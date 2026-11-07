import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  Compass, 
  Filter, 
  ArrowRight, 
  Truck, 
  Building2, 
  Anchor, 
  Snowflake, 
  ExternalLink,
  CheckCircle2,
  Navigation
} from 'lucide-react';
import { CITY_COORDINATES, CityHubInfo } from '../services/scoringEngine';
import { OrderInput } from '../types/logistics';

interface LogisticsNetworkTabProps {
  onSelectRoute: (origin: string, destination: string) => void;
  currentOrigin: string;
  currentDestination: string;
}

type HubFilter = 'all' | 'port' | 'industrial' | 'border' | 'cold_chain';

export const LogisticsNetworkTab: React.FC<LogisticsNetworkTabProps> = ({
  onSelectRoute,
  currentOrigin,
  currentDestination
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<HubFilter>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const hubEntries = Object.entries(CITY_COORDINATES);

  const filteredHubs = hubEntries.filter(([cityName, info]) => {
    // Search filter
    const matchesSearch = 
      cityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      info.specialtyTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      info.regionLabel.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    // Region filter
    if (selectedRegion !== 'all' && info.region !== selectedRegion) {
      return false;
    }

    // Category filter
    if (selectedFilter === 'port') {
      return info.specialtyTag.includes('Cảng') || info.icon === '🚢' || info.icon === '⚓';
    }
    if (selectedFilter === 'industrial') {
      return info.specialtyTag.includes('KCN') || info.specialtyTag.includes('kho') || info.specialtyTag.includes('ICD') || info.icon === '🏭' || info.icon === '🏗️';
    }
    if (selectedFilter === 'border') {
      return info.specialtyTag.includes('Cửa khẩu') || info.icon === '🛂';
    }
    if (selectedFilter === 'cold_chain') {
      return info.specialtyTag.includes('chuỗi lạnh') || info.specialtyTag.includes('thủy hải sản') || info.icon === '❄️' || info.icon === '🥦' || info.icon === '🦐' || info.icon === '🐟';
    }

    return true;
  });

  const KEY_CORRIDORS = [
    {
      name: 'Hành lang Hải Phòng - Hà Nội - Bắc Ninh (KCN & Cảng biển Miền Bắc)',
      distance: '120 - 160 km',
      time: '2.5 - 4 giờ',
      type: 'port_corridor',
      orig: 'Bắc Ninh',
      dest: 'Hải Phòng',
      note: 'Ưu tiên xe cont & xe tải trung luân chuyển linh kiện điện tử ra cảng Đình Vũ / Lạch Huyện.'
    },
    {
      name: 'Hành lang Bình Dương - Đồng Nai - Cái Mép (Cảng nước sâu Đông Nam Bộ)',
      distance: '95 - 120 km',
      time: '2 - 3.5 giờ',
      type: 'port_corridor',
      orig: 'Bình Dương',
      dest: 'Bà Rịa - Vũng Tàu',
      note: 'Tuyến kết nối hệ thống kho ICD Sóng Thần, Long Bình với cụm cảng đón tàu mẹ quốc tế Cái Mép.'
    },
    {
      name: 'Trục Huyết mạch Bắc - Nam (Hà Nội - Đà Nẵng - TP. Hồ Chí Minh)',
      distance: '1.720 km',
      time: '30 - 40 giờ',
      type: 'north_south_axis',
      orig: 'Hà Nội',
      dest: 'TP. Hồ Chí Minh',
      note: 'Trục xương sống luân chuyển hàng hóa liên vùng, kiểm soát trạm dừng GPS và đội xe 2 tài xế.'
    },
    {
      name: 'Hành lang Chuỗi Lạnh Rau Quả: Lâm Đồng (Đà Lạt) - TP. Hồ Chí Minh',
      distance: '310 km',
      time: '6 - 8 giờ',
      type: 'regional',
      orig: 'Lâm Đồng (Đà Lạt)',
      dest: 'TP. Hồ Chí Minh',
      note: 'Vận chuyển xe lạnh chuyên dụng kiểm soát nhiệt độ từ +2°C đến +8°C cho rau củ và hoa tươi.'
    },
    {
      name: 'Hành lang Nông Thủy Sản ĐBSCL: Cần Thơ - TP. Hồ Chí Minh',
      distance: '170 km',
      time: '3.5 - 5 giờ',
      type: 'regional',
      orig: 'Cần Thơ',
      dest: 'TP. Hồ Chí Minh',
      note: 'Hub trung chuyển thủy hải sản xuất khẩu, trái cây Đồng bằng Sông Cửu Long.'
    },
    {
      name: 'Hành lang Biên mậu Cửa khẩu: Hà Nội - Lạng Sơn (Hữu Nghị / Tân Thanh)',
      distance: '155 km',
      time: '3 - 4 giờ',
      type: 'regional',
      orig: 'Hà Nội',
      dest: 'Lạng Sơn',
      note: 'Xuất nhập khẩu đường bộ qua biên giới, thủ tục hải quan nhanh tại cửa khẩu quốc tế.'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#07211d] to-slate-900 border border-emerald-500/30 shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🗺️</span>
              <h2 className="text-xl font-black text-white tracking-tight">
                Mạng Lưới 27 Hub Logistics & Hành Lang Vận Tải Trọng Điểm
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Cơ sở dữ liệu tọa độ, cự ly thực tế và thế mạnh vận hành của 27 tỉnh thành logistics hàng đầu Việt Nam được tích hợp trong mô hình AI Scoring.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs bg-slate-900/80 px-3.5 py-2 rounded-xl border border-emerald-700/40">
            <span className="text-slate-400">Tuyến đang chọn:</span>
            <span className="font-bold text-emerald-300 font-mono">
              {currentOrigin} ➔ {currentDestination}
            </span>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-emerald-950/60">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm hub, cảng biển, KCN..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setSelectedRegion('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${selectedRegion === 'all' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              Toàn quốc
            </button>
            <button
              type="button"
              onClick={() => setSelectedRegion('Bac')}
              className={`px-2.5 py-1 rounded-md transition-colors ${selectedRegion === 'Bac' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              Miền Bắc
            </button>
            <button
              type="button"
              onClick={() => setSelectedRegion('Trung')}
              className={`px-2.5 py-1 rounded-md transition-colors ${selectedRegion === 'Trung' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              Miền Trung
            </button>
            <button
              type="button"
              onClick={() => setSelectedRegion('TayNguyen')}
              className={`px-2.5 py-1 rounded-md transition-colors ${selectedRegion === 'TayNguyen' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              Tây Nguyên
            </button>
            <button
              type="button"
              onClick={() => setSelectedRegion('Nam')}
              className={`px-2.5 py-1 rounded-md transition-colors ${selectedRegion === 'Nam' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              Miền Nam & ĐBSCL
            </button>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setSelectedFilter('all')}
              className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
                selectedFilter === 'all'
                  ? 'border-emerald-400 bg-emerald-950/80 text-emerald-300'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              Tất cả (27)
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('port')}
              className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all flex items-center gap-1 ${
                selectedFilter === 'port'
                  ? 'border-cyan-400 bg-cyan-950/80 text-cyan-300'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🚢</span>
              <span>Cảng biển quốc tế</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('industrial')}
              className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all flex items-center gap-1 ${
                selectedFilter === 'industrial'
                  ? 'border-emerald-400 bg-emerald-950/80 text-emerald-300'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🏭</span>
              <span>KCN & ICD Kho bãi</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('border')}
              className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all flex items-center gap-1 ${
                selectedFilter === 'border'
                  ? 'border-amber-400 bg-amber-950/80 text-amber-300'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🛂</span>
              <span>Cửa khẩu biên mậu</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('cold_chain')}
              className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all flex items-center gap-1 ${
                selectedFilter === 'cold_chain'
                  ? 'border-teal-400 bg-teal-950/80 text-teal-300'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🥦</span>
              <span>Chuỗi lạnh & Nông sản</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Freight Corridors Showcase */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>6 Hành Lang Vận Tải Huyết Mạch (Click để áp dụng ngay vào đơn hàng)</span>
          </h3>
          <span className="text-xs text-slate-400">Tự động cấu hình cự ly & tuyến</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {KEY_CORRIDORS.map(corridor => {
            const isCurrent = currentOrigin === corridor.orig && currentDestination === corridor.dest;
            return (
              <div
                key={corridor.name}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'border-emerald-400 bg-emerald-950/50 shadow-md ring-1 ring-emerald-400/40'
                    : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white truncate">
                      {corridor.orig} ➔ {corridor.dest}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                      {corridor.distance}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-emerald-300/90 leading-snug">
                    {corridor.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {corridor.note}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    Thời gian: <strong className="text-white">{corridor.time}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectRoute(corridor.orig, corridor.dest)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <span>Chọn tuyến này</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid of 27 Logistics Hubs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-teal-400" />
            <span>Danh Sách 27 Hub Logistics ({filteredHubs.length} địa điểm khớp bộ lọc)</span>
          </h3>
          <span className="text-xs text-slate-400">Nhấp để gán làm điểm gửi hoặc điểm nhận hàng</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredHubs.map(([cityName, info]) => {
            const isOrigin = currentOrigin === cityName;
            const isDest = currentDestination === cityName;

            return (
              <div
                key={cityName}
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                  isOrigin || isDest
                    ? 'border-emerald-400 bg-emerald-950/40 shadow-sm ring-1 ring-emerald-400/30'
                    : 'border-slate-800 bg-slate-900/60 hover:bg-slate-850 hover:border-slate-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{info.icon}</span>
                      <div>
                        <h4 className="text-sm font-bold text-white leading-tight">
                          {cityName}
                        </h4>
                        <span className="text-[10px] text-teal-300 font-medium">
                          {info.regionLabel} • {info.lat.toFixed(2)}°N, {info.lng.toFixed(2)}°E
                        </span>
                      </div>
                    </div>

                    {(isOrigin || isDest) && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        {isOrigin ? 'Điểm gửi' : 'Điểm nhận'}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-300 leading-snug bg-slate-950/50 p-2 rounded-lg border border-slate-800/80">
                    {info.specialtyTag}
                  </p>
                </div>

                <div className="pt-2.5 mt-2.5 border-t border-slate-800/80 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectRoute(cityName, currentDestination)}
                    className="flex-1 py-1 rounded bg-slate-800 hover:bg-teal-900/70 text-[11px] font-semibold text-slate-300 hover:text-white border border-slate-700 transition-colors"
                  >
                    Gửi từ đây
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectRoute(currentOrigin, cityName)}
                    className="flex-1 py-1 rounded bg-slate-800 hover:bg-emerald-900/70 text-[11px] font-semibold text-slate-300 hover:text-white border border-slate-700 transition-colors"
                  >
                    Giao tới đây
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
