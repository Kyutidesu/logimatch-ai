import React, { useState } from 'react';
import { X, CheckCircle2, QrCode, Truck, Phone, MapPin, Calendar, ShieldCheck, Printer, ArrowRight } from 'lucide-react';
import { WaybillBooking } from '../types/logistics';

interface WaybillModalProps {
  booking: WaybillBooking | null;
  onClose: () => void;
}

export const WaybillModal: React.FC<WaybillModalProps> = ({ booking, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!booking) return null;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(booking.waybillCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white text-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Banner */}
        <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-100">
                Tạo vận đơn thành công
              </span>
              <h3 className="text-xl font-bold">Vận Đơn Điện Tử (E-Waybill)</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Đóng vận đơn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          
          {/* Waybill Code Bar */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-xs text-slate-500 font-medium block">MÃ VẬN ĐƠN (WAYBILL CODE)</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-2xl font-mono font-extrabold text-blue-600 tracking-wider">
                  {booking.waybillCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-2 py-1 rounded bg-slate-200 hover:bg-slate-300 text-xs text-slate-700 font-medium transition-colors"
                >
                  {copied ? 'Đã sao chép!' : 'Sao chép'}
                </button>
              </div>
            </div>

            {/* QR Mockup */}
            <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-300 shadow-sm">
              <QrCode className="w-12 h-12 text-slate-800" />
              <div className="text-[11px] text-slate-500 leading-tight">
                <span className="font-semibold block text-slate-700">Quét mã kiểm tra</span>
                <span>Hệ thống phân loại tự động</span>
              </div>
            </div>
          </div>

          {/* Provider & Assigned Driver */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Đơn vị vận chuyển được chọn
              </span>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white shadow-sm"
                  style={{ backgroundColor: booking.provider.brandColor || '#2563EB' }}
                >
                  {booking.provider.logo}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{booking.provider.name}</h4>
                  <p className="text-xs text-slate-500">Hotline: {booking.provider.contactHotline}</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Tài xế & Phương tiện điều động
              </span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{booking.driverName}</h4>
                  <p className="text-xs text-slate-500 font-mono">Biển số: {booking.truckPlate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Route & Timeline */}
          <div className="p-4 rounded-xl border border-slate-200 space-y-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Hành trình & Lịch trình dự kiến
            </span>
            
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-blue-600 font-bold">
                  <MapPin className="w-4 h-4" />
                  <span>Điểm gửi: {booking.order.originCity}</span>
                </div>
                <p className="text-slate-500 text-xs">Lấy hàng lúc: {booking.pickupEta}</p>
              </div>

              <ArrowRight className="w-5 h-5 text-slate-400" />

              <div className="space-y-1 text-right">
                <div className="flex items-center justify-end gap-1.5 text-emerald-600 font-bold">
                  <MapPin className="w-4 h-4" />
                  <span>Điểm nhận: {booking.order.destinationCity}</span>
                </div>
                <p className="text-slate-500 text-xs">Giao dự kiến: {booking.deliveryEta}</p>
              </div>
            </div>

            {/* Stepper Status */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-4 gap-2 text-center text-[11px]">
              <div className="p-2 rounded bg-emerald-50 text-emerald-700 font-medium">
                ✓ Đã xác nhận đơn
              </div>
              <div className="p-2 rounded bg-blue-50 text-blue-700 font-semibold animate-pulse">
                Đang điều xe lấy
              </div>
              <div className="p-2 rounded bg-slate-100 text-slate-400">
                Qua trạm phân loại
              </div>
              <div className="p-2 rounded bg-slate-100 text-slate-400">
                Giao tới nơi
              </div>
            </div>
          </div>

          {/* Pricing & Insurance Summary */}
          <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Tổng cước phí dự tính (Đã gồm VAT & Phụ phí)</span>
              <span className="text-2xl font-extrabold text-emerald-400">
                {booking.provider.cost.totalVnd.toLocaleString('vi-VN')} đ
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Bảo hiểm & SLA cam kết</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>In Phiếu Gửi Hàng</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-md"
          >
            Hoàn tất & Về Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};
