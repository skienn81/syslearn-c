// Study Gamification & Cognitive Focus System
// Implements Active In-App Focus Tracking, Streak, XP, Ranks, and Web Audio feedback

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: string
}

export interface GamificationState {
  totalFocusSeconds: number
  todayFocusSeconds: number
  lastDateActive: string // YYYY-MM-DD
  streakDays: number
  xp: number
  level: number
  rankTitle: string
  achievements: Record<string, boolean> // id -> unlocked
  completedLabCount: number
}

const STORAGE_KEY = 'syslearn_gamification_state'

export const ACHIEVEMENTS_LIST: Achievement[] = [
  { id: 'first_run', title: 'Khởi Động Biên Dịch', description: 'Chạy thử lần đầu tiên với GCC', icon: '⚡' },
  { id: 'vim_ninja', title: 'Vim Ninja', description: 'Lưu và chạy code thành công bằng lệnh :wq', icon: '🥷' },
  { id: 'clean_compile', title: 'Mã Nguồn Tinh Gọn', description: 'Biên dịch không một cảnh báo GCC (-Wall -Wextra)', icon: '🎯' },
  { id: 'deep_work_15', title: 'Dòng Chảy Tập Trung', description: 'Học tập trung 15 phút liên tục trong app', icon: '⏳' },
  { id: 'deep_work_30', title: 'Kỷ Luật Thép', description: 'Tích lũy 30 phút tập trung thực tế trong app', icon: '🧠' },
  { id: 'three_streak', title: 'Chiến Binh Bền Bỉ', description: 'Duy trì chuỗi học tập liên tiếp 3 ngày', icon: '🔥' },
  { id: 'all_levels', title: 'Chinh Phục 5 Mức Độ', description: 'Hoàn thành bài tập ở cả 5 mức độ', icon: '🏆' },
]

export const RANKS = [
  { level: 1, minXp: 0, title: 'Tân Binh Linux', badge: '🌱' },
  { level: 2, minXp: 150, title: 'Chiến Binh C', badge: '⚔️' },
  { level: 3, minXp: 400, title: 'Bậc Thầy Con Trỏ', badge: '🎯' },
  { level: 4, minXp: 850, title: 'Kỹ Sư Hệ Thống', badge: '💻' },
  { level: 5, minXp: 1500, title: 'Huyền Thoại Hạt Nhân', badge: '👑' },
]

export function getTodayDateString(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function loadGamificationState(): GamificationState {
  const today = getTodayDateString()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return {
        totalFocusSeconds: 0,
        todayFocusSeconds: 0,
        lastDateActive: today,
        streakDays: 1,
        xp: 0,
        level: 1,
        rankTitle: RANKS[0].title,
        achievements: {},
        completedLabCount: 0,
      }
    }
    const state: GamificationState = JSON.parse(raw)
    
    // Check daily streak roll
    if (state.lastDateActive !== today) {
      const last = new Date(state.lastDateActive)
      const cur = new Date(today)
      const diffDays = Math.round((cur.getTime() - last.getTime()) / (1000 * 3600 * 24))
      
      if (diffDays === 1) {
        state.streakDays = (state.streakDays || 1) + 1
      } else if (diffDays > 1) {
        state.streakDays = 1
      }
      state.todayFocusSeconds = 0
      state.lastDateActive = today
    }

    // Calculate level and rank
    const currentRank = [...RANKS].reverse().find(r => state.xp >= r.minXp) || RANKS[0]
    state.level = currentRank.level
    state.rankTitle = currentRank.title

    return state
  } catch {
    return {
      totalFocusSeconds: 0,
      todayFocusSeconds: 0,
      lastDateActive: today,
      streakDays: 1,
      xp: 0,
      level: 1,
      rankTitle: RANKS[0].title,
      achievements: {},
      completedLabCount: 0,
    }
  }
}

export function saveGamificationState(state: GamificationState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

// Subtle Audio Feedback with Web Audio API (Synthesizer, zero files loaded)
export function playHapticSound(type: 'pass' | 'level_up' | 'start' | 'click') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return
    const ctx = new AudioContextClass()

    if (type === 'pass') {
      // Pleasant two-tone ascending chord
      const now = ctx.currentTime
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gain = ctx.createGain()

      osc1.type = 'sine'
      osc2.type = 'sine'
      osc1.frequency.setValueAtTime(523.25, now) // C5
      osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.15) // E5
      osc2.frequency.setValueAtTime(659.25, now + 0.15)
      osc2.frequency.exponentialRampToValueAtTime(783.99, now + 0.3) // G5

      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

      osc1.connect(gain)
      osc2.connect(gain)
      gain.connect(ctx.destination)

      osc1.start(now)
      osc2.start(now + 0.15)
      osc1.stop(now + 0.15)
      osc2.stop(now + 0.35)
    } else if (type === 'level_up') {
      // Fanfare arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.50]
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        const t = ctx.currentTime + i * 0.1
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, t)
        gain.gain.setValueAtTime(0.1, t)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(t)
        osc.stop(t + 0.25)
      })
    }
  } catch {
    // Audio context may be restricted before user gesture
  }
}
