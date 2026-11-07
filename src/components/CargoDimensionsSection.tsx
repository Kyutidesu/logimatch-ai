import React, { useState } from 'react';
import { 
  Box, 
  Scale, 
  HelpCircle, 
  Layers, 
  Info, 
  AlertTriangle, 
  Sparkles, 
  ChevronRight,
  Calculator,
  ArrowRight,
  Package,
  Plus,
  Minus
} from 'lucide-react';
import { OrderInput, CargoMetrics } from '../types/logistics';

interface CargoDimensionsSectionProps {
  order: OrderInput;
  setOrder: React.Dispatch<React.SetStateAction<OrderInput>>;
  metrics: CargoMetrics;
}

interface PackagingPreset {
  id: string;
  name: string;
  category: string;
  length: number;
  width: number;
  height: number;
  typicalWeight: number;
  icon: string;
}

const PACKAGING_PRESETS: PackagingPreset[] = [
  {
    id: 'carton_s',
    name: 'Carton Nhỏ (S)',
    category: 'TMĐT, Mỹ phẩm, Chip',
    length: 30,
    width: 20,
    height: 15,
    typicalWeight: 2,
    icon: '📦'
  },
  {
    id: 'carton_m',
    name: 'Carton Vừa (M)',
    category: 'Gia dụng, Giày dép',
    length: 50,
    width: 40,
    height: 30,
    typicalWeight: 10,
    icon: '📦'
  },
  {
    id: 'carton_export',
    name: 'Carton Xuất Khẩu (L)',
    category: 'May mặc, Thực phẩm khô',
    length: 60,
    width: 40,
    height: 40,
    typicalWeight: 20,
    icon: '📦'
  },
  {
    id: 'foam_box',
    name: 'Thùng Xốp Giữ Nhiệt',
    category: 'Thủy hải sản, Nông sản',
    length: 65,
    width: 45,
    height: 35,
    typicalWeight: 22,
    icon: '❄️'
  },
  {
    id: 'pallet_standard',
    name: 'Pallet Gỗ Chuẩn ISO',
    category: 'Kho công nghiệp, B2B',
    length: 120,
    width: 100,
    height: 120,
    typicalWeight: 350,
    icon: '🪵'
  },
  {
    id: 'heavy_crate',
    name: 'Kiện Gỗ / Thùng Phuy',
    category: 'Cơ khí, Hóa chất, Máy móc',
    length: 150,
    width: 100,
    height: 110,
    typicalWeight: 600,
    icon: '🏗️'
  }
];

export const CargoDimensionsSection: React.FC<CargoDimensionsSectionProps> = ({
  order,
  setOrder,
  metrics
}) => {
  const [showFormulaDetails, setShowFormulaDetails] = useState<boolean>(false);

  // 1 Kiện calculations
  const singleActualWeight = order.weightKg;
  const singleVolumeM3 = (order.lengthCm * order.widthCm * order.heightCm) / 1_000_000;
  const singleVolumetricWeight = (order.lengthCm * order.widthCm * order.heightCm) / 5000;

  // Lô hàng (Total Consignment) calculations
  const totalActualWeight = order.weightKg * order.quantity;
  const totalVolumeM3 = singleVolumeM3 * order.quantity;
  const totalVolumetricWeight = singleVolumetricWeight * order.quantity;
  const totalChargeableWeight = Math.max(totalActualWeight, totalVolumetricWeight);

  // Density & classification
  const isBulkyCargo = totalVolumetricWeight > totalActualWeight;
  const weightDiff = Math.abs(totalVolumetricWeight - totalActualWeight);

  // Vehicle limits check
  const isOverLength = order.lengthCm > 240;
  const isOverHeight = order.heightCm > 180;
  const isOverWeight = totalChargeableWeight > 2000;

  // Apply packaging preset
  const handleApplyPackagingPreset = (preset: PackagingPreset) => {
    setOrder(prev => ({
      ...prev,
      lengthCm: preset.length,
      widthCm: preset.width,
      heightCm: preset.height,
      weightKg: preset.typicalWeight
    }));
  };

  const handleAdjustQuantity = (delta: number) => {
    setOrder(prev => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + delta)
    }));
  };

  // Isometric 3D box scaling
  const maxDim = Math.max(order.lengthCm, order.widthCm, order.heightCm, 1);
  const boxL = Math.max(35, Math.min(125, (order.lengthCm / maxDim) * 110));
  const boxW = Math.max(30, Math.min(100, (order.widthCm / maxDim) * 85));
  const boxH = Math.max(30, Math.min(110, (order.heightCm / maxDim) * 95));

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-[#061816] border border-emerald-500/30 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-950/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-emerald-900/30">
            1
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white tracking-tight">
                Thông Số Hàng Hóa: Nhập 1 Kiện ➔ Tự Động Tính Cả Lô Hàng
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Chuẩn Vận Tải Xanh (Green Logistics)
              </span>
            </div>
            <p className="text-xs text-emerald-100/70">
              Chỉ cần nhập kích thước & khối lượng của <strong>1 kiện</strong> và <strong>số lượng kiện</strong>, hệ thống AI sẽ tự động nhân tính toàn bộ thể tích CBM và trọng lượng tính cước.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowFormulaDetails(prev => !prev)}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/70 text-emerald-300 text-xs font-semibold border border-emerald-700/50 transition-colors shadow-sm"
        >
          <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>{showFormulaDetails ? 'Ẩn công thức' : 'Công thức tính CBM & CW'}</span>
        </button>
      </div>

      {/* Packaging Presets (Quy cách đóng gói nhanh 1 kiện) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-emerald-200 flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-emerald-400" />
            <span>Chọn nhanh mẫu bao bì tiêu chuẩn cho 1 kiện:</span>
          </span>
          <span className="text-[11px] text-slate-400">1-Click nạp kích thước & trọng lượng 1 kiện</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {PACKAGING_PRESETS.map(preset => {
            const isMatch = 
              order.lengthCm === preset.length && 
              order.widthCm === preset.width && 
              order.heightCm === preset.height;

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPackagingPreset(preset)}
                className={`p-2.5 rounded-xl text-left border transition-all text-xs flex flex-col justify-between ${
                  isMatch
                    ? 'border-emerald-400 bg-emerald-900/40 text-emerald-200 ring-1 ring-emerald-400 shadow-lg shadow-emerald-950/40'
                    : 'border-slate-800 bg-slate-850/60 hover:bg-slate-800 hover:border-emerald-700/60 text-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1 font-bold">
                    <span>{preset.icon}</span>
                    <span className="truncate">{preset.name}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {preset.length}×{preset.width}×{preset.height} cm
                  </p>
                </div>
                <div className="mt-2 pt-1.5 border-t border-slate-700/50 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="text-emerald-400 font-semibold">{preset.typicalWeight} kg/kiện</span>
                  <span className="text-emerald-300">Chọn ➔</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: NHẬP THÔNG SỐ 1 KIỆN & SỐ LƯỢNG */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Left Inputs (7 Cols): Step A (1 Kiện) + Step B (Số lượng) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Card A: Kích thước & Khối lượng 1 Kiện */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <Box className="w-4 h-4 text-emerald-400" />
                <span>Bước 1: Kích thước & Cân nặng của 1 Kiện Hàng</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Đơn vị: cm, kg</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {/* Chiều Dài */}
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 focus-within:border-emerald-400 transition-colors">
                <div className="flex justify-between items-center text-[11px] text-slate-300 mb-0.5">
                  <label htmlFor="len-single" className="font-semibold">Dài (L)</label>
                  <span className="text-[10px] text-emerald-400 font-mono">cm</span>
                </div>
                <input
                  id="len-single"
                  type="number"
                  min="1"
                  max="2500"
                  step="any"
                  value={order.lengthCm}
                  onChange={(e) => setOrder(prev => ({ ...prev, lengthCm: Math.max(1, Number(e.target.value)) }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono text-base font-bold focus:outline-none focus:border-emerald-400"
                  required
                />
                <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                  = {(order.lengthCm / 100).toFixed(2)} m
                </span>
              </div>

              {/* Chiều Rộng */}
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 focus-within:border-emerald-400 transition-colors">
                <div className="flex justify-between items-center text-[11px] text-slate-300 mb-0.5">
                  <label htmlFor="wid-single" className="font-semibold">Rộng (W)</label>
                  <span className="text-[10px] text-emerald-400 font-mono">cm</span>
                </div>
                <input
                  id="wid-single"
                  type="number"
                  min="1"
                  max="2500"
                  step="any"
                  value={order.widthCm}
                  onChange={(e) => setOrder(prev => ({ ...prev, widthCm: Math.max(1, Number(e.target.value)) }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono text-base font-bold focus:outline-none focus:border-emerald-400"
                  required
                />
                <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                  = {(order.widthCm / 100).toFixed(2)} m
                </span>
              </div>

              {/* Chiều Cao */}
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 focus-within:border-emerald-400 transition-colors">
                <div className="flex justify-between items-center text-[11px] text-slate-300 mb-0.5">
                  <label htmlFor="hei-single" className="font-semibold">Cao (H)</label>
                  <span className="text-[10px] text-emerald-400 font-mono">cm</span>
                </div>
                <input
                  id="hei-single"
                  type="number"
                  min="1"
                  max="2500"
                  step="any"
                  value={order.heightCm}
                  onChange={(e) => setOrder(prev => ({ ...prev, heightCm: Math.max(1, Number(e.target.value)) }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono text-base font-bold focus:outline-none focus:border-emerald-400"
                  required
                />
                <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                  = {(order.heightCm / 100).toFixed(2)} m
                </span>
              </div>
            </div>

            {/* Cân nặng thực tế 1 kiện */}
            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-600/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="space-y-0.5">
                <label htmlFor="weight-single" className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Khối lượng thực tế 1 kiện:</span>
                </label>
                <p className="text-[11px] text-slate-400">
                  Cân nặng của 1 kiện đơn lẻ khi đặt lên cân
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="weight-single"
                  type="number"
                  min="0.1"
                  max="50000"
                  step="any"
                  value={order.weightKg}
                  onChange={(e) => setOrder(prev => ({ ...prev, weightKg: Math.max(0.1, Number(e.target.value)) }))}
                  className="w-28 bg-slate-900 border border-emerald-500/50 rounded-lg px-2.5 py-1.5 text-white font-mono text-lg font-black text-right focus:outline-none focus:border-emerald-400"
                  required
                />
                <span className="text-xs font-mono font-bold text-emerald-400">kg/kiện</span>
              </div>
            </div>

            {/* Tính nhanh cho 1 kiện */}
            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-400 block">Thể tích 1 kiện:</span>
                <span className="font-mono font-bold text-teal-300">
                  {singleVolumeM3.toFixed(3)} m³
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Trọng lượng quy đổi 1 kiện:</span>
                <span className="font-mono font-bold text-emerald-300">
                  {singleVolumetricWeight.toFixed(1)} kg
                </span>
              </div>
            </div>
          </div>

          {/* Card B: Nhập Số Lượng Kiện */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-teal-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-teal-400" />
                <span>Bước 2: Số Lượng Kiện Hàng Trong Lô</span>
              </span>
              <span className="text-[11px] text-slate-400">Hệ thống sẽ nhân thông số 1 kiện lên N lần</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleAdjustQuantity(-1)}
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold transition-colors"
                  aria-label="Giảm 1 kiện"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="text-center">
                  <input
                    type="number"
                    min="1"
                    max="5000"
                    value={order.quantity}
                    onChange={(e) => setOrder(prev => ({ ...prev, quantity: Math.max(1, Math.floor(Number(e.target.value))) }))}
                    className="w-24 bg-slate-900 border border-teal-500/60 rounded-lg px-2 py-1 text-center font-mono text-xl font-black text-teal-300 focus:outline-none"
                    required
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">kiện / thùng</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleAdjustQuantity(1)}
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold transition-colors"
                  aria-label="Tăng 1 kiện"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Quick quantity pill buttons */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-500 mr-1 hidden sm:inline">Nhanh:</span>
                {[1, 5, 10, 20, 50, 100].map(qty => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setOrder(prev => ({ ...prev, quantity: qty }))}
                    className={`px-2 py-1 rounded-md text-[11px] font-mono border transition-colors ${
                      order.quantity === qty
                        ? 'bg-teal-600 text-white border-teal-400 font-bold shadow-sm'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white border-slate-700'
                    }`}
                  >
                    {qty}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Right (5 Cols): Isometric 3D Visualizer + Dimension Overview */}
        <div className="lg:col-span-5 p-4 rounded-xl bg-slate-950/90 border border-emerald-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-emerald-950/80 pb-2 mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
              <Box className="w-4 h-4 text-emerald-400" />
              <span>Mô Phỏng 3D Kiện Hàng Đơn Lẻ</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">
              {order.lengthCm} × {order.widthCm} × {order.heightCm} cm
            </span>
          </div>

          {/* SVG 3D Isometric View */}
          <div className="relative w-full h-40 flex items-center justify-center overflow-hidden">
            <svg viewBox="-120 -80 240 160" className="w-full h-full max-h-36">
              <defs>
                <linearGradient id="ecoTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="ecoLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#047857" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#064e3b" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="ecoRightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#059669" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#065f46" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              {(() => {
                const cos30 = 0.866;
                const sin30 = 0.5;
                const l = boxL * 0.7;
                const w = boxW * 0.7;
                const h = boxH * 0.7;

                const p0 = { x: 0, y: h / 2 };
                const pLeftBottom = { x: -l * cos30, y: h / 2 - l * sin30 };
                const pRightBottom = { x: w * cos30, y: h / 2 - w * sin30 };
                const pFarBottom = { x: (w - l) * cos30, y: h / 2 - (w + l) * sin30 };

                const pTopCenter = { x: 0, y: -h / 2 };
                const pTopLeft = { x: -l * cos30, y: -h / 2 - l * sin30 };
                const pTopRight = { x: w * cos30, y: -h / 2 - w * sin30 };
                const pTopFar = { x: (w - l) * cos30, y: -h / 2 - (w + l) * sin30 };

                return (
                  <g>
                    {/* Shadow */}
                    <polygon
                      points={`${p0.x},${p0.y + 10} ${pLeftBottom.x},${pLeftBottom.y + 10} ${pFarBottom.x},${pFarBottom.y + 10} ${pRightBottom.x},${pRightBottom.y + 10}`}
                      fill="#000000"
                      opacity="0.5"
                    />

                    {/* Left Face */}
                    <polygon
                      points={`${p0.x},${p0.y} ${pLeftBottom.x},${pLeftBottom.y} ${pTopLeft.x},${pTopLeft.y} ${pTopCenter.x},${pTopCenter.y}`}
                      fill="url(#ecoLeftGrad)"
                      stroke="#10b981"
                      strokeWidth="1.2"
                    />

                    {/* Right Face */}
                    <polygon
                      points={`${p0.x},${p0.y} ${pRightBottom.x},${pRightBottom.y} ${pTopRight.x},${pTopRight.y} ${pTopCenter.x},${pTopCenter.y}`}
                      fill="url(#ecoRightGrad)"
                      stroke="#34d399"
                      strokeWidth="1.2"
                    />

                    {/* Top Face */}
                    <polygon
                      points={`${pTopCenter.x},${pTopCenter.y} ${pTopLeft.x},${pTopLeft.y} ${pTopFar.x},${pTopFar.y} ${pTopRight.x},${pTopRight.y}`}
                      fill="url(#ecoTopGrad)"
                      stroke="#6ee7b7"
                      strokeWidth="1.2"
                    />

                    {/* Carton tape */}
                    <line
                      x1={pTopCenter.x}
                      y1={pTopCenter.y}
                      x2={pTopFar.x}
                      y2={pTopFar.y}
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                      strokeDasharray="4,2"
                    />

                    {/* Labels */}
                    <text
                      x={(p0.x + pLeftBottom.x) / 2 - 12}
                      y={(p0.y + pLeftBottom.y) / 2 + 10}
                      fill="#6ee7b7"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      Dài {order.lengthCm}cm
                    </text>

                    <text
                      x={(p0.x + pRightBottom.x) / 2 + 16}
                      y={(p0.y + pRightBottom.y) / 2 + 10}
                      fill="#6ee7b7"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      Rộng {order.widthCm}cm
                    </text>

                    <text
                      x={14}
                      y={0}
                      fill="#a7f3d0"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="start"
                    >
                      Cao {order.heightCm}cm
                    </text>
                  </g>
                );
              })()}
            </svg>
          </div>

          {/* Dimension warning if needed */}
          {(isOverLength || isOverHeight || isOverWeight) && (
            <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-500/40 text-[11px] text-amber-200 mt-2">
              <span className="font-bold block text-amber-300">⚠️ Lưu ý kích thước:</span>
              {isOverLength && `Dài ${order.lengthCm}cm (>2.4m). `}
              {isOverHeight && `Cao ${order.heightCm}cm (>1.8m). `}
              {isOverWeight && `Tổng tải trọng ${totalChargeableWeight.toLocaleString()}kg (>2 tấn).`}
            </div>
          )}

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono mt-2">
            <span>1 Kiện: <strong className="text-emerald-300">{singleVolumeM3.toFixed(3)} m³</strong></span>
            <span>Cân nặng: <strong className="text-emerald-300">{order.weightKg} kg</strong></span>
          </div>
        </div>

      </div>

      {/* SECTION 2: BẢNG TỔNG HỢP TOÀN BỘ LÔ HÀNG (CẢ LÔ) */}
      <div className="p-4 rounded-xl bg-slate-950/90 border border-emerald-500/30 space-y-4">
        
        {/* Banner Multiplying Formula */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Bước 3: Tổng Hợp Toàn Bộ Lô Hàng ({order.quantity} Kiện)
            </h4>
          </div>
          <div className="text-xs font-mono text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-800/80">
            Công thức: (Số liệu 1 kiện) × ({order.quantity} kiện) = Toàn bộ lô hàng
          </div>
        </div>

        {/* 4 Grand Totals Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* 1. Tổng Thể Tích */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400">1. Tổng Thể Tích Cả Lô:</span>
              <span className="text-[10px] font-mono text-cyan-400">CBM</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-mono font-black text-2xl text-cyan-400">
                {totalVolumeM3.toFixed(3)}
              </span>
              <span className="text-xs text-cyan-500 font-mono">m³</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">
              = {singleVolumeM3.toFixed(3)} m³ × {order.quantity} kiện
            </p>
          </div>

          {/* 2. Tổng Khối Lượng Thực Tế (GW) */}
          <div className={`p-3.5 rounded-xl border space-y-1 transition-all ${
            !isBulkyCargo 
              ? 'bg-emerald-950/30 border-emerald-500/60 ring-1 ring-emerald-500/30' 
              : 'bg-slate-900/90 border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400">2. Tổng Cân Nặng Thực (GW):</span>
              {!isBulkyCargo && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950">
                  Lớn hơn
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-mono font-black text-2xl text-emerald-400">
                {totalActualWeight.toLocaleString()}
              </span>
              <span className="text-xs text-emerald-500 font-mono">kg</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">
              = {order.weightKg} kg × {order.quantity} kiện
            </p>
          </div>

          {/* 3. Tổng Trọng Lượng Quy Đổi (VW) */}
          <div className={`p-3.5 rounded-xl border space-y-1 transition-all ${
            isBulkyCargo 
              ? 'bg-amber-950/30 border-amber-500/60 ring-1 ring-amber-500/30' 
              : 'bg-slate-900/90 border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400">3. Trọng Lượng Quy Đổi (VW):</span>
              {isBulkyCargo && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-slate-950">
                  Lớn hơn
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-mono font-black text-2xl text-amber-400">
                {totalVolumetricWeight.toFixed(1)}
              </span>
              <span className="text-xs text-amber-500 font-mono">kg</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">
              = {singleVolumetricWeight.toFixed(1)} kg × {order.quantity} kiện
            </p>
          </div>

          {/* 4. Trọng Lượng Tính Cước Cuối Cùng (CW) */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-950/80 via-teal-950/60 to-slate-900 border border-emerald-400/60 shadow-lg shadow-emerald-950/50 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-emerald-300">4. Trọng Lượng Tính Cước (CW):</span>
              <span className="text-[9px] uppercase font-bold text-emerald-400">Max(GW, VW)</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-mono font-black text-3xl text-emerald-300">
                {totalChargeableWeight.toFixed(1)}
              </span>
              <span className="text-xs text-emerald-400 font-mono font-bold">kg</span>
            </div>
            <p className="text-[10px] text-emerald-200/80">
              Đưa vào mô hình AI để tính cước phí
            </p>
          </div>

        </div>

        {/* Verdict Callout Banner */}
        <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
          isBulkyCargo
            ? 'bg-amber-950/30 border-amber-500/50 text-amber-200'
            : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <span className="text-xl">{isBulkyCargo ? '📦' : '⚖️'}</span>
            <div>
              <strong className="font-bold text-sm">
                {isBulkyCargo
                  ? `Kết luận: Đơn hàng là HÀNG CỒNG KỀNH (Thể tích chiếm chỗ quy đổi ${totalVolumetricWeight.toFixed(1)} kg > Cân nặng thực tế ${totalActualWeight} kg)`
                  : `Kết luận: Đơn hàng là HÀNG NẶNG (Cân nặng thực tế ${totalActualWeight} kg ≥ Thể tích quy đổi ${totalVolumetricWeight.toFixed(1)} kg)`
                }
              </strong>
              <p className="text-[11px] opacity-90 mt-0.5">
                Các đơn vị 3PL sẽ áp dụng bảng giá cước trên trọng lượng tính cước chính thức: <strong className="font-mono text-white text-xs">{totalChargeableWeight.toFixed(1)} kg</strong>.
              </p>
            </div>
          </div>

          <div className="hidden sm:block text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Mật độ lô hàng</span>
            <span className="text-sm font-bold font-mono text-white">{metrics.densityKgM3} kg/m³</span>
          </div>
        </div>

      </div>

      {/* Formula Explanation Collapsible */}
      {showFormulaDetails && (
        <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/20 text-xs text-slate-300 space-y-3 animate-fadeIn">
          <div className="flex items-center gap-2 text-emerald-300 font-bold">
            <Info className="w-4 h-4 text-emerald-400" />
            <span>Quy Chuẩn Quốc Tế & Logistics Việt Nam Về Trọng Lượng Tính Cước (Chargeable Weight)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <span className="font-bold text-cyan-400 block">1. Thể tích Mét Khối (CBM):</span>
              <p className="text-slate-300 font-mono">
                CBM = (Dài × Rộng × Cao cm) / 1.000.000 × Số kiện
              </p>
              <p className="text-slate-500 text-[10px]">
                Đo lường thể tích không gian kiện hàng chiếm trong thùng xe tải hoặc container.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <span className="font-bold text-amber-400 block">2. Trọng Lượng Quy Đổi (VW):</span>
              <p className="text-slate-300 font-mono">
                VW (kg) = (Dài × Rộng × Cao cm) / 5.000 × Số kiện
              </p>
              <p className="text-slate-500 text-[10px]">
                Hệ số 5.000 tương đương 1 m³ = 200 kg theo chuẩn hiệp hội vận tải đường bộ Việt Nam.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <span className="font-bold text-emerald-400 block">3. Trọng Lượng Tính Cước (CW):</span>
              <p className="text-slate-300 font-mono">
                CW = Max(Tổng GW, Tổng VW)
              </p>
              <p className="text-slate-500 text-[10px]">
                Đơn vị 3PL tính phí theo số lớn hơn nhằm bù đắp chi phí thể tích chiếm chỗ trong khoang xe.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
