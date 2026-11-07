import React from 'react';
import { Layers, Sparkles, Compass, FileText, Cpu, Truck } from 'lucide-react';
import { AppMainTab } from './Navbar';

interface MobileBottomNavProps {
  activeTab: AppMainTab;
  setActiveTab: (tab: AppMainTab) => void;
  hasResults: boolean;
  waybillsCount: number;
  osVariant?: 'android' | 'ios' | 'web';
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  hasResults,
  waybillsCount,
  osVariant = 'web'
}) => {
  const isIOS = osVariant === 'ios';
  const isAndroid = osVariant === 'android';

  const navItems = [
    {
      id: 'input' as AppMainTab,
      label: 'Nhập đơn',
      icon: Layers,
      enabled: true
    },
    {
      id: 'results' as AppMainTab,
      label: 'Top 3 Gợi ý',
      icon: Sparkles,
      enabled: hasResults,
      badge: hasResults ? '3' : undefined
    },
    {
      id: 'network' as AppMainTab,
      label: '27 Tuyến',
      icon: Compass,
      enabled: true
    },
    {
      id: 'waybills' as AppMainTab,
      label: 'Vận đơn',
      icon: FileText,
      enabled: true,
      badge: waybillsCount > 0 ? String(waybillsCount) : undefined
    },
    {
      id: 'model' as AppMainTab,
      label: 'AI Model',
      icon: Cpu,
      enabled: true
    }
  ];

  return (
    <div
      className={`w-full z-40 select-none ${
        isIOS
          ? 'bg-[#061816]/90 backdrop-blur-xl border-t border-emerald-500/20'
          : isAndroid
          ? 'bg-[#030e0c] border-t border-emerald-950/80 shadow-2xl'
          : 'bg-[#061816]/95 backdrop-blur-lg border-t border-emerald-500/30'
      }`}
    >
      {/* 5 Bottom Nav Buttons */}
      <nav className="grid grid-cols-5 items-center h-14 sm:h-16 px-1 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              disabled={!item.enabled}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-all relative ${
                !item.enabled ? 'opacity-30 cursor-not-allowed' : 'active:scale-95'
              }`}
            >
              {/* Icon Container with Android Material You Pill or iOS Clean Accent */}
              <div
                className={`relative px-3 py-1 rounded-full transition-all flex items-center justify-center ${
                  isActive
                    ? isAndroid
                      ? 'bg-emerald-600/30 text-emerald-300 ring-1 ring-emerald-500/50'
                      : 'text-emerald-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />

                {/* Badge if available */}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-emerald-500 text-slate-950 shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] tracking-tight mt-0.5 truncate max-w-full ${
                  isActive
                    ? 'font-bold text-emerald-300'
                    : 'font-medium text-slate-400'
                }`}
              >
                {item.label}
              </span>

              {/* iOS subtle active dot */}
              {isIOS && isActive && (
                <span className="w-1 h-1 rounded-full bg-emerald-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </nav>

      {/* OS Specific Bottom Safe Area / Gesture Bar */}
      {isIOS ? (
        // iOS Home Indicator Bar
        <div className="pb-2 pt-1 flex justify-center">
          <div className="w-32 h-1 rounded-full bg-white/40 hover:bg-white/60 transition-colors" />
        </div>
      ) : isAndroid ? (
        // Android Gesture Navigation Pill Bar
        <div className="pb-1.5 pt-0.5 flex justify-center">
          <div className="w-20 h-1 rounded-full bg-slate-600/60" />
        </div>
      ) : null}
    </div>
  );
};
