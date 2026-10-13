import { LabExercise } from '../../types/curriculum'
import { SESSIONS_DATA } from './curriculumData'

const STORAGE_KEY_CUSTOM_EXERCISES = 'syslearn_custom_exercises'
const STORAGE_KEY_EXERCISE_HISTORY = 'syslearn_exercise_history'

// Default level mapping for base curriculum labs (1 to 5)
export const DEFAULT_LAB_LEVELS: Record<string, 1 | 2 | 3 | 4 | 5> = {
  lab1_01: 1, // Linux Shell & I/O
  lab2_01: 1, // Standard I/O (printf, scanf, &)
  lab2_02: 1, // sizeof & Data Types
  lab2_03: 2, // Integer Division & Floats
  lab2_04: 3, // Bitwise Flags (&, |, ^, ~)
  lab2_05: 3, // Bitwise Shift (<<, >>)
  lab2_06: 3, // Bitwise Tricks (Parity, Power of 2)
  lab2_07: 4, // Hamming Weight (Count Set Bits)
  lab2_08: 4, // Bit Reversal (Reverse 8-bit)
  lab2_09: 3, // XOR Swap without temp variable
  lab2_10: 3, // Pointers & Address Operator
  lab2_11: 4, // Pointer Arithmetic & Arrays
  lab2_12: 2, // Strings & Null Terminator '\0'
  lab2_13: 4, // Type Casting & Integer Overflow
  lab2_14: 5, // Hardware Register Masking & Bit Packing
}

export const LEVEL_METADATA: Record<1 | 2 | 3 | 4 | 5, { name: string; description: string; badgeColor: string }> = {
  1: {
    name: 'Mức 1: Nhập Môn C & I/O',
    description: 'Cú pháp cơ bản, printf, scanf, toán tử &, biến và kiểu dữ liệu nguyên thủy',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  },
  2: {
    name: 'Mức 2: Cơ Bản & Toán Học',
    description: 'Ép kiểu, cạm bẫy chia số nguyên 5/9, điều kiện if/else, vòng lặp, chuỗi cơ bản',
    badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
  },
  3: {
    name: 'Mức 3: Toán Tử Bit & Con Trỏ',
    description: 'Toán tử Bitwise (&, |, ^, ~), cờ hiệu Flags, con trỏ cơ bản và địa chỉ ô nhớ',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  },
  4: {
    name: 'Mức 4: Nâng Cao & Bộ Nhớ',
    description: 'Số học con trỏ, mảng nhiều chiều, số bù 2, thuật toán nhị phân tối ưu',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
  },
  5: {
    name: 'Mức 5: Chuyên Sâu Hệ Thống',
    description: 'Mô phỏng thanh ghi phần cứng, Bit Packing, tràn số nguyên và Bit hacks Kernel',
    badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
  },
}

export function getExerciseLevel(exercise: LabExercise): 1 | 2 | 3 | 4 | 5 {
  if (exercise.level && exercise.level >= 1 && exercise.level <= 5) {
    return exercise.level
  }
  return DEFAULT_LAB_LEVELS[exercise.id] || 2
}

// Load custom exercises created by user
export function getCustomExercises(): LabExercise[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_EXERCISES)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    console.error('Failed to parse custom exercises:', err)
    return []
  }
}

// Save a new custom exercise or update existing
export function saveCustomExercise(exercise: LabExercise): void {
  const existing = getCustomExercises()
  const idx = existing.findIndex(e => e.id === exercise.id)
  if (idx >= 0) {
    existing[idx] = exercise
  } else {
    existing.push(exercise)
  }
  localStorage.setItem(STORAGE_KEY_CUSTOM_EXERCISES, JSON.stringify(existing))
}

// Delete a custom exercise
export function deleteCustomExercise(id: string): void {
  const existing = getCustomExercises()
  const filtered = existing.filter(e => e.id !== id)
  localStorage.setItem(STORAGE_KEY_CUSTOM_EXERCISES, JSON.stringify(filtered))
}

// Get all exercises (Base Curriculum + Custom) with normalized level
export function getAllExercises(): LabExercise[] {
  const baseLabs = SESSIONS_DATA.flatMap(s => s.labs).map(lab => ({
    ...lab,
    level: getExerciseLevel(lab),
  }))
  const custom = getCustomExercises().map(lab => ({
    ...lab,
    level: getExerciseLevel(lab),
  }))

  return [...baseLabs, ...custom]
}

// History tracking
export interface ExerciseHistoryItem {
  labId: string
  title: string
  level: 1 | 2 | 3 | 4 | 5
  lastVisitedAt: number
  isCompleted: boolean
}

export function getExerciseHistory(): ExerciseHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EXERCISE_HISTORY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function recordExerciseVisit(exercise: LabExercise, isCompleted: boolean = false): void {
  try {
    const history = getExerciseHistory()
    const level = getExerciseLevel(exercise)
    const existingIndex = history.findIndex(h => h.labId === exercise.id)

    const updatedItem: ExerciseHistoryItem = {
      labId: exercise.id,
      title: exercise.title,
      level,
      lastVisitedAt: Date.now(),
      isCompleted: isCompleted || (existingIndex >= 0 ? history[existingIndex].isCompleted : false),
    }

    if (existingIndex >= 0) {
      history.splice(existingIndex, 1)
    }
    history.unshift(updatedItem) // Put at the top of recent visits

    // Keep up to 100 recent items
    const trimmed = history.slice(0, 100)
    localStorage.setItem(STORAGE_KEY_EXERCISE_HISTORY, JSON.stringify(trimmed))
  } catch (err) {
    console.error('Failed to record history:', err)
  }
}

export function updateExerciseHistoryStatus(labId: string, isCompleted: boolean): void {
  try {
    const history = getExerciseHistory()
    const item = history.find(h => h.labId === labId)
    if (item) {
      item.isCompleted = isCompleted
      localStorage.setItem(STORAGE_KEY_EXERCISE_HISTORY, JSON.stringify(history))
    }
  } catch (err) {
    console.error('Failed to update history status:', err)
  }
}

// Bulk import JSON
export function importExercisesJson(jsonString: string): { success: boolean; count: number; error?: string } {
  try {
    const parsed = JSON.parse(jsonString)
    const list = Array.isArray(parsed) ? parsed : [parsed]
    const validExercises: LabExercise[] = []

    list.forEach((item, i) => {
      if (item && item.title && (item.scaffoldingCode || item.solutionCode)) {
        validExercises.push({
          id: item.id || `custom_${Date.now()}_${i}`,
          number: item.number || (100 + i),
          title: item.title,
          topic: item.topic || 'Custom Topic',
          difficulty: item.difficulty || 'Trung bình',
          level: (item.level >= 1 && item.level <= 5 ? item.level : 2) as 1 | 2 | 3 | 4 | 5,
          description: item.description || '',
          theoryExplanation: item.theoryExplanation || '',
          scaffoldingCode: item.scaffoldingCode || item.solutionCode,
          solutionCode: item.solutionCode || item.scaffoldingCode,
          defaultFileName: item.defaultFileName || `custom_${i + 1}.c`,
          testCases: Array.isArray(item.testCases) ? item.testCases : [{ id: 'tc1', input: '', expectedOutput: '' }],
          hints: Array.isArray(item.hints) ? item.hints : [],
          pitfalls: Array.isArray(item.pitfalls) ? item.pitfalls : [],
        })
      }
    })

    if (validExercises.length === 0) {
      return { success: false, count: 0, error: 'Không tìm thấy bài tập hợp lệ trong file JSON.' }
    }

    const currentCustom = getCustomExercises()
    const combined = [...currentCustom]
    validExercises.forEach(ve => {
      const existingIdx = combined.findIndex(c => c.id === ve.id)
      if (existingIdx >= 0) {
        combined[existingIdx] = ve
      } else {
        combined.push(ve)
      }
    })

    localStorage.setItem(STORAGE_KEY_CUSTOM_EXERCISES, JSON.stringify(combined))
    return { success: true, count: validExercises.length }
  } catch (err) {
    return { success: false, count: 0, error: (err as Error).message }
  }
}

// Exercise Code Draft Persistence (Auto-saved across page reloads & F5)
const STORAGE_PREFIX_CODE = 'syslearn_code_draft_'

export function getSavedExerciseCode(labId: string, defaultCode: string): string {
  try {
    const saved = localStorage.getItem(`${STORAGE_PREFIX_CODE}${labId}`)
    return saved !== null ? saved : defaultCode
  } catch {
    return defaultCode
  }
}

export function saveExerciseCode(labId: string, code: string): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX_CODE}${labId}`, code)
  } catch (err) {
    console.error('Failed to auto-save exercise code draft:', err)
  }
}

export function clearSavedExerciseCode(labId: string): void {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX_CODE}${labId}`)
  } catch {
    // ignore
  }
}
