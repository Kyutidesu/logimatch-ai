# TỔNG HỢP DANH SÁCH 8 NHÀ CUNG CẤP 3PL TRÊN HỆ THỐNG WEB LOGIMATCH AI
# (Trích xuất đồng bộ trực tiếp từ scoringEngine.ts)

Dưới đây là thông số thực tế của 8 nhà cung cấp dịch vụ 3PL được sử dụng trong toàn bộ hệ thống Web LogiMatch AI:

| STT | Provider ID (`id`) | Tên hiển thị (`shortName`) | Logo Code | Cước cơ sở (`baseCostPerTonKm`) | Phí bốc xếp (`handlingFeeBase`) | Tốc độ TB (`averageSpeedKmh`) | Chuỗi lạnh (`coldChainTier`) | Hàng nặng (`bulkyHandlingTier`) | Hàng dễ vỡ (`fragileHandlingTier`) | Đánh giá (`ratingBase`) | Lượt đánh giá | Hotline | Thế mạnh & SLA cam kết |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **1** | `viettel_post` | **Viettel Post** | VTP | 380 đ/kg/100km | 45,000 đ | 48 km/h | 2 | 3 | 3 | 4.88 ⭐ | 14,200 | 1900 8095 | Hơn 8.000 xe tải thùng kín, GPS thời gian thực, bưu cục phủ 100% xã phường. Bồi thường 100% giá trị theo hóa đơn trong 24h. |
| **2** | `vnpost` | **VNPost Logistics** | VNPost | 310 đ/kg/100km | 35,000 đ | 42 km/h | 1 | 3 | 2 | 4.75 ⭐ | 21,500 | 1900 545481 | Mạng lưới vận chuyển đường sắt và đường bộ lớn nhất VN, xe tải 2.5 - 15 tấn. Cước phí rẻ nhất cho hàng nặng. |
| **3** | `ghtk` | **GHTK Cargo** | GHTK | 330 đ/kg/100km | 38,000 đ | 52 km/h | 1 | 2 | 2 | 4.82 ⭐ | 38,900 | 1900 6092 | Trung tâm chia chọn tự động hóa 100% robot, app cập nhật từng phút. Tối ưu chi phí hàng tiêu dùng nhanh (FMCG) và TMĐT. |
| **4** | `transimex` | **Transimex Cold Chain** | TMS | 460 đ/kg/100km | 90,000 đ | 49 km/h | **3** (Chuyên gia) | 2 | 3 | 4.93 ⭐ | 4,200 | 028 3824 4567 | Chuyên gia chuỗi lạnh: xe tải lạnh -25°C đến +15°C, kho lạnh đạt chuẩn GDP/HACCP. Cảm biến IoT real-time, bồi hoàn 100% nếu đứt gãy nhiệt. |
| **5** | `dhl_supply` | **DHL Express/Logistics** | DHL | 580 đ/kg/100km | 120,000 đ | **65 km/h** (Đội bay) | 2 | 2 | **3** | 4.96 ⭐ | 8,800 | 1800 1530 | Đội bay chuyên dụng + xe chuẩn quốc tế. SLA hỏa tốc cam kết giờ chính xác, an ninh tối đa cho hàng điện tử, công nghệ cao, giá trị lớn. |
| **6** | `sotrans` | **Sotrans Logistics** | STR | 350 đ/kg/100km | 70,000 đ | 44 km/h | 1 | **3** (Chuyên gia) | 2 | 4.81 ⭐ | 6,500 | 028 3829 0447 | Chuyên gia hàng container, xe đầu kéo tải trọng 30 tấn, ICD cảng cạn. Phục vụ máy móc công nghiệp nặng và hàng siêu trường siêu trọng. |
| **7** | `kerry_logistics` | **Kerry Express** | KRY | 395 đ/kg/100km | 50,000 đ | 50 km/h | 2 | 3 | 3 | 4.86 ⭐ | 9,700 | 1900 6966 | Trung tâm logistics chuẩn ISO, tỷ lệ đúng hạn ổn định tuyến liên vùng, hỗ trợ quản lý chuỗi cung ứng B2B doanh nghiệp. |
| **8** | `jt_cargo` | **J&T Cargo** | J&T | 340 đ/kg/100km | 40,000 đ | 47 km/h | 1 | 3 | 2 | 4.79 ⭐ | 16,400 | 1900 1088 | Đội xe tải lớn nhận hàng tận kho, giá cước bậc thang ưu đãi cho sản lượng lớn, chiết khấu trực tiếp cho chủ hàng. |

---

## Các phân loại (Categories) đồng bộ trên Web

### 1. Phân loại hàng hóa (`cargo_type`)
- `fmcg`: Hàng tiêu dùng nhanh, mỹ phẩm, thực phẩm khô
- `electronics`: Đồ điện tử, linh kiện công nghệ cao
- `fragile`: Đồ gốm sứ, thủy tinh, hàng dễ vỡ
- `perishable`: Nông sản tươi, thủy hải sản, hàng cần bảo quản lạnh
- `bulky`: Máy móc, thiết bị công nghiệp nặng, hàng cồng kềnh
- `textile`: Hàng may mặc, thời trang, da giày
- `chemicals`: Hóa chất công nghiệp, sơn, dung môi

### 2. Mức độ ưu tiên (`priority`)
- `cost`: Ưu tiên tối ưu chi phí (Tiết kiệm cước)
- `speed`: Ưu tiên thời gian giao hàng (Hỏa tốc)
- `reliability`: Ưu tiên độ an toàn & cam kết SLA (Đúng hẹn, không vỡ hỏng)
- `balanced`: Cân bằng hài hòa giữa chi phí, thời gian và dịch vụ

