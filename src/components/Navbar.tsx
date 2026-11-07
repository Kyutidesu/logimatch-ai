import React from 'react';
import { Truck, Sparkles, Cpu, RefreshCw, Layers, Leaf, MapPin, FileText, Compass, Smartphone } from 'lucide-react';

export type AppMainTab = 'input' | 'results' | 'network' | 'waybills' | 'model';

interface NavbarProps {
  activeTab: AppMainTab;
  setActiveTab: (tab: AppMainTab) => void;
  hasResults: boolean;
  waybillsCount: number;
  onOpenModelModal: () => void;
  onOpenMobileGuide?: () => void;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  hasResults,
  waybillsCount,
  onOpenModelModal,
  onOpenMobileGuide,
  onReset
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#061816]/95 backdrop-blur-md border-b border-emerald-500/30 text-white shadow-xl shadow-emerald-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-2.5 flex-shrink-0 cursor-pointer" onClick={() => setActiveTab('input')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/25 border border-emerald-400/40">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-emerald-100 to-teal-200 bg-clip-text text-transparent">
                LogiMatch AI
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hidden sm:flex items-center gap-1">
                <Leaf className="w-2.5 h-2.5 text-emerald-400" />
                <span>Logistics Xanh</span>
              </span>
            </div>
          </div>
        </div>

        {/* Main Application Tabs (Desktop Navigation) */}
        <nav className="hidden md:flex items-center bg-slate-900/90 p-1 rounded-xl border border-emerald-900/60 text-xs font-medium overflow-x-auto scrollbar-none max-w-full">
          {/* Tab 1: Nhập đơn hàng */}
          <button
            type="button"
            onClick={() => setActiveTab('input')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'input'
                ? 'bg-emerald-600 text-white shadow-md font-semibold'
                : 'text-slate-400 hover:text-emerald-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>1. Nhập Đơn</span>
          </button>
          
          {/* Tab 2: Top 3 gợi ý */}
          <button
            type="button"
            onClick={() => {
              if (hasResults) setActiveTab('results');
            }}
            disabled={!hasResults}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'results'
                ? 'bg-teal-600 text-white shadow-md font-semibold'
                : hasResults
                ? 'text-slate-300 hover:text-white'
                : 'text-slate-600 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>2. Top 3 Gợi Ý</span>
            {hasResults && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          {/* Tab 3: Mạng lưới 27 Hubs */}
          <button
            type="button"
            onClick={() => setActiveTab('network')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'network'
                ? 'bg-emerald-600 text-white shadow-md font-semibold'
                : 'text-slate-400 hover:text-emerald-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>3. 27 Hubs & Tuyến</span>
          </button>

          {/* Tab 4: Quản lý vận đơn */}
          <button
            type="button"
            onClick={() => setActiveTab('waybills')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'waybills'
                ? 'bg-emerald-600 text-white shadow-md font-semibold'
                : 'text-slate-400 hover:text-emerald-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>4. Vận Đơn</span>
            {waybillsCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-500/40">
                {waybillsCount}
              </span>
            )}
          </button>

          {/* Tab 5: Mô hình AI */}
          <button
            type="button"
            onClick={() => setActiveTab('model')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'model'
                ? 'bg-cyan-700 text-white shadow-md font-semibold'
                : 'text-slate-400 hover:text-emerald-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>5. AI Model</span>
          </button>
        </nav>

        {/* Actions: Mobile Phone QR + Model Inspector + Reset */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onOpenMobileGuide && (
            <button
              type="button"
              onClick={onOpenMobileGuide}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-colors shadow-sm"
              title="Mở giao diện trên iPhone / Android"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Mobile App</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenModelModal}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-emerald-800/40 text-emerald-300 text-xs font-medium transition-colors shadow-sm"
            title="Xem chi tiết mô hình AI Scoring (.pkl)"
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
            <span className="hidden md:inline font-mono">Model: 3pl_scoring_v2.pkl</span>
            <span className="md:hidden font-mono">AI .pkl</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-emerald-300 border border-slate-800 transition-colors"
            title="Làm mới thông số đơn hàng"
            aria-label="Làm mới đơn hàng"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
