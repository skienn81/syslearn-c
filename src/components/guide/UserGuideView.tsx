import React from 'react'
import { 
  Keyboard, 
  Terminal, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  HelpCircle,
  Lightbulb,
  Play,
  Send,
  RotateCcw
} from 'lucide-react'

interface UserGuideViewProps {
  onNavigateToTab?: (tab: any) => void
}

export const UserGuideView: React.FC<UserGuideViewProps> = ({ onNavigateToTab }) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      {/* Hero Welcome Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-950/40 via-indigo-950/30 to-purple-950/40 border border-sky-500/20 space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 font-mono text-[11px] font-semibold">
            Hướng Dẫn Nhanh Cho Sinh Viên
          </span>
          <span className="text-slate-400 text-xs">Ôn thi thực hành môn Lập Trình Hệ Thống (LTHT)</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
          Bàn Luyện Code C Chuẩn <span className="text-sky-400">Linux Terminal &amp; Vim</span> 🚀
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Không cần cài máy ảo nặng nề hay lo lỗi môi trường. Tất cả thao tác gõ Vim, biên dịch GCC, nhập Stdin và kiểm tra Test Cases đều chạy trực tiếp trên trình duyệt, lưu nháp liên tục (F5 không mất code).
        </p>

        {onNavigateToTab && (
          <button
            onClick={() => onNavigateToTab('practice')}
            className="mt-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors shadow"
          >
            <span>Vào Bàn Luyện Code Ngay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Lộ Trình 4 Bước Đơn Giản */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Quy Trình 4 Bước Ôn Luyện Hiệu Quả
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Bước 1 */}
          <div className="p-4 rounded-xl bg-[#0e1422] border border-sky-500/20 space-y-2">
            <span className="text-xs font-mono font-bold text-sky-400">BƯỚC 1</span>
            <h4 className="text-xs font-semibold text-slate-100">Chọn Mức Độ</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Chọn mức độ 1 đến 5 hoặc Tất cả. Dùng nút <strong>&lt;</strong> và <strong>&gt;</strong> để đổi bài ngẫu nhiên không trùng lặp.
            </p>
          </div>

          {/* Bước 2 */}
          <div className="p-4 rounded-xl bg-[#0e1422] border border-amber-500/20 space-y-2">
            <span className="text-xs font-mono font-bold text-amber-400">BƯỚC 2</span>
            <h4 className="text-xs font-semibold text-slate-100">Gõ Vim Chuẩn</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Bấm <code className="text-amber-300 font-mono">i</code> để sửa code. Khi xong, <strong>BẮT BUỘC bấm <code className="text-amber-300 font-mono">Esc</code></strong> về NORMAL mode trước khi lưu/chạy.
            </p>
          </div>

          {/* Bước 3 */}
          <div className="p-4 rounded-xl bg-[#0e1422] border border-emerald-500/20 space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-400">BƯỚC 3</span>
            <h4 className="text-xs font-semibold text-slate-100">Chạy Thử (GCC)</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Bấm <strong>Chạy Thử</strong> hoặc gõ <code className="text-emerald-300 font-mono">:wq</code>. Terminal Linux tự động kiểm tra lỗi cú pháp và cảnh báo trước.
            </p>
          </div>

          {/* Bước 4 */}
          <div className="p-4 rounded-xl bg-[#0e1422] border border-purple-500/20 space-y-2">
            <span className="text-xs font-mono font-bold text-purple-400">BƯỚC 4</span>
            <h4 className="text-xs font-semibold text-slate-100">Nộp Bài</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Khi code không còn lỗi cú pháp, bấm <strong>Nộp Bài</strong> để chạy toàn bộ Test Cases tự động và đối chiếu kết quả.
            </p>
          </div>
        </div>
      </div>

      {/* Cẩm Nang Cứu Hộ Vim & Phím Tắt */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Vim Cheatsheet */}
        <div className="p-5 rounded-xl bg-[#0e1422] border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-slate-100">Phím Tắt Vim Phải Nhớ</h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">Vào chế độ sửa code:</span>
              <kbd className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-300 font-mono font-bold">i</kbd>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">Về chế độ điều hướng (Thoát Insert):</span>
              <kbd className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-sky-300 font-mono font-bold">Esc (hoặc Ctrl+[)</kbd>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">Lưu file nháp:</span>
              <kbd className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-emerald-300 font-mono font-bold">:w</kbd>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">Lưu file &amp; Chạy thử với GCC:</span>
              <kbd className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-purple-300 font-mono font-bold">:wq (hoặc :x)</kbd>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">Xóa dòng hiện tại:</span>
              <kbd className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-rose-300 font-mono font-bold">dd</kbd>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">Hoàn tác (Undo):</span>
              <kbd className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-indigo-300 font-mono font-bold">u</kbd>
            </div>
          </div>
        </div>

        {/* Linux Terminal Cheatsheet */}
        <div className="p-5 rounded-xl bg-[#0e1422] border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-slate-100">Lệnh Terminal Linux Thường Dùng</h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">Xem danh sách tệp:</span>
              <code className="text-emerald-300 font-mono font-bold">ls -la</code>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">Xem nội dung file code:</span>
              <code className="text-emerald-300 font-mono font-bold">cat solution.c</code>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">Biên dịch mã nguồn C:</span>
              <code className="text-emerald-300 font-mono font-bold">gcc -Wall -Wextra solution.c -o solution</code>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">Chạy tệp thực thi vừa tạo:</span>
              <code className="text-emerald-300 font-mono font-bold">./solution</code>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">Pipe truyền dữ liệu vào Stdin:</span>
              <code className="text-emerald-300 font-mono font-bold">echo "5 10" | ./solution</code>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">Xóa màn hình / Xem lịch sử:</span>
              <code className="text-emerald-300 font-mono font-bold">clear (Ctrl+L) / history</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
