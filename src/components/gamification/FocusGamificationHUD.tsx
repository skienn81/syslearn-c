import React, { useState, useEffect, useRef } from 'react'
import { Flame, Clock, Trophy, Sparkles } from 'lucide-react'
import { 
  GamificationState, 
  loadGamificationState, 
  saveGamificationState,
  playHapticSound
} from '../../core/gamification/studyGamification'
import { GamificationModal } from './GamificationModal'

interface FocusGamificationHUDProps {
  completedLabIds?: string[]
}

export const FocusGamificationHUD: React.FC<FocusGamificationHUDProps> = ({
  completedLabIds = [],
}) => {
  const [state, setState] = useState<GamificationState>(() => loadGamificationState())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAppFocused, setIsAppFocused] = useState(true)
  const [sessionSeconds, setSessionSeconds] = useState(0)

  // Keep stateRef for background interval updates without stale closures
  const stateRef = useRef(state)
  stateRef.current = state

  // Update completed lab count when completedLabIds changes
  useEffect(() => {
    setState(prev => {
      const updated = {
        ...prev,
        completedLabCount: completedLabIds.length,
      }
      saveGamificationState(updated)
      return updated
    })
  }, [completedLabIds])

  // In-App Active Focus Timer
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === 'visible'
      setIsAppFocused(isVisible)
    }

    const handleFocus = () => setIsAppFocused(true)
    const handleBlur = () => {
      // Small timeout to avoid instant blur flickers when interacting with system inputs
      if (document.hidden) {
        setIsAppFocused(false)
      }
    }

    window.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)

    // Interval to count seconds ONLY when active in-app
    const timer = setInterval(() => {
      // Check document visibility
      if (document.visibilityState !== 'visible') {
        setIsAppFocused(false)
        return
      }

      setIsAppFocused(true)
      setSessionSeconds(prev => prev + 1)

      const current = stateRef.current
      const nextTotal = current.totalFocusSeconds + 1
      const nextToday = current.todayFocusSeconds + 1
      let newXp = current.xp

      // +15 XP every 5 minutes (300s) of active in-app focus
      if (nextTotal % 300 === 0) {
        newXp += 15
      }

      // Check achievements
      const ach = { ...current.achievements }
      if (nextToday >= 900 && !ach['deep_work_15']) ach['deep_work_15'] = true
      if (nextTotal >= 1800 && !ach['deep_work_30']) ach['deep_work_30'] = true

      const updatedState: GamificationState = {
        ...current,
        totalFocusSeconds: nextTotal,
        todayFocusSeconds: nextToday,
        xp: newXp,
        achievements: ach,
      }

      setState(updatedState)
      saveGamificationState(updatedState)
    }, 1000)

    return () => {
      clearInterval(timer)
      window.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
    }
  }, [])

  // Format seconds into mm:ss
  const formatTimer = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60)
    const s = totalSecs % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  return (
    <>
      {/* Sleek, Compact Gamification Pill on Header */}
      <div 
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 rounded-md bg-[#0e1526] hover:bg-[#131d33] border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-all select-none group"
        title="Bấm để xem Thống kê giờ học & Hồ sơ chinh phục"
      >
        {/* Active Focus Timer */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          {isAppFocused ? (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Đang tập trung trong app" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-amber-500" title="Đã tạm dừng (Bạn vừa ra ngoài app)" />
          )}

          <span className={isAppFocused ? 'text-slate-200 font-semibold' : 'text-amber-400/80 italic'}>
            {isAppFocused ? formatTimer(sessionSeconds) : 'Tạm dừng'}
          </span>
        </div>

        <div className="h-3 w-[1px] bg-slate-800 hidden sm:block" />

        {/* Streak */}
        <div className="hidden sm:flex items-center gap-1 text-xs font-mono text-amber-400" title={`Chuỗi học: ${state.streakDays} ngày`}>
          <Flame className="w-3.5 h-3.5 fill-current text-amber-400" />
          <span>{state.streakDays}d</span>
        </div>

        <div className="h-3 w-[1px] bg-slate-800 hidden md:block" />

        {/* Level & XP */}
        <div className="hidden md:flex items-center gap-1 text-xs font-mono text-sky-300">
          <Trophy className="w-3 h-3 text-sky-400" />
          <span className="text-[11px] font-bold">Cấp {state.level}</span>
          <span className="text-[10px] text-slate-500">({state.xp} XP)</span>
        </div>
      </div>

      {/* Gamification Modal */}
      <GamificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        state={state}
      />
    </>
  )
}
