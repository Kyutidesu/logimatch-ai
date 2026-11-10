import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV, StratifiedKFold
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score, f1_score

def tune_random_forest_hyperparameters():
    print("🚀 Đang nạp tập dữ liệu đồng bộ Web từ '3pl_vietnam_dataset_1000.csv'...")
    try:
        df = pd.read_csv('3pl_vietnam_dataset_1000.csv')
    except FileNotFoundError:
        print("❌ Không tìm thấy file '3pl_vietnam_dataset_1000.csv'. Hãy chạy build_dataset.py trước!")
        return

    # Khai báo các cột đặc trưng theo đúng bản chất dữ liệu
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

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    print(f"📦 Dữ liệu đã phân chia: Train = {X_train.shape[0]} mẫu (80%), Test = {X_test.shape[0]} mẫu (20%).")

    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features),
            ('num_zscore', StandardScaler(), zscore_features),
            ('keep_raw', 'passthrough', passthrough_features)
        ]
    )

    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(random_state=42))
    ])

    param_grid = {
        'classifier__n_estimators': [50, 100, 150, 200, 300],
        'classifier__max_depth': [5, 10, 15, 20, None],
        'classifier__min_samples_split': [2, 5, 10],
        'classifier__criterion': ['gini', 'entropy'],
        'classifier__max_features': ['sqrt', 'log2']
    }

    cv_strategy = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    grid_search = GridSearchCV(
        estimator=pipeline,
        param_grid=param_grid,
        cv=cv_strategy,
        scoring='f1',
        n_jobs=-1,
        verbose=1
    )

    print("\n⏳ Đang tiến hành Grid Search & 5-Fold Cross-Validation (Vui lòng đợi giây lát)...")
    grid_search.fit(X_train, y_train)

    print("\n" + "=" * 70)
    print("🎯 BỘ SIÊU THAM SỐ TỐI ƯU NHẤT TÌM THẤY (BEST HYPERPARAMETERS):")
    print("=" * 70)
    best_params = grid_search.best_params_
    for param_name, value in best_params.items():
        clean_name = param_name.replace('classifier__', '')
        print(f"  • {clean_name:<20}: {value}")

    print(f"\n📊 Điểm F1-Score trung bình tốt nhất trên 5 Folds Train: {grid_search.best_score_:.4f}")

    best_model = grid_search.best_estimator_
    y_pred = best_model.predict(X_test)

    acc = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)

    print("\n" + "=" * 70)
    print("📈 KẾT QUẢ ĐÁNH GIÁ MÔ HÌNH TỐI ƯU TRÊN TẬP TEST (200 MẪU):")
    print("=" * 70)
    print(f"Độ chính xác (Accuracy): {acc * 100:.2f}%")
    print(f"F1-Score               : {f1:.4f}\n")
    print("Chi tiết Báo cáo Phân loại (Classification Report):")
    print(classification_report(y_test, y_pred, target_names=['Loại (0)', 'Được chọn (1)']))
    print("=" * 70)

if __name__ == '__main__':
    tune_random_forest_hyperparameters()
