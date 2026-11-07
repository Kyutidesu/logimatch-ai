-- Script khởi tạo Database cho LogiMatch AI trên Supabase
-- Copy và dán đoạn SQL này vào mục "SQL Editor" trên trang quản trị Supabase rồi nhấn "Run"

-- 1. Bảng lưu trữ Vận đơn (Waybills)
CREATE TABLE IF NOT EXISTS waybills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    waybill_code VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'confirmed', -- confirmed, in_transit, delivered, cancelled
    origin_city VARCHAR(100) NOT NULL,
    destination_city VARCHAR(100) NOT NULL,
    cargo_type VARCHAR(50) NOT NULL,
    chargeable_weight_kg NUMERIC(10, 2),
    volume_m3 NUMERIC(10, 4),
    declared_value_vnd BIGINT DEFAULT 0,
    provider_id VARCHAR(100) NOT NULL,
    provider_name VARCHAR(150) NOT NULL,
    total_cost_vnd BIGINT NOT NULL,
    delivery_time_text VARCHAR(100),
    driver_name VARCHAR(100),
    truck_plate VARCHAR(50),
    pickup_eta VARCHAR(100),
    delivery_eta VARCHAR(100),
    order_data JSONB,       -- Chi tiết kích thước, số lượng kiện, yêu cầu đặc biệt
    provider_data JSONB,    -- Chi tiết điểm số SLA, bảng giá cước của đối tác
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Cho phép người dùng đọc và thêm vận đơn (Row Level Security - RLS)
ALTER TABLE waybills ENABLE ROW LEVEL SECURITY;

-- Cho phép SELECT công khai (để xem danh sách vận đơn)
CREATE POLICY "Cho phép đọc danh sách vận đơn" 
ON waybills FOR SELECT 
USING (true);

-- Cho phép INSERT công khai (để khách tạo đơn mới)
CREATE POLICY "Cho phép tạo vận đơn mới" 
ON waybills FOR INSERT 
WITH CHECK (true);

-- Index để tìm kiếm theo mã vận đơn nhanh hơn
CREATE INDEX IF NOT EXISTS idx_waybills_code ON waybills (waybill_code);
CREATE INDEX IF NOT EXISTS idx_waybills_created_at ON waybills (created_at DESC);

