import React, { useState, useMemo } from 'react';
import { 
  Package, 
  MapPin, 
  TrendingUp, 
  Zap, 
  DollarSign, 
  ShieldCheck, 
  Scale, 
  Layers, 
  Sparkles, 
  Snowflake, 
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  HelpCircle,
  Truck,
  Leaf,
  ArrowUpDown,
  Compass,
  Building2,
  Anchor
} from 'lucide-react';
import { OrderInput, CargoType, PriorityGoal, CargoMetrics } from '../types/logistics';
import { CITY_COORDINATES, calculateCargoMetrics, resolveCityHub } from '../services/scoringEngine';
import { CargoDimensionsSection } from './CargoDimensionsSection';

export type FormStepTab = 'dimensions' | 'route' | 'cargo' | 'priority' | 'all';

interface OrderFormProps {
  order: OrderInput;
  setOrder: React.Dispatch<React.SetStateAction<OrderInput>>;
  onSubmit: () => void;
  isLoading: boolean;
  onApplyPreset: (presetKey: string) => void;
}

const CARGO_TYPES: { id: CargoType; label: string; desc: string; icon: string }[] = [
  { id: 'fmcg', label: 'Hàng tiêu dùng nhanh (FMCG)', desc: 'Thực phẩm khô, hóa mỹ phẩm, may mặc', icon: '📦' },
  { id: 'electronics', label: 'Điện tử & Công nghệ', desc: 'Linh kiện, điện thoại, máy tính', icon: '💻' },
  { id: 'perishable', label: 'Nông sản & Chuỗi lạnh', desc: 'Thực phẩm tươi sống, thủy hải sản', icon: '❄️' },
  { id: 'bulky', label: 'Hàng cồng kềnh / Cơ khí', desc: 'Máy móc, phụ tùng nặng, vật liệu', icon: '🏗️' },
  { id: 'high_value', label: 'Hàng giá trị cao', desc: 'Mỹ phẩm xa xỉ, dược phẩm, trang sức', icon: '💎' },
  { id: 'fragile_chemicals', label: 'Hàng dễ vỡ / Thủy tinh', desc: 'Đồ sành sứ, hóa chất thông dụng', icon: '🍷' },
];

const REGIONAL_CITY_GROUPS = [
  {
    groupLabel: '🏭 Miền Bắc (Hub Công nghiệp, Cảng biển Đình Vũ/Lạch Huyện & Cửa khẩu)',
    cities: [
      'Hà Nội',
      'Hải Phòng',
      'Bắc Ninh',
      'Hưng Yên',
      'Hải Dương',
      'Quảng Ninh',
      'Lạng Sơn',
      'Vĩnh Phúc',
      'Hà Nam',
      'Thái Nguyên',
    ]
  },
  {
    groupLabel: '🌊 Miền Trung & Tây Nguyên (Hub Cảng Quy Nhơn, Chu Lai & Chuỗi lạnh Đà Lạt)',
    cities: [
      'Đà Nẵng',
      'Bình Định (Quy Nhơn)',
      'Khánh Hòa (Nha Trang)',
      'Quảng Nam (Chu Lai)',
      'Nghệ An (Vinh)',
      'Lâm Đồng (Đà Lạt)',
      'Đắk Lắk (Buôn Ma Thuột)',
    ]
  },
  {
    groupLabel: '🏙️ Miền Nam & ĐBSCL (Cụm cảng Cái Mép, Cát Lái, ICD Sóng Thần & Nông thủy sản)',
    cities: [
      'TP. Hồ Chí Minh',
      'Bình Dương',
      'Đồng Nai',
      'Bà Rịa - Vũng Tàu',
      'Long An',
      'Tây Ninh',
      'Tiền Giang (Mỹ Tho)',
      'Cần Thơ',
      'Đồng Tháp',
      'Kiên Giang (Rạch Giá)',
      'Cà Mau',
    ]
  }
];

const SPECIALIZED_LOGISTICS_ROUTES = [
  { label: 'Bắc Ninh ➔ Hải Phòng', orig: 'Bắc Ninh', dest: 'Hải Phòng', desc: 'KCN Công nghệ ➔ Cảng biển Đình Vũ/Lạch Huyện', icon: '🚢' },
  { label: 'Bình Dương ➔ Cái Mép', orig: 'Bình Dương', dest: 'Bà Rịa - Vũng Tàu', desc: 'Thủ phủ kho bãi ICD Sóng Thần ➔ Cảng nước sâu Cái Mép', icon: '⚓' },
  { label: 'Đà Lạt ➔ TP.HCM', orig: 'Lâm Đồng (Đà Lạt)', dest: 'TP. Hồ Chí Minh', desc: 'Chuỗi lạnh rau củ quả & hoa tươi xuất nhập khẩu', icon: '🥦' },
  { label: 'Hà Nội ➔ Lạng Sơn', orig: 'Hà Nội', dest: 'Lạng Sơn', desc: 'Hành lang xuất nhập khẩu Cửa khẩu Quốc tế Hữu Nghị', icon: '🛂' },
  { label: 'Cần Thơ ➔ Hà Nội', orig: 'Cần Thơ', dest: 'Hà Nội', desc: 'Thủy hải sản ĐBSCL ➔ Thủ đô & Hub miền Bắc', icon: '🦐' },
  { label: 'Hà Nội ➔ TP.HCM', orig: 'Hà Nội', dest: 'TP. Hồ Chí Minh', desc: 'Trục huyết mạch vận tải Bắc - Nam (1.720 km)', icon: '🚛' },
];

export const OrderForm: React.FC<OrderFormProps> = ({
  order,
  setOrder,
  onSubmit,
  isLoading,
  onApplyPreset
}) => {
  // Live metric preview
  const metrics: CargoMetrics = useMemo(() => {
    return calculateCargoMetrics(order);
  }, [order]);

  const [activeStepTab, setActiveStepTab] = useState<FormStepTab>('dimensions');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="space-y-6">
      
      {/* Quick Preset Selector */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-[#07201c] to-slate-900 border border-emerald-500/25 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>Dữ liệu đơn hàng mẫu (1-Click Presets)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-normal">Thử nghiệm nhanh</span>
            </span>
          </div>
          <span className="text-[11px] text-emerald-100/60">Nhấp để nạp nhanh thông số</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => onApplyPreset('electronics_express')}
            className="p-2.5 rounded-xl text-left border border-emerald-900/60 bg-slate-900/70 hover:bg-emerald-950/60 hover:border-emerald-500/50 transition-all group"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-teal-300 group-hover:text-emerald-200">
              <span>💻</span>
              <span className="truncate">10 Kiện Laptop</span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              Bắc Ninh ➔ TP.HCM | Ưu tiên Tốc độ
            </p>
          </button>

          <button
            type="button"
            onClick={() => onApplyPreset('cold_chain')}
            className="p-2.5 rounded-xl text-left border border-emerald-900/60 bg-slate-900/70 hover:bg-emerald-950/60 hover:border-emerald-500/50 transition-all group"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 group-hover:text-cyan-200">
              <span>❄️</span>
              <span className="truncate">Pallet Thủy Sản Lạnh</span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              Cần Thơ ➔ Hà Nội | Chuỗi lạnh
            </p>
          </button>

          <button
            type="button"
            onClick={() => onApplyPreset('fmcg_budget')}
            className="p-2.5 rounded-xl text-left border border-emerald-900/60 bg-slate-900/70 hover:bg-emerald-950/60 hover:border-emerald-500/50 transition-all group"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 group-hover:text-emerald-200">
              <span>👕</span>
              <span className="truncate">500kg Hàng May Mặc</span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              TP.HCM ➔ Đà Nẵng | Tiết kiệm giá
            </p>
          </button>

          <button
            type="button"
            onClick={() => onApplyPreset('heavy_machinery')}
            className="p-2.5 rounded-xl text-left border border-emerald-900/60 bg-slate-900/70 hover:bg-emerald-950/60 hover:border-emerald-500/50 transition-all group"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 group-hover:text-amber-200">
              <span>🏗️</span>
              <span className="truncate">2 Tấn Cơ Khí Nặng</span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              Hải Phòng ➔ Đồng Nai | Siêu trọng
            </p>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Step Navigation Tabs Bar */}
        <div className="bg-slate-900/95 p-1.5 rounded-2xl border border-emerald-500/30 shadow-lg flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveStepTab('dimensions')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-1 justify-center ${
              activeStepTab === 'dimensions'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/60'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-slate-950/60 flex items-center justify-center text-[10px] font-black">1</span>
            <Package className="w-4 h-4" />
            <span>Kiện & Thể Tích</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStepTab('route')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-1 justify-center ${
              activeStepTab === 'route'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/60'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-slate-950/60 flex items-center justify-center text-[10px] font-black">2</span>
            <MapPin className="w-4 h-4" />
            <span>Tuyến & 27 Hubs</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStepTab('cargo')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-1 justify-center ${
              activeStepTab === 'cargo'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/60'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-slate-950/60 flex items-center justify-center text-[10px] font-black">3</span>
            <Layers className="w-4 h-4" />
            <span>Loại Hàng Hóa</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStepTab('priority')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-1 justify-center ${
              activeStepTab === 'priority'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/60'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-slate-950/60 flex items-center justify-center text-[10px] font-black">4</span>
            <TrendingUp className="w-4 h-4" />
            <span>Mục Tiêu & Dịch Vụ</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStepTab('all')}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeStepTab === 'all'
                ? 'bg-slate-800 text-emerald-300 border border-emerald-500/50'
                : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Xem toàn bộ biểu mẫu trên một trang duy nhất"
          >
            <span>Tất cả</span>
          </button>
        </div>

        {/* Step 1: Dimensions & Weight with Enhanced Visualizer & Packaging Presets */}
        {(activeStepTab === 'dimensions' || activeStepTab === 'all') && (
          <div className="space-y-4">
            <CargoDimensionsSection 
              order={order} 
              setOrder={setOrder} 
              metrics={metrics} 
            />
            {activeStepTab !== 'all' && (
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStepTab('route')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 group"
                >
                  <span>Tiếp tục: Bước 2 Tuyến đường</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Route & Destination Selection */}
        {(activeStepTab === 'route' || activeStepTab === 'all') && (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-[#061816] border border-emerald-500/20 shadow-md space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-emerald-950/60 pb-3 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-black text-base">
                    2
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>Tuyến Đường Vận Chuyển Chuyên Biệt</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-950 border border-teal-500/40 text-teal-300 font-medium">
                        27 Tỉnh & Hub Logistics
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">Chọn điểm đi và điểm đến để mô hình đánh giá tỷ lệ đúng hạn của từng 3PL theo từng cặp hành lang vận tải</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs self-start sm:self-auto">
                  <span className="text-slate-400">Cự ly ước tính:</span>
                  <span className="font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-700/50">
                    {metrics.estimatedDistanceKm} km
                  </span>
                </div>
              </div>

              {/* Quick Specialized Logistics Routes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-teal-300 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-teal-400" />
                    <span>Các tuyến chuyên biệt trọng điểm (Click chọn nhanh):</span>
                  </span>
                  <span className="text-[11px] text-slate-500 hidden sm:inline">Cảng nước sâu, KCN vệ tinh & Chuỗi lạnh</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {SPECIALIZED_LOGISTICS_ROUTES.map(route => {
                    const isActive = order.originCity === route.orig && order.destinationCity === route.dest;
                    return (
                      <button
                        key={route.label}
                        type="button"
                        onClick={() => setOrder(prev => ({ ...prev, originCity: route.orig, destinationCity: route.dest }))}
                        className={`p-2 rounded-xl text-left border transition-all text-xs flex flex-col justify-between ${
                          isActive
                            ? 'border-emerald-400 bg-emerald-950/70 text-emerald-200 shadow-sm ring-1 ring-emerald-400/50'
                            : 'border-slate-800 bg-slate-900/60 hover:bg-emerald-950/30 hover:border-emerald-600/40 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold truncate">
                          <span>{route.icon}</span>
                          <span className="truncate">{route.label}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 truncate mt-1">{route.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Origin and Destination Selectors with Swap */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto,1fr] gap-3 items-center">
                {/* Origin */}
                <div className="space-y-2">
                  <label htmlFor="origin-city-select" className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-400" />
                    <span>Tỉnh / Thành phố Đi (Nơi nhận & đóng gói)</span>
                  </label>
                  <select
                    id="origin-city-select"
                    value={order.originCity}
                    onChange={(e) => setOrder(prev => ({ ...prev, originCity: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-medium focus:outline-none focus:border-emerald-400 transition-colors"
                  >
                    {REGIONAL_CITY_GROUPS.map(group => (
                      <optgroup key={group.groupLabel} label={group.groupLabel}>
                        {group.cities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>

                  {/* Origin Hub Detail Card */}
                  {(() => {
                    const hub = resolveCityHub(order.originCity);
                    if (!hub) return null;
                    return (
                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-teal-900/40 text-xs flex items-start gap-2.5">
                        <span className="text-xl mt-0.5">{hub.icon}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white">{order.originCity}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800/40">
                              {hub.regionLabel}
                            </span>
                          </div>
                          <p className="text-[11px] text-emerald-200/80 leading-snug mt-0.5">
                            {hub.specialtyTag}
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Swap Button */}
                <div className="flex justify-center pt-4 lg:pt-0">
                  <button
                    type="button"
                    onClick={() => setOrder(prev => ({ ...prev, originCity: prev.destinationCity, destinationCity: prev.originCity }))}
                    title="Đổi chiều tuyến vận chuyển"
                    className="p-3 rounded-xl bg-slate-800 hover:bg-emerald-900/70 border border-slate-700 hover:border-emerald-500/60 text-slate-300 hover:text-emerald-300 transition-all flex items-center justify-center gap-1 text-xs font-semibold shadow-md group"
                  >
                    <ArrowUpDown className="w-4 h-4 text-emerald-400 group-hover:rotate-180 transition-transform duration-300" />
                    <span className="lg:hidden text-xs">Đổi chiều điểm đi / đến</span>
                  </button>
                </div>

                {/* Destination */}
                <div className="space-y-2">
                  <label htmlFor="dest-city-select" className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tỉnh / Thành phố Đến (Nơi giao hàng đích)</span>
                  </label>
                  <select
                    id="dest-city-select"
                    value={order.destinationCity}
                    onChange={(e) => setOrder(prev => ({ ...prev, destinationCity: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-medium focus:outline-none focus:border-emerald-400 transition-colors"
                  >
                    {REGIONAL_CITY_GROUPS.map(group => (
                      <optgroup key={group.groupLabel} label={group.groupLabel}>
                        {group.cities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>

                  {/* Destination Hub Detail Card */}
                  {(() => {
                    const hub = resolveCityHub(order.destinationCity);
                    if (!hub) return null;
                    return (
                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-emerald-900/40 text-xs flex items-start gap-2.5">
                        <span className="text-xl mt-0.5">{hub.icon}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white">{order.destinationCity}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                              {hub.regionLabel}
                            </span>
                          </div>
                          <p className="text-[11px] text-emerald-200/80 leading-snug mt-0.5">
                            {hub.specialtyTag}
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Corridor Assessment Details */}
              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-300 font-semibold">
                      Phân loại Hành lang Vận tải:
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {metrics.routeType === 'port_corridor' && '🚢 Hành lang Cảng biển & Hàng hải Xuất nhập khẩu'}
                      {metrics.routeType === 'industrial_corridor' && '🏭 Hành lang Công nghiệp & Kho vận Vệ tinh'}
                      {metrics.routeType === 'north_south_axis' && '🚛 Tuyến trục Huyết mạch Bắc - Nam'}
                      {metrics.routeType === 'inner_city' && '🏙️ Tuyến Giao nhận Nội thành & Phụ cận'}
                      {metrics.routeType === 'regional' && '🗺️ Tuyến Vận tải Liên tỉnh Khu vực'}
                    </span>
                  </div>
                  <span className="text-emerald-400 font-mono font-bold text-xs">
                    Khoảng cách: ~{metrics.estimatedDistanceKm} km
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {metrics.routeType === 'port_corridor' && (
                    <span>Mô hình AI sẽ đánh giá cao nhà xe sở hữu đội xe đầu kéo container, hạ tầng liên kết cảng biển quốc tế (Đình Vũ, Cái Mép, Cát Lái) và kinh nghiệm xử lý chứng từ hải quan.</span>
                  )}
                  {metrics.routeType === 'industrial_corridor' && (
                    <span>Mô hình AI ưu tiên nhà xe có tần suất xe chạy liên tục hàng ngày giữa các KCN công nghệ cao (Bắc Ninh, Bình Dương, Đồng Nai, Hưng Yên) và kho tổng ICD.</span>
                  )}
                  {metrics.routeType === 'north_south_axis' && (
                    <span>Mô hình AI ưu tiên các 3PL có trạm dừng trung chuyển dọc Quốc lộ 1A/Cao tốc Bắc Nam, hệ thống kiểm soát GPS 24/7 và 2 tài xế luân phiên đảm bảo an toàn.</span>
                  )}
                  {metrics.routeType === 'inner_city' && (
                    <span>Mô hình AI tối ưu hóa cước theo mạng lưới bưu cục/hub chặng cuối (last-mile) và đội xe van/xe tải nhẹ hạ tải tránh giờ cấm tải nội đô.</span>
                  )}
                  {metrics.routeType === 'regional' && (
                    <span>Mô hình AI cân đối giữa cước ghép hàng theo chuyến và thời gian giao nhận liên tỉnh phù hợp với loại hình hàng hóa được khai báo.</span>
                  )}
                </p>
              </div>
            </div>

            {/* Step 2 Navigation Buttons */}
            {activeStepTab !== 'all' && (
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStepTab('dimensions')}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại: Bước 1 Kiện & Kích thước</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStepTab('cargo')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 group"
                >
                  <span>Tiếp tục: Bước 3 Phân loại hàng</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Cargo Category */}
        {(activeStepTab === 'cargo' || activeStepTab === 'all') && (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-[#061816] border border-emerald-500/20 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-950/60 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black text-base">
                    3
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Phân Loại Hàng Hóa</h3>
                    <p className="text-xs text-slate-400">Chọn nhóm mặt hàng để mô hình lọc năng lực chuyên môn của nhà xe</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {CARGO_TYPES.map(cat => {
                  const isSelected = order.cargoType === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setOrder(prev => ({ 
                          ...prev, 
                          cargoType: cat.id,
                          specialRequirements: {
                            ...prev.specialRequirements,
                            coldChain: cat.id === 'perishable' ? true : prev.specialRequirements.coldChain
                          }
                        }));
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'border-emerald-400 bg-emerald-950/50 shadow-lg shadow-emerald-950/60 ring-1 ring-emerald-400'
                          : 'border-slate-800 bg-slate-900/60 hover:bg-slate-850 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <div>
                        <h4 className={`text-sm font-bold ${isSelected ? 'text-emerald-300' : 'text-white'}`}>
                          {cat.label}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                          {cat.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3 Navigation Buttons */}
            {activeStepTab !== 'all' && (
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStepTab('route')}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại: Bước 2 Tuyến đường</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStepTab('priority')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 group"
                >
                  <span>Tiếp tục: Bước 4 Mục tiêu & Dịch vụ</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Optimization Priority */}
        {(activeStepTab === 'priority' || activeStepTab === 'all') && (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-[#061816] border border-emerald-500/20 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-950/60 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black text-base">
                4
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Mục Tiêu Ưu Tiên (Optimization Priority)</h3>
                <p className="text-xs text-slate-400">Chỉ định trọng số ưu tiên: giá rẻ, tốc độ giao nhanh hay độ an toàn</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                id: 'balanced' as PriorityGoal,
                label: 'Cân bằng Tối ưu',
                desc: 'Hài hòa giữa chi phí hợp lý, thời gian giao và SLA',
                icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
                badge: 'Khuyên dùng'
              },
              {
                id: 'cost' as PriorityGoal,
                label: 'Ưu tiên Tiết kiệm Chi phí',
                desc: 'Tối đa hóa điểm số cho các 3PL có mức cước rẻ nhất',
                icon: <DollarSign className="w-5 h-5 text-teal-400" />,
                badge: 'Tiết kiệm'
              },
              {
                id: 'speed' as PriorityGoal,
                label: 'Ưu tiên Tốc độ Giao nhanh',
                desc: 'Tối ưu thời gian nhận hàng và luân chuyển hỏa tốc',
                icon: <Zap className="w-5 h-5 text-cyan-400" />,
                badge: 'Hỏa tốc'
              },
              {
                id: 'reliability' as PriorityGoal,
                label: 'Ưu tiên Độ an toàn & SLA',
                desc: 'Tỷ lệ đúng hạn cao nhất, bồi thường 100%, bảo mật',
                icon: <ShieldCheck className="w-5 h-5 text-amber-400" />,
                badge: 'Uy tín cao'
              }
            ].map(p => {
              const isSelected = order.priority === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setOrder(prev => ({ ...prev, priority: p.id }))}
                  className={`p-4 rounded-xl border text-left transition-all relative ${
                    isSelected
                      ? 'border-emerald-400 bg-emerald-950/40 shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-400'
                      : 'border-slate-800 bg-slate-900/60 hover:bg-slate-850 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                      {p.icon}
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-emerald-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {p.badge}
                    </span>
                  </div>
                  <h4 className={`text-sm font-bold ${isSelected ? 'text-emerald-300' : 'text-white'}`}>
                    {p.label}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-snug">
                    {p.desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Additional Options */}
          <div className="pt-3 border-t border-slate-800/80">
            <span className="text-xs font-semibold text-emerald-300/80 uppercase tracking-wider block mb-3">
              Yêu cầu & Dịch vụ Gia tăng đặc thù
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:bg-emerald-950/30 transition-colors">
                <input
                  type="checkbox"
                  checked={!!order.specialRequirements.coldChain}
                  onChange={(e) => setOrder(prev => ({
                    ...prev,
                    specialRequirements: { ...prev.specialRequirements, coldChain: e.target.checked }
                  }))}
                  className="rounded text-emerald-600 focus:ring-0"
                />
                <Snowflake className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-200">Xe lạnh chuyên dụng</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:bg-emerald-950/30 transition-colors">
                <input
                  type="checkbox"
                  checked={!!order.specialRequirements.cargoInsurance}
                  onChange={(e) => setOrder(prev => ({
                    ...prev,
                    specialRequirements: { ...prev.specialRequirements, cargoInsurance: e.target.checked }
                  }))}
                  className="rounded text-emerald-600 focus:ring-0"
                />
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className="text-slate-200">Bảo hiểm 100% giá trị</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:bg-emerald-950/30 transition-colors">
                <input
                  type="checkbox"
                  checked={!!order.specialRequirements.expressDelivery}
                  onChange={(e) => setOrder(prev => ({
                    ...prev,
                    specialRequirements: { ...prev.specialRequirements, expressDelivery: e.target.checked }
                  }))}
                  className="rounded text-emerald-600 focus:ring-0"
                />
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-slate-200">Cam kết hỏa tốc 24h</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:bg-emerald-950/30 transition-colors">
                <input
                  type="checkbox"
                  checked={!!order.specialRequirements.liftingSupport}
                  onChange={(e) => setOrder(prev => ({
                    ...prev,
                    specialRequirements: { ...prev.specialRequirements, liftingSupport: e.target.checked }
                  }))}
                  className="rounded text-emerald-600 focus:ring-0"
                />
                <Layers className="w-4 h-4 text-teal-400" />
                <span className="text-slate-200">Bốc xếp & xe nâng tại chỗ</span>
              </label>
            </div>
          </div>
        </div>

        {/* Step 4 Navigation Button */}
        {activeStepTab !== 'all' && (
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setActiveStepTab('cargo')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại: Bước 3 Phân loại hàng</span>
            </button>
            <span className="text-xs text-emerald-300 font-medium hidden sm:inline">
              ✓ Đã hoàn tất 4 bước cấu hình đơn hàng
            </span>
          </div>
        )}
      </div>
    )}

        {/* Submit Button */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-[#07241f] to-slate-900 border border-emerald-500/40 shadow-xl">
          <div className="hidden sm:block text-xs text-slate-300">
            <span>Sẵn sàng: </span>
            <strong className="text-emerald-400 font-mono text-sm">{metrics.chargeableWeightKg} kg</strong> tính cước
            {' • '} tuyến <strong className="text-white">{order.originCity} ➔ {order.destinationCity}</strong>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-700/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group border border-emerald-400/40"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Mô hình AI đang chấm điểm 3PL...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>Phân tích & Chạy Mô hình AI Scoring</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
