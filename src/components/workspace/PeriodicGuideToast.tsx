import React, { useState, useEffect } from 'react'
import { Sparkles, X, Terminal, Keyboard, Clock } from 'lucide-react'

const STORAGE_KEY = 'syslearn_last_periodic_guide_timestamp'
const THREE_HOURS_MS = 3 * 60 * 60 * 1000 // 3 hours

export const PeriodicGuideToast: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    try {
      const lastShown = Number(localStorage.getItem(STORAGE_KEY) || '0')
      const now = Date.now()

      // Only show if at least 3 hours have passed since last appearance (evaluated once on load/F5)
      if (!lastShown || now - lastShown >= THREE_HOURS_MS) {
        setIsVisible(true)
        localStorage.setItem(STORAGE_KEY, String(now))
      }
    } catch {
      // ignore
    }
  }, []) // Empty dependency array ensures it only checks on mount (F5 / new session), never interrupting active study

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-xs w-full animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="bg-[#0b101c]/95 backdrop-blur-md border border-sky-500/30 rounded-xl p-3.5 shadow-2xl text-xs text-slate-200 space-y-2 ring-1 ring-sky-500/20">
        {/* Header */}
        <div className="flex items-center justify-between pb-1 border-b border-slate-800">
          <div className="flex items-center gap-1.5 text-sky-400 font-bold font-mono text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Mẹo 30s Vào Bàn Luyện Code:</span>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-slate-400 hover:text-slate-200 p-0.5 rounded transition-colors cursor-pointer"
            title="Đóng (Sẽ không hiện lại trong 3 tiếng)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Quick Bullets */}
        <div className="space-y-1 text-[11px] text-slate-300">
          <div className="flex items-start gap-1.5">
            <span className="text-amber-400 font-bold">1.</span>
            <span>Bấm <kbd className="px-1 rounded bg-slate-800 border border-slate-700 text-amber-300 font-mono">i</kbd> sửa code. Khi xong, <strong>bắt buộc bấm <kbd className="px-1 rounded bg-slate-800 border border-slate-700 text-sky-300 font-mono">Esc</kbd></strong> về NORMAL trước khi lưu/chạy.</span>
          </div>

          <div className="flex items-start gap-1.5">
            <span className="text-emerald-400 font-bold">2.</span>
            <span>Gõ <code className="text-emerald-300 font-mono">:wq</code> hoặc bấm <strong>Chạy Thử</strong> (hoặc phím <kbd className="px-1 rounded bg-slate-800 border border-slate-700 text-emerald-300 font-mono">F5</kbd>) để check lỗi GCC.</span>
          </div>

          <div className="flex items-start gap-1.5">
            <span className="text-sky-400 font-bold">3.</span>
            <span>Mã nguồn tự lưu nháp liên tục (đóng tab không mất). Đồng hồ tự đếm giờ khi bạn ở trong app.</span>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>Chỉ xuất hiện 3 tiếng / lần</span>
          </span>
          <button
            onClick={() => setIsVisible(false)}
            className="px-2.5 py-1 rounded bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 font-semibold cursor-pointer transition-colors"
          >
            Đã hiểu &times;
          </button>
        </div>
      </div>
    </div>
  )
}
