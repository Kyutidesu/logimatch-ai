import React from 'react';
import { Monitor, Smartphone, Apple, RotateCcw, QrCode, Sparkles, Sliders } from 'lucide-react';

export type DeviceMode = 'desktop' | 'android' | 'ios';

interface DeviceModeBarProps {
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
  onOpenMobileGuide: () => void;
  orientation: 'portrait' | 'landscape';
  setOrientation: (o: 'portrait' | 'landscape') => void;
  deviceScale: number;
  setDeviceScale: (scale: number) => void;
}

export const DeviceModeBar: React.FC<DeviceModeBarProps> = ({
  deviceMode,
  setDeviceMode,
  onOpenMobileGuide,
  orientation,
  setOrientation,
  deviceScale,
  setDeviceScale
}) => {
  return (
    <aside aria-label="Bộ chuyển đổi giao diện di động" className="w-full bg-[#020b0a] border-b border-emerald-950/80 px-4 py-2 text-slate-300 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Device Switcher Segmented Control */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
            Giao diện:
          </span>
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-emerald-900/50">
            {/* Desktop */}
            <button
              type="button"
              onClick={() => setDeviceMode('desktop')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-all ${
                deviceMode === 'desktop'
                  ? 'bg-emerald-600 text-white shadow font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Máy tính</span>
            </button>

            {/* Android */}
            <button
              type="button"
              onClick={() => setDeviceMode('android')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-all ${
                deviceMode === 'android'
                  ? 'bg-teal-600 text-white shadow font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android</span>
            </button>

            {/* iOS (iPhone) */}
            <button
              type="button"
              onClick={() => setDeviceMode('ios')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-all ${
                deviceMode === 'ios'
                  ? 'bg-slate-800 text-white shadow font-semibold border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Apple className="w-3.5 h-3.5" />
              <span>iOS (iPhone)</span>
            </button>
          </div>
        </div>

        {/* Middle: Active Device Specs Badge */}
        {deviceMode !== 'desktop' && (
          <div className="hidden md:flex items-center gap-3 text-[11px] text-slate-400">
            <span className="font-mono text-emerald-400">
              {deviceMode === 'ios' ? 'iPhone 16 Pro • 393 × 852 px' : 'Google Pixel 8 • 412 × 915 px'}
            </span>
            <span className="text-slate-600">•</span>
            <span>{orientation === 'portrait' ? 'Dọc (Portrait)' : 'Ngang (Landscape)'}</span>
          </div>
        )}

        {/* Right Actions: Rotate, Scale & QR Modal Trigger */}
        <div className="flex items-center gap-2">
          {deviceMode !== 'desktop' && (
            <>
              {/* Rotate button */}
              <button
                type="button"
                onClick={() => setOrientation(orientation === 'portrait' ? 'landscape' : 'portrait')}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-300 transition-colors"
                title="Xoay hướng màn hình (Dọc / Ngang)"
                aria-label="Xoay hướng màn hình"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Scale Zoom dropdown */}
              <select
                value={deviceScale}
                onChange={(e) => setDeviceScale(Number(e.target.value))}
                className="bg-slate-900 border border-slate-800 text-slate-300 rounded-lg px-2 py-1 text-[11px] focus:outline-none focus:border-emerald-500"
                aria-label="Thu phóng thiết bị"
              >
                <option value={0.85}>85%</option>
                <option value={0.95}>95%</option>
                <option value={1.0}>100%</option>
                <option value={1.05}>105%</option>
              </select>
            </>
          )}

          {/* Open Real Phone QR Guide */}
          <button
            type="button"
            onClick={onOpenMobileGuide}
            className="px-3 py-1.5 rounded-lg bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 hover:text-emerald-200 hover:bg-emerald-900/60 font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <QrCode className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Quét QR Mở Điện Thoại Thật</span>
            <span className="sm:hidden">Quét QR</span>
          </button>
        </div>

      </div>
    </aside>
  );
};
