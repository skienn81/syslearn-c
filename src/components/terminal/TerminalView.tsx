import React, { useState, useRef, useEffect } from 'react'
import { VirtualFileSystem } from '../../core/vfs/VirtualFileSystem'
import { TerminalHistoryItem } from '../../types/vfs'
import { runCCode } from '../../core/c-sandbox/cInterpreter'
import { Terminal as TerminalIcon, CornerDownLeft, Play, AlertCircle } from 'lucide-react'

interface TerminalViewProps {
  vfs: VirtualFileSystem
  onOpenVim?: (fileName: string, content: string) => void
  onDiagnosticTriggered?: (code: string) => void
}

export const TerminalView: React.FC<TerminalViewProps> = ({
  vfs,
  onOpenVim,
  onDiagnosticTriggered,
}) => {
  const [history, setHistory] = useState<TerminalHistoryItem[]>([
    {
      id: 'welcome_1',
      output: `Linux syslearn 5.15.0-generic #1 SMP x86_64 GNU/Linux
Chào mừng bạn đến với Linux Terminal Simulator (LTHT Studio)!
Gõ 'help' để xem danh sách các lệnh hỗ trợ.
Gõ 'gcc <file.c> -o <ten>' để biên dịch và './<ten>' để chạy.`,
      isSystem: true,
      cwd: '/home/student/lab2',
      timestamp: Date.now(),
    },
  ])

  const [inputVal, setInputVal] = useState('')
  const [historyIndex, setHistoryIndex] = useState<number>(-1)
  const [commandHistoryList, setCommandHistoryList] = useState<string[]>([])
  const [awaitingStdin, setAwaitingStdin] = useState<{ binaryName: string; sourceCode: string } | null>(null)

  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, awaitingStdin])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const val = inputVal
      setInputVal('')

      if (awaitingStdin) {
        // Handle interactive stdin input for running program
        handleStdinInput(val)
        return
      }

      executeCommand(val)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistoryList.length > 0) {
        const nextIdx = historyIndex + 1
        if (nextIdx < commandHistoryList.length) {
          setHistoryIndex(nextIdx)
          setInputVal(commandHistoryList[commandHistoryList.length - 1 - nextIdx])
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1
        setHistoryIndex(nextIdx)
        setInputVal(commandHistoryList[commandHistoryList.length - 1 - nextIdx])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInputVal('')
      }
    }
  }

  const handleStdinInput = (stdinData: string) => {
    if (!awaitingStdin) return

    const { binaryName, sourceCode } = awaitingStdin
    setAwaitingStdin(null)

    // Append user input to terminal
    const inputItem: TerminalHistoryItem = {
      id: 'hist_' + Date.now(),
      output: `[Nhập stdin]: ${stdinData}`,
      cwd: vfs.getCurrentPath(),
      timestamp: Date.now(),
    }

    // Run program with stdin
    const execResult = runCCode(sourceCode, stdinData)

    let runOutput = ''
    if (execResult.stdout) {
      runOutput += execResult.stdout
    }
    if (execResult.stderr) {
      runOutput += `\n${execResult.stderr}`
    }
    runOutput += `\n\n[Tiến trình '${binaryName}' kết thúc với mã trả về exit code: ${execResult.exitCode}]`

    const resultItem: TerminalHistoryItem = {
      id: 'hist_' + (Date.now() + 1),
      output: runOutput,
      cwd: vfs.getCurrentPath(),
      timestamp: Date.now(),
    }

    setHistory(prev => [...prev, inputItem, resultItem])
    if (onDiagnosticTriggered && execResult.diagnostics.length > 0) {
      onDiagnosticTriggered(sourceCode)
    }
  }

  const executeCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim()
    if (!trimmed) {
      setHistory(prev => [
        ...prev,
        {
          id: 'hist_' + Date.now(),
          command: '',
          cwd: vfs.getCurrentPath(),
          timestamp: Date.now(),
        },
      ])
      return
    }

    // Add to command history
    setCommandHistoryList(prev => [...prev, trimmed])
    setHistoryIndex(-1)

    const parts = trimmed.split(/\s+/)
    const cmd = parts[0]
    const args = parts.slice(1)
    const currentCwd = vfs.getCurrentPath()

    let output = ''
    let isError = false

    switch (cmd) {
      case 'clear':
        setHistory([])
        return

      case 'pwd':
        output = currentCwd
        break

      case 'cd': {
        const target = args[0] || '~'
        const res = vfs.changeDirectory(target)
        if (!res.success) {
          output = res.error || 'cd: error'
          isError = true
        }
        break
      }

      case 'ls': {
        const target = args.find(a => !a.startsWith('-'))
        const list = vfs.listDirectory(target)
        if (typeof list === 'string') {
          output = list
          isError = true
        } else {
          output = list
            .map(item => {
              const prefix = item.type === 'dir' ? 'd rwxr-xr-x' : '- rw-r--r--'
              const colorCode = item.type === 'dir' ? '📁 ' : item.name.endsWith('.c') ? '📄 ' : '⚙️ '
              return `${prefix}  ${item.size.toString().padStart(6, ' ')}  ${colorCode}${item.name}`
            })
            .join('\n')
        }
        break
      }

      case 'cat': {
        if (!args[0]) {
          output = 'cat: missing file operand'
          isError = true
        } else {
          const res = vfs.readFile(args[0])
          if (!res.success) {
            output = res.error || 'cat: file not found'
            isError = true
          } else {
            output = res.content || ''
          }
        }
        break
      }

      case 'mkdir': {
        if (!args[0]) {
          output = 'mkdir: missing operand'
          isError = true
        } else {
          const res = vfs.makeDirectory(args[0])
          if (!res.success) {
            output = res.error || 'mkdir: error'
            isError = true
          }
        }
        break
      }

      case 'touch': {
        if (!args[0]) {
          output = 'touch: missing file operand'
          isError = true
        } else {
          vfs.writeFile(args[0], '')
        }
        break
      }

      case 'rm': {
        if (!args[0]) {
          output = 'rm: missing operand'
          isError = true
        } else {
          const res = vfs.removeNode(args[0])
          if (!res.success) {
            output = res.error || 'rm: error'
            isError = true
          }
        }
        break
      }

      case 'vim':
      case 'vi': {
        const fileName = args[0] || 'untilted.c'
        const fileRes = vfs.readFile(fileName)
        const initialContent = fileRes.success ? fileRes.content || '' : ''
        if (onOpenVim) {
          onOpenVim(fileName, initialContent)
          output = `Đang mở trình soạn thảo Vim cho [${fileName}]...`
        } else {
          output = `Vim đã mở [${fileName}].`
        }
        break
      }

      case 'gcc': {
        // e.g. gcc bai01_io.c -o bai01
        if (args.length === 0) {
          output = 'gcc: fatal error: no input files\ncompilation terminated.'
          isError = true
          break
        }
        const sourceFile = args[0]
        const fileRes = vfs.readFile(sourceFile)
        if (!fileRes.success) {
          output = `gcc: error: ${sourceFile}: No such file or directory\ngcc: fatal error: no input files\ncompilation terminated.`
          isError = true
          break
        }

        const outIdx = args.indexOf('-o')
        const binName = outIdx !== -1 && args[outIdx + 1] ? args[outIdx + 1] : 'a.out'

        const sourceCode = fileRes.content || ''
        const execCheck = runCCode(sourceCode, '')

        if (execCheck.exitCode !== 0 && execCheck.stderr) {
          output = `gcc: compilation failed:\n${execCheck.stderr}`
          isError = true
        } else {
          // Store compiled virtual binary
          vfs.writeFile(binName, `/* BINARY_EXEC */\n${sourceCode}`)
          output = `Biên dịch thành công: [${sourceFile}] -> [${binName}] (ELF 64-bit LSB executable, x86-64)`
          if (execCheck.diagnostics.length > 0 && onDiagnosticTriggered) {
            onDiagnosticTriggered(sourceCode)
          }
        }
        break
      }

      case 'help':
        output = `=== DANH SÁCH LỆNH LINUX SHELL ===
- pwd                  : In thư mục làm việc hiện tại
- cd <duong_dan>       : Chuyển thư mục (vd: cd .., cd ~, cd lab2)
- ls [-la]             : Liệt kê các tệp tin và thư mục
- cat <file>           : Xem nội dung tệp tin
- vim <file.c>         : Soạn thảo code bằng Vim
- gcc <file.c> -o <bin>: Biên dịch mã nguồn C
- ./<bin>              : Thực thi chương trình (hỗ trợ nhập scanf)
- mkdir <ten_thu_muc>  : Tạo thư mục mới
- touch <ten_file>     : Tạo tệp tin rỗng
- rm <ten_file>        : Xóa tệp tin
- clear                : Xóa màn hình terminal`
        break

      default: {
        // Check if executing a local binary like ./bai01 or ./a.out
        if (cmd.startsWith('./')) {
          const binName = cmd.replace('./', '')
          const binFile = vfs.readFile(binName)
          if (!binFile.success) {
            output = `bash: ${cmd}: No such file or directory`
            isError = true
          } else {
            let srcCode = binFile.content || ''
            if (srcCode.startsWith('/* BINARY_EXEC */')) {
              srcCode = srcCode.replace('/* BINARY_EXEC */\n', '')
            }

            // Check if source code has scanf
            if (srcCode.includes('scanf')) {
              setAwaitingStdin({ binaryName: binName, sourceCode: srcCode })
              output = `Đang chạy [${cmd}]...\nChương trình đang yêu cầu dữ liệu từ bàn phím (scanf). Hãy nhập giá trị bên dưới và ấn [Enter]:`
            } else {
              const execResult = runCCode(srcCode, '')
              output = execResult.stdout
              if (execResult.stderr) {
                output += (output ? '\n' : '') + execResult.stderr
              }
              output += `\n[Tiến trình kết thúc với exit code: ${execResult.exitCode}]`
              if (onDiagnosticTriggered && execResult.diagnostics.length > 0) {
                onDiagnosticTriggered(srcCode)
              }
            }
          }
        } else {
          output = `bash: ${cmd}: command not found. Gõ 'help' để xem danh sách lệnh.`
          isError = true
        }
      }
    }

    setHistory(prev => [
      ...prev,
      {
        id: 'hist_' + Date.now(),
        command: rawCmd,
        output,
        isError,
        cwd: currentCwd,
        timestamp: Date.now(),
      },
    ])
  }

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="flex flex-col h-full bg-[#070b12] rounded-xl border border-slate-800 overflow-hidden font-mono shadow-2xl"
    >
      {/* Terminal Title Bar */}
      <div className="px-3 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-slate-400 font-semibold flex items-center gap-1.5 ml-2">
            <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
            student@syslearn: {vfs.getCurrentPath()}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <span>bash 5.1</span>
          <span>x86_64</span>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div className="flex-1 overflow-auto p-4 space-y-2 text-xs sm:text-sm text-slate-300">
        {history.map(item => (
          <div key={item.id} className="space-y-1">
            {item.command !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">student@syslearn</span>
                <span className="text-slate-500">:</span>
                <span className="text-cyan-400">{item.cwd}</span>
                <span className="text-slate-300">$</span>
                <span className="text-slate-100 font-medium">{item.command}</span>
              </div>
            )}
            {item.output && (
              <pre className={`whitespace-pre-wrap font-mono leading-relaxed pl-2 ${
                item.isError
                  ? 'text-rose-400 border-l-2 border-rose-500/40'
                  : item.isSystem
                  ? 'text-cyan-300/90 border-l-2 border-cyan-500/40'
                  : 'text-slate-300'
              }`}>
                {item.output}
              </pre>
            )}
          </div>
        ))}

        {/* Stdin Awaiting Indicator */}
        {awaitingStdin && (
          <div className="flex items-center gap-2 text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/30 text-xs">
            <AlertCircle className="w-4 h-4 animate-spin text-amber-400" />
            <span>Đang chờ nhập dữ liệu (scanf)... Nhập giá trị và nhấn Enter:</span>
          </div>
        )}

        {/* Active Command Input Line */}
        <div className="flex items-center gap-2 pt-1">
          {awaitingStdin ? (
            <span className="text-amber-400 font-bold text-xs">[stdin] &gt;</span>
          ) : (
            <>
              <span className="text-emerald-400 font-bold">student@syslearn</span>
              <span className="text-slate-500">:</span>
              <span className="text-cyan-400">{vfs.getCurrentPath()}</span>
              <span className="text-slate-300">$</span>
            </>
          )}

          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="flex-1 bg-transparent text-slate-100 outline-none font-mono text-xs sm:text-sm caret-cyan-400"
            placeholder={awaitingStdin ? 'Ví dụ: 20' : ''}
          />
        </div>
        <div ref={endRef} />
      </div>
    </div>
  )
}
