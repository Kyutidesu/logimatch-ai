import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  CheckCircle2, 
  Clock, 
  Truck, 
  MapPin, 
  Printer, 
  ExternalLink, 
  QrCode, 
  Phone, 
  ShieldCheck,
  PlusCircle,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { WaybillBooking } from '../types/logistics';

interface WaybillManagementTabProps {
  waybills: WaybillBooking[];
  onOpenWaybillDetail: (waybill: WaybillBooking) => void;
  onGoToOrderForm: () => void;
}

export const WaybillManagementTab: React.FC<WaybillManagementTabProps> = ({
  waybills,
  onOpenWaybillDetail,
  onGoToOrderForm
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'dispatched' | 'in_transit' | 'delivered'>('all');

  const filteredWaybills = waybills.filter(wb => {
    const matchesSearch = 
      wb.waybillCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wb.provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wb.order.originCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wb.order.destinationCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wb.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wb.truckPlate.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && wb.status !== statusFilter) return false;

    return true;
  });

  const getStatusBadge = (status: WaybillBooking['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Đã xác nhận đơn</span>
          </span>
        );
      case 'dispatched':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
            <Truck className="w-3 h-3 text-cyan-400" />
            <span>Đã điều xe lấy hàng</span>
          </span>
        );
      case 'in_transit':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>Đang luân chuyển trên tuyến</span>
          </span>
        );
      case 'delivered':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-blue-400" />
            <span>Đã giao thành công (POD)</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#061e1b] to-slate-900 border border-emerald-500/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📋</span>
              <h2 className="text-xl font-black text-white tracking-tight">
                Quản Lý Vận Đơn Điện Tử & Theo Dõi Hành Trình (E-Waybills)
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Theo dõi tình trạng điều phối xe, mã QR tiếp nhận kho bãi và biên bản giao nhận điện tử (e-POD)
            </p>
          </div>

          <button
            type="button"
            onClick={onGoToOrderForm}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tạo Vận Đơn Mới</span>
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-emerald-950/60">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo mã vận đơn, nhà xe, tài xế, tuyến..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs overflow-x-auto">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${statusFilter === 'all' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              Tất cả ({waybills.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('confirmed')}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${statusFilter === 'confirmed' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              Đã xác nhận
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('dispatched')}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${statusFilter === 'dispatched' ? 'bg-cyan-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              Đang điều xe
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('in_transit')}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${statusFilter === 'in_transit' ? 'bg-amber-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              Đang vận chuyển
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('delivered')}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${statusFilter === 'delivered' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              Đã giao
            </button>
          </div>
        </div>
      </div>

      {/* Waybills List */}
      {filteredWaybills.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <FileText className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">Không tìm thấy vận đơn nào</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Chưa có vận đơn nào khớp với tiêu chí tìm kiếm hoặc bạn chưa khởi tạo vận đơn từ màn hình gợi ý Top 3 3PL.
          </p>
          <button
            type="button"
            onClick={onGoToOrderForm}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md inline-flex items-center gap-2 mt-2"
          >
            <span>Nhập đơn & Lấy gợi ý 3PL ngay</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredWaybills.map(wb => (
            <div
              key={wb.waybillCode}
              className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/20 hover:border-emerald-500/40 shadow-lg space-y-4 transition-all group"
            >
              {/* Card Top: Code, Carrier & Status */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-xs shadow-md"
                    style={{ backgroundColor: wb.provider.brandColor }}
                  >
                    {wb.provider.logo}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-emerald-300 text-sm">
                        {wb.waybillCode}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {wb.createdAt}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white">
                      {wb.provider.name}
                    </h4>
                  </div>
                </div>

                <div>
                  {getStatusBadge(wb.status)}
                </div>
              </div>

              {/* Route & Cargo Specs */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 block">Tuyến vận chuyển:</span>
                  <div className="font-bold text-white flex items-center gap-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                    <span className="truncate">{wb.order.originCity} ➔ {wb.order.destinationCity}</span>
                  </div>
                  <span className="text-[10px] text-emerald-300/80 block">
                    Lấy: {wb.pickupEta}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 block">Kiện & Khối lượng:</span>
                  <span className="font-bold text-white block">
                    {wb.order.quantity} kiện • {wb.order.lengthCm}x{wb.order.widthCm}x{wb.order.heightCm} cm
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    Giao dự kiến: <strong className="text-white">{wb.deliveryEta}</strong>
                  </span>
                </div>
              </div>

              {/* Driver & Truck Dispatch Info */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block leading-tight">
                      {wb.driverName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Xe: {wb.truckPlate}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Cước phí:</span>
                  <span className="font-mono font-bold text-emerald-300 text-sm">
                    {wb.provider.cost.totalVnd.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>

              {/* Card Footer: Detail & Print Actions */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Phone className="w-3 h-3 text-slate-500" />
                  <span>{wb.provider.contactHotline}</span>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenWaybillDetail(wb)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/40 text-emerald-300 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Xem Chi Tiết & Mã QR</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
