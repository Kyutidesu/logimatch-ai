import React, { useState } from 'react';
import { Truck, ChevronRight, Phone, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import { WaybillBooking, RecommendationResponse } from '../types/logistics';

interface IOSDynamicIslandProps {
  latestBooking?: WaybillBooking | null;
  results?: RecommendationResponse | null;
  onOpenBooking?: () => void;
}

export const IOSDynamicIsland: React.FC<IOSDynamicIslandProps> = ({
  latestBooking,
  results,
  onOpenBooking
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // If there's an active booking or results, show interactive dynamic content
  const hasLiveActivity = !!latestBooking || !!results;

  return (
    <div className="relative z-50 flex justify-center pt-2 select-none">
      <div
        onClick={() => hasLiveActivity && setIsExpanded(!isExpanded)}
        className={`transition-all duration-300 ease-spring bg-black text-white cursor-pointer shadow-2xl border border-white/10 ${
          isExpanded
            ? 'w-[350px] min-h-[140px] rounded-[36px] p-4'
            : hasLiveActivity
            ? 'w-[200px] h-[34px] rounded-full px-3.5 flex items-center justify-between hover:scale-105'
            : 'w-[124px] h-[32px] rounded-full flex items-center justify-center'
        }`}
      >
        {!isExpanded ? (
          // Compact Dynamic Island Pill
          hasLiveActivity ? (
            <div className="w-full flex items-center justify-between text-[11px] font-medium">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Truck className="w-3.5 h-3.5 animate-pulse" />
                <span className="font-mono font-bold text-white text-[10px]">
                  {latestBooking ? latestBooking.waybillCode : 'AI Match 94%'}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>{latestBooking ? 'Đang giao' : 'Top 1'}</span>
              </div>
            </div>
          ) : (
            // Default inactive island camera/sensor pill
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
              <div className="w-2 h-2 rounded-full bg-[#0a101f]" />
            </div>
          )
        ) : (
          // Expanded Live Activity View
          <div className="w-full space-y-2.5 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white flex items-center gap-1">
                    <span>{latestBooking ? latestBooking.provider.name : 'LogiMatch AI Dispatch'}</span>
                    <span className="text-[9px] px-1 rounded bg-emerald-500/30 text-emerald-300">Live</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {latestBooking ? latestBooking.waybillCode : 'Mô hình XGBoost v2.4'}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] font-bold text-emerald-400">
                  {latestBooking ? latestBooking.status === 'in_transit' ? 'Đang luân chuyển' : 'Đã xác nhận' : 'Top 1 tối ưu'}
                </div>
                <div className="text-[9px] text-slate-400">iOS Live Activity</div>
              </div>
            </div>

            {/* Route & ETA */}
            {latestBooking ? (
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="bg-white/5 p-2 rounded-xl">
                  <span className="text-slate-400 block text-[9px]">Tuyến</span>
                  <span className="font-semibold text-white truncate block">
                    {latestBooking.order.originCity} ➔ {latestBooking.order.destinationCity}
                  </span>
                  <span className="text-slate-400 text-[9px] mt-0.5 block">{latestBooking.deliveryEta}</span>
                </div>
                <div className="bg-white/5 p-2 rounded-xl">
                  <span className="text-slate-400 block text-[9px]">Tài xế &amp; Biển số</span>
                  <span className="font-semibold text-white block">{latestBooking.driverName}</span>
                  <span className="font-mono text-emerald-300 text-[9px]">{latestBooking.truckPlate}</span>
                </div>
              </div>
            ) : results ? (
              <div className="p-2 rounded-xl bg-white/5 text-[10px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-semibold">{results.topProviders[0].name}</span>
                  <span className="text-emerald-400 font-bold font-mono">Score: {results.topProviders[0].matchScore}/100</span>
                </div>
                <div className="text-[9px] text-slate-400 mt-1 line-clamp-1">
                  {results.topProviders[0].mainReason}
                </div>
              </div>
            ) : null}

            {/* Tap Action */}
            <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
              <span className="text-[9px]">Chạm để thu nhỏ</span>
              {latestBooking && onOpenBooking && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(false);
                    onOpenBooking();
                  }}
                  className="px-2 py-0.5 rounded-lg bg-emerald-600 text-white font-semibold flex items-center gap-1 hover:bg-emerald-500"
                >
                  <span>Chi tiết vận đơn</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
