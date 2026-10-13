import React, { useState } from 'react'
import { ExerciseHistoryItem, LEVEL_METADATA } from '../../core/curriculum/exerciseManager'
import { X, CheckCircle2, Clock, Trash2, BookOpen } from 'lucide-react'

interface HistoryDrawerProps {
  isOpen: boolean
  onClose: () => void
  historyItems: ExerciseHistoryItem[]
  onSelectExercise: (labId: string) => void
  onClearHistory: () => void
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  historyItems,
  onSelectExercise,
  onClearHistory,
}) => {
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<number | 'all'>('all')

  if (!isOpen) return null

  const filteredItems = selectedLevelFilter === 'all'
    ? historyItems
    : historyItems.filter(h => h.level === selectedLevelFilter)

  const passedCount = historyItems.filter(h => h.isCompleted).length

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Vừa xong'
    if (mins < 60) return `${mins} phút trước`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours} giờ trước`
    return new Date(ts).toLocaleDateString('vi-VN')
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs select-none">
      <div 
        className="w-full max-w-md bg-[#0c111e] border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="h-14 px-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-[#090d16]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-400" />
            <h2 className="text-sm font-bold text-slate-100">Lịch Sử Luyện Tập</h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {passedCount}/{historyItems.length} Đã Đạt
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Level Filter Pills */}
        <div className="px-4 py-2.5 border-b border-slate-800/80 bg-[#0a0e1a] flex items-center gap-1.5 overflow-x-auto shrink-0 text-xs font-mono">
          <button
            onClick={() => setSelectedLevelFilter('all')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer shrink-0 ${
              selectedLevelFilter === 'all'
                ? 'bg-slate-800 text-sky-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tất cả ({historyItems.length})
          </button>
          {[1, 2, 3, 4, 5].map((lvl) => {
            const count = historyItems.filter(h => h.level === lvl).length
            return (
              <button
                key={lvl}
                onClick={() => setSelectedLevelFilter(lvl)}
                className={`px-2 py-1 rounded-md transition-colors cursor-pointer shrink-0 ${
                  selectedLevelFilter === lvl
                    ? 'bg-slate-800 text-sky-400 font-semibold'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Mức {lvl} ({count})
              </button>
            )
          })}
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs flex flex-col items-center justify-center gap-2">
              <BookOpen className="w-6 h-6 text-slate-600" />
              <span>Chưa có bài tập nào trong lịch sử</span>
              <p className="text-[11px] text-slate-600">
                Hãy làm bài và bấm "Nộp Bài" hoặc duyệt bài ngẫu nhiên để ghi nhận lịch sử.
              </p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const meta = LEVEL_METADATA[item.level] || LEVEL_METADATA[2]
              return (
                <div
                  key={item.labId}
                  onClick={() => {
                    onSelectExercise(item.labId)
                    onClose()
                  }}
                  className="p-3 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-1.5 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-sky-300 transition-colors line-clamp-1">
                      {item.title}
                    </span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border shrink-0 ${meta.badgeColor}`}>
                      Mức {item.level}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-1 font-mono text-[10px]">
                      {item.isCompleted ? (
                        <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-3 h-3" /> Đã Hoàn Thành
                        </span>
                      ) : (
                        <span className="text-slate-500">Chưa Đạt</span>
                      )}
                    </div>
                    <span>{formatTime(item.lastVisitedAt)}</span>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        {historyItems.length > 0 && (
          <div className="p-3 border-t border-slate-800 bg-[#090d16] flex items-center justify-between text-xs shrink-0">
            <span className="text-slate-500 text-[11px]">
              Tự động lưu vào localStorage
            </span>
            <button
              onClick={() => {
                if (window.confirm('Xóa toàn bộ lịch sử luyện tập?')) {
                  onClearHistory()
                }
              }}
              className="text-rose-400 hover:text-rose-300 flex items-center gap-1 p-1 rounded transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa Lịch Sử</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
