import React, { useEffect, useRef, useState } from 'react'
import { EditorView, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, rectangularSelection, highlightActiveLine } from '@codemirror/view'
import { EditorState, Extension } from '@codemirror/state'
import { foldGutter, indentOnInput, syntaxHighlighting, defaultHighlightStyle, bracketMatching } from '@codemirror/language'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search'
import { cpp } from '@codemirror/lang-cpp'
import { oneDark } from '@codemirror/theme-one-dark'
import { vim, Vim, getCM } from '@replit/codemirror-vim'
import { DiagnosticIssue } from '../../types/cEngine'
import { Save, AlertTriangle, Keyboard } from 'lucide-react'

interface VimEditorProps {
  initialContent?: string
  fileName?: string
  onSave?: (content: string) => void
  onExit?: () => void
  allowedKeysHint?: string[]
  onContentChange?: (content: string) => void
  diagnostics?: DiagnosticIssue[]
  isVimEnabled?: boolean
  onModeChange?: (mode: string) => void
}

export const VimEditor: React.FC<VimEditorProps> = ({
  initialContent = '',
  fileName = 'solution.c',
  onSave,
  onExit,
  onContentChange,
  diagnostics = [],
  isVimEnabled = true,
  onModeChange,
}) => {
  const editorContainerRef = useRef<HTMLDivElement>(null)
  const editorViewRef = useRef<EditorView | null>(null)
  
  const onSaveRef = useRef(onSave)
  onSaveRef.current = onSave

  const onExitRef = useRef(onExit)
  onExitRef.current = onExit

  const onContentChangeRef = useRef(onContentChange)
  onContentChangeRef.current = onContentChange

  const onModeChangeRef = useRef(onModeChange)
  onModeChangeRef.current = onModeChange

  const [vimMode, setVimMode] = useState<string>('NORMAL')
  const [cursorPos, setCursorPos] = useState<{ line: number; col: number }>({ line: 1, col: 1 })
  const [statusMsg, setStatusMsg] = useState<string>('')

  // Define global Ex commands once
  useEffect(() => {
    try {
      Vim.defineEx('write', 'w', () => {
        onSaveRef.current?.(editorViewRef.current?.state.doc.toString() || '')
        setStatusMsg('"written"')
      })
      Vim.defineEx('wq', 'wq', () => {
        onSaveRef.current?.(editorViewRef.current?.state.doc.toString() || '')
        setStatusMsg('"saved & running gcc"')
      })
      Vim.defineEx('x', 'x', () => {
        onSaveRef.current?.(editorViewRef.current?.state.doc.toString() || '')
        setStatusMsg('"saved & running gcc"')
      })
      Vim.defineEx('quit', 'q', () => {
        onExitRef.current?.()
      })
      Vim.defineEx('q!', 'q!', () => {
        onExitRef.current?.()
      })
    } catch {
      // already registered
    }
  }, [])

  // Initialize CodeMirror 6 with Replit Vim & C++ language pack
  useEffect(() => {
    if (!editorContainerRef.current) return

    const customTheme = EditorView.theme({
      '&': {
        height: '100%',
        backgroundColor: '#080c14',
        color: '#e2e8f0',
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Menlo, Monaco, Consolas, monospace",
        fontSize: '13px',
      },
      '.cm-scroller': {
        overflow: 'auto',
        fontFamily: 'inherit',
      },
      '.cm-content': {
        padding: '10px 0',
        caretColor: '#38bdf8',
      },
      '.cm-line': {
        padding: '0 12px',
        lineHeight: '1.65',
      },
      '.cm-cursor, .cm-dropCursor': {
        borderLeftColor: '#38bdf8',
        borderLeftWidth: '2px',
      },
      '.cm-fat-cursor': {
        backgroundColor: '#38bdf8 !important',
        color: '#090d16 !important',
      },
      '&:focus-within .cm-fat-cursor': {
        backgroundColor: '#38bdf8 !important',
        color: '#090d16 !important',
      },
      '.cm-activeLine': {
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
      },
      '.cm-gutters': {
        backgroundColor: '#070b12',
        color: '#475569',
        borderRight: '1px solid #1e293b',
        paddingRight: '4px',
        userSelect: 'none',
      },
      '.cm-activeLineGutter': {
        backgroundColor: 'transparent',
        color: '#38bdf8',
        fontWeight: 'bold',
      },
      '.cm-selectionBackground, ::selection': {
        backgroundColor: 'rgba(56, 189, 248, 0.22) !important',
      },
      '.cm-vim-panel': {
        padding: '2px 8px',
        backgroundColor: '#0a0e1a',
        color: '#38bdf8',
        fontFamily: 'monospace',
        borderTop: '1px solid #1e293b',
      },
      '.cm-vim-panel input': {
        color: '#f8fafc',
        backgroundColor: 'transparent',
        outline: 'none',
      },
    }, { dark: true })

    const extensions: Extension[] = [
      lineNumbers(),
      highlightActiveLineGutter(),
      highlightSpecialChars(),
      history(),
      foldGutter(),
      drawSelection(),
      dropCursor(),
      EditorState.allowMultipleSelections.of(true),
      indentOnInput(),
      bracketMatching(),
      rectangularSelection(),
      highlightActiveLine(),
      highlightSelectionMatches(),
      cpp(),
      oneDark,
      customTheme,
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const docString = update.state.doc.toString()
          onContentChangeRef.current?.(docString)
        }
        if (update.selectionSet || update.docChanged) {
          const head = update.state.selection.main.head
          const lineObj = update.state.doc.lineAt(head)
          setCursorPos({
            line: lineObj.number,
            col: head - lineObj.from + 1,
          })
        }
      }),
    ]

    if (isVimEnabled) {
      extensions.unshift(vim())
    }

    const state = EditorState.create({
      doc: initialContent,
      extensions,
    })

    const view = new EditorView({
      state,
      parent: editorContainerRef.current,
    })

    editorViewRef.current = view

    // Listen to Vim mode changes via CM wrapper
    if (isVimEnabled) {
      try {
        const cm = getCM(view)
        if (cm && typeof cm.on === 'function') {
          cm.on('vim-mode-change', (data: { mode: string; subMode?: string }) => {
            const m = (data.mode || 'normal').toUpperCase()
            const sub = data.subMode ? ` ${data.subMode.toUpperCase()}` : ''
            const fullMode = `${m}${sub}`
            setVimMode(fullMode)
            onModeChangeRef.current?.(fullMode)
            setStatusMsg('')
          })
        }
      } catch (err) {
        console.warn('Vim mode listener attachment warning:', err)
      }
    }

    onModeChangeRef.current?.('NORMAL')
    view.focus()

    return () => {
      view.destroy()
      editorViewRef.current = null
    }
  }, [isVimEnabled])

  // Sync content externally when exercise changes
  useEffect(() => {
    if (editorViewRef.current) {
      const currentDoc = editorViewRef.current.state.doc.toString()
      if (initialContent !== currentDoc) {
        editorViewRef.current.dispatch({
          changes: { from: 0, to: currentDoc.length, insert: initialContent },
        })
      }
    }
  }, [initialContent])

  // Helpers for quick button triggers
  const handleQuickKey = (key: string) => {
    if (!editorViewRef.current) return
    editorViewRef.current.focus()
    try {
      const cm = getCM(editorViewRef.current)
      if (cm) {
        if (key === '<Esc>') {
          Vim.exitInsertMode(cm as any)
          Vim.exitVisualMode(cm as any)
          setVimMode('NORMAL')
          onModeChangeRef.current?.('NORMAL')
          setStatusMsg('')
          return
        }
        Vim.handleKey(cm as any, key, 'mapping')
      }
    } catch {
      // fallback
    }
  }

  const handleQuickWq = () => {
    if (!editorViewRef.current) return
    if (vimMode.includes('INSERT')) {
      setStatusMsg('E37: Đang ở INSERT mode! Hãy bấm [Esc] về NORMAL trước.')
      return
    }
    const content = editorViewRef.current.state.doc.toString()
    onSaveRef.current?.(content)
  }

  return (
    <div className="flex flex-col h-full bg-[#080c14] overflow-hidden select-none">
      {/* Sleek Minimalist Editor Bar */}
      <div className="h-9 px-3 bg-[#0c111e] border-b border-slate-800 flex items-center justify-between text-xs font-mono select-none shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="text-slate-200 font-medium">{fileName}</span>
          {isVimEnabled && (
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                vimMode.includes('INSERT')
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 animate-pulse'
                  : vimMode.includes('VISUAL')
                  ? 'bg-purple-500/15 text-purple-300 border-purple-500/40'
                  : 'bg-sky-500/15 text-sky-300 border-sky-500/40'
              }`}
            >
              -- {vimMode} --
            </span>
          )}
          {diagnostics.length > 0 && (
            <span className="text-rose-400 text-[10px] flex items-center gap-1 font-sans">
              <AlertTriangle className="w-3 h-3" />
              {diagnostics.length} cảnh báo/lỗi
            </span>
          )}
        </div>

        {/* Essential Vim Quick Keys */}
        <div className="flex items-center gap-1 text-[11px]">
          <button
            onClick={() => handleQuickKey('i')}
            className={`px-2 py-0.5 rounded border transition-colors cursor-pointer ${
              vimMode.includes('INSERT')
                ? 'bg-amber-500/25 text-amber-300 border-amber-500/50 font-bold'
                : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-slate-800'
            }`}
            title="Chế độ Insert gõ code tự do [i]"
          >
            i
          </button>
          <button
            onClick={() => handleQuickKey('<Esc>')}
            className={`px-2 py-0.5 rounded border transition-all cursor-pointer ${
              vimMode.includes('INSERT')
                ? 'bg-amber-500/25 text-amber-200 border-amber-400 font-bold ring-2 ring-amber-400/40 animate-pulse'
                : vimMode === 'NORMAL'
                ? 'bg-sky-500/25 text-sky-300 border-sky-500/50 font-bold'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
            title="Quay về chế độ Normal [Esc] để lưu và chạy thử"
          >
            Esc
          </button>
          <button
            onClick={() => handleQuickKey('u')}
            className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-purple-300 border border-slate-800 cursor-pointer"
            title="Undo hoàn tác [u]"
          >
            u
          </button>
          <button
            onClick={() => {
              handleQuickKey('d')
              handleQuickKey('d')
            }}
            className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-rose-300 border border-slate-800 cursor-pointer"
            title="Xóa dòng hiện tại [dd]"
          >
            dd
          </button>
          <button
            onClick={handleQuickWq}
            disabled={vimMode.includes('INSERT')}
            className={`px-2.5 py-0.5 rounded border font-bold transition-colors ${
              vimMode.includes('INSERT')
                ? 'bg-slate-900/40 text-slate-600 border-slate-800/40 cursor-not-allowed opacity-50'
                : 'bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border-sky-500/30 cursor-pointer'
            }`}
            title={vimMode.includes('INSERT') ? 'Vim đang ở INSERT mode: Hãy bấm [Esc] về NORMAL trước khi dùng :wq' : 'Lưu file và biên dịch gcc [:wq]'}
          >
            <Save className="w-3 h-3 inline mr-1" />:wq
          </button>
        </div>
      </div>

      {/* CodeMirror 6 Viewport */}
      <div 
        ref={editorContainerRef} 
        className="flex-1 overflow-hidden relative cursor-text text-sm select-text"
        onClick={() => editorViewRef.current?.focus()}
      />

      {/* Real Vim Statusline */}
      <div className="h-6 px-3 bg-[#0a0e1a] border-t border-slate-800 flex items-center justify-between text-[11px] font-mono select-none shrink-0 text-slate-400">
        <div className="flex items-center gap-3">
          <span className={vimMode.includes('INSERT') ? 'text-amber-400 font-bold' : 'text-sky-400 font-semibold'}>
            -- {vimMode} --
          </span>
          {statusMsg && (
            <span className="text-emerald-400 font-mono">{statusMsg}</span>
          )}
        </div>

        <div className="flex items-center gap-4 text-slate-500 text-[10px]">
          <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
          <span>UTF-8</span>
          <span>C/C++ (GCC)</span>
        </div>
      </div>
    </div>
  )
}
