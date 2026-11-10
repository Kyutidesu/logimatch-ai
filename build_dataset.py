import random
import csv
import math

# Thiết lập seed để đảm bảo tính tái lập (Reproducibility)
random.seed(42)

TOTAL_RECORDS = 1000

# 8 Nhà cung cấp 3PL đồng bộ từ scoringEngine.ts và bổ sung Route_Capacity thực tế
RAW_PROVIDERS = [
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
        'capacityRange': (8000, 16000) # Đơn/ngày
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
        'capacityRange': (7000, 15000)
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
        'capacityRange': (3500, 7500)
    },
    {
        'id': 'transimex',
        'name': 'Transimex Cold Chain',
        'baseCostPerTonKm': 460,
        'handlingFeeBase': 90000,
        'averageSpeedKmh': 49,
        'coldChainTier': 3, # Chuyên gia chuỗi lạnh
        'bulkyTier': 2,
        'fragileTier': 3,
        'rating': 4.93,
        'onTimeBias': 0.989,
        'complaintRate': 0.011,
        'capacityRange': (1500, 4500)
    },
    {
        'id': 'dhl_supply',
        'name': 'DHL Express/Logistics',
        'baseCostPerTonKm': 580,
        'handlingFeeBase': 120000,
        'averageSpeedKmh': 65, # Đội bay chuyên dụng
        'coldChainTier': 2,
        'bulkyTier': 2,
        'fragileTier': 3,
        'rating': 4.96,
        'onTimeBias': 0.995,
        'complaintRate': 0.005,
        'capacityRange': (800, 2500)
    },
    {
        'id': 'sotrans',
        'name': 'Sotrans Logistics',
        'baseCostPerTonKm': 350,
        'handlingFeeBase': 70000,
        'averageSpeedKmh': 44,
        'coldChainTier': 1,
        'bulkyTier': 3, # Container & siêu trọng
        'fragileTier': 2,
        'rating': 4.81,
        'onTimeBias': 0.982,
        'complaintRate': 0.018,
        'capacityRange': (2000, 6000)
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
        'capacityRange': (3000, 7000)
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
        'capacityRange': (3000, 6500)
    }
]

CARGO_TYPES = ['fmcg', 'electronics', 'fragile', 'perishable', 'bulky', 'textile', 'chemicals']
PRIORITIES = ['cost', 'speed', 'reliability', 'balanced']

CITIES = [
    'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Bắc Ninh', 
    'Bình Dương', 'Đồng Nai', 'Cần Thơ', 'Khánh Hòa (Nha Trang)', 
    'Nghệ An (Vinh)', 'Quảng Ninh', 'Bà Rịa - Vũng Tàu'
]

rows = []

for idx in range(1, TOTAL_RECORDS + 1):
    order_id = f"ORD{idx:04d}"
    origin = random.choice(CITIES)
    destination = random.choice([c for c in CITIES if c != origin])
    cargo_type = random.choice(CARGO_TYPES)
    priority = random.choice(PRIORITIES)
    
    length_cm = random.randint(20, 150)
    width_cm = random.randint(15, 120)
    height_cm = random.randint(10, 100)
    quantity = random.randint(1, 10)
    actual_weight_kg = round(random.uniform(2.0, 150.0), 1)
    
    vol_weight_kg = round(((length_cm * width_cm * height_cm) / 5000.0) * quantity, 1)
    chargeable_weight_kg = max(actual_weight_kg * quantity, vol_weight_kg)
    
    if ('Hà Nội' in origin and 'Hồ Chí Minh' in destination) or ('Hồ Chí Minh' in origin and 'Hà Nội' in destination):
        distance_km = 1720.0
    elif 'Đà Nẵng' in origin or 'Đà Nẵng' in destination:
        distance_km = round(random.uniform(700.0, 950.0), 1)
    elif ('Hà Nội' in origin and 'Hải Phòng' in destination) or ('Hải Phòng' in origin and 'Hà Nội' in destination):
        distance_km = 120.0
    elif ('Hồ Chí Minh' in origin and 'Bình Dương' in destination) or ('Bình Dương' in origin and 'Hồ Chí Minh' in destination):
        distance_km = 45.0
    else:
        distance_km = round(random.uniform(80.0, 1200.0), 1)
        
    is_cold_chain = 1 if cargo_type == 'perishable' or random.random() < 0.15 else 0
    is_express = 1 if priority == 'speed' or random.random() < 0.20 else 0
    is_insured = 1 if cargo_type in ['electronics', 'fragile'] or random.random() < 0.30 else 0
    declared_value_vnd = random.randint(2, 80) * 1_000_000

    prov = random.choice(RAW_PROVIDERS)
    
    # 1. Giá cước Price_VND
    ton_km_cost = (distance_km / 100.0) * prov['baseCostPerTonKm'] * max(1.0, chargeable_weight_kg / 10.0)
    total_cost = prov['handlingFeeBase'] + ton_km_cost
    if is_cold_chain: total_cost *= 1.35
    if is_express: total_cost *= 1.25
    if is_insured: total_cost += declared_value_vnd * 0.005
    price_vnd = int(round(total_cost / 1000.0) * 1000)
    
    # 2. Thời gian giao Lead_Time_Days
    transit_hours = (distance_km / prov['averageSpeedKmh']) + 6.0
    if is_express: transit_hours *= 0.7
    lead_time_days = round(max(0.5, transit_hours / 24.0), 1)
    
    # 3. Các chỉ số dịch vụ & NĂNG LỰC TUYẾN (Route_Capacity)
    on_time_rate = round(prov['onTimeBias'] + random.uniform(-0.015, 0.01), 4)
    complaint_rate = round(prov['complaintRate'] + random.uniform(-0.003, 0.005), 4)
    customer_rating = round(prov['rating'] + random.uniform(-0.15, 0.04), 1)
    route_capacity = random.randint(*prov['capacityRange'])
    
    # === QUY TẮC NGHIỆP VỤ XÁC ĐỊNH NHÃN Is_Selected ===
    score = 0.0
    
    if is_cold_chain == 1:
        if prov['coldChainTier'] == 3: score += 4.5
        elif prov['coldChainTier'] == 2: score += 1.5
        else: score -= 5.0
        
    elif cargo_type == 'bulky' or chargeable_weight_kg >= 100:
        if prov['bulkyTier'] == 3: score += 4.0
        if route_capacity >= 7000: score += 2.5
        if prov['id'] in ['sotrans', 'viettel_post', 'vnpost']: score += 2.0
        if prov['id'] in ['ghtk', 'dhl_supply']: score -= 3.0
        
    elif cargo_type in ['electronics', 'fragile'] or priority == 'speed':
        if prov['id'] == 'dhl_supply': score += 4.5
        if on_time_rate >= 0.985: score += 2.5
        if complaint_rate > 0.020: score -= 3.0
        
    elif priority == 'cost':
        if prov['baseCostPerTonKm'] <= 340: score += 3.5
        if prov['id'] in ['vnpost', 'ghtk', 'jt_cargo']: score += 2.5
        if prov['id'] == 'dhl_supply': score -= 4.5
        
    else:
        if prov['id'] in ['ghtk', 'viettel_post', 'kerry_logistics']: score += 3.0
        if price_vnd < 150000: score += 1.5
        
    is_selected = 1 if score >= 2.0 else 0
    
    if random.random() < 0.04:
        is_selected = 1 - is_selected
        
    rows.append({
        'Order_ID': order_id,
        'Origin_City': origin,
        'Destination_City': destination,
        'Distance_KM': distance_km,
        'Cargo_Type': cargo_type,
        'Priority': priority,
        'Weight_Kg': actual_weight_kg,
        'Chargeable_Weight_Kg': chargeable_weight_kg,
        'Is_Cold_Chain': is_cold_chain,
        'Is_Express': is_express,
        'Provider_ID': prov['id'],
        'Provider_Name': prov['name'],
        'Price_VND': price_vnd,
        'Lead_Time_Days': lead_time_days,
        'On_Time_Rate': on_time_rate,
        'Complaint_Rate': complaint_rate,
        'Route_Capacity': route_capacity,
        'Customer_Rating': customer_rating,
        'Is_Selected': is_selected
    })

# Xuất ra file CSV
csv_filename = '3pl_vietnam_dataset_1000.csv'
fieldnames = list(rows[0].keys())

with open(csv_filename, mode='w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print(f"✅ Đã tạo thành công file '{csv_filename}' (1000 dòng) có thêm cột 'Route_Capacity'!")
pos_count = sum(1 for r in rows if r['Is_Selected'] == 1)
print(f"- Số mẫu được chọn (Is_Selected = 1): {pos_count} ({pos_count / TOTAL_RECORDS * 100:.1f}%)")
print(f"- Số mẫu bị loại (Is_Selected = 0): {TOTAL_RECORDS - pos_count} ({(TOTAL_RECORDS - pos_count) / TOTAL_RECORDS * 100:.1f}%)")
