import React from 'react'
import { X, Terminal, Keyboard, Play, Send, CheckCircle2, RotateCcw, AlertTriangle, Sparkles } from 'lucide-react'

interface QuickGuideModalProps {
  isOpen: boolean
  onClose: () => void
}

export const QuickGuideModal: React.FC<QuickGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#0c111d] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-sky-950/40 via-[#0e1628] to-[#0c111d] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                <span>Cẩm Nang 1 Phút Luyện Code C (Linux Workbench)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Hướng dẫn nhanh cho sinh viên ôn thi thực hành môn Lập trình hệ thống (LTHT)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300">
          {/* 4 Core Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Bước 1 */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-sky-400 font-bold font-mono text-[11px]">
                <span className="w-5 h-5 rounded-full bg-sky-500/20 flex items-center justify-center border border-sky-500/40">1</span>
                <span>CHỌN BÀI &amp; MỨC ĐỘ</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Chọn mức độ <strong>1 đến 5</strong> trên thanh công cụ. Bấm <strong>&lt;</strong> và <strong>&gt;</strong> để chuyển bài ngẫu nhiên. Bấm nút <strong>Lịch Sử</strong> để xem lại bài đã làm.
              </p>
            </div>

            {/* Bước 2 */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold font-mono text-[11px]">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/40">2</span>
                <span>GÕ VIM CHUẨN LINUX</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Mặc định ở <strong>NORMAL</strong> mode. Bấm <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300 font-mono">i</kbd> để sửa code. Sửa xong <strong>BẮT BUỘC bấm <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300 font-mono">Esc</kbd></strong> về NORMAL trước khi lưu/chạy!
              </p>
            </div>

            {/* Bước 3 */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono text-[11px]">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40">3</span>
                <span>CHẠY THỬ &amp; CHECK LỖI GCC</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Bấm <strong>Chạy Thử</strong> hoặc gõ <code className="text-emerald-300">:wq</code> trong Vim. Màn hình tự chuyển sang <strong>Terminal Linux</strong> để kiểm tra biên dịch GCC và báo lỗi cú pháp (dòng, cột) trước.
              </p>
            </div>

            {/* Bước 4 */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-bold font-mono text-[11px]">
                <span className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/40">4</span>
                <span>NỘP BÀI &amp; CHẤM TEST CASE</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Khi code không còn lỗi cú pháp, bấm <strong>Nộp Bài</strong>. Hệ thống tự động chuyển sang tab <strong>Test Cases</strong> để chấm toàn bộ bộ test và thông báo Pass/Fail trực quan.
              </p>
            </div>
          </div>

          {/* Tips and Cheatsheet */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-3">
            <h3 className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
              <Keyboard className="w-4 h-4 text-sky-400" />
              <span>Phím Tắt Vim Thường Dùng Nhất Trong Phòng Thi:</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                <span className="text-amber-400 font-bold block">i</span>
                <span className="text-slate-400 text-[10px]">Vào Insert mode</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                <span className="text-sky-400 font-bold block">Esc</span>
                <span className="text-slate-400 text-[10px]">Về Normal mode</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                <span className="text-emerald-400 font-bold block">:w</span>
                <span className="text-slate-400 text-[10px]">Lưu file nháp</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                <span className="text-purple-400 font-bold block">:wq</span>
                <span className="text-slate-400 text-[10px]">Lưu &amp; Chạy gcc</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                <span className="text-rose-400 font-bold block">dd</span>
                <span className="text-slate-400 text-[10px]">Xóa dòng hiện tại</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                <span className="text-indigo-400 font-bold block">u</span>
                <span className="text-slate-400 text-[10px]">Undo (Hoàn tác)</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                <span className="text-teal-400 font-bold block">yy / p</span>
                <span className="text-slate-400 text-[10px]">Copy / Paste dòng</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                <span className="text-cyan-400 font-bold block">/tu_khoa</span>
                <span className="text-slate-400 text-[10px]">Tìm kiếm từ khóa</span>
              </div>
            </div>
          </div>

          {/* Useful Notes */}
          <div className="p-3 rounded-lg bg-sky-950/20 border border-sky-500/20 flex items-start gap-2 text-[11px] text-sky-200">
            <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <span>
              <strong>Tự động lưu:</strong> Mọi thao tác gõ code đều tự động lưu vào trình duyệt. Bấm <strong>F5</strong> thoải mái không sợ mất bài. Nếu muốn quay về code mẫu ban đầu, bấm biểu tượng <strong>Đặt lại (Reset)</strong> trên thanh công cụ.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#0e1628] border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            SysLearn C • Thiết kế trực tiếp cho sinh viên LTHT
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs cursor-pointer transition-colors"
          >
            Đã hiểu, vào luyện ngay!
          </button>
        </div>
      </div>
    </div>
  )
}
