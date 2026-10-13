import React, { useState } from 'react'
import { LabExercise } from '../../types/curriculum'
import { saveCustomExercise, importExercisesJson } from '../../core/curriculum/exerciseManager'
import { SAMPLE_EXAM_EXERCISES } from '../../core/curriculum/sampleExamExercises'
import { X, Upload, FileCode, CheckCircle2, AlertTriangle, Code2, Sparkles } from 'lucide-react'

interface AddExerciseModalProps {
  isOpen: boolean
  onClose: () => void
  onExerciseAdded: (newLabId: string) => void
}

export const AddExerciseModal: React.FC<AddExerciseModalProps> = ({
  isOpen,
  onClose,
  onExerciseAdded,
}) => {
  const [mode, setMode] = useState<'form' | 'json'>('form')

  // Form state
  const [title, setTitle] = useState('')
  const [level, setLevel] = useState<1 | 2 | 3 | 4 | 5>(2)
  const [topic, setTopic] = useState('Lập trình C & Hệ thống')
  const [description, setDescription] = useState('')
  const [scaffoldingCode, setScaffoldingCode] = useState(`#include <stdio.h>\n\nint main() {\n    /* TODO: Gõ code của bạn vào đây */\n    \n    return 0;\n}\n`)
  const [testInput, setTestInput] = useState('')
  const [testExpectedOutput, setTestExpectedOutput] = useState('')

  // JSON state
  const [jsonText, setJsonText] = useState('')
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null)

  if (!isOpen) return null

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề bài tập!')
      return
    }

    const newId = `custom_${Date.now()}`
    const exercise: LabExercise = {
      id: newId,
      number: 999,
      title: title.trim(),
      topic: topic.trim() || 'Custom Lab',
      difficulty: level <= 2 ? 'Căn bản' : level <= 4 ? 'Trung bình' : 'Chuyên sâu',
      level,
      description: description.trim() || 'Bài tập tự nạp.',
      theoryExplanation: 'Bài tập do người học tự cấu hình.',
      scaffoldingCode: scaffoldingCode.trim(),
      solutionCode: scaffoldingCode.trim(),
      defaultFileName: `exercise_${newId.slice(-4)}.c`,
      testCases: [
        {
          id: `tc_${Date.now()}`,
          input: testInput.trim(),
          expectedOutput: testExpectedOutput.trim(),
        },
      ],
      hints: [],
      pitfalls: [],
    }

    saveCustomExercise(exercise)
    onExerciseAdded(newId)
    onClose()
  }

  const handleImportJson = () => {
    if (!jsonText.trim()) return
    const res = importExercisesJson(jsonText)
    if (res.success) {
      setImportStatus({ success: true, message: `Đã nạp thành công ${res.count} bài tập mới!` })
      setTimeout(() => {
        onExerciseAdded(`custom_${Date.now()}`)
        onClose()
      }, 1200)
    } else {
      setImportStatus({ success: false, message: `Lỗi: ${res.error}` })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
      <div 
        className="w-full max-w-2xl bg-[#0c111e] border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="h-12 px-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-[#090d16]">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-sky-400" />
            <h2 className="text-sm font-bold text-slate-100">Nạp Thêm Bài Tập C Của Bạn</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher: Quick Form vs Import JSON */}
        <div className="h-10 px-5 border-b border-slate-800 bg-[#0a0e1a] flex items-center gap-4 text-xs font-mono shrink-0">
          <button
            onClick={() => setMode('form')}
            className={`h-full flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              mode === 'form' ? 'border-sky-400 text-sky-400 font-semibold' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Tạo 1 Bài Nhanh</span>
          </button>
          <button
            onClick={() => setMode('json')}
            className={`h-full flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              mode === 'json' ? 'border-sky-400 text-sky-400 font-semibold' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Nạp Nhiều Bài Bằng JSON (Hàng chục bài)</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 text-xs text-slate-200">
          {mode === 'form' ? (
            <form onSubmit={handleSaveForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-slate-400 font-medium">Tiêu đề bài tập *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ví dụ: Đảo chuỗi ký tự bằng con trỏ..."
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-100 outline-none focus:border-sky-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Mức độ (Level 1-5)</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(Number(e.target.value) as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-100 outline-none focus:border-sky-500 font-mono"
                  >
                    <option value={1}>Mức 1: Nhập môn I/O</option>
                    <option value={2}>Mức 2: Cơ bản & Toán</option>
                    <option value={3}>Mức 3: Bit & Con trỏ</option>
                    <option value={4}>Mức 4: Nâng cao & Bộ nhớ</option>
                    <option value={5}>Mức 5: Chuyên sâu Hệ thống</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Mô tả bài toán &amp; Yêu cầu</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả input, output, yêu cầu cần làm..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-100 outline-none focus:border-sky-500 resize-none leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Khung mã nguồn ban đầu (Scaffolding C Code)</label>
                <textarea
                  value={scaffoldingCode}
                  onChange={(e) => setScaffoldingCode(e.target.value)}
                  rows={5}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-100 outline-none focus:border-sky-500 font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-800/80">
                <div className="space-y-1 font-mono">
                  <label className="text-slate-400 font-sans font-medium">Test Case: Input (stdin)</label>
                  <input
                    type="text"
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    placeholder="Ví dụ: 10 (để trống nếu không cần)"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-amber-300 outline-none focus:border-sky-500"
                  />
                </div>
                <div className="space-y-1 font-mono">
                  <label className="text-slate-400 font-sans font-medium">Test Case: Output Kỳ Vọng (stdout) *</label>
                  <input
                    type="text"
                    value={testExpectedOutput}
                    onChange={(e) => setTestExpectedOutput(e.target.value)}
                    placeholder="Ví dụ: Kết quả là: 10"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-emerald-400 outline-none focus:border-sky-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold cursor-pointer transition-colors shadow-sm"
                >
                  Lưu &amp; Bắt Đầu Làm Bài
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3 font-mono">
              <div className="flex items-center justify-between text-slate-400 font-sans">
                <span>Dán mảng JSON chứa danh sách bài tập (Hỗ trợ nạp 200 bài):</span>
                <button
                  type="button"
                  onClick={() => setJsonText(JSON.stringify(SAMPLE_EXAM_EXERCISES, null, 2))}
                  className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-medium cursor-pointer bg-amber-500/10 hover:bg-amber-500/20 px-2 py-1 rounded border border-amber-500/30 transition-colors"
                  title="Điền sẵn 15 bài tập mẫu ôn thi C chuẩn"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Điền Mẫu 15 Bài Thi C (Mức 1-5)</span>
                </button>
              </div>
              <textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                placeholder={`[\n  {\n    "title": "Tính tổng mảng con trỏ",\n    "level": 3,\n    "topic": "Pointers",\n    "description": "Viết hàm tính tổng...",\n    "scaffoldingCode": "#include <stdio.h>\\n...",\n    "testCases": [{ "input": "5", "expectedOutput": "15" }]\n  }\n]`}
                rows={9}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-100 outline-none focus:border-sky-500 font-mono text-[11px]"
              />

              {importStatus && (
                <div className={`p-2.5 rounded text-xs flex items-center gap-2 ${
                  importStatus.success ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                }`}>
                  {importStatus.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
                  <span>{importStatus.message}</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2 font-sans">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleImportJson}
                  className="px-4 py-1.5 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold cursor-pointer transition-colors shadow-sm"
                >
                  Nạp Vào Kho Bài Tập
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
