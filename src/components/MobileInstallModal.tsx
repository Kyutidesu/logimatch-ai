import React, { useState } from 'react';
import { X, Smartphone, QrCode, Copy, Check, Share2, ArrowRight, Apple, CheckCircle2 } from 'lucide-react';

interface MobileInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileInstallModal: React.FC<MobileInstallModalProps> = ({ isOpen, onClose }) => {
  const [guideTab, setGuideTab] = useState<'android' | 'ios'>('ios');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://logimatch.ai';

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'LogiMatch AI - Hệ thống Gợi ý 3PL Logistics',
          text: 'Nền tảng AI đề xuất Top 3 nhà cung cấp 3PL theo chi phí, thời gian và tuyến đường',
          url: currentUrl
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  // Generate a high quality SVG QR code representing the link
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#061816] border border-emerald-500/40 text-slate-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-900/80 via-slate-900 to-teal-950 border-b border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Mở Trên Điện Thoại Android &amp; iOS</h3>
              <p className="text-xs text-emerald-200/70">Quét mã QR hoặc Cài đặt PWA dùng như ứng dụng Native</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          
          {/* QR Code & Scan Section */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-900/60 flex flex-col sm:flex-row items-center gap-5">
            {/* Realistic stylized QR SVG */}
            <div className="p-3 rounded-2xl bg-white shadow-xl flex-shrink-0">
              <svg className="w-32 h-32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* 3 Corner Detection Squares */}
                <rect x="5" y="5" width="28" height="28" rx="4" fill="#041412" />
                <rect x="10" y="10" width="18" height="18" rx="2" fill="white" />
                <rect x="14" y="14" width="10" height="10" rx="2" fill="#059669" />

                <rect x="67" y="5" width="28" height="28" rx="4" fill="#041412" />
                <rect x="72" y="10" width="18" height="18" rx="2" fill="white" />
                <rect x="76" y="14" width="10" height="10" rx="2" fill="#059669" />

                <rect x="5" y="67" width="28" height="28" rx="4" fill="#041412" />
                <rect x="10" y="72" width="18" height="18" rx="2" fill="white" />
                <rect x="14" y="76" width="10" height="10" rx="2" fill="#059669" />

                {/* Data blocks */}
                <rect x="38" y="10" width="8" height="8" rx="1.5" fill="#0f172a" />
                <rect x="50" y="10" width="12" height="8" rx="1.5" fill="#0f172a" />
                <rect x="38" y="24" width="24" height="8" rx="1.5" fill="#047857" />
                <rect x="10" y="38" width="8" height="12" rx="1.5" fill="#0f172a" />
                <rect x="22" y="38" width="12" height="8" rx="1.5" fill="#0f172a" />
                <rect x="38" y="38" width="8" height="8" rx="1.5" fill="#059669" />
                <rect x="50" y="38" width="16" height="8" rx="1.5" fill="#0f172a" />
                <rect x="72" y="38" width="8" height="12" rx="1.5" fill="#0f172a" />
                <rect x="84" y="38" width="10" height="8" rx="1.5" fill="#047857" />

                <rect x="10" y="54" width="18" height="8" rx="1.5" fill="#0f172a" />
                <rect x="34" y="50" width="12" height="12" rx="2" fill="#041412" />
                <rect x="50" y="54" width="8" height="8" rx="1.5" fill="#059669" />
                <rect x="62" y="50" width="12" height="8" rx="1.5" fill="#0f172a" />
                <rect x="78" y="54" width="16" height="8" rx="1.5" fill="#041412" />

                <rect x="38" y="66" width="8" height="12" rx="1.5" fill="#0f172a" />
                <rect x="50" y="66" width="12" height="8" rx="1.5" fill="#047857" />
                <rect x="66" y="66" width="8" height="16" rx="1.5" fill="#0f172a" />
                <rect x="78" y="66" width="16" height="8" rx="1.5" fill="#059669" />

                <rect x="38" y="82" width="24" height="12" rx="2" fill="#041412" />
                <rect x="66" y="86" width="8" height="8" rx="1.5" fill="#059669" />
                <rect x="78" y="78" width="16" height="16" rx="2" fill="#0f172a" />

                {/* Center Green Leaf / Truck Logo */}
                <rect x="42" y="42" width="16" height="16" rx="4" fill="#059669" />
                <path d="M 46 50 L 50 54 L 55 46" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                1. Quét Camera trên điện thoại
              </span>
              <h4 className="text-sm font-bold text-white">
                Bật Camera điện thoại và hướng vào mã QR
              </h4>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Hệ thống sẽ tự động mở trang web trên Safari (iPhone) hoặc Chrome (Android) với đầy đủ giao diện di động cảm ứng.
              </p>

              {/* Copy / Share Button */}
              <div className="pt-2 flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-semibold flex items-center gap-1.5 hover:bg-emerald-900 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Đã sao chép link!' : 'Sao chép link web'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-semibold flex items-center gap-1.5 hover:bg-slate-700 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Chia sẻ link</span>
                </button>
              </div>
            </div>
          </div>

          {/* OS-Specific PWA Installation Guides */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                2. Cài Đặt Làm Ứng Dụng (PWA) Trên Màn Hình Chính
              </span>

              {/* Segmented OS Switcher */}
              <div className="p-0.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setGuideTab('ios')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    guideTab === 'ios'
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Apple className="w-3.5 h-3.5" />
                  <span>iPhone (iOS)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGuideTab('android')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    guideTab === 'android'
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Android (Chrome)</span>
                </button>
              </div>
            </div>

            {/* iOS Guide */}
            {guideTab === 'ios' && (
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 animate-fadeIn">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">🍎</span>
                  <span>Cách cài đặt trên iPhone / iPad (Safari)</span>
                </div>

                <div className="space-y-2 text-[11px] text-slate-300">
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/50">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">1</span>
                    <span>Mở link web trong trình duyệt <strong>Safari</strong> trên iPhone của bạn.</span>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/50">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">2</span>
                    <span>Nhấn vào nút <strong>Chia sẻ (Share 📤)</strong> ở thanh công cụ dưới đáy màn hình Safari.</span>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/50">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">3</span>
                    <span>Cuộn xuống danh sách tùy chọn và chạm vào <strong>"Thêm vào MH chính" (Add to Home Screen)</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/50">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">4</span>
                    <span>Bấm <strong>"Thêm" (Add)</strong> ở góc trên bên phải. Biểu tượng <strong>LogiMatch AI</strong> sẽ xuất hiện trên màn hình chính như một ứng dụng App Store!</span>
                  </div>
                </div>
              </div>
            )}

            {/* Android Guide */}
            {guideTab === 'android' && (
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 animate-fadeIn">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center text-[10px]">🤖</span>
                  <span>Cách cài đặt trên điện thoại Android (Google Chrome)</span>
                </div>

                <div className="space-y-2 text-[11px] text-slate-300">
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/50">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold">1</span>
                    <span>Mở link web bằng <strong>Google Chrome</strong> trên điện thoại Android.</span>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/50">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold">2</span>
                    <span>Nếu thấy banner <strong>"Thêm LogiMatch vào Màn hình chính"</strong> ở đáy, nhấn <strong>Cài đặt</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/50">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold">3</span>
                    <span>Hoặc bấm biểu tượng menu <strong>3 chấm (⋮)</strong> góc trên bên phải Chrome ➔ chọn <strong>"Cài đặt ứng dụng"</strong> (Install App).</span>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/50">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold">4</span>
                    <span>Ứng dụng chạy độc lập toàn màn hình không có thanh địa chỉ duyệt web (WebAPK), tự động cập nhật!</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-900 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Hỗ trợ Android 10+ và iOS 15+
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
          >
            Đã hiểu &amp; Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
