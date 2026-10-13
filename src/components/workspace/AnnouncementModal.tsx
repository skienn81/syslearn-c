import React from 'react'
import { X, Sparkles, CheckCircle2, BookOpen, Layers, Terminal, ArrowRight } from 'lucide-react'
import { LATEST_ANNOUNCEMENT, markAnnouncementAsRead } from '../../core/curriculum/updateAnnouncements'

interface AnnouncementModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectExercise?: (exerciseId: string) => void
}

export const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
  isOpen,
  onClose,
  onSelectExercise,
}) => {
  if (!isOpen) return null

  const handleAcknowledge = () => {
    markAnnouncementAsRead()
    onClose()
  }

  const handlePickExercise = (exerciseId: string) => {
    markAnnouncementAsRead()
    onClose()
    if (onSelectExercise) {
      onSelectExercise(exerciseId)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#0b0f19] border border-sky-500/30 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-sky-950/40 via-[#0e1424] to-[#0b0f19] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-100">{LATEST_ANNOUNCEMENT.title}</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 font-semibold">
                  v{LATEST_ANNOUNCEMENT.version}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Cập nhật ngày {LATEST_ANNOUNCEMENT.timestamp} • Thông báo tự động đến tất cả người học
              </p>
            </div>
          </div>

          <button
            onClick={handleAcknowledge}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          {/* Summary Box */}
          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 leading-relaxed text-slate-200">
            {LATEST_ANNOUNCEMENT.summary}
          </div>

          {/* Highlights & Notes */}
          <div>
            <h3 className="text-xs font-semibold text-slate-200 mb-2.5 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-sky-400" />
              <span>Điểm mới &amp; Cải tiến hệ thống:</span>
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {LATEST_ANNOUNCEMENT.notes.map((note, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2.5 rounded-md bg-slate-900/50 border border-slate-800/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300 leading-relaxed">{note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* New Exercises List */}
          <div>
            <h3 className="text-xs font-semibold text-slate-200 mb-2.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Các bài tập tiêu biểu vừa được bổ sung:</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                +{LATEST_ANNOUNCEMENT.newExercisesCount} bài
              </span>
            </h3>
            <div className="space-y-1.5">
              {LATEST_ANNOUNCEMENT.newExercisesList.map((ex) => (
                <div
                  key={ex.id}
                  onClick={() => handlePickExercise(ex.id)}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-sky-500/40 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30">
                      Mức {ex.level}
                    </span>
                    <span className="font-medium text-slate-200 group-hover:text-sky-300 transition-colors truncate">
                      {ex.title}
                    </span>
                    <span className="text-[11px] text-slate-500 hidden sm:inline">
                      • {ex.topic}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <span>Làm ngay</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#0e1424] border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Dữ liệu bài tập được đồng bộ trực tiếp khi phát hành phiên bản mới.
          </span>
          <button
            onClick={handleAcknowledge}
            className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs cursor-pointer transition-colors shadow-md flex items-center gap-1.5"
          >
            <span>Đã hiểu &amp; Bắt đầu luyện bài</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
