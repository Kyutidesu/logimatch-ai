import React from 'react';
import { Wifi, Signal, Battery, Bell, MapPin, Truck } from 'lucide-react';

interface AndroidTopBarProps {
  currentTime?: string;
}

export const AndroidTopBar: React.FC<AndroidTopBarProps> = ({
  currentTime = '09:41'
}) => {
  return (
    <div className="w-full bg-[#030e0c] text-slate-300 px-4 py-1.5 flex items-center justify-between text-xs select-none border-b border-emerald-950/40 relative z-30 font-sans">
      
      {/* Left: Time & App Notification Icons */}
      <div className="flex items-center gap-2">
        <span className="font-semibold text-white text-[11px] tracking-tight">{currentTime}</span>
        <div className="flex items-center gap-1.5 text-emerald-400">
          <Truck className="w-3 h-3" />
          <MapPin className="w-2.5 h-2.5 text-slate-400" />
        </div>
      </div>

      {/* Center: Android Camera Punch-Hole */}
      <div className="absolute left-1/2 -translate-x-1/2 top-2">
        <div className="w-3.5 h-3.5 rounded-full bg-black border border-slate-800 flex items-center justify-center shadow-inner">
          <div className="w-1.5 h-1.5 rounded-full bg-[#071329]" />
        </div>
      </div>

      {/* Right: 5G, Wi-Fi & Battery 100% */}
      <div className="flex items-center gap-1.5 text-slate-300">
        <span className="text-[10px] font-bold tracking-tighter text-emerald-300">5G</span>
        <Signal className="w-3 h-3" />
        <Wifi className="w-3 h-3" />
        <div className="flex items-center gap-0.5">
          <span className="text-[10px] font-mono">100%</span>
          <Battery className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
        </div>
      </div>

    </div>
  );
};
