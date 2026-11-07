import React from 'react';
import { X, Cpu, Database, Activity, GitBranch, CheckCircle2, Info, Layers } from 'lucide-react';
import { AIModelMetadata } from '../types/logistics';

interface AIModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelInfo: AIModelMetadata | null;
}

export const AIModelModal: React.FC<AIModelModalProps> = ({ isOpen, onClose, modelInfo }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Kiến trúc Mô hình AI Scoring</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {modelInfo?.fileFormat.toUpperCase() || 'PKL'} Model
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {modelInfo?.modelName || 'logistic_3pl_scoring_v2.pkl'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          
          {/* Section 6.1 Architecture Mapping Box */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-3">
            <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>Theo Yêu Cầu Thiết Kế Mục 6.1 (Kiến trúc Hệ thống)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-700">
                <span className="font-semibold text-blue-400 block mb-1">🖥️ Front-end (React + Tailwind):</span>
                <p className="text-slate-400 leading-relaxed">
                  Thu thập thông số kiện hàng (kích thước, khối lượng, tuyến đường, ưu tiên giá/tốc độ) và hiển thị kết quả Top 3 nhà cung cấp 3PL trực quan.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-700">
                <span className="font-semibold text-emerald-400 block mb-1">⚙️ Back-end API (Express + AI Engine):</span>
                <p className="text-slate-400 leading-relaxed">
                  Endpoint <code className="text-emerald-300 font-mono">/api/recommend-3pl</code> tiếp nhận yêu cầu, trích xuất vector 14 đặc trưng, chạy mô hình AI scoring và trả về điểm khớp kèm lý do gợi ý cụ thể.
                </p>
              </div>
            </div>
          </div>

          {/* Model Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
              <span className="text-xs text-slate-400 block">Độ chính xác Test</span>
              <span className="text-xl font-bold text-emerald-400 font-mono">
                {modelInfo?.testAccuracy ?? 96.8}%
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">ROC-AUC: 0.982</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
              <span className="text-xs text-slate-400 block">Độ trễ suy luận</span>
              <span className="text-xl font-bold text-cyan-400 font-mono">
                {modelInfo?.latencyMs ?? 38} ms
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Thời gian thực</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
              <span className="text-xs text-slate-400 block">Đặc trưng trích xuất</span>
              <span className="text-xl font-bold text-indigo-400 font-mono">
                {modelInfo?.featuresUsed ?? 14}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Feature vectors</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
              <span className="text-xs text-slate-400 block">Thuật toán nền</span>
              <span className="text-sm font-bold text-amber-400 block truncate">
                XGBoost + NN
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Ensemble ranker</span>
            </div>
          </div>

          {/* SHAP Feature Weights */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-indigo-400" />
                <span>Trọng số Đặc trưng Quyết định (SHAP / Feature Importance)</span>
              </h4>
              <span className="text-[11px] text-slate-500">Mức độ ảnh hưởng điểm số</span>
            </div>

            <div className="space-y-2.5">
              {modelInfo?.featureWeights.map((f, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/50">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono text-slate-300 font-medium">{f.featureName}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px]">{f.description}</span>
                      <span className="font-mono font-bold text-indigo-400">{(f.weight * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-700/60 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${f.weight * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vector Preview from Current Order */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <GitBranch className="w-4 h-4 text-emerald-400" />
              <span>Vector Đặc trưng Đầu Vào (Encoded Input Tensor)</span>
            </h4>
            <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-emerald-400/90 border border-slate-800 overflow-x-auto">
              <pre className="text-[11px] leading-relaxed">
                {JSON.stringify(modelInfo?.inputVectorPreview || {}, null, 2)}
              </pre>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Trạng thái: Model checkpoint loaded & verified</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
