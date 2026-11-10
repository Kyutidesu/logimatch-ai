import React, { useState } from 'react';
import { 
  Award, 
  Sparkles, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  Truck, 
  TrendingUp, 
  ArrowLeft, 
  CheckCircle2, 
  ChevronRight, 
  Info, 
  Cpu, 
  ExternalLink, 
  FileText, 
  Star,
  Layers,
  Phone,
  BarChart2,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Scale
} from 'lucide-react';
import { 
  OrderInput, 
  CargoMetrics, 
  ProviderEvaluation, 
  AIModelMetadata,
  WSMComparisonResult
} from '../types/logistics';
import { DynamicWSMComparison } from './DynamicWSMComparison';

interface ResultsDashboardProps {
  order: OrderInput;
  metrics: CargoMetrics;
  topProviders: ProviderEvaluation[];
  allProviders: ProviderEvaluation[];
  modelInfo: AIModelMetadata;
  aiAnalysisSummary?: string;
  wsmComparison?: WSMComparisonResult;
  onBackToInput: () => void;
  onBookProvider: (provider: ProviderEvaluation) => void;
  onOpenModelModal: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  order,
  metrics,
  topProviders,
  allProviders,
  modelInfo,
  aiAnalysisSummary,
  wsmComparison,
  onBackToInput,
  onBookProvider,
  onOpenModelModal
}) => {
  const [activeResultTab, setActiveResultTab] = useState<'top3' | 'wsm' | 'comparison' | 'market'>('top3');
  const [showComparison, setShowComparison] = useState(false);
  const [showAllMarket, setShowAllMarket] = useState(false);
  const [selectedCostDetail, setSelectedCostDetail] = useState<string | null>(null);

  const bestChoice = topProviders[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Header & Breadcrumbs / Order Context */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-[#061816] border border-emerald-500/30 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-950/60 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onBackToInput}
                className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-emerald-900/60 transition-colors"
                title="Quay lại nhập thông số đơn hàng"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>Dashboard Gợi Ý Top 3 Nhà Cung Cấp 3PL</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  AI Scored
                </span>
              </h2>
            </div>
            <p className="text-xs text-emerald-100/60">
              Mô hình <code className="text-emerald-400 font-mono">{modelInfo.modelName}</code> đã chấm điểm và xếp hạng {allProviders.length} đơn vị vận tải trên thị trường.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setShowComparison(prev => !prev)}
              className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-emerald-800/50 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-2 shadow-sm"
            >
              <BarChart2 className="w-4 h-4 text-emerald-400" />
              <span>{showComparison ? 'Ẩn so sánh trực diện' : 'So sánh Top 3'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveResultTab('wsm')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shadow-sm ${
                activeResultTab === 'wsm'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-indigo-900/50'
                  : 'bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-300'
              }`}
              title="So sánh kết quả chấm điểm đối đầu trực tiếp giữa AI và WSM trên đơn hàng này"
            >
              <Scale className="w-4 h-4 text-emerald-400" />
              <span>Đối Chiếu AI vs WSM</span>
            </button>

            <button
              type="button"
              onClick={onOpenModelModal}
              className="px-3.5 py-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-600/40 text-xs font-semibold text-emerald-300 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Giải thích AI Model</span>
            </button>
          </div>
        </div>

        {/* Current Order Summary Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-850/60 border border-emerald-900/40">
            <span className="text-slate-400 block text-[11px]">Tuyến vận chuyển</span>
            <span className="font-bold text-white block truncate">
              {order.originCity} ➔ {order.destinationCity}
            </span>
            <span className="text-[10px] text-emerald-400/80">{metrics.estimatedDistanceKm} km ({metrics.routeType})</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-850/60 border border-emerald-900/40">
            <span className="text-slate-400 block text-[11px]">Trọng lượng tính cước</span>
            <span className="font-mono font-bold text-emerald-300 block">
              {metrics.chargeableWeightKg} kg
            </span>
            <span className="text-[10px] text-slate-400">Thực: {order.weightKg * order.quantity}kg | Quy đổi: {metrics.volumetricWeightKg}kg</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-850/60 border border-emerald-900/40">
            <span className="text-slate-400 block text-[11px]">Kích thước & Kiện</span>
            <span className="font-mono font-semibold text-slate-200 block truncate">
              {order.lengthCm}x{order.widthCm}x{order.heightCm} cm
            </span>
            <span className="text-[10px] text-slate-400">{order.quantity} kiện ({metrics.volumeM3} m³)</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-850/60 border border-emerald-900/40">
            <span className="text-slate-400 block text-[11px]">Loại hàng hóa</span>
            <span className="font-bold text-teal-300 block truncate uppercase">
              {order.cargoType}
            </span>
            <span className="text-[10px] text-slate-400">Phân loại theo chuẩn</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-850/60 border border-emerald-900/40">
            <span className="text-slate-400 block text-[11px]">Mục tiêu ưu tiên</span>
            <span className="font-bold text-emerald-400 block truncate capitalize">
              {order.priority === 'cost' ? 'Tiết kiệm chi phí' : (order.priority === 'speed' ? 'Tốc độ hỏa tốc' : (order.priority === 'reliability' ? 'An toàn & SLA' : 'Cân bằng'))}
            </span>
            <span className="text-[10px] text-slate-400">Trọng số scoring</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-850/60 border border-emerald-900/40 flex flex-col justify-between">
            <span className="text-slate-400 block text-[11px]">Yêu cầu thêm</span>
            <div className="flex flex-wrap gap-1 mt-0.5">
              {order.specialRequirements.coldChain && (
                <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 text-[10px] border border-cyan-800">Lạnh</span>
              )}
              {order.specialRequirements.cargoInsurance && (
                <span className="px-1.5 py-0.2 rounded bg-amber-950 text-amber-400 text-[10px] border border-amber-800">Bảo hiểm</span>
              )}
              {order.specialRequirements.expressDelivery && (
                <span className="px-1.5 py-0.2 rounded bg-yellow-950 text-yellow-400 text-[10px] border border-yellow-800">Hỏa tốc</span>
              )}
              {!order.specialRequirements.coldChain && !order.specialRequirements.cargoInsurance && !order.specialRequirements.expressDelivery && (
                <span className="text-[10px] text-slate-500">Tiêu chuẩn</span>
              )}
            </div>
            <button
              type="button"
              onClick={onBackToInput}
              className="text-[10px] text-emerald-400 hover:underline text-left mt-1"
            >
              Chỉnh sửa ➔
            </button>
          </div>
        </div>

        {/* AI Commentary Note */}
        {aiAnalysisSummary && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/50 via-teal-950/40 to-slate-900 border border-emerald-500/30 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 flex-shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block mb-1">
                AI Logistics Dispatcher Insight (Nhận định Vận hành)
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {aiAnalysisSummary}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Results Sub-Tabs Switcher */}
      <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-emerald-500/30 shadow-lg overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveResultTab('top3')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap flex-1 justify-center ${
            activeResultTab === 'top3'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4 text-emerald-300" />
          <span>1. Top 3 Đề Xuất Tối Ưu</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveResultTab('wsm')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap flex-1 justify-center ${
            activeResultTab === 'wsm'
              ? 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Scale className="w-4 h-4 text-emerald-400" />
          <span>2. ⚔️ Đối Chiếu AI vs WSM (Song Song)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveResultTab('comparison')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap flex-1 justify-center ${
            activeResultTab === 'comparison'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BarChart2 className="w-4 h-4 text-teal-300" />
          <span>3. Bảng Ma Trận Top 3</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveResultTab('market')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap flex-1 justify-center ${
            activeResultTab === 'market'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4 text-cyan-300" />
          <span>4. Toàn Bộ Thị Trường ({allProviders.length} 3PL)</span>
        </button>
      </div>

      {/* TOP 3 3PL RECOMMENDED CARDS */}
      {activeResultTab === 'top3' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white tracking-tight">
                Top 3 Nhà Cung Cấp 3PL Được Đề Xuất
              </h3>
            </div>
            <span className="text-xs text-emerald-200/60">
              Sắp xếp theo Điểm Khớp Lệnh AI (Match Score 0-100)
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {topProviders.map((provider, index) => {
            const isTop1 = index === 0;
            const isTop2 = index === 1;
            const isTop3 = index === 2;

            let cardThemeBorder = 'border-slate-800';
            let badgeBg = 'bg-slate-800 text-slate-300';
            let crownIcon = null;

            if (isTop1) {
              cardThemeBorder = 'border-emerald-400/80 ring-2 ring-emerald-500/40 shadow-xl shadow-emerald-950/40';
              badgeBg = 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black';
              crownIcon = <Award className="w-4 h-4 text-emerald-300" />;
            } else if (isTop2) {
              cardThemeBorder = 'border-teal-500/40';
              badgeBg = 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold';
            } else if (isTop3) {
              cardThemeBorder = 'border-cyan-500/40';
              badgeBg = 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold';
            }

            return (
              <div
                key={provider.id}
                className={`rounded-2xl bg-slate-900 border ${cardThemeBorder} shadow-2xl flex flex-col justify-between overflow-hidden relative group hover:border-slate-700 transition-all`}
              >
                {/* Ribbon Tag for Top 1 / Top 2 / Top 3 */}
                <div className="px-5 pt-4 pb-3 bg-slate-800/40 border-b border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {crownIcon}
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full ${badgeBg}`}>
                      {provider.badgeLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-bold">{provider.rating}</span>
                    <span className="text-slate-500 text-[10px]">({provider.reviewCount.toLocaleString()})</span>
                  </div>
                </div>

                {/* Card Main Body */}
                <div className="p-5 space-y-4 flex-1">
                  
                  {/* Brand & AI Match Score Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-base shadow-md"
                        style={{ backgroundColor: provider.brandColor || '#2563EB' }}
                      >
                        {provider.logo}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-base text-white group-hover:text-blue-300 transition-colors">
                          {provider.shortName}
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          {provider.name}
                        </p>
                      </div>
                    </div>

                    {/* Circular-style Score Badge */}
                    <div className="text-right">
                      <div className="flex items-baseline justify-end gap-0.5">
                        <span className="text-2xl font-black font-mono tracking-tight text-white">
                          {provider.matchScore}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">/100</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">
                        AI Score
                      </span>
                    </div>
                  </div>

                  {/* CRITICAL USER REQUIREMENT: Highlight Main Reason */}
                  <div className={`p-3.5 rounded-xl border ${
                    isTop1 
                      ? 'bg-amber-950/20 border-amber-500/40 text-amber-200' 
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-200'
                  } space-y-1`}>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Lý do gợi ý từ mô hình AI</span>
                    </div>
                    <p className="text-xs font-semibold leading-relaxed">
                      "{provider.mainReason}"
                    </p>
                  </div>

                  {/* Price & Lead Time Block */}
                  <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <div>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-emerald-400" />
                        <span>Cước ước tính:</span>
                      </span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-base font-extrabold text-emerald-400 font-mono">
                          {provider.cost.totalVnd.toLocaleString('vi-VN')}
                        </span>
                        <span className="text-[11px] text-emerald-500">đ</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedCostDetail(selectedCostDetail === provider.id ? null : provider.id)}
                        className="text-[10px] text-slate-500 hover:text-slate-300 underline mt-0.5 block"
                      >
                        {selectedCostDetail === provider.id ? 'Ẩn phụ phí' : 'Chi tiết phụ phí'}
                      </button>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        <span>Thời gian giao:</span>
                      </span>
                      <div className="mt-0.5">
                        <span className="text-sm font-bold text-cyan-300">
                          {provider.deliveryTimeText}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        Cam kết SLA tuyến
                      </span>
                    </div>
                  </div>

                  {/* Popdown Cost Breakdown */}
                  {selectedCostDetail === provider.id && (
                    <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-[11px] space-y-1 font-mono text-slate-300 animate-fadeIn">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Cước cơ bản:</span>
                        <span>{provider.cost.baseRate.toLocaleString('vi-VN')} đ</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Phụ phí xăng dầu (10%):</span>
                        <span>{provider.cost.fuelSurcharge.toLocaleString('vi-VN')} đ</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Phí xử lý & bốc dỡ:</span>
                        <span>{provider.cost.specialHandling.toLocaleString('vi-VN')} đ</span>
                      </div>
                      {provider.cost.insurance > 0 && (
                        <div className="flex justify-between text-amber-300">
                          <span>Bảo hiểm hàng hóa:</span>
                          <span>{provider.cost.insurance.toLocaleString('vi-VN')} đ</span>
                        </div>
                      )}
                      <div className="flex justify-between text-slate-400">
                        <span>Thuế VAT (8%):</span>
                        <span>{provider.cost.vat.toLocaleString('vi-VN')} đ</span>
                      </div>
                    </div>
                  )}

                  {/* 5-Metric Breakdown Progress Bars */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Đánh giá 5 khía cạnh cốt lõi:
                    </span>

                    <div className="space-y-1.5 text-xs">
                      <div>
                        <div className="flex justify-between text-[11px] mb-0.5">
                          <span className="text-slate-400">Đúng hạn tuyến:</span>
                          <span className="font-mono font-bold text-white">{provider.scores.onTimeRate}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-full rounded-full" 
                            style={{ width: `${provider.scores.onTimeRate}%` }} 
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-0.5">
                          <span className="text-slate-400">Tối ưu chi phí:</span>
                          <span className="font-mono font-bold text-white">{provider.scores.costScore}/100</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-blue-500 h-full rounded-full" 
                            style={{ width: `${provider.scores.costScore}%` }} 
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-0.5">
                          <span className="text-slate-400">Năng lực đội xe & trạm:</span>
                          <span className="font-mono font-bold text-white">{provider.scores.fleetCapacityScore}/100</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-500 h-full rounded-full" 
                            style={{ width: `${provider.scores.fleetCapacityScore}%` }} 
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-0.5">
                          <span className="text-slate-400">An toàn & Bảo quản:</span>
                          <span className="font-mono font-bold text-white">{provider.scores.safetyScore}/100</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-amber-500 h-full rounded-full" 
                            style={{ width: `${provider.scores.safetyScore}%` }} 
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-0.5">
                          <span className="text-slate-400">Công nghệ & Tracking API:</span>
                          <span className="font-mono font-bold text-white">{provider.scores.techCoverageScore}/100</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-purple-500 h-full rounded-full" 
                            style={{ width: `${provider.scores.techCoverageScore}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Highlights Bullet List */}
                  <div className="pt-2 text-xs text-slate-300 space-y-1">
                    {provider.strengths.slice(0, 2).map((st, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{st}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Card Action Footer */}
                <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-2">
                  <button
                    type="button"
                    onClick={() => onBookProvider(provider)}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 ${
                      isTop1
                        ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-600/30'
                        : 'bg-slate-800 hover:bg-emerald-900/60 text-white border border-slate-700'
                    }`}
                  >
                    <span>Đặt Đơn Ngay (Tạo Vận Đơn)</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
                    <span>Hotline: {provider.contactHotline}</span>
                    <span className="text-emerald-400">Hỗ trợ API Dispatch</span>
                  </div>
                </div>

              </div>
            );
          })}
          </div>
        </div>
      )}

      {/* REAL-TIME DYNAMIC WSM VS AI COMPARISON */}
      {activeResultTab === 'wsm' && wsmComparison && (
        <DynamicWSMComparison
          comparison={wsmComparison}
          order={order}
          metrics={metrics}
        />
      )}

      {/* HEAD-TO-HEAD COMPARISON TABLE */}
      {(activeResultTab === 'comparison' || showComparison) && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-teal-400" />
              <h3 className="text-base font-bold text-white">
                Bảng So Sánh Đối Chiếu Trực Diện Top 3
              </h3>
            </div>
            <span className="text-xs text-slate-400">Xem tương quan giữa các tiêu chí lựa chọn</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-3 font-semibold">Tiêu chí so sánh</th>
                  {topProviders.map(p => (
                    <th key={p.id} className="p-3 font-bold text-white">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-2.5 h-2.5 rounded-full inline-block" 
                          style={{ backgroundColor: p.brandColor }} 
                        />
                        <span>{p.shortName}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                <tr>
                  <td className="p-3 font-medium text-slate-400">Điểm AI Matching</td>
                  {topProviders.map(p => (
                    <td key={p.id} className="p-3 font-bold font-mono text-emerald-400 text-sm">
                      {p.matchScore} / 100
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-400">Tổng cước phí dự tính</td>
                  {topProviders.map(p => (
                    <td key={p.id} className="p-3 font-extrabold font-mono text-white">
                      {p.cost.totalVnd.toLocaleString('vi-VN')} đ
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-400">Thời gian giao (Lead Time)</td>
                  {topProviders.map(p => (
                    <td key={p.id} className="p-3 font-medium text-cyan-300">
                      {p.deliveryTimeText}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-400">Tỷ lệ đúng hạn tuyến này</td>
                  {topProviders.map(p => (
                    <td key={p.id} className="p-3 font-bold text-emerald-400">
                      {p.scores.onTimeRate}%
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-400">Lý do gợi ý cốt lõi</td>
                  {topProviders.map(p => (
                    <td key={p.id} className="p-3 text-slate-200 italic">
                      "{p.mainReason}"
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-400">Đặc trưng đội xe</td>
                  {topProviders.map(p => (
                    <td key={p.id} className="p-3 text-slate-400 leading-relaxed">
                      {p.fleetHighlights}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-400">Cam kết SLA & Bồi hoàn</td>
                  {topProviders.map(p => (
                    <td key={p.id} className="p-3 text-slate-300">
                      {p.slaCommitment}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EXTENDED MARKET VIEW: Other Scored Providers */}
      {(activeResultTab === 'market' || showAllMarket) && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Toàn Bộ Danh Sách Các 3PL Được Mô Hình Chấm Điểm ({allProviders.length} đơn vị)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Minh bạch hóa điểm số của các đơn vị khác trên cùng tuyến đường
              </p>
            </div>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-xs text-left text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 bg-slate-950/50">
                  <th className="p-2.5">Xếp hạng</th>
                  <th className="p-2.5">Nhà cung cấp 3PL</th>
                  <th className="p-2.5">AI Match Score</th>
                  <th className="p-2.5">Đúng hạn tuyến</th>
                  <th className="p-2.5">Cước phí ước tính</th>
                  <th className="p-2.5">Thời gian giao</th>
                  <th className="p-2.5">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {allProviders.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-2.5 font-bold text-slate-400">#{idx + 1}</td>
                    <td className="p-2.5 font-sans font-medium text-white flex items-center gap-2">
                      <span 
                        className="w-2.5 h-2.5 rounded-full inline-block" 
                        style={{ backgroundColor: item.brandColor }} 
                      />
                      <span>{item.name}</span>
                    </td>
                    <td className="p-2.5 font-bold text-emerald-400">{item.matchScore}</td>
                    <td className="p-2.5 text-slate-300">{item.scores.onTimeRate}%</td>
                    <td className="p-2.5 text-white">{item.cost.totalVnd.toLocaleString('vi-VN')} đ</td>
                    <td className="p-2.5 font-sans text-cyan-300">{item.deliveryTimeText}</td>
                    <td className="p-2.5 font-sans">
                      <button
                        type="button"
                        onClick={() => onBookProvider(item)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white transition-colors text-[11px]"
                      >
                        Chọn đặt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
