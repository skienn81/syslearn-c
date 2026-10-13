import React, { useState, useEffect, useRef, useMemo } from 'react'
import { 
  getAllExercises, 
  getExerciseLevel, 
  LEVEL_METADATA, 
  recordExerciseVisit, 
  getExerciseHistory, 
  updateExerciseHistoryStatus,
  getSavedExerciseCode,
  saveExerciseCode,
  clearSavedExerciseCode 
} from '../../core/curriculum/exerciseManager'
import { runCCode } from '../../core/c-sandbox/cInterpreter'
import { analyzeCCodeDiagnostics } from '../../core/c-sandbox/diagnosticRules'
import { validateCSyntax } from '../../core/c-sandbox/syntaxValidator'
import { DiagnosticIssue } from '../../types/cEngine'
import { VirtualFileSystem } from '../../core/vfs/VirtualFileSystem'
import { VimEditor } from '../vim/VimEditor'
import { SyntaxHighlightedCodeEditor } from '../common/SyntaxHighlightedCodeEditor'
import { HistoryDrawer } from './HistoryDrawer'
import { AnnouncementModal } from './AnnouncementModal'
import { QuickGuideModal } from './QuickGuideModal'
import { PeriodicGuideToast } from './PeriodicGuideToast'
import { FocusGamificationHUD } from '../gamification/FocusGamificationHUD'
import { playHapticSound } from '../../core/gamification/studyGamification'
import { hasUnreadAnnouncement } from '../../core/curriculum/updateAnnouncements'
import confetti from 'canvas-confetti'
import { 
  Play, 
  Send, 
  Terminal as TerminalIcon, 
  AlertTriangle, 
  CheckCircle2, 
  Lightbulb, 
  Eye, 
  Wand2, 
  Keyboard, 
  RotateCcw, 
  Trash2, 
  CornerDownLeft, 
  ChevronLeft, 
  ChevronRight, 
  HelpCircle, 
  FlaskConical, 
  Plus, 
  Shuffle, 
  Clock,
  Check,
  Bell
} from 'lucide-react'

interface UnifiedCodingWorkspaceProps {
  vfs: VirtualFileSystem
  activeLabId: string
  onSelectLab: (labId: string) => void
  onCompleteLab?: (labId: string) => void
  completedLabIds?: string[]
  onOpenGuide?: () => void
}

export const UnifiedCodingWorkspace: React.FC<UnifiedCodingWorkspaceProps> = ({
  vfs: _vfs,
  activeLabId,
  onSelectLab,
  onCompleteLab,
  completedLabIds = [],
  onOpenGuide,
}) => {
  // All exercises (including custom ones loaded from localStorage)
  const [exercisesRevision, setExercisesRevision] = useState(0)
  const allExercises = useMemo(() => getAllExercises(), [exercisesRevision])

  // Selected Difficulty Level Filter (1..5 or 'all')
  const [selectedLevel, setSelectedLevel] = useState<number | 'all'>(() => {
    try {
      const s = localStorage.getItem('syslearn_selected_level')
      if (s === 'all') return 'all'
      const n = Number(s)
      return (n >= 1 && n <= 5) ? n : 'all'
    } catch {
      return 'all'
    }
  })

  // Navigation History Stack (< quay lại bài vừa làm, > đi tiếp bài ngẫu nhiên mới)
  const [historyStack, setHistoryStack] = useState<string[]>(() => {
    try {
      const s = localStorage.getItem('syslearn_history_stack')
      return s ? JSON.parse(s) : [activeLabId]
    } catch {
      return [activeLabId]
    }
  })
  const [historyIndex, setHistoryIndex] = useState<number>(() => {
    try {
      const s = localStorage.getItem('syslearn_history_index')
      return s !== null ? Number(s) : 0
    } catch {
      return 0
    }
  })

  // Modals state
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false)
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(() => hasUnreadAnnouncement())
  const [hasUnreadNews, setHasUnreadNews] = useState(() => hasUnreadAnnouncement())
  const [isQuickGuideOpen, setIsQuickGuideOpen] = useState(false)
  const [historyItems, setHistoryItems] = useState(() => getExerciseHistory())

  // Current Exercise
  const currentLab = useMemo(() => {
    return allExercises.find(l => l.id === activeLabId) || allExercises[0]
  }, [allExercises, activeLabId])

  const currentLevel = getExerciseLevel(currentLab)
  const levelMeta = LEVEL_METADATA[currentLevel] || LEVEL_METADATA[2]

  // Code state (Loaded from persistent draft, fallback to scaffoldingCode)
  const [code, setCode] = useState<string>(() => {
    return getSavedExerciseCode(currentLab.id, currentLab.scaffoldingCode)
  })
  const [showSolution, setShowSolution] = useState<boolean>(false)
  const [isVimMode, setIsVimMode] = useState<boolean>(true)
  const [vimCurrentMode, setVimCurrentMode] = useState<string>('NORMAL')

  // Auto-save code draft
  const handleCodeChange = (newCode: string) => {
    if (showSolution) return
    setCode(newCode)
    saveExerciseCode(currentLab.id, newCode)
  }

  // Persist navigation stack & level
  useEffect(() => {
    try {
      localStorage.setItem('syslearn_history_stack', JSON.stringify(historyStack))
      localStorage.setItem('syslearn_history_index', String(historyIndex))
    } catch {
      // ignore
    }
  }, [historyStack, historyIndex])

  useEffect(() => {
    try {
      localStorage.setItem('syslearn_selected_level', String(selectedLevel))
    } catch {
      // ignore
    }
  }, [selectedLevel])

  // Left panel tab: 'problem' | 'hints'
  const [leftTab, setLeftTab] = useState<'problem' | 'hints'>('problem')

  // Bottom console tab: 'tests' | 'terminal' | 'diagnostics'
  const [bottomTab, setBottomTab] = useState<'tests' | 'terminal' | 'diagnostics'>('tests')

  // Active selected test case tab in console
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState<number | 'custom'>(0)
  const [customInputValue, setCustomInputValue] = useState<string>('')
  const [customOutput, setCustomOutput] = useState<{ stdout: string; stderr: string; exitCode: number } | null>(null)

  // Terminal State (Full Linux Virtual Bash Shell)
  const [currentCwd, setCurrentCwd] = useState<string>('~/lab')
  const [terminalLines, setTerminalLines] = useState<string[]>([
    `student@syslearn:~/lab$ # Đã nạp bài: ${currentLab.title} [Mức ${currentLevel}]`,
    `student@syslearn:~/lab$ # Dùng [i] để sửa code trong Vim, [:wq] hoặc gõ 'gcc' để biên dịch.`,
  ])
  const [terminalCmdInput, setTerminalCmdInput] = useState<string>('')
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [cmdHistoryIndex, setCmdHistoryIndex] = useState<number>(-1)
  const [isBinaryCompiled, setIsBinaryCompiled] = useState<boolean>(false)
  const [compiledBinaryName, setCompiledBinaryName] = useState<string>('')
  const [awaitingStdin, setAwaitingStdin] = useState<boolean>(false)
  const [extraFiles, setExtraFiles] = useState<{ name: string; type: 'file' | 'dir'; content?: string }[]>([])
  const [testResults, setTestResults] = useState<{ passed: boolean; actual: string; expected: string; id: string; input?: string }[] | null>(null)
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const terminalEndRef = useRef<HTMLDivElement>(null)
  const terminalInputRef = useRef<HTMLInputElement>(null)

  const diagnostics: DiagnosticIssue[] = analyzeCCodeDiagnostics(code)

  // Filtered pool of exercises based on selectedLevel
  const filteredPool = useMemo(() => {
    if (selectedLevel === 'all') return allExercises
    return allExercises.filter(e => getExerciseLevel(e) === selectedLevel)
  }, [allExercises, selectedLevel])

  // Sync code and record history when active lab changes
  useEffect(() => {
    const savedCode = getSavedExerciseCode(currentLab.id, currentLab.scaffoldingCode)
    setCode(savedCode)
    setShowSolution(false)
    setTestResults(null)
    setCustomOutput(null)
    setSelectedTestCaseIndex(0)
    setIsBinaryCompiled(false)
    setCompiledBinaryName(currentLab.defaultFileName.replace('.c', ''))
    setAwaitingStdin(false)
    setCurrentCwd('~/lab')
    setTerminalLines([
      `student@syslearn:~/lab$ # Đã nạp bài: ${currentLab.title} [Mức ${currentLevel}]`,
      `student@syslearn:~/lab$ # Tệp hiện tại: ${currentLab.defaultFileName}. Code được tự động lưu liên tục.`,
    ])

    // Record visit in history
    const isCompleted = completedLabIds.includes(currentLab.id)
    recordExerciseVisit(currentLab, isCompleted)
    setHistoryItems(getExerciseHistory())
  }, [currentLab])

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [terminalLines, awaitingStdin])

  // Function to pick a random unvisited problem from pool
  const pickRandomProblem = (excludeIds: string[] = []): string | null => {
    // Priority: unvisited exercises in pool
    const candidates = filteredPool.filter(e => !excludeIds.includes(e.id))
    if (candidates.length > 0) {
      const randIdx = Math.floor(Math.random() * candidates.length)
      return candidates[randIdx].id
    }
    // If all visited in history, pick any other exercise in pool
    const remaining = filteredPool.filter(e => e.id !== currentLab.id)
    if (remaining.length > 0) {
      const randIdx = Math.floor(Math.random() * remaining.length)
      return remaining[randIdx].id
    }
    return null
  }

  // Handle Next Problem:
  // - If walking forward in history stack: go to next in stack
  // - If at the top of history: pick a RANDOM unvisited problem in current level!
  const handleNextProblem = () => {
    if (historyIndex < historyStack.length - 1) {
      const nextIndex = historyIndex + 1
      setHistoryIndex(nextIndex)
      onSelectLab(historyStack[nextIndex])
    } else {
      // Pick random next
      const nextId = pickRandomProblem(historyStack)
      if (nextId) {
        setHistoryStack(prev => [...prev, nextId])
        setHistoryIndex(prev => prev + 1)
        onSelectLab(nextId)
      } else {
        alert('Bạn đã duyệt qua tất cả bài tập trong mức độ này!')
      }
    }
  }

  // Handle Prev Problem:
  // - Go back to exact previous problem in history!
  const handlePrevProblem = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1
      setHistoryIndex(prevIndex)
      onSelectLab(historyStack[prevIndex])
    }
  }

  // Immediate Shuffle button (Đổi bài ngẫu nhiên mới)
  const handleShuffleNewProblem = () => {
    const nextId = pickRandomProblem([currentLab.id])
    if (nextId) {
      setHistoryStack(prev => [...prev.slice(0, historyIndex + 1), nextId])
      setHistoryIndex(prev => prev + 1)
      onSelectLab(nextId)
    }
  }

  // Handle Level Change
  const handleLevelChange = (lvl: number | 'all') => {
    setSelectedLevel(lvl)
    // Find exercises matching new level
    const pool = lvl === 'all' ? allExercises : allExercises.filter(e => getExerciseLevel(e) === lvl)
    if (pool.length > 0) {
      const randIdx = Math.floor(Math.random() * pool.length)
      const newId = pool[randIdx].id
      setHistoryStack(prev => [...prev, newId])
      setHistoryIndex(prev => prev + 1)
      onSelectLab(newId)
    }
  }

  const promptStr = `student@syslearn:${currentCwd}$`

  const handleRunCode = (customStdin?: string) => {
    // Authentic Vim guard: Cannot run while in INSERT mode
    if (isVimMode && vimCurrentMode.includes('INSERT')) {
      setBottomTab('terminal')
      setTerminalLines(prev => [
        ...prev,
        `${promptStr} # LỖI VIM [E37]: Trình soạn thảo đang ở chế độ -- INSERT --!`,
        `student@syslearn:~/lab$ # Trên Linux Vim, bạn bắt buộc phải bấm phím [Esc] để quay về chế độ NORMAL trước khi lưu file (:w/:wq) và biên dịch gcc.`,
      ])
      return
    }

    setIsRunning(true)
    setIsBinaryCompiled(true)
    setBottomTab('terminal')

    const binaryName = compiledBinaryName || currentLab.defaultFileName.replace('.c', '')

    const isCustom = selectedTestCaseIndex === 'custom'
    const inputToUse = customStdin !== undefined 
      ? customStdin 
      : (isCustom ? customInputValue : (currentLab.testCases[0]?.input || ''))

    const newLogs: string[] = [
      `${promptStr} gcc -Wall -Wextra ${currentLab.defaultFileName} -o ${binaryName}`,
    ]

    const result = runCCode(code, inputToUse, currentLab.defaultFileName)

    if (result.exitCode !== 0) {
      if (result.stderr) newLogs.push(result.stderr)
      newLogs.push(`[Biên dịch thất bại: gcc trả về exit code ${result.exitCode}]`)
      setTerminalLines(prev => [...prev, ...newLogs])
      setIsRunning(false)
      setIsBinaryCompiled(false)
      setBottomTab('terminal')
      return
    }

    if (result.diagnostics && result.diagnostics.length > 0) {
      result.diagnostics.forEach(d => {
        if (d.type === 'warning') {
          newLogs.push(`${currentLab.defaultFileName}:${d.line}:5: warning: ${d.title}`)
          newLogs.push(`    ${d.problematicCodeSnippet}`)
          newLogs.push(`    --> Gợi ý: ${d.suggestedFix}`)
        }
      })
    }

    newLogs.push(`${promptStr} ./${binaryName}`)
    if (inputToUse.trim()) newLogs.push(`[stdin]: ${inputToUse}`)
    if (result.stdout) newLogs.push(result.stdout)
    if (result.stderr) newLogs.push(`[stderr]: ${result.stderr}`)
    newLogs.push(`[Tiến trình kết thúc với exit code 0]`)

    setTerminalLines(prev => [...prev, ...newLogs])
    setIsRunning(false)

    if (isCustom) {
      setCustomOutput({
        stdout: result.stdout || '',
        stderr: result.stderr || '',
        exitCode: result.exitCode,
      })
    }
    setBottomTab('terminal')
  }

  const handleExecuteTerminalCommand = (cmd: string) => {
    // If program is currently paused waiting for interactive stdin input:
    if (awaitingStdin) {
      setAwaitingStdin(false)
      const input = cmd
      const activeBin = compiledBinaryName || currentLab.defaultFileName.replace('.c', '')
      const result = runCCode(code, input, currentLab.defaultFileName)
      const logs = [
        `[stdin]: ${input}`,
        ...(result.stdout ? [result.stdout] : []),
        ...(result.stderr ? [`[stderr]: ${result.stderr}`] : []),
        `[Tiến trình kết thúc với exit code ${result.exitCode}]`,
      ]
      setTerminalLines(prev => [...prev, ...logs])
      setTerminalCmdInput('')
      return
    }

    const trimmed = cmd.trim()
    if (!trimmed) {
      setTerminalLines(prev => [...prev, promptStr])
      return
    }

    // Record command history
    setCmdHistory(prev => [...prev, trimmed])
    setCmdHistoryIndex(-1)

    const newLogs: string[] = [`${promptStr} ${trimmed}`]
    const binaryName = currentLab.defaultFileName.replace('.c', '')

    // Handle Pipe: e.g. echo "10 20" | ./solution
    if (trimmed.includes('|')) {
      const parts = trimmed.split('|').map(p => p.trim())
      if (parts.length === 2 && parts[0].startsWith('echo ') && (parts[1].startsWith('./') || parts[1] === 'run')) {
        const echoVal = parts[0].replace(/^echo\s+/, '').replace(/^["']|["']$/g, '')
        const targetBin = parts[1].replace('./', '')
        const activeBin = compiledBinaryName || binaryName
        if (!isBinaryCompiled && targetBin !== activeBin) {
          newLogs.push(`bash: ./${targetBin}: No such file or directory. Hãy chạy 'gcc ${currentLab.defaultFileName} -o ${targetBin}' trước.`)
        } else {
          const result = runCCode(code, echoVal, currentLab.defaultFileName)
          if (result.stdout) newLogs.push(result.stdout)
          if (result.stderr) newLogs.push(`[stderr]: ${result.stderr}`)
          newLogs.push(`[Tiến trình kết thúc với exit code ${result.exitCode}]`)
        }
        setTerminalLines(prev => [...prev, ...newLogs])
        setTerminalCmdInput('')
        return
      }
    }

    // Tokenize
    const tokens = trimmed.split(/\s+/).filter(Boolean)
    const command = tokens[0]
    const args = tokens.slice(1)

    if (command === 'clear') {
      setTerminalLines([])
      setTerminalCmdInput('')
      return
    }

    if (command === 'pwd') {
      const fullPath = currentCwd === '~' 
        ? '/home/student' 
        : currentCwd === '~/lab' 
        ? '/home/student/lab' 
        : `/home/student/${currentCwd.replace('~/', '')}`
      newLogs.push(fullPath)
    }
    else if (command === 'whoami') {
      newLogs.push('student')
    }
    else if (command === 'uname') {
      if (args.includes('-a')) {
        newLogs.push('Linux syslearn-vm 6.5.0-35-generic #36-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux')
      } else {
        newLogs.push('Linux')
      }
    }
    else if (command === 'history') {
      const fullHist = [...cmdHistory, trimmed]
      fullHist.forEach((h, i) => {
        newLogs.push(`  ${(i + 1).toString().padStart(3, ' ')}  ${h}`)
      })
    }
    else if (command === 'help') {
      newLogs.push(`--- Linux Bash Terminal & GCC Mini Guide ---`)
      newLogs.push(`  pwd                              In thư mục hiện hành`)
      newLogs.push(`  ls [-la]                         Liệt kê tệp tin & quyền thực thi`)
      newLogs.push(`  cat <file>                       Xem mã nguồn tệp tin`)
      newLogs.push(`  gcc [-Wall] <file.c> -o <binary> Biên dịch mã C thành tệp thực thi`)
      newLogs.push(`  ./<binary>                       Chạy chương trình vừa biên dịch`)
      newLogs.push(`  echo "..." | ./<binary>          Pipe truyền stdin trực tiếp vào chương trình`)
      newLogs.push(`  cd <dir>                         Chuyển thư mục (.., ~, lab)`)
      newLogs.push(`  mkdir / touch / rm               Tạo thư mục, tạo tệp, xóa tệp`)
      newLogs.push(`  clear (Ctrl+L)                   Xóa màn hình terminal`)
      newLogs.push(`  Phím Mũi Tên (↑/↓)               Cuộn lại các lệnh đã gõ`)
      newLogs.push(`  Phím Tab                         Tự động gợi ý hoàn thành lệnh và tệp`)
    }
    else if (command === 'ls') {
      const isDetailed = args.some(a => a.includes('l'))
      const showAll = args.some(a => a.includes('a'))
      const activeBin = compiledBinaryName || binaryName

      if (isDetailed) {
        newLogs.push('total 28')
        if (showAll) {
          newLogs.push('drwxr-xr-x 2 student student 4096 Oct 13 22:50 .')
          newLogs.push('drwxr-xr-x 3 student student 4096 Oct 13 22:50 ..')
        }
        newLogs.push(`-rw-r--r-- 1 student student  ${code.length} Oct 13 22:50 ${currentLab.defaultFileName}`)
        if (isBinaryCompiled) {
          newLogs.push(`-rwxr-xr-x 1 student student 16384 Oct 13 22:50 ${activeBin}*`)
        }
        extraFiles.forEach(f => {
          if (f.type === 'dir') {
            newLogs.push(`drwxr-xr-x 2 student student 4096 Oct 13 22:50 ${f.name}`)
          } else {
            newLogs.push(`-rw-r--r-- 1 student student  128 Oct 13 22:50 ${f.name}`)
          }
        })
      } else {
        const files: string[] = []
        if (showAll) files.push('.', '..')
        files.push(currentLab.defaultFileName)
        if (isBinaryCompiled) files.push(`${activeBin}*`)
        extraFiles.forEach(f => files.push(f.name + (f.type === 'dir' ? '/' : '')))
        newLogs.push(files.join('  '))
      }
    }
    else if (command === 'cat') {
      const targetFile = args[0]
      if (!targetFile || targetFile === currentLab.defaultFileName || targetFile === 'solution.c') {
        newLogs.push(code)
      } else {
        const found = extraFiles.find(f => f.name === targetFile)
        if (found) {
          newLogs.push(found.content || '')
        } else {
          newLogs.push(`cat: ${targetFile}: No such file or directory`)
        }
      }
    }
    else if (command === 'gcc') {
      let outName = binaryName
      const oIdx = args.indexOf('-o')
      if (oIdx >= 0 && args[oIdx + 1]) {
        outName = args[oIdx + 1]
      }

      // Check Syntax with compiler emulator
      const syntaxErr = validateCSyntax(code, currentLab.defaultFileName)
      if (syntaxErr) {
        newLogs.push(`${currentLab.defaultFileName}:${syntaxErr.line}:${syntaxErr.column}: error: ${syntaxErr.message}`)
        newLogs.push(`    ${syntaxErr.lineContent}`)
        newLogs.push(`    ${' '.repeat(Math.max(0, syntaxErr.column - 1))}^~~~~~`)
        newLogs.push('compilation terminated.')
        setIsBinaryCompiled(false)
      } else {
        const diags = analyzeCCodeDiagnostics(code)
        let hasWarnings = false
        diags.forEach(d => {
          if (d.type === 'warning') {
            hasWarnings = true
            newLogs.push(`${currentLab.defaultFileName}:${d.line}:5: warning: ${d.title} [-Wunused-result]`)
            newLogs.push(`    ${d.problematicCodeSnippet}`)
            newLogs.push(`    ^~~~~~`)
          }
        })
        setIsBinaryCompiled(true)
        setCompiledBinaryName(outName)
      }
    }
    else if (command.startsWith('./') || command === 'run') {
      const reqBin = command === 'run' ? (compiledBinaryName || binaryName) : command.replace('./', '')
      const activeBin = compiledBinaryName || binaryName

      if (!isBinaryCompiled && reqBin !== activeBin) {
        newLogs.push(`bash: ./${reqBin}: No such file or directory. Hãy chạy 'gcc ${currentLab.defaultFileName} -o ${reqBin}' trước.`)
      } else {
        if (code.includes('scanf')) {
          setAwaitingStdin(true)
          newLogs.push(`[Đang chạy ./${activeBin}: Chương trình đợi dữ liệu từ scanf]`)
          newLogs.push(`Nhập giá trị đầu vào (stdin) rồi nhấn Enter:`)
          setTerminalLines(prev => [...prev, ...newLogs])
          setTerminalCmdInput('')
          return
        } else {
          const result = runCCode(code, '', currentLab.defaultFileName)
          if (result.stdout) newLogs.push(result.stdout)
          if (result.stderr) newLogs.push(`[stderr]: ${result.stderr}`)
          newLogs.push(`[Tiến trình kết thúc với exit code ${result.exitCode}]`)
        }
      }
    }
    else if (command === 'cd') {
      const target = args[0] || '~'
      if (target === '~' || target === '/home/student') {
        setCurrentCwd('~')
      } else if (target === 'lab' || target === '~/lab' || target === '/home/student/lab') {
        setCurrentCwd('~/lab')
      } else if (target === '..') {
        if (currentCwd === '~/lab') setCurrentCwd('~')
        else if (currentCwd === '~') setCurrentCwd('/')
      } else if (target === '/') {
        setCurrentCwd('/')
      } else {
        newLogs.push(`bash: cd: ${target}: No such file or directory`)
      }
    }
    else if (command === 'mkdir') {
      if (!args[0]) {
        newLogs.push('mkdir: missing operand')
      } else {
        setExtraFiles(prev => [...prev, { name: args[0], type: 'dir' }])
      }
    }
    else if (command === 'touch') {
      if (!args[0]) {
        newLogs.push('touch: missing file operand')
      } else {
        setExtraFiles(prev => [...prev, { name: args[0], type: 'file', content: '' }])
      }
    }
    else if (command === 'rm') {
      if (!args[0]) {
        newLogs.push('rm: missing operand')
      } else {
        setExtraFiles(prev => prev.filter(f => f.name !== args[0]))
        if (args[0] === compiledBinaryName || args[0] === binaryName) {
          setIsBinaryCompiled(false)
        }
      }
    }
    else if (command === 'echo') {
      const text = args.join(' ').replace(/^["']|["']$/g, '')
      newLogs.push(text)
    }
    else {
      newLogs.push(`bash: ${command}: command not found`)
    }

    setTerminalLines(prev => [...prev, ...newLogs])
    setTerminalCmdInput('')
  }

  const handleTerminalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleExecuteTerminalCommand(terminalCmdInput)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (cmdHistory.length === 0) return
      const nextIdx = cmdHistoryIndex === -1 ? cmdHistory.length - 1 : Math.max(0, cmdHistoryIndex - 1)
      setCmdHistoryIndex(nextIdx)
      setTerminalCmdInput(cmdHistory[nextIdx])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (cmdHistoryIndex === -1) return
      const nextIdx = cmdHistoryIndex + 1
      if (nextIdx >= cmdHistory.length) {
        setCmdHistoryIndex(-1)
        setTerminalCmdInput('')
      } else {
        setCmdHistoryIndex(nextIdx)
        setTerminalCmdInput(cmdHistory[nextIdx])
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const val = terminalCmdInput.trim()
      const binaryName = currentLab.defaultFileName.replace('.c', '')
      const candidates = [
        'pwd',
        'ls',
        'ls -la',
        'cat',
        `cat ${currentLab.defaultFileName}`,
        'gcc',
        `gcc -Wall -Wextra ${currentLab.defaultFileName} -o ${binaryName}`,
        `./${binaryName}`,
        'clear',
        'history',
        'whoami',
        'uname -a',
        'help',
        currentLab.defaultFileName,
      ]
      const match = candidates.find(c => c.startsWith(val))
      if (match) {
        setTerminalCmdInput(match)
      }
    } else if (e.ctrlKey && e.key.toLowerCase() === 'l') {
      e.preventDefault()
      setTerminalLines([])
    } else if (e.ctrlKey && e.key.toLowerCase() === 'c') {
      e.preventDefault()
      setTerminalLines(prev => [...prev, `${promptStr} ${terminalCmdInput}^C`])
      setTerminalCmdInput('')
      setAwaitingStdin(false)
    }
  }

  const handleSubmitTests = () => {
    // Authentic Vim guard: Cannot submit tests while in INSERT mode
    if (isVimMode && vimCurrentMode.includes('INSERT')) {
      setBottomTab('terminal')
      setTerminalLines(prev => [
        ...prev,
        `${promptStr} # LỖI VIM [E37]: Không thể nộp bài khi đang ở chế độ -- INSERT --!`,
        `student@syslearn:~/lab$ # Hãy bấm phím [Esc] trên bàn phím để quay về chế độ NORMAL trước khi nộp bài.`,
      ])
      return
    }

    setIsRunning(true)
    setBottomTab('tests')

    const results = currentLab.testCases.map(tc => {
      const exec = runCCode(code, tc.input, currentLab.defaultFileName)
      const passed = exec.exitCode === 0 && exec.stdout.trim().includes(tc.expectedOutput.trim())
      return {
        id: tc.id,
        input: tc.input,
        passed,
        actual: exec.exitCode !== 0 ? (exec.stderr || 'Lỗi biên dịch GCC') : exec.stdout.trim(),
        expected: tc.expectedOutput.trim(),
      }
    })

    setTestResults(results)
    setIsRunning(false)
    setSelectedTestCaseIndex(0)

    const allPassed = results.every(r => r.passed)
    if (allPassed && results.length > 0) {
      playHapticSound('pass')
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      })
      if (onCompleteLab) {
        onCompleteLab(currentLab.id)
      }
      updateExerciseHistoryStatus(currentLab.id, true)
      setHistoryItems(getExerciseHistory())
    }
  }

  const handleApplyFix = (diag: DiagnosticIssue) => {
    if (diag.correctedCodeSnippet) {
      const lines = code.split('\n')
      lines[diag.line - 1] = diag.correctedCodeSnippet
      const newCode = lines.join('\n')
      handleCodeChange(newCode)
      setTimeout(() => handleRunCode(), 100)
    }
  }

  const isCurrentLabCompleted = completedLabIds.includes(currentLab.id)
  const passedTestsCount = testResults ? testResults.filter(r => r.passed).length : 0
  const totalTestsCount = currentLab.testCases.length

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#070b12] text-slate-100 font-sans select-none">
      {/* 1. Header tinh gọn 48px với Level Selector & Random Navigator */}
      <header className="h-12 shrink-0 bg-[#090d16] border-b border-slate-800/80 px-4 flex items-center justify-between gap-3 z-10">
        {/* Left: Brand & Difficulty Level Selector */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-100 shrink-0">
            <span className="text-sky-400">&gt;_</span>
            <span className="hidden sm:inline">SysLearn C</span>
          </div>

          <div className="h-4 w-[1px] bg-slate-800 shrink-0" />

          {/* Difficulty Level Dropdown Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-500 font-medium hidden md:inline">Mức độ:</span>
            <select
              value={selectedLevel}
              onChange={(e) => {
                const val = e.target.value === 'all' ? 'all' : Number(e.target.value)
                handleLevelChange(val as any)
              }}
              className="bg-slate-900 border border-slate-700/80 text-slate-200 text-xs rounded-md px-2.5 py-1 outline-none focus:border-sky-500 font-medium cursor-pointer max-w-[210px] sm:max-w-[260px] truncate"
            >
              <option value="all">Tất cả mức độ ({allExercises.length} bài)</option>
              <option value={1}>Mức 1: Nhập môn C &amp; I/O</option>
              <option value={2}>Mức 2: Cơ bản &amp; Toán học</option>
              <option value={3}>Mức 3: Toán tử Bit &amp; Con trỏ</option>
              <option value={4}>Mức 4: Nâng cao &amp; Bộ nhớ</option>
              <option value={5}>Mức 5: Chuyên sâu Hệ thống</option>
            </select>
          </div>

          {/* Prev (<) · Shuffle (🔀) · Next (>) Random Navigation */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-md p-0.5">
            <button
              onClick={handlePrevProblem}
              disabled={historyIndex === 0}
              className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              title="Quay lại bài vừa làm lúc nãy (<)"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleShuffleNewProblem}
              className="p-1 rounded text-amber-400 hover:text-amber-300 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Đổi bài ngẫu nhiên khác trong mức độ này"
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleNextProblem}
              className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 cursor-pointer"
              title="Bài tiếp theo ngẫu nhiên không trùng lặp (>)"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {isCurrentLabCompleted && (
            <span className="hidden xl:inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
              <CheckCircle2 className="w-3 h-3" /> Đạt
            </span>
          )}
        </div>

        {/* Center: In-App Focus Timer & Gamification HUD */}
        <div className="flex items-center">
          <FocusGamificationHUD completedLabIds={completedLabIds} />
        </div>

        {/* Right: History, Add Exercise, Vim Mode, Run, Submit */}
        <div className="flex items-center gap-2 shrink-0">
          {/* History Button */}
          <button
            onClick={() => setIsHistoryDrawerOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer"
            title="Xem danh sách các bài đã làm"
          >
            <Clock className="w-3 h-3 text-sky-400" />
            <span>Lịch Sử</span>
            <span className="text-[10px] text-slate-500">({historyItems.length})</span>
          </button>

          {/* Update Announcement Broadcast Bell */}
          <button
            onClick={() => {
              setIsAnnouncementOpen(true)
              setHasUnreadNews(false)
            }}
            className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer border ${
              hasUnreadNews
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 hover:bg-amber-500/25'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
            title="Thông báo cập nhật bài tập mới (Broadcast all clients)"
          >
            <Bell className={`w-3.5 h-3.5 ${hasUnreadNews ? 'text-amber-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Bài Mới</span>
            {hasUnreadNews && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            )}
            {hasUnreadNews && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400" />
            )}
          </button>

          {/* Vim Mode Indicator */}
          <button
            onClick={() => setIsVimMode(!isVimMode)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-mono border transition-colors cursor-pointer ${
              isVimMode
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Bật/Tắt chế độ Vim"
          >
            <Keyboard className="w-3 h-3" />
            <span className="hidden sm:inline">Vim:</span>
            <span>{isVimMode ? 'ON' : 'OFF'}</span>
          </button>

          {/* Auto-saved badge */}
          <div className="hidden xl:flex items-center gap-1 text-[11px] text-emerald-400 font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 select-none" title="Tiến trình làm bài được tự động lưu liên tục (F5 không mất)">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>Tự lưu nháp</span>
          </div>

          {/* Reset Code */}
          <button
            onClick={() => {
              if (window.confirm('Khôi phục mã nguồn ban đầu của bài này? Toàn bộ sửa đổi nháp sẽ bị xóa.')) {
                clearSavedExerciseCode(currentLab.id)
                setCode(currentLab.scaffoldingCode)
              }
            }}
            className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Đặt lại code ban đầu (xóa bản nháp)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Solution */}
          <button
            onClick={() => setShowSolution(!showSolution)}
            className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            title={showSolution ? 'Ẩn lời giải' : 'Xem lời giải mẫu'}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Run Code */}
          {isVimMode && vimCurrentMode.includes('INSERT') ? (
            <button
              onClick={() => handleRunCode()}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border border-amber-600/50 text-xs font-mono font-medium cursor-pointer transition-all ring-1 ring-amber-500/30"
              title="Vim đang ở chế độ INSERT! Bấm phím [Esc] để quay lại NORMAL trước khi lưu và chạy."
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>INSERT (Bấm Esc)</span>
            </button>
          ) : (
            <button
              onClick={() => handleRunCode()}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium cursor-pointer transition-colors disabled:opacity-50"
              title="Biên dịch và chạy thử (Hoặc dùng :wq trong Vim NORMAL mode)"
            >
              <Play className="w-3 h-3 fill-current text-emerald-400" />
              <span className="hidden sm:inline">Chạy Thử</span>
            </button>
          )}

          {/* Submit */}
          {isVimMode && vimCurrentMode.includes('INSERT') ? (
            <button
              onClick={() => handleSubmitTests()}
              className="flex items-center gap-1.5 px-3.5 py-1 rounded-md bg-slate-900 text-slate-500 border border-slate-800 text-xs font-medium cursor-not-allowed opacity-60"
              title="Vim đang ở chế độ INSERT. Hãy bấm [Esc] trước khi nộp bài!"
            >
              <Send className="w-3 h-3" />
              <span>Nộp Bài</span>
            </button>
          ) : (
            <button
              onClick={handleSubmitTests}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-3.5 py-1 rounded-md bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold cursor-pointer transition-colors shadow-sm disabled:opacity-50"
              title="Chấm toàn bộ test case"
            >
              <Send className="w-3 h-3" />
              <span>Nộp Bài</span>
            </button>
          )}

          {/* Quick Guide Cheatsheet Button */}
          <button
            onClick={() => setIsQuickGuideOpen(true)}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-mono text-slate-300 hover:text-slate-100 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer ml-1"
            title="Cẩm nang 1 phút hướng dẫn sử dụng & Phím tắt Vim"
          >
            <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden md:inline">Hướng Dẫn</span>
          </button>
        </div>
      </header>

      {/* 2. Main Body Split: 42% Left (Problem Specs) | 58% Right (Vim & Console) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column (42% Width): Sạch sẽ, Markdown-driven reading */}
        <section className="w-[42%] shrink-0 border-r border-slate-800/80 bg-[#090d16] flex flex-col h-full overflow-hidden select-text">
          {/* Subheader Tab */}
          <div className="h-9 border-b border-slate-800/80 px-4 flex items-center justify-between text-xs font-medium select-none shrink-0 bg-[#0c111e]">
            <div className="flex items-center gap-4 h-full">
              <button
                onClick={() => setLeftTab('problem')}
                className={`h-full flex items-center border-b-2 transition-colors cursor-pointer ${
                  leftTab === 'problem'
                    ? 'border-sky-400 text-sky-400 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Mô Tả Bài Toán
              </button>
              <button
                onClick={() => setLeftTab('hints')}
                className={`h-full flex items-center gap-1 border-b-2 transition-colors cursor-pointer ${
                  leftTab === 'hints'
                    ? 'border-sky-400 text-sky-400 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Lightbulb className="w-3 h-3 text-amber-400" />
                <span>Gợi Ý &amp; Cạm Bẫy</span>
              </button>
            </div>

            {/* Level Badge */}
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${levelMeta.badgeColor}`}>
              Mức {currentLevel}
            </span>
          </div>

          {/* Reading Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-sm text-slate-300 leading-relaxed font-sans">
            {leftTab === 'problem' && (
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <h1 className="text-base font-bold text-slate-100">
                    {currentLab.title}
                  </h1>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-mono">
                    <span>Chủ đề: {currentLab.topic}</span>
                    <span>·</span>
                    <span>Tệp: {currentLab.defaultFileName}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {currentLab.description}
                </div>

                {/* I/O Specifications */}
                <div className="space-y-1.5 pt-2">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Định Dạng Đầu Vào &amp; Đầu Ra
                  </h2>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                    <li>
                      <strong className="text-slate-200">Đầu vào (stdin):</strong>{' '}
                      {currentLab.testCases[0]?.input ? `Đọc dữ liệu qua scanf: "${currentLab.testCases[0].input}"` : 'Không có input (Tham số hằng)'}
                    </li>
                    <li>
                      <strong className="text-slate-200">Đầu ra (stdout):</strong> In ra màn hình qua <code className="text-sky-300 font-mono">printf</code>
                    </li>
                  </ul>
                </div>

                {/* Sample Test Cases */}
                <div className="space-y-3 pt-2">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Ví Dụ Mẫu (Sample Cases)
                  </h2>
                  {currentLab.testCases.map((tc, idx) => (
                    <div key={idx} className="rounded-lg bg-[#0e1424] border border-slate-800 p-3 space-y-2 font-mono text-xs">
                      <div className="text-[11px] text-slate-400 font-sans font-semibold">
                        Ví dụ #{idx + 1}:
                      </div>
                      {tc.input && (
                        <div>
                          <div className="text-[10px] text-slate-500 font-sans">Input:</div>
                          <div className="text-amber-300 font-bold">{tc.input}</div>
                        </div>
                      )}
                      <div>
                        <div className="text-[10px] text-slate-500 font-sans">Output:</div>
                        <div className="text-emerald-400 whitespace-pre">{tc.expectedOutput}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pitfall Note */}
                {currentLab.pitfalls.length > 0 && (
                  <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 text-xs text-slate-300 space-y-1">
                    <span className="font-semibold text-amber-300 block">Lưu ý khi làm bài:</span>
                    <p className="text-[11px] text-slate-400">
                      {currentLab.pitfalls[0]}
                    </p>
                  </div>
                )}
              </div>
            )}

            {leftTab === 'hints' && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/20 space-y-2">
                  <span className="font-semibold text-amber-300 flex items-center gap-1.5 text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-400" /> Cạm Bẫy Sinh Viên Hay Gặp:
                  </span>
                  <ul className="list-disc list-inside text-slate-300 space-y-1 text-xs">
                    {currentLab.pitfalls.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                  <span className="font-semibold text-emerald-300 flex items-center gap-1.5 text-xs">
                    <Lightbulb className="w-4 h-4 text-emerald-400" /> Gợi Ý Tư Duy Thuật Toán:
                  </span>
                  <ul className="list-disc list-inside text-slate-300 space-y-1 text-xs">
                    {currentLab.hints.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>

                {currentLab.theoryExplanation && (
                  <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
                    <span className="font-semibold text-slate-200 text-xs block">Kiến Thức Cốt Lõi:</span>
                    <pre className="text-xs text-slate-400 whitespace-pre-wrap font-sans leading-relaxed">
                      {currentLab.theoryExplanation}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Right Column (58% Width): Code Editor Trên (~60%) & Console Dưới (~40%) */}
        <section className="w-[58%] flex flex-col h-full bg-[#080c14] overflow-hidden">
          {/* Top Half: Code Editor (~60% Height) */}
          <div className="h-[60%] flex flex-col border-b border-slate-800 overflow-hidden relative">
            <VimEditor
              key={`${currentLab.id}_${isVimMode ? 'vim' : 'std'}`}
              fileName={currentLab.defaultFileName}
              initialContent={showSolution ? currentLab.solutionCode : code}
              diagnostics={diagnostics}
              isVimEnabled={isVimMode}
              onModeChange={setVimCurrentMode}
              onContentChange={handleCodeChange}
              onSave={(savedContent) => {
                handleCodeChange(savedContent)
                handleRunCode()
              }}
            />
          </div>

          {/* Bottom Half: Console & Tests (~40% Height) - Chỉ 1 thanh bar mỏng 36px */}
          <div className="h-[40%] flex flex-col bg-[#070b12] overflow-hidden">
            {/* Console Single Header (h-9 / 36px) */}
            <div className="h-9 bg-[#0c111e] border-b border-slate-800 px-3 flex items-center justify-between text-xs select-none shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setBottomTab('tests')}
                  className={`h-full flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                    bottomTab === 'tests' 
                      ? 'border-sky-400 text-sky-400 font-semibold' 
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>Test Cases</span>
                  {testResults && (
                    <span className={`text-[10px] font-mono px-1 rounded ${
                      testResults.every(r => r.passed) ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {passedTestsCount}/{totalTestsCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setBottomTab('terminal')}
                  className={`h-full flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                    bottomTab === 'terminal' 
                      ? 'border-sky-400 text-sky-400 font-semibold' 
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <TerminalIcon className="w-3.5 h-3.5" />
                  <span>Terminal Linux</span>
                </button>

                {diagnostics.length > 0 && (
                  <button
                    onClick={() => setBottomTab('diagnostics')}
                    className={`h-full flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                      bottomTab === 'diagnostics' 
                        ? 'border-rose-400 text-rose-400 font-semibold' 
                        : 'border-transparent text-rose-400/80 hover:text-rose-300'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Lỗi GCC ({diagnostics.length})</span>
                  </button>
                )}
              </div>

              {bottomTab === 'terminal' && (
                <button
                  onClick={() => setTerminalLines([])}
                  className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Xóa màn hình"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Console Content */}
            <div className="flex-1 overflow-auto p-3 font-mono text-xs text-slate-200">
              {/* Tab Test Cases */}
              {bottomTab === 'tests' && (
                <div className="space-y-3 font-sans">
                  {/* Pills Switcher: Case 1 | Case 2 | + Custom Input */}
                  <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2">
                    {currentLab.testCases.map((tc, idx) => {
                      const res = testResults ? testResults.find(r => r.id === tc.id) : null
                      const isSelected = selectedTestCaseIndex === idx
                      return (
                        <button
                          key={tc.id}
                          onClick={() => setSelectedTestCaseIndex(idx)}
                          className={`px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1.5 border cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-slate-800 border-sky-500/40 text-slate-100 font-semibold'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {res ? (
                            <span className={`w-1.5 h-1.5 rounded-full ${res.passed ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                          )}
                          <span>Case {idx + 1}</span>
                        </button>
                      )
                    })}

                    <button
                      onClick={() => setSelectedTestCaseIndex('custom')}
                      className={`px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1 border cursor-pointer transition-colors ${
                        selectedTestCaseIndex === 'custom'
                          ? 'bg-slate-800 border-sky-500/40 text-sky-300 font-semibold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Plus className="w-3 h-3" />
                      <span>Custom Input</span>
                    </button>
                  </div>

                  {/* Content of Selected Case */}
                  {selectedTestCaseIndex === 'custom' ? (
                    <div className="space-y-2 font-mono text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 font-sans">Nhập dữ liệu test biên tùy ý (stdin):</span>
                        <button
                          onClick={() => handleRunCode(customInputValue)}
                          disabled={isRunning}
                          className="px-2 py-0.5 rounded bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 text-xs font-medium cursor-pointer"
                        >
                          Chạy với Input này
                        </button>
                      </div>
                      <textarea
                        value={customInputValue}
                        onChange={(e) => setCustomInputValue(e.target.value)}
                        placeholder="Ví dụ: -10, 0, 9999..."
                        rows={2}
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-100 outline-none focus:border-sky-500/80 resize-none"
                      />
                      {customOutput && (
                        <div className="p-2 rounded bg-slate-950 border border-slate-800 space-y-1">
                          <span className="text-[10px] text-slate-500 font-sans">Output thực tế:</span>
                          <div className="text-emerald-400 whitespace-pre">{customOutput.stdout || '(Không có stdout)'}</div>
                          {customOutput.stderr && <div className="text-rose-400 text-[11px]">{customOutput.stderr}</div>}
                        </div>
                      )}
                    </div>
                  ) : (
                    (() => {
                      const tc = currentLab.testCases[selectedTestCaseIndex as number]
                      const res = testResults ? testResults.find(r => r.id === tc?.id) : null
                      if (!tc) return null

                      return (
                        <div className="space-y-2 text-xs font-mono">
                          {tc.input && (
                            <div className="space-y-0.5">
                              <span className="text-[10px] text-slate-500 font-sans">Input:</span>
                              <div className="p-2 rounded bg-slate-950 border border-slate-800 text-amber-300">{tc.input}</div>
                            </div>
                          )}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="space-y-0.5">
                              <span className="text-[10px] text-slate-500 font-sans">Output Kỳ Vọng:</span>
                              <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300 whitespace-pre">{tc.expectedOutput}</div>
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[10px] text-slate-500 font-sans">Output Của Bạn:</span>
                              <div className={`p-2 rounded bg-slate-950 border whitespace-pre ${
                                !res ? 'border-slate-800 text-slate-500' : res.passed ? 'border-emerald-500/30 text-emerald-400' : 'border-rose-500/30 text-rose-400 font-bold'
                              }`}>
                                {res ? (res.actual || '(Rỗng)') : '(Chưa chạy test - Bấm "Nộp Bài")'}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })()
                  )}
                </div>
              )}

              {/* Tab Terminal */}
              {bottomTab === 'terminal' && (
                <div className="h-full flex flex-col justify-between space-y-2">
                  <div className="flex-1 overflow-auto space-y-1 font-mono text-[11px] leading-relaxed text-slate-200">
                    {terminalLines.map((line, idx) => (
                      <div
                        key={idx}
                        className={`${
                          line.startsWith('student@syslearn')
                            ? 'text-sky-400 font-bold'
                            : line.includes('warning:')
                            ? 'text-amber-400'
                            : line.includes('error:') || line.startsWith('bash:') || line.startsWith('cat:') || line.includes('compilation terminated')
                            ? 'text-rose-400'
                            : line.startsWith('[stdin') || line.startsWith('[Đang chạy') || line.startsWith('Nhập giá trị')
                            ? 'text-amber-300 font-semibold'
                            : line.includes('-rwxr-xr-x') || line.endsWith('*')
                            ? 'text-emerald-400 font-semibold'
                            : line.startsWith('[Tiến trình') || line.startsWith('[Exit')
                            ? 'text-emerald-400/90'
                            : 'text-slate-300'
                        }`}
                      >
                        {line}
                      </div>
                    ))}
                    <div ref={terminalEndRef} />
                  </div>

                  {/* Single Clean Linux Bash Prompt */}
                  <div className="pt-2 border-t border-slate-800/80 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono shrink-0 select-none ${
                        awaitingStdin ? 'text-amber-400 font-bold' : 'text-emerald-400 font-semibold'
                      }`}>
                        {awaitingStdin ? '[stdin] >' : promptStr}
                      </span>
                      <input
                        ref={terminalInputRef}
                        type="text"
                        value={terminalCmdInput}
                        onChange={(e) => setTerminalCmdInput(e.target.value)}
                        onKeyDown={handleTerminalKeyDown}
                        placeholder={
                          awaitingStdin 
                            ? 'Nhập dữ liệu stdin cho scanf rồi bấm Enter...' 
                            : 'Gõ lệnh bash (pwd, ls -la, gcc, ./solution, cat, clear)...'
                        }
                        className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-100 text-xs outline-none focus:border-emerald-500/80 font-mono shadow-inner"
                        autoFocus
                      />
                      <button
                        onClick={() => handleExecuteTerminalCommand(terminalCmdInput)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer transition-colors"
                        title="Thực thi lệnh (Enter)"
                      >
                        <CornerDownLeft className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Diagnostics */}
              {bottomTab === 'diagnostics' && (
                <div className="space-y-2 font-sans">
                  {diagnostics.length === 0 ? (
                    <div className="p-4 text-center text-slate-500 text-xs">
                      Không phát hiện lỗi cạm bẫy nào trong mã nguồn.
                    </div>
                  ) : (
                    diagnostics.map((diag) => (
                      <div
                        key={diag.id}
                        className="p-3 rounded-lg border bg-rose-500/5 border-rose-500/20 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-rose-300 font-semibold">
                          <span>{diag.title}</span>
                          <span className="font-mono text-[10px] text-slate-400">Dòng {diag.line}</span>
                        </div>
                        <div className="text-[11px] text-slate-300">
                          {diag.systemExplanation}
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] text-emerald-300">💡 {diag.suggestedFix}</span>
                          {diag.correctedCodeSnippet && (
                            <button
                              onClick={() => handleApplyFix(diag)}
                              className="px-2 py-0.5 rounded bg-sky-500/15 text-sky-300 border border-sky-500/30 text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <Wand2 className="w-3 h-3" /> Sửa
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* 3. History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        historyItems={historyItems}
        onSelectExercise={(labId) => {
          setHistoryStack(prev => [...prev, labId])
          setHistoryIndex(prev => prev + 1)
          onSelectLab(labId)
        }}
        onClearHistory={() => {
          localStorage.removeItem('syslearn_exercise_history')
          setHistoryItems([])
        }}
      />

      {/* 4. Update Announcement Modal (Broadcast for all clients) */}
      <AnnouncementModal
        isOpen={isAnnouncementOpen}
        onClose={() => {
          setIsAnnouncementOpen(false)
          setHasUnreadNews(false)
        }}
        onSelectExercise={(labId) => {
          setHistoryStack(prev => [...prev, labId])
          setHistoryIndex(prev => prev + 1)
          onSelectLab(labId)
        }}
      />

      {/* 5. Quick Guide Cheatsheet Modal */}
      <QuickGuideModal
        isOpen={isQuickGuideOpen}
        onClose={() => setIsQuickGuideOpen(false)}
      />

      {/* 6. 3-Hour Rate-Limited Periodic Guide Toast (non-intrusive) */}
      <PeriodicGuideToast />
    </div>
  )
}
