export type LearningMode = 'EXPLORER' | 'SCAFFOLDING' | 'CHALLENGE'

export interface TestCase {
  id: string
  input: string
  expectedOutput: string
  description?: string
  isSecret?: boolean
}

export interface LabExercise {
  id: string
  number: number
  title: string
  topic: string
  difficulty: 'Căn bản' | 'Trung bình' | 'Nâng cao' | 'Chuyên sâu'
  level?: 1 | 2 | 3 | 4 | 5
  description: string
  theoryExplanation: string // Phân tích I-P-O & bản chất hệ thống
  scaffoldingCode: string   // Khung sườn có TODO để điền code
  solutionCode: string      // Code hoàn chỉnh chuẩn mực
  defaultFileName: string   // ví dụ: bai01_io.c
  testCases: TestCase[]
  hints: string[]
  pitfalls: string[]        // Những lỗi chết người sinh viên hay mắc phải
}

export interface CurriculumSession {
  id: string
  sessionNumber: number
  title: string
  shortDescription: string
  icon: string
  status: 'active' | 'upcoming' // active = đã có đầy đủ bài, upcoming = sẵn sàng nạp slide
  slidesCount?: number
  slideDeckUrl?: string
  slidePdfUrl?: string // Link Google Drive (hoặc file PDF)
  driveFileId?: string // Google Drive File ID
  keyConcepts: string[]
  labs: LabExercise[]
}
