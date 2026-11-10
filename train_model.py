import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score, f1_score

# 1. Nạp dữ liệu đồng bộ từ Web (đã có Route_Capacity)
csv_file = '3pl_vietnam_dataset_1000.csv'
print(f"1. Đang nạp tập dữ liệu đồng bộ Web từ '{csv_file}'...")
df = pd.read_csv(csv_file)

# 2. Khai báo các cột đặc trưng theo đúng bản chất dữ liệu
categorical_features = ['Cargo_Type', 'Priority', 'Provider_ID', 'Origin_City', 'Destination_City']

# Nhóm biến số liên tục (Chuẩn hóa Z-score để đưa về cùng mặt bằng phân phối)
zscore_features = [
    'Distance_KM', 'Weight_Kg', 'Chargeable_Weight_Kg',
    'Price_VND', 'Route_Capacity', 'Lead_Time_Days', 'Customer_Rating'
]

# Nhóm biến đã chuẩn hóa tự nhiên (0 đến 1) -> Giữ nguyên (Passthrough)
passthrough_features = [
    'Is_Cold_Chain', 'Is_Express', 'On_Time_Rate', 'Complaint_Rate'
]

X = df[categorical_features + zscore_features + passthrough_features]
y = df['Is_Selected']

# 3. Phân chia tập dữ liệu: 80% Train, 20% Test (Stratified)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42, stratify=y
)
print(f"2. Kích thước dữ liệu: Train = {X_train.shape[0]} mẫu, Test = {X_test.shape[0]} mẫu.")

# 4. Pipeline Tiền xử lý dữ liệu chuẩn hóa (ColumnTransformer)
preprocessor = ColumnTransformer(
    transformers=[
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features),
        ('num_zscore', StandardScaler(), zscore_features),
        ('keep_raw', 'passthrough', passthrough_features)
    ]
)

# 5. Huấn luyện mô hình Random Forest Classifier
model_pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(
            n_estimators=200,
            max_depth=15,
            min_samples_split=5,
            random_state=42
        ))
    ])

print("3. Đang huấn luyện Random Forest Classifier...")
model_pipeline.fit(X_train, y_train)

# 6. Đánh giá chất lượng mô hình trên tập kiểm thử
y_pred = model_pipeline.predict(X_test)
acc = accuracy_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)

print("\n" + "=" * 55)
print("KẾT QUẢ ĐÁNH GIÁ MÔ HÌNH TRÊN TẬP TEST (200 MẪU):")
print(f"- Độ chính xác (Accuracy): {acc * 100:.2f}%")
print(f"- F1-Score: {f1:.4f}")
print("=" * 55)
print(classification_report(y_test, y_pred, target_names=['Loại (0)', 'Được chọn (1)']))

# 7. Đóng gói mô hình ra file .pkl
output_model_path = '3pl_scoring_v2.pkl'
joblib.dump(model_pipeline, output_model_path)
print(f"\n4. Đã lưu thành công mô hình Pipeline vào file: '{output_model_path}'")
