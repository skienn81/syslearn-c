import React from 'react'
import { X, Flame, Trophy, Clock, Target, Sparkles, CheckCircle2, Lock } from 'lucide-react'
import { GamificationState, ACHIEVEMENTS_LIST, RANKS } from '../../core/gamification/studyGamification'

interface GamificationModalProps {
  isOpen: boolean
  onClose: () => void
  state: GamificationState
}

export const GamificationModal: React.FC<GamificationModalProps> = ({
  isOpen,
  onClose,
  state,
}) => {
  if (!isOpen) return null

  // Format seconds to mm:ss or hh:mm
  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600)
    const m = Math.floor((secs % 3600) / 60)
    if (h > 0) return `${h} giờ ${m} phút`
    return `${m} phút`
  }

  // Next level progress
  const nextRank = RANKS.find(r => r.minXp > state.xp) || RANKS[RANKS.length - 1]
  const currentRank = [...RANKS].reverse().find(r => r.minXp <= state.xp) || RANKS[0]
  const currentRankBase = currentRank.minXp
  const nextRankTarget = nextRank.minXp
  const progressPercent = nextRankTarget > currentRankBase
    ? Math.min(100, Math.round(((state.xp - currentRankBase) / (nextRankTarget - currentRankBase)) * 100))
    : 100

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#0c111e] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-950/40 via-[#131929] to-[#0c111e] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xl">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-100">Hồ Sơ Chinh Phục &amp; Cường Độ Học</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                  Cấp {state.level}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Danh hiệu: <strong className="text-amber-300">{state.rankTitle}</strong>
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
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          {/* XP Progress to next level */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Tiến trình thăng cấp ({state.xp} XP)
              </span>
              <span className="text-amber-400 font-mono text-[11px]">
                {nextRank.title} ({nextRankTarget} XP)
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden relative">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-sky-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400">
              Giải bài tập đúng (+50-250 XP) và duy trì tập trung in-app (+15 XP / 5 phút) để thăng cấp.
            </p>
          </div>

          {/* Core Focus Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* 1. Today Active Focus */}
            <div className="p-3.5 rounded-xl bg-[#0e1526] border border-sky-500/20 space-y-1">
              <div className="flex items-center gap-1.5 text-sky-400 text-[11px] font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>Hôm Nay</span>
              </div>
              <div className="text-lg font-bold font-mono text-slate-100">
                {formatTime(state.todayFocusSeconds)}
              </div>
              <span className="text-[10px] text-slate-500">Tập trung thực tế</span>
            </div>

            {/* 2. Lifetime In-app focus */}
            <div className="p-3.5 rounded-xl bg-[#0e1526] border border-indigo-500/20 space-y-1">
              <div className="flex items-center gap-1.5 text-indigo-400 text-[11px] font-semibold">
                <Target className="w-3.5 h-3.5" />
                <span>Tổng Tích Lũy</span>
              </div>
              <div className="text-lg font-bold font-mono text-slate-100">
                {formatTime(state.totalFocusSeconds)}
              </div>
              <span className="text-[10px] text-slate-500">Giờ học in-app</span>
            </div>

            {/* 3. Daily Streak */}
            <div className="p-3.5 rounded-xl bg-[#0e1526] border border-amber-500/20 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 text-[11px] font-semibold">
                <Flame className="w-3.5 h-3.5" />
                <span>Chuỗi Ngày</span>
              </div>
              <div className="text-lg font-bold font-mono text-amber-300">
                {state.streakDays} ngày
              </div>
              <span className="text-[10px] text-slate-500">Học liên tục</span>
            </div>

            {/* 4. Completed Labs */}
            <div className="p-3.5 rounded-xl bg-[#0e1526] border border-emerald-500/20 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-semibold">
                <Trophy className="w-3.5 h-3.5" />
                <span>Bài Đã Đạt</span>
              </div>
              <div className="text-lg font-bold font-mono text-emerald-400">
                {state.completedLabCount} bài
              </div>
              <span className="text-[10px] text-slate-500">Vượt qua test case</span>
            </div>
          </div>

          {/* Scientific note: In-app vs Out-app */}
          <div className="p-3 rounded-lg bg-sky-950/20 border border-sky-500/20 flex items-start gap-2 text-[11px] text-sky-200">
            <span className="text-base shrink-0">🧠</span>
            <span className="leading-relaxed">
              <strong>Khoa học nhận thức (Active Time on Task):</strong> Đồng hồ tự động tạm dừng khi bạn rời tab hoặc thu nhỏ trình duyệt để đảm bảo đo lường chính xác thời lượng tập trung sâu (Deep Work).
            </span>
          </div>

          {/* Badges / Achievements List */}
          <div className="space-y-2.5">
            <h3 className="font-semibold text-slate-200 text-xs flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Bộ Sưu Tập Huy Hiệu Chinh Phục:</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {Object.values(state.achievements).filter(Boolean).length} / {ACHIEVEMENTS_LIST.length} đã mở
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ACHIEVEMENTS_LIST.map((ach) => {
                const isUnlocked = Boolean(state.achievements[ach.id])
                return (
                  <div
                    key={ach.id}
                    className={`p-3 rounded-lg border flex items-center gap-3 transition-colors ${
                      isUnlocked
                        ? 'bg-amber-500/10 border-amber-500/30 text-slate-200'
                        : 'bg-slate-900/40 border-slate-800/80 text-slate-500'
                    }`}
                  >
                    <div className="text-2xl shrink-0">
                      {ach.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-200">
                        <span>{ach.title}</span>
                        {isUnlocked ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        ) : (
                          <Lock className="w-3 h-3 text-slate-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {ach.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#0e1526] border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Giữ nhịp tập trung mỗi ngày để chuẩn bị tốt nhất cho kỳ thi LTHT!
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer transition-colors shadow"
          >
            Tiếp Tục Luyện Tập
          </button>
        </div>
      </div>
    </div>
  )
}
