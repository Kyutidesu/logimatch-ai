import joblib
import pandas as pd
import os

MODEL_FILE = '3pl_scoring_v2.pkl'

PROVIDERS = [
    {
        'id': 'viettel_post',
        'name': 'Viettel Post',
        'baseCostPerTonKm': 380,
        'handlingFeeBase': 45000,
        'averageSpeedKmh': 48,
        'coldChainTier': 2,
        'bulkyTier': 3,
        'fragileTier': 3,
        'rating': 4.88,
        'onTimeBias': 0.985,
        'complaintRate': 0.015,
        'capacity': 12000
    },
    {
        'id': 'vnpost',
        'name': 'VNPost Logistics',
        'baseCostPerTonKm': 310,
        'handlingFeeBase': 35000,
        'averageSpeedKmh': 42,
        'coldChainTier': 1,
        'bulkyTier': 3,
        'fragileTier': 2,
        'rating': 4.75,
        'onTimeBias': 0.972,
        'complaintRate': 0.025,
        'capacity': 11000
    },
    {
        'id': 'ghtk',
        'name': 'GHTK Cargo',
        'baseCostPerTonKm': 330,
        'handlingFeeBase': 38000,
        'averageSpeedKmh': 52,
        'coldChainTier': 1,
        'bulkyTier': 2,
        'fragileTier': 2,
        'rating': 4.82,
        'onTimeBias': 0.980,
        'complaintRate': 0.018,
        'capacity': 5500
    },
    {
        'id': 'transimex',
        'name': 'Transimex Cold Chain',
        'baseCostPerTonKm': 460,
        'handlingFeeBase': 90000,
        'averageSpeedKmh': 49,
        'coldChainTier': 3,
        'bulkyTier': 2,
        'fragileTier': 3,
        'rating': 4.93,
        'onTimeBias': 0.989,
        'complaintRate': 0.011,
        'capacity': 3000
    },
    {
        'id': 'dhl_supply',
        'name': 'DHL Express/Logistics',
        'baseCostPerTonKm': 580,
        'handlingFeeBase': 120000,
        'averageSpeedKmh': 65,
        'coldChainTier': 2,
        'bulkyTier': 2,
        'fragileTier': 3,
        'rating': 4.96,
        'onTimeBias': 0.995,
        'complaintRate': 0.005,
        'capacity': 1500
    },
    {
        'id': 'sotrans',
        'name': 'Sotrans Logistics',
        'baseCostPerTonKm': 350,
        'handlingFeeBase': 70000,
        'averageSpeedKmh': 44,
        'coldChainTier': 1,
        'bulkyTier': 3,
        'fragileTier': 2,
        'rating': 4.81,
        'onTimeBias': 0.982,
        'complaintRate': 0.018,
        'capacity': 4000
    },
    {
        'id': 'kerry_logistics',
        'name': 'Kerry Express',
        'baseCostPerTonKm': 395,
        'handlingFeeBase': 50000,
        'averageSpeedKmh': 50,
        'coldChainTier': 2,
        'bulkyTier': 3,
        'fragileTier': 3,
        'rating': 4.86,
        'onTimeBias': 0.985,
        'complaintRate': 0.014,
        'capacity': 5000
    },
    {
        'id': 'jt_cargo',
        'name': 'J&T Cargo',
        'baseCostPerTonKm': 340,
        'handlingFeeBase': 40000,
        'averageSpeedKmh': 47,
        'coldChainTier': 1,
        'bulkyTier': 3,
        'fragileTier': 2,
        'rating': 4.79,
        'onTimeBias': 0.979,
        'complaintRate': 0.021,
        'capacity': 4500
    }
]

def predict_top3(order_input):
    if not os.path.exists(MODEL_FILE):
        print(f"Lỗi: Không tìm thấy file model '{MODEL_FILE}'. Vui lòng chạy lệnh 'python train_model.py' trước!")
        return

    model = joblib.load(MODEL_FILE)

    records = []
    for prov in PROVIDERS:
        distance_km = order_input['Distance_KM']
        chargeable_weight_kg = order_input['Chargeable_Weight_Kg']
        is_cold = order_input['Is_Cold_Chain']
        is_express = order_input['Is_Express']

        ton_km_cost = (distance_km / 100.0) * prov['baseCostPerTonKm'] * max(1.0, chargeable_weight_kg / 10.0)
        total_cost = prov['handlingFeeBase'] + ton_km_cost
        if is_cold: total_cost *= 1.35
        if is_express: total_cost *= 1.25
        price_vnd = int(round(total_cost / 1000.0) * 1000)

        transit_hours = (distance_km / prov['averageSpeedKmh']) + 6.0
        if is_express: transit_hours *= 0.7
        lead_time_days = round(max(0.5, transit_hours / 24.0), 1)

        records.append({
            'Provider_ID': prov['id'],
            'Provider_Name': prov['name'],
            'Cargo_Type': order_input['Cargo_Type'],
            'Priority': order_input['Priority'],
            'Origin_City': order_input['Origin_City'],
            'Destination_City': order_input['Destination_City'],
            'Distance_KM': distance_km,
            'Weight_Kg': order_input['Weight_Kg'],
            'Chargeable_Weight_Kg': chargeable_weight_kg,
            'Is_Cold_Chain': is_cold,
            'Is_Express': is_express,
            'Price_VND': price_vnd,
            'Lead_Time_Days': lead_time_days,
            'On_Time_Rate': prov['onTimeBias'],
            'Complaint_Rate': prov['complaintRate'],
            'Route_Capacity': prov['capacity'],
            'Customer_Rating': prov['rating']
        })

    df_test = pd.DataFrame(records)
    probabilities = model.predict_proba(df_test)[:, 1]

    for idx, prob in enumerate(probabilities):
        records[idx]['Probability'] = prob

    records.sort(key=lambda x: x['Probability'], reverse=True)

    print("\n" + "=" * 90)
    print("KẾT QUẢ DỰ ĐOÁN XÁC SUẤT VÀ XẾP HẠNG TOP 3 (RANDOM FOREST)")
    print("=" * 90)
    print(f"Thông tin đơn hàng mẫu:")
    print(f"- Tuyến: {order_input['Origin_City']} ➔ {order_input['Destination_City']} ({order_input['Distance_KM']} km)")
    print(f"- Mặt hàng: {order_input['Cargo_Type']} | Trọng lượng: {order_input['Weight_Kg']} kg | Ưu tiên: {order_input['Priority']}")
    print("-" * 90)
    print(f"{'Nhà cung cấp (3PL)':<30} {'Xác suất P(Is_Selected=1)':<25} {'Thứ hạng':<15} {'Trạng thái hiển thị UI'}")
    print("-" * 90)

    for rank, item in enumerate(records, start=1):
        name = item['Provider_Name']
        prob_str = f"{item['Probability'] * 100:.1f}%"
        
        if rank == 1:
            ui_status = "Gợi ý Top 1"
        elif rank == 2:
            ui_status = "Gợi ý Top 2"
        elif rank == 3:
            ui_status = "Gợi ý Top 3"
        else:
            ui_status = "Loại"

        print(f"{name:<30} {prob_str:<25} {rank:<15} {ui_status}")

    print("=" * 90 + "\n")

if __name__ == '__main__':
    sample_order = {
        'Origin_City': 'Hà Nội',
        'Destination_City': 'TP. Hồ Chí Minh',
        'Distance_KM': 1720.0,
        'Cargo_Type': 'electronics',
        'Priority': 'speed',
        'Weight_Kg': 25.0,
        'Chargeable_Weight_Kg': 48.0,
        'Is_Cold_Chain': 0,
        'Is_Express': 1
    }

    predict_top3(sample_order)
