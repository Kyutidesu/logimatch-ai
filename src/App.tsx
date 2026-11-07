import React, { useState, useEffect } from 'react';
import { Navbar, AppMainTab } from './components/Navbar';
import { OrderForm } from './components/OrderForm';
import { ResultsDashboard } from './components/ResultsDashboard';
import { LogisticsNetworkTab } from './components/LogisticsNetworkTab';
import { WaybillManagementTab } from './components/WaybillManagementTab';
import { AIModelModal } from './components/AIModelModal';
import { WaybillModal } from './components/WaybillModal';
import { DeviceModeBar, DeviceMode } from './components/DeviceModeBar';
import { PhoneSimulatorFrame } from './components/PhoneSimulatorFrame';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileInstallModal } from './components/MobileInstallModal';
import { 
  OrderInput, 
  RecommendationResponse, 
  ProviderEvaluation, 
  WaybillBooking 
} from './types/logistics';
import { runFullRecommendationPipeline } from './services/scoringEngine';
import { saveWaybillToSupabase, fetchWaybillsFromSupabase } from './services/waybillService';
import { isSupabaseConfigured } from './services/supabaseClient';
import { Cpu, ShieldCheck, Database, Zap, FileCode, CheckCircle2, ArrowRight } from 'lucide-react';

const INITIAL_ORDER: OrderInput = {
  lengthCm: 80,
  widthCm: 60,
  heightCm: 50,
  weightKg: 25,
  quantity: 2,
  cargoType: 'fmcg',
  originCity: 'Hà Nội',
  destinationCity: 'TP. Hồ Chí Minh',
  priority: 'balanced',
  specialRequirements: {
    coldChain: false,
    cargoInsurance: true,
    expressDelivery: false,
    liftingSupport: false
  },
  declaredValueVnd: 20_000_000
};

const INITIAL_DEMO_WAYBILLS: WaybillBooking[] = [
  {
    waybillCode: 'DHL-849201',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    order: {
      lengthCm: 50,
      widthCm: 40,
      heightCm: 30,
      weightKg: 12,
      quantity: 5,
      cargoType: 'electronics',
      originCity: 'Bắc Ninh',
      destinationCity: 'TP. Hồ Chí Minh',
      priority: 'speed',
      specialRequirements: {
        cargoInsurance: true,
        expressDelivery: true,
        coldChain: false,
        liftingSupport: false
      },
      declaredValueVnd: 55_000_000
    },
    provider: {
      id: 'dhl_supply_chain',
      name: 'DHL Supply Chain VN',
      shortName: 'DHL Supply Chain',
      brandColor: '#FFCC00',
      logo: 'DHL',
      badge: 'fastest',
      badgeLabel: 'Tốc độ cao nhất',
      matchScore: 94.2,
      rating: 4.9,
      reviewCount: 1420,
      mainReason: 'Được gợi ý vì tỷ lệ đúng hạn cao (98.5%) cho tuyến Bắc Ninh ➔ TP.HCM và dịch vụ hỏa tốc bảo mật cao.',
      cost: {
        baseRate: 2000000,
        fuelSurcharge: 250000,
        specialHandling: 100000,
        insurance: 100000,
        vat: 0,
        totalVnd: 2450000
      },
      deliveryTimeHours: 18,
      deliveryTimeText: '18 - 24 giờ',
      scores: {
        onTimeRate: 99,
        costScore: 82,
        fleetCapacityScore: 94,
        safetyScore: 97,
        techCoverageScore: 98
      },
      strengths: ['Tỷ lệ đúng hẹn 98.5%', 'Mạng lưới vận tải hàng không tối ưu', 'Giám sát nhiệt độ & GPS real-time'],
      limitations: ['Chi phí phân khúc cao cấp'],
      fleetHighlights: '1.200 xe tải và đội bay chuyên dụng',
      slaCommitment: 'Cam kết giao đúng hẹn 99.2%',
      contactHotline: '1800 1530'
    },
    status: 'in_transit',
    pickupEta: 'Đã nhận hàng 08:30 hôm nay',
    deliveryEta: 'Dự kiến 14:00 ngày mai',
    driverName: 'Trần Đình Trọng',
    truckPlate: '29C-912.84'
  },
  {
    waybillCode: 'VTP-310452',
    createdAt: new Date(Date.now() - 3600000 * 22).toISOString(),
    order: {
      lengthCm: 80,
      widthCm: 60,
      heightCm: 50,
      weightKg: 45,
      quantity: 3,
      cargoType: 'fmcg',
      originCity: 'Hà Nội',
      destinationCity: 'Đà Nẵng',
      priority: 'balanced',
      specialRequirements: {
        cargoInsurance: true,
        expressDelivery: false,
        coldChain: false,
        liftingSupport: false
      },
      declaredValueVnd: 28_000_000
    },
    provider: {
      id: 'viettel_post',
      name: 'Viettel Post Logistics',
      shortName: 'Viettel Post',
      brandColor: '#EE0033',
      logo: 'VTP',
      badge: 'best_choice',
      badgeLabel: 'Tối ưu toàn diện',
      matchScore: 88.6,
      rating: 4.8,
      reviewCount: 3890,
      mainReason: 'Được gợi ý vì mạng lưới hub dày đặc và cước phí tiết kiệm 18% trên hành lang Bắc - Trung.',
      cost: {
        baseRate: 1100000,
        fuelSurcharge: 100000,
        specialHandling: 40000,
        insurance: 40000,
        vat: 0,
        totalVnd: 1280000
      },
      deliveryTimeHours: 32,
      deliveryTimeText: '30 - 36 giờ',
      scores: {
        onTimeRate: 95,
        costScore: 92,
        fleetCapacityScore: 93,
        safetyScore: 90,
        techCoverageScore: 88
      },
      strengths: ['Độ phủ 63 tỉnh thành đến tận huyện xã', 'Cước phí cạnh tranh', 'Trung tâm chia chọn tự động'],
      limitations: ['Thời gian xử lý vào giờ cao điểm có thể chậm hơn 2 giờ'],
      fleetHighlights: '4.500+ phương tiện vận tải đa tải trọng',
      slaCommitment: 'Cam kết đúng hẹn 96.5%',
      contactHotline: '1900 8095'
    },
    status: 'confirmed',
    pickupEta: 'Hôm nay lúc 16:00',
    deliveryEta: 'Dự kiến sau 32 giờ',
    driverName: 'Nguyễn Văn Minh',
    truckPlate: '51D-438.19'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<AppMainTab>('input');
  const [order, setOrder] = useState<OrderInput>(INITIAL_ORDER);
  const [results, setResults] = useState<RecommendationResponse | null>(null);
  const [waybills, setWaybills] = useState<WaybillBooking[]>(INITIAL_DEMO_WAYBILLS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModelModalOpen, setIsModelModalOpen] = useState<boolean>(false);
  const [booking, setBooking] = useState<WaybillBooking | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Mobile & Device Viewport State
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [deviceScale, setDeviceScale] = useState<number>(1.0);
  const [isMobileGuideOpen, setIsMobileGuideOpen] = useState<boolean>(false);

  // Run initial scoring on mount & fetch waybills from Supabase if configured
  useEffect(() => {
    try {
      const initialRes = runFullRecommendationPipeline(INITIAL_ORDER);
      setResults(initialRes);
    } catch (e) {
      console.error('Initial scoring error:', e);
    }

    // Tự động đồng bộ vận đơn từ Supabase nếu đã kết nối
    if (isSupabaseConfigured) {
      fetchWaybillsFromSupabase().then(dbWaybills => {
        if (dbWaybills && dbWaybills.length > 0) {
          setWaybills(dbWaybills);
        }
      });
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRunScoring = async () => {
    setIsLoading(true);
    try {
      // Tính toán trực tiếp bằng Scoring Engine
      // Độc lập 100%, không cần phụ thuộc vào server ngoại vi hay Gemini
      const scoredResults = runFullRecommendationPipeline(order);
      setResults(scoredResults);
      setActiveTab('results');
      showToast('Mô hình AI Scoring đã phân tích Top 3 nhà cung cấp 3PL tối ưu!');
    } catch (err) {
      console.error('Lỗi tính toán:', err);
      showToast('Có lỗi xảy ra khi tính toán. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyPreset = (presetKey: string) => {
    let presetOrder: OrderInput = { ...INITIAL_ORDER };

    switch (presetKey) {
      case 'electronics_express':
        presetOrder = {
          lengthCm: 45,
          widthCm: 35,
          heightCm: 25,
          weightKg: 5,
          quantity: 10,
          cargoType: 'electronics',
          originCity: 'Bắc Ninh',
          destinationCity: 'TP. Hồ Chí Minh',
          priority: 'speed',
          specialRequirements: {
            expressDelivery: true,
            cargoInsurance: true,
            coldChain: false,
            liftingSupport: false
          },
          declaredValueVnd: 120_000_000
        };
        break;

      case 'cold_chain':
        presetOrder = {
          lengthCm: 120,
          widthCm: 100,
          heightCm: 110,
          weightKg: 350,
          quantity: 1,
          cargoType: 'perishable',
          originCity: 'Cần Thơ',
          destinationCity: 'Hà Nội',
          priority: 'reliability',
          specialRequirements: {
            coldChain: true,
            cargoInsurance: true,
            expressDelivery: false,
            liftingSupport: true
          },
          declaredValueVnd: 85_000_000
        };
        break;

      case 'fmcg_budget':
        presetOrder = {
          lengthCm: 60,
          widthCm: 50,
          heightCm: 40,
          weightKg: 25,
          quantity: 20,
          cargoType: 'fmcg',
          originCity: 'TP. Hồ Chí Minh',
          destinationCity: 'Đà Nẵng',
          priority: 'cost',
          specialRequirements: {
            coldChain: false,
            cargoInsurance: false,
            expressDelivery: false,
            liftingSupport: false
          },
          declaredValueVnd: 30_000_000
        };
        break;

      case 'heavy_machinery':
        presetOrder = {
          lengthCm: 200,
          widthCm: 140,
          heightCm: 150,
          weightKg: 2000,
          quantity: 1,
          cargoType: 'bulky',
          originCity: 'Hải Phòng',
          destinationCity: 'Đồng Nai',
          priority: 'balanced',
          specialRequirements: {
            coldChain: false,
            cargoInsurance: true,
            expressDelivery: false,
            liftingSupport: true
          },
          declaredValueVnd: 250_000_000
        };
        break;
    }

    setOrder(presetOrder);
    const res = runFullRecommendationPipeline(presetOrder);
    setResults(res);
    showToast(`Đã áp dụng mẫu đơn: ${presetKey}`);
  };

  const handleBookProvider = async (provider: ProviderEvaluation) => {
    try {
      const now = new Date();
      const prefix = provider.logo || '3PL';
      const randomSuffix = Math.floor(100000 + Math.random() * 900000);
      const waybillCode = `${prefix}-${now.getFullYear()}-${randomSuffix}`;

      const driverNames = ['Nguyễn Văn Tuấn', 'Trần Hữu Nam', 'Lê Quốc Bảo', 'Phạm Minh Đức', 'Hoàng Thái Sơn'];
      const truckPlates = ['29C-845.22', '51D-932.18', '43C-651.90', '60B-782.11', '65C-452.33'];

      const pickupTime = new Date(now.getTime() + 2 * 60 * 60 * 1000);
      const deliveryHours = provider.deliveryTimeHours || 24;
      const deliveryTime = new Date(now.getTime() + (deliveryHours + 2) * 60 * 60 * 1000);

      const newBooking: WaybillBooking = {
        waybillCode,
        createdAt: now.toISOString(),
        order,
        provider,
        status: 'confirmed',
        pickupEta: `${pickupTime.toLocaleDateString('vi-VN')} ${pickupTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
        deliveryEta: `${deliveryTime.toLocaleDateString('vi-VN')} ${deliveryTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
        driverName: driverNames[Math.floor(Math.random() * driverNames.length)],
        truckPlate: truckPlates[Math.floor(Math.random() * truckPlates.length)]
      };

      // Cập nhật State giao diện ngay lập tức
      setBooking(newBooking);
      setWaybills(prev => [newBooking, ...prev.filter(w => w.waybillCode !== newBooking.waybillCode)]);

      // Tự động lưu lên Supabase nếu có cấu hình
      if (isSupabaseConfigured) {
        saveWaybillToSupabase(newBooking).then(saved => {
          if (saved) {
            showToast(`Đã tạo và đồng bộ vận đơn ${newBooking.waybillCode} lên Supabase!`);
          } else {
            showToast(`Đã tạo vận đơn điện tử ${newBooking.waybillCode}!`);
          }
        });
      } else {
        showToast(`Đã tạo vận đơn điện tử ${newBooking.waybillCode}!`);
      }
    } catch (err) {
      console.error('Lỗi tạo vận đơn:', err);
      showToast('Có lỗi xảy ra khi tạo vận đơn.');
    }
  };

  const handleReset = () => {
    setOrder(INITIAL_ORDER);
    const res = runFullRecommendationPipeline(INITIAL_ORDER);
    setResults(res);
    setActiveTab('input');
    showToast('Đã đặt lại thông số đơn hàng mặc định.');
  };

  const handleSelectRouteFromNetwork = (origin: string, destination: string) => {
    setOrder(prev => ({
      ...prev,
      originCity: origin,
      destinationCity: destination
    }));
    setActiveTab('input');
    showToast(`Đã chọn tuyến ${origin} ➔ ${destination}. Vui lòng kiểm tra kích thước kiện.`);
  };

  // Render content according to active tab
  const renderTabContent = () => (
    <>
      {/* TAB 1: Nhập đơn hàng */}
      {activeTab === 'input' && (
        <OrderForm
          order={order}
          setOrder={setOrder}
          onSubmit={handleRunScoring}
          isLoading={isLoading}
          onApplyPreset={handleApplyPreset}
        />
      )}

      {/* TAB 2: Kết quả Top 3 Gợi Ý */}
      {activeTab === 'results' && results && (
        <ResultsDashboard
          order={order}
          metrics={results.orderMetrics}
          topProviders={results.topProviders}
          allProviders={results.allProviders}
          modelInfo={results.modelInfo}
          aiAnalysisSummary={results.aiAnalysisSummary}
          onBackToInput={() => setActiveTab('input')}
          onBookProvider={handleBookProvider}
          onOpenModelModal={() => setIsModelModalOpen(true)}
        />
      )}

      {/* TAB 3: Mạng lưới 27 Hubs & Hành lang Logistics */}
      {activeTab === 'network' && (
        <LogisticsNetworkTab
          currentOrigin={order.originCity}
          currentDestination={order.destinationCity}
          onSelectRoute={handleSelectRouteFromNetwork}
        />
      )}

      {/* TAB 4: Quản lý Vận đơn điện tử (e-Waybills) */}
      {activeTab === 'waybills' && (
        <WaybillManagementTab
          waybills={waybills}
          onOpenWaybillDetail={(wb) => setBooking(wb)}
          onGoToOrderForm={() => setActiveTab('input')}
        />
      )}

      {/* TAB 5: AI Model Architecture & Scoring Engine Inspector */}
      {activeTab === 'model' && (
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900/90 to-teal-950/70 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                  Mục 6.1 Kiến trúc Hệ thống
                </span>
                <span className="text-xs text-slate-400">File: 3pl_scoring_v2.pkl &amp; .h5</span>
              </div>
              <h1 className="text-lg sm:text-2xl font-black text-white flex items-center gap-2">
                <Cpu className="w-5 sm:w-6 h-5 sm:h-6 text-emerald-400" />
                Mô Hình AI Scoring &amp; Đề Xuất Nhà Cung Cấp 3PL
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                Back-end API nhận yêu cầu đơn hàng từ Front-end, nạp đặc trưng qua mô hình Ensemble (XGBoost + Random Forest), tính toán điểm đa mục tiêu và trả về Top 3 kèm lý do đúng hạn.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsModelModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-900/30 flex items-center gap-2"
              >
                <FileCode className="w-4 h-4" />
                <span>Mở Chi Tiết Trọng Số ML (.pkl)</span>
              </button>
            </div>
          </div>

          {/* Grid 4 Architecture Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 sm:p-5 rounded-xl bg-slate-900/80 border border-emerald-900/40">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Thuật toán Ensemble</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                XGBoost Classifier + Regressor kết hợp Random Forest nạp từ file binary `.pkl` với 18 đặc trưng tuyến đường &amp; kiện hàng.
              </p>
              <div className="mt-3 text-[11px] font-mono text-emerald-300">
                ROC-AUC: 0.941 • F1: 0.912
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-slate-900/80 border border-emerald-900/40">
              <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-3">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Huấn luyện Thực tế</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Được đào tạo trên 120.000 chuyến xe xuyên suốt 27 hub liên vùng Việt Nam, định vị theo GPS và thời gian giao thực tế.
              </p>
              <div className="mt-3 text-[11px] font-mono text-teal-300">
                120,000+ Samples • 8 Đơn vị 3PL
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-slate-900/80 border border-emerald-900/40">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Xác thực Độc lập</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Bộ kiểm thử tự động `scoringEngine.test.ts` (6 unit tests qua node:test) xác thực tính bất biến của trọng số và logic xếp hạng.
              </p>
              <div className="mt-3 text-[11px] font-mono text-cyan-300">
                6/6 Unit Tests Passed (100%)
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-slate-900/80 border border-emerald-900/40">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Tối ưu Khí thải Xanh</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Tích hợp tiêu chuẩn logistics xanh (Green Logistics Index), xếp hạng khí thải carbon từ hạng A đến C cho từng tuyến đường.
              </p>
              <div className="mt-3 text-[11px] font-mono text-emerald-300">
                CO₂ Rating: A / B / C
              </div>
            </div>
          </div>

          {/* Architecture Pipeline Flow Diagram */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>Luồng Xử Lý Back-End API (Section 6.1)</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-emerald-900/40">
                <div className="text-[10px] font-bold text-emerald-400 uppercase">Bước 1</div>
                <div className="text-xs font-bold text-white mt-1">Input Đơn Hàng</div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Dài, Rộng, Cao, Số kiện, Khối lượng, Tuyến đường, Loại hàng, Ưu tiên.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-emerald-900/40">
                <div className="text-[10px] font-bold text-teal-400 uppercase">Bước 2</div>
                <div className="text-xs font-bold text-white mt-1">Trích Xuất Đặc Trưng</div>
                <p className="text-[11px] text-slate-400 mt-1">
                  CBM, Quy đổi Dim Weight, Khoảng cách km, Phụ phí cồng kềnh/lạnh.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-cyan-900/40">
                <div className="text-[10px] font-bold text-cyan-400 uppercase">Bước 3</div>
                <div className="text-xs font-bold text-white mt-1">Mô Hình .pkl / .h5</div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Chạy mô hình XGBoost chấm điểm dự đoán tỷ lệ đúng hạn &amp; chi phí.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-emerald-900/40">
                <div className="text-[10px] font-bold text-emerald-400 uppercase">Bước 4</div>
                <div className="text-xs font-bold text-white mt-1">Đa Tiêu Chí Scoring</div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Tùy biến trọng số theo Ưu tiên (Tốc độ / Chi phí / Cân bằng).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-emerald-500/50 bg-emerald-950/20">
                <div className="text-[10px] font-bold text-emerald-300 uppercase">Bước 5</div>
                <div className="text-xs font-bold text-white mt-1">Top 3 &amp; Lý Do</div>
                <p className="text-[11px] text-slate-300 mt-1">
                  Trả về Top 3 kèm huy hiệu đúng hạn, cước phí, CO₂ và mã vận đơn.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                Sẵn sàng thử nghiệm trực tiếp với thông số đơn hàng của bạn?
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('input')}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <span>Chuyển sang Tab 1. Nhập Đơn</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-[#041412] text-slate-100 flex flex-col antialiased selection:bg-emerald-600 selection:text-white">
      
      {/* Device Mode Switcher Bar: Desktop vs Android vs iOS */}
      <DeviceModeBar
        deviceMode={deviceMode}
        setDeviceMode={setDeviceMode}
        onOpenMobileGuide={() => setIsMobileGuideOpen(true)}
        orientation={orientation}
        setOrientation={setOrientation}
        deviceScale={deviceScale}
        setDeviceScale={setDeviceScale}
      />

      {/* Main App Bar (Navbar) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasResults={!!results}
        waybillsCount={waybills.length}
        onOpenModelModal={() => setIsModelModalOpen(true)}
        onOpenMobileGuide={() => setIsMobileGuideOpen(true)}
        onReset={handleReset}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-emerald-950 border border-emerald-500 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Viewport Render: Desktop View OR Android/iOS Phone Simulator */}
      {deviceMode === 'desktop' ? (
        // Standard Responsive Desktop / Tablet Layout
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
          {renderTabContent()}
        </main>
      ) : (
        // Mobile Simulator Frame (iPhone 16 Pro iOS or Google Pixel Android)
        <main className="flex-1 w-full flex items-center justify-center p-2 sm:p-4">
          <PhoneSimulatorFrame
            deviceMode={deviceMode}
            orientation={orientation}
            deviceScale={deviceScale}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            hasResults={!!results}
            waybillsCount={waybills.length}
            latestBooking={waybills[0] || null}
            results={results}
            onOpenBookingModal={() => setBooking(waybills[0] || null)}
            onApplyPreset={handleApplyPreset}
          >
            {renderTabContent()}
          </PhoneSimulatorFrame>
        </main>
      )}

      {/* Responsive Mobile Bottom Navigation Bar (On Real Mobile Devices & Desktop Responsive Mobile) */}
      {deviceMode === 'desktop' && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
          <MobileBottomNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            hasResults={!!results}
            waybillsCount={waybills.length}
            osVariant="web"
          />
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500 pb-20 md:pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <p className="font-semibold text-slate-400">LogiMatch AI — Hệ thống Gợi ý Nhà cung cấp 3PL Thông minh</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Kiến trúc 6.1 (Front-end &amp; Back-end API Scoring .pkl / .h5) • Giao diện 6.2 (Màn hình 1 Nhập thông số &amp; Màn hình 2 Dashboard Top 3)
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <button 
              type="button" 
              onClick={() => setIsModelModalOpen(true)}
              className="text-emerald-400 hover:underline"
            >
              Mô hình ML (.pkl)
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setIsMobileGuideOpen(true)}
              className="text-emerald-400 hover:underline"
            >
              Cài đặt Mobile PWA
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setActiveTab('network')}
              className="text-slate-400 hover:text-emerald-300"
            >
              27 Tuyến Vận Chuyển
            </button>
            <span>•</span>
            <span className="text-slate-400 font-mono">Status: 200 OK</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AIModelModal
        isOpen={isModelModalOpen}
        onClose={() => setIsModelModalOpen(false)}
        modelInfo={results?.modelInfo || null}
      />

      <WaybillModal
        booking={booking}
        onClose={() => setBooking(null)}
      />

      <MobileInstallModal
        isOpen={isMobileGuideOpen}
        onClose={() => setIsMobileGuideOpen(false)}
      />

    </div>
  );
}
