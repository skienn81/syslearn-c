import React, { useState } from 'react'
import { LabExercise, LearningMode } from '../../types/curriculum'
import { SESSIONS_DATA } from '../../core/curriculum/curriculumData'
import { runCCode } from '../../core/c-sandbox/cInterpreter'
import { SyntaxHighlightedCodeEditor } from '../common/SyntaxHighlightedCodeEditor'
import confetti from 'canvas-confetti'
import { 
  Play, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Terminal, 
  AlertTriangle, 
  Lightbulb,
  FileCode,
  Sparkles
} from 'lucide-react'

interface LabWorkspaceProps {
  onOpenInStudio?: (fileName: string, code: string) => void
}

const LAB_GROUPS = [
  {
    name: '1. I/O & BỘ NHỚ CƠ BẢN',
    indices: [1, 2, 3],
  },
  {
    name: '2. BITWISE & MÃ BÙ 2',
    indices: [4, 5, 6, 7, 8],
  },
  {
    name: '3. CON TRỎ & HÀM',
    indices: [9, 10],
  },
  {
    name: '4. MẢNG & CHUỖI KÝ TỰ',
    indices: [11, 12],
  },
  {
    name: '5. STRUCT & SHELL ARGUMENTS',
    indices: [13, 14],
  },
]

export const LabWorkspace: React.FC<LabWorkspaceProps> = ({ onOpenInStudio }) => {
  const lab2Session = SESSIONS_DATA.find(s => s.id === 'session_02') || SESSIONS_DATA[1]
  const labs = lab2Session.labs

  const [selectedLabId, setSelectedLabId] = useState<string>(labs[0].id)
  const [learningMode, setLearningMode] = useState<LearningMode>('SCAFFOLDING')
  const [userCode, setUserCode] = useState<string>(labs[0].scaffoldingCode)
  const [showSolution, setShowSolution] = useState<boolean>(false)
  const [testResults, setTestResults] = useState<{ passed: boolean; actual: string; expected: string; id: string }[] | null>(null)
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false)

  const activeLab: LabExercise = labs.find(l => l.id === selectedLabId) || labs[0]

  const handleSelectLab = (lab: LabExercise) => {
    setSelectedLabId(lab.id)
    setUserCode(lab.scaffoldingCode)
    setShowSolution(false)
    setTestResults(null)
  }

  const handleRunTests = () => {
    setIsRunningTests(true)
    const results = activeLab.testCases.map(tc => {
      const exec = runCCode(userCode, tc.input)
      const passed = exec.stdout.trim().includes(tc.expectedOutput.trim())
      return {
        id: tc.id,
        passed,
        actual: exec.stdout.trim(),
        expected: tc.expectedOutput.trim(),
      }
    })

    setTestResults(results)
    setIsRunningTests(false)

    const allPassed = results.every(r => r.passed)
    if (allPassed && results.length > 0) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      })
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* Cột Trái (4 cols): Danh Sách 14 Bài */}
      <div className="lg:col-span-4 bg-[#0e1422] border border-slate-800 rounded-xl p-3 flex flex-col gap-3 max-h-[820px] overflow-hidden">
        <div className="px-2 py-1 flex items-center justify-between border-b border-slate-800/80 pb-2.5">
          <span className="text-xs font-semibold text-slate-200">Danh Mục Bài Thực Hành</span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-bold">14 Bài Lab</span>
        </div>

        {/* Scrollable Groups List */}
        <div className="overflow-y-auto space-y-3 pr-1 flex-1">
          {LAB_GROUPS.map((group, gIdx) => {
            const groupLabs = labs.filter(l => group.indices.includes(l.number))
            return (
              <div key={gIdx} className="space-y-1">
                <div className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase px-2 py-0.5">
                  {group.name}
                </div>
                <div className="space-y-0.5">
                  {groupLabs.map((lab) => {
                    const isSelected = lab.id === selectedLabId
                    return (
                      <button
                        key={lab.id}
                        onClick={() => handleSelectLab(lab)}
                        className={`w-full text-left px-2.5 py-2 rounded-lg transition-colors flex items-center justify-between text-xs ${
                          isSelected
                            ? 'bg-sky-500/15 text-sky-300 font-medium border border-sky-500/30'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                        }`}
                      >
                        <span className="truncate pr-2 font-mono">
                          #{lab.number.toString().padStart(2, '0')} {lab.title.replace(/^Bài \d+:\s*/, '')}
                        </span>
                        <span className="text-[10px] text-slate-500 shrink-0 font-sans">
                          {lab.difficulty}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Cột Phải (8 cols): Không Gian Làm Bài */}
      <div className="lg:col-span-8 bg-[#0e1422] border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
        {/* Lab Header & Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-slate-100">
                {activeLab.title}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-sky-400 font-mono">
                {activeLab.defaultFileName}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{activeLab.description}</p>
          </div>

          {/* 3 Learning Modes Selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setLearningMode('EXPLORER')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                learningMode === 'EXPLORER'
                  ? 'bg-slate-800 text-sky-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              1. Khám Phá I-P-O
            </button>
            <button
              onClick={() => setLearningMode('SCAFFOLDING')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                learningMode === 'SCAFFOLDING'
                  ? 'bg-slate-800 text-sky-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              2. Lấp Khung (Scaffolding)
            </button>
            <button
              onClick={() => setLearningMode('CHALLENGE')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                learningMode === 'CHALLENGE'
                  ? 'bg-slate-800 text-sky-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              3. Thử Thách Shell
            </button>
          </div>
        </div>

        {/* Tab 1: Explorer */}
        {learningMode === 'EXPLORER' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
              <span className="text-xs font-semibold text-sky-400 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" /> Bản Chất Hệ Thống &amp; Phân Tích I-P-O
              </span>
              <pre className="text-xs text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                {activeLab.theoryExplanation}
              </pre>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-1">
                <span className="font-semibold text-amber-300 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Cạm bẫy sinh viên hay gặp
                </span>
                <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                  {activeLab.pitfalls.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-sky-500/5 border border-sky-500/20 text-xs space-y-1">
                <span className="font-semibold text-sky-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Gợi ý tư duy
                </span>
                <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                  {activeLab.hints.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setLearningMode('SCAFFOLDING')}
                className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition-colors"
              >
                Chuyển Sang Viết Code (Scaffolding) &rarr;
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Scaffolding với Theme Code Đa Sắc */}
        {learningMode === 'SCAFFOLDING' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Điền logic vào các vị trí <code className="text-amber-300 font-mono">/* TODO */</code> bên dưới:
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center gap-1 text-xs"
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-400" /> {showSolution ? 'Ẩn Code Mẫu' : 'Xem Code Mẫu Chuẩn'}
                </button>
                {onOpenInStudio && (
                  <button
                    onClick={() => onOpenInStudio(activeLab.defaultFileName, userCode)}
                    className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-sky-400 border border-slate-800 flex items-center gap-1 text-xs"
                  >
                    <Terminal className="w-3.5 h-3.5" /> Mở Trong Vim &amp; Shell
                  </button>
                )}
              </div>
            </div>

            {/* Syntax Highlighted Code Editor */}
            <SyntaxHighlightedCodeEditor
              code={showSolution ? activeLab.solutionCode : userCode}
              onChange={(newCode) => !showSolution && setUserCode(newCode)}
              readOnly={showSolution}
              fileName={activeLab.defaultFileName}
              minHeight="350px"
            />

            {/* Actions & Run Test */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <span className="text-xs text-slate-500 font-mono">
                {activeLab.testCases.length} Test Cases Tự Động
              </span>

              <button
                onClick={handleRunTests}
                disabled={isRunningTests}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isRunningTests ? 'Đang Chấm...' : 'Chạy Biên Dịch & Chấm Test'}</span>
              </button>
            </div>

            {/* Test Results */}
            {testResults && (
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between font-semibold text-slate-200">
                  <span>Kết Quả Kiểm Thử:</span>
                  <span className={testResults.every(r => r.passed) ? 'text-emerald-400' : 'text-rose-400'}>
                    {testResults.filter(r => r.passed).length}/{testResults.length} Đạt
                  </span>
                </div>

                <div className="space-y-1">
                  {testResults.map((r, i) => (
                    <div
                      key={r.id}
                      className={`p-2 rounded-lg border flex items-center justify-between ${
                        r.passed
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {r.passed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                        <span>Test #{i + 1}</span>
                      </div>
                      <div className="text-[11px] truncate max-w-xs text-slate-400">
                        {r.passed ? 'Khớp output kỳ vọng' : `Thực tế: "${r.actual}"`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Challenge */}
        {learningMode === 'CHALLENGE' && (
          <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mx-auto">
              <FileCode className="w-5 h-5" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-sm font-semibold text-slate-100">Chế Độ Thử Thách Tự Lực</h3>
              <p className="text-xs text-slate-400">
                Tự tạo file, viết code trong Vim và dùng lệnh <code className="text-sky-300 font-mono">gcc {activeLab.defaultFileName} -o app && ./app</code> trong Shell để rèn phản xạ thực tế.
              </p>
            </div>
            {onOpenInStudio && (
              <div className="pt-2">
                <button
                  onClick={() => onOpenInStudio(activeLab.defaultFileName, '')}
                  className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs inline-flex items-center gap-1.5 transition-colors"
                >
                  <Terminal className="w-3.5 h-3.5" /> Mở Code &amp; Shell Studio
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
