# TỔNG HỢP NGUYÊN TẮC VÀ DỮ LIỆU ĐẶC TRƯNG 6 NHÀ CUNG CẤP 3PL VIỆT NAM
# Dành cho việc sinh dữ liệu mô phỏng (build_dataset.py) và huấn luyện Random Forest

## 1. Danh sách 6 nhà cung cấp 3PL và Dải giá trị hoạt động thực tế

| STT | Provider_ID | Đặc trưng & Thế mạnh cốt lõi | Price_VND (Đơn giá/km) | Lead_Time (Tốc độ) | On_Time_Rate (%) | Complaint_Rate (%) | Route_Capacity (Đơn/ngày) | Customer_Rating |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **DHL Express** | Hàng giá trị cao, hỏa tốc, tỷ lệ an toàn tuyệt đối, giá cao nhất | 75,000 - 150,000 | Siêu nhanh (0.5 - 2 ngày) | 97.0% - 99.5% | 0.4% - 1.0% | 800 - 2,500 | 4.7 - 5.0 |
| 2 | **Giaohangnhanh (GHN)** | TMĐT, thời trang, hàng dễ vỡ, giao chuẩn 24h - 48h liên tỉnh | 28,000 - 65,000 | Nhanh (1.0 - 3.5 ngày) | 93.0% - 97.0% | 1.0% - 2.5% | 3,500 - 8,000 | 4.3 - 4.8 |
| 3 | **Giaohangtietkiem (GHTK)** | Hàng nhẹ, tiêu dùng nhanh, tối ưu chi phí, độ phủ mạnh | 18,000 - 50,000 | Trung bình (1.0 - 3.0 ngày) | 91.0% - 96.0% | 1.2% - 2.8% | 3,500 - 7,500 | 4.2 - 4.7 |
| 4 | **Viettel Post** | Tuyến dài, hàng cồng kềnh, mạng lưới sâu đến xã đảo, giá tốt | 24,000 - 60,000 | Trung bình (2.0 - 5.5 ngày) | 88.0% - 94.0% | 1.5% - 3.2% | 8,000 - 16,000 | 4.1 - 4.5 |
| 5 | **J&T Express** | Phục vụ sàn TMĐT linh hoạt, giá rẻ, đẩy mạnh hỏa tốc chặng ngắn | 22,000 - 55,000 | Nhanh - TB (1.5 - 4.5 ngày) | 86.0% - 93.0% | 2.0% - 3.8% | 3,000 - 6,500 | 3.9 - 4.4 |
| 6 | **VNPost** | Bưu điện truyền thống, thế mạnh hàng cồng kềnh, tuyến liên tỉnh sâu | 20,000 - 52,000 | Chậm hơn (3.0 - 7.0 ngày) | 85.0% - 92.0% | 2.2% - 4.2% | 7,000 - 15,000 | 3.8 - 4.3 |

---

## 2. Quy tắc nghiệp vụ phân loại nhãn mục tiêu (Business Rules for `Is_Selected`)

Theo mục 4.2.6 (Cơ chế giải quyết xung đột đa tiêu chí), nhãn `Is_Selected` (1: Được chọn, 0: Loại) được quyết định dựa trên sự tương tác giữa bối cảnh đơn hàng và thế mạnh nhà xe:

1. **Khi `Cargo_Type = 'Giá trị cao'` hoặc `'Dễ vỡ'`**:
   - Nếu `Service_Priority = 'Hỏa tốc'`: Ưu tiên tuyệt đối cho **DHL Express** (tỷ lệ chọn 90%) hoặc **Giaohangnhanh (GHN)**.
   - Nếu chọn nhà xe giá rẻ nhưng `Complaint_Rate > 3%`: Tỷ lệ bị loại (`Is_Selected = 0`) là 85%.

2. **Khi `Cargo_Type = 'Cồng kềnh'`**:
   - Ưu tiên cho đơn vị có năng lực tải trọng và Route_Capacity lớn: **Viettel Post** hoặc **VNPost** (tỷ lệ chọn 85%).
   - Các đơn vị TMĐT nhẹ (GHTK, J&T) có nguy cơ quá tải nên thường bị loại (`Is_Selected = 0`).

3. **Khi `Cargo_Type = 'Tiêu dùng nhanh'`**:
   - Nếu `Service_Priority = 'Tiết kiệm'`: Ưu tiên **Giaohangtietkiem (GHTK)** hoặc **Viettel Post** nhờ cước rẻ (Price thấp).
   - Nếu `Service_Priority = 'Hỏa tốc'` chặng ngắn (< 300km): Ưu tiên **Giaohangnhanh (GHN)** hoặc **J&T Express**.

4. **Khi `Service_Priority = 'Tiết kiệm'`**:
   - Các nhà xe có giá cước cao bất thường (> 70,000đ ở khoảng cách ngắn) như DHL Express sẽ bị loại (`Is_Selected = 0`).

