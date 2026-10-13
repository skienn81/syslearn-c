import React, { useState, useEffect } from 'react'
import { Sparkles, BookOpen, ArrowRight, X, CheckSquare, Square } from 'lucide-react'

interface WelcomeGuideModalProps {
  isOpen: boolean
  onClose: () => void
  onNavigateToGuide: () => void
}

const STORAGE_KEY = 'syslearn_hide_welcome_guide'

export const WelcomeGuideModal: React.FC<WelcomeGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigateToGuide,
}) => {
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(false)

  if (!isOpen) return null

  const handleGoToGuide = () => {
    if (dontShowAgain) {
      localStorage.setItem(STORAGE_KEY, 'true')
    }
    onNavigateToGuide()
  }

  const handleDismiss = () => {
    if (dontShowAgain) {
      localStorage.setItem(STORAGE_KEY, 'true')
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-[#0e1422] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between gap-3 bg-gradient-to-r from-sky-950/40 via-indigo-950/30 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                Chào Mừng Bạn Đến Với SysLearn Studio! 👋
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Nền tảng thực hành Lập trình Hệ thống &amp; C toàn diện
              </p>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Đóng thông báo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-5 space-y-4 text-xs text-slate-300 leading-relaxed">
          <p>
            Bạn mới bắt đầu học môn Lập trình hệ thống? Hãy xem qua <strong>Hướng Dẫn Sử Dụng</strong> để làm quen nhanh với:
          </p>

          <div className="space-y-2 font-medium">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
              <span><strong>Vim Dojo:</strong> Cách dùng Normal mode, Insert mode và phím cứu hộ <code className="text-amber-300">:wq</code>.</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <span><strong>Linux Shell:</strong> Thao tác tệp và chuỗi lệnh biên dịch <code className="text-emerald-300">gcc file.c -o file</code>.</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
              <span><strong>14 Bài Lab 2:</strong> Làm bài theo phương pháp Scaffolding &amp; Chấm điểm tự động.</span>
            </div>
          </div>

          {/* Do not show again checkbox */}
          <div className="pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => setDontShowAgain(!dontShowAgain)}
              className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 cursor-pointer select-none"
            >
              {dontShowAgain ? (
                <CheckSquare className="w-4 h-4 text-sky-400 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-600 shrink-0" />
              )}
              <span>Đã biết, không hiển thị lại thông báo này khi vào web nữa</span>
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={handleDismiss}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs transition-colors"
          >
            Bắt Đầu Thực Hành Ngay
          </button>

          <button
            onClick={handleGoToGuide}
            className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Xem Hướng Dẫn Sử Dụng</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
