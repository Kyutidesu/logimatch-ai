import React, { ReactNode } from 'react';
import { DeviceMode } from './DeviceModeBar';
import { IOSDynamicIsland } from './IOSDynamicIsland';
import { AndroidTopBar } from './AndroidTopBar';
import { MobileBottomNav } from './MobileBottomNav';
import { AppMainTab } from './Navbar';
import { WaybillBooking, RecommendationResponse } from '../types/logistics';
import { Sparkles, Zap, ChevronUp } from 'lucide-react';

interface PhoneSimulatorFrameProps {
  deviceMode: 'android' | 'ios';
  orientation: 'portrait' | 'landscape';
  deviceScale: number;
  activeTab: AppMainTab;
  setActiveTab: (tab: AppMainTab) => void;
  hasResults: boolean;
  waybillsCount: number;
  latestBooking?: WaybillBooking | null;
  results?: RecommendationResponse | null;
  onOpenBookingModal?: () => void;
  onApplyPreset?: (preset: string) => void;
  children: ReactNode;
}

export const PhoneSimulatorFrame: React.FC<PhoneSimulatorFrameProps> = ({
  deviceMode,
  orientation,
  deviceScale,
  activeTab,
  setActiveTab,
  hasResults,
  waybillsCount,
  latestBooking,
  results,
  onOpenBookingModal,
  onApplyPreset,
  children
}) => {
  const isIOS = deviceMode === 'ios';
  const isLandscape = orientation === 'landscape';

  // Device Dimensions:
  // iPhone 16 Pro portrait: 393 x 852
  // Pixel 8 portrait: 412 x 892
  const widthPx = isLandscape ? (isIOS ? 852 : 892) : (isIOS ? 393 : 412);
  const heightPx = isLandscape ? (isIOS ? 393 : 412) : (isIOS ? 852 : 880);

  return (
    <div className="w-full py-8 flex flex-col items-center justify-center animate-fadeIn select-none">
      
      {/* Device Info Banner */}
      <div className="mb-4 text-center">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
          {isIOS ? '🍎 Chế độ iPhone 16 Pro (iOS Cupertino)' : '🤖 Chế độ Google Pixel (Android Material You)'}
        </span>
      </div>

      {/* Outer Phone Hardware Chassis */}
      <div
        style={{
          transform: `scale(${deviceScale})`,
          transformOrigin: 'top center'
        }}
        className={`relative transition-all duration-300 shadow-[0_25px_70px_rgba(0,0,0,0.85)] border-[10px] sm:border-[12px] ${
          isIOS
            ? 'rounded-[52px] sm:rounded-[58px] border-[#262c2f] bg-[#030e0c] ring-1 ring-white/20'
            : 'rounded-[44px] sm:rounded-[48px] border-[#1e293b] bg-[#030e0c] ring-1 ring-emerald-500/30'
        }`}
      >
        {/* Hardware side buttons simulation (Volume / Power) */}
        {/* Left Side Buttons */}
        <div className="absolute -left-[14px] top-28 w-[4px] h-12 bg-slate-700 rounded-l-md hidden sm:block" />
        <div className="absolute -left-[14px] top-44 w-[4px] h-12 bg-slate-700 rounded-l-md hidden sm:block" />
        {/* Right Power Button */}
        <div className="absolute -right-[14px] top-32 w-[4px] h-16 bg-slate-700 rounded-r-md hidden sm:block" />

        {/* Screen Display Container */}
        <div
          style={{
            width: `${widthPx}px`,
            maxWidth: 'calc(100vw - 32px)',
            height: `${heightPx}px`
          }}
          className="relative bg-[#041412] text-slate-100 flex flex-col overflow-hidden rounded-[40px] sm:rounded-[46px]"
        >
          {/* iOS Top Section: Status Bar + Dynamic Island */}
          {isIOS ? (
            <div className="w-full bg-[#030e0c] text-white pt-2 pb-1 px-6 flex flex-col border-b border-emerald-950/40 relative z-30 font-sans">
              {/* iOS Status Bar Row */}
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 tracking-tight">
                <span>09:41</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-emerald-400">5G</span>
                  {/* Cellular Bars */}
                  <div className="flex items-end gap-0.5 h-2.5">
                    <span className="w-0.5 h-1 bg-white rounded-xs" />
                    <span className="w-0.5 h-1.5 bg-white rounded-xs" />
                    <span className="w-0.5 h-2 bg-white rounded-xs" />
                    <span className="w-0.5 h-2.5 bg-white rounded-xs" />
                  </div>
                  {/* Battery icon */}
                  <div className="w-5 h-2.5 rounded-sm border border-white flex items-center p-0.5 ml-1">
                    <div className="w-3.5 h-1.5 bg-emerald-400 rounded-xs" />
                  </div>
                </div>
              </div>

              {/* Apple Dynamic Island (Interactive with Live Activity!) */}
              <IOSDynamicIsland
                latestBooking={latestBooking}
                results={results}
                onOpenBooking={onOpenBookingModal}
              />
            </div>
          ) : (
            // Android Top Section: Material Status Bar + Punch-hole Camera
            <AndroidTopBar currentTime="09:41" />
          )}

          {/* Scrollable Mobile Screen Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-3.5 space-y-4 scrollbar-none relative">
            {children}
          </div>

          {/* Android Material Floating Action Button (FAB) for Fast Presets */}
          {!isIOS && onApplyPreset && (
            <div className="absolute right-4 bottom-20 z-30">
              <button
                type="button"
                onClick={() => onApplyPreset('electronics_express')}
                className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-xl shadow-emerald-950/60 border border-emerald-400/50 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                title="Android FAB: Nạp nhanh đơn mẫu điện tử"
              >
                <Zap className="w-5 h-5 fill-white" />
              </button>
            </div>
          )}

          {/* Native Mobile Bottom Navigation Bar (Bottom Tab Bar) */}
          <MobileBottomNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            hasResults={hasResults}
            waybillsCount={waybillsCount}
            osVariant={deviceMode}
          />

        </div>
      </div>

    </div>
  );
};
