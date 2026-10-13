import { VimMode, VimState } from '../../types/vim'

export class VimEngine {
  private lines: string[]
  private state: VimState
  private pendingOperator: string = ''
  private onSaveCallback?: (content: string) => void
  private onQuitCallback?: (force: boolean) => void

  constructor(initialText: string = '') {
    this.lines = initialText ? initialText.split('\n') : ['']
    this.state = {
      mode: 'NORMAL',
      cursor: { row: 0, col: 0 },
      commandBuffer: '',
      statusMessage: '-- NORMAL -- Gõ [i] để sửa code, [Esc] về Normal, [:wq] để lưu và chạy',
      lastKeys: [],
      yankBuffer: '',
      undoStack: [initialText],
      redoStack: [],
    }
  }

  public setCallbacks(onSave?: (content: string) => void, onQuit?: (force: boolean) => void) {
    this.onSaveCallback = onSave
    this.onQuitCallback = onQuit
  }

  public setText(text: string) {
    this.lines = text ? text.split('\n') : ['']
    this.clampCursor()
    this.state.undoStack = [text]
    this.state.redoStack = []
  }

  public getText(): string {
    return this.lines.join('\n')
  }

  public getLines(): string[] {
    return [...this.lines]
  }

  public getState(): VimState {
    return { ...this.state, lastKeys: [...this.state.lastKeys] }
  }

  public setCursor(row: number, col: number) {
    this.state.cursor.row = Math.max(0, Math.min(this.lines.length - 1, row))
    const line = this.lines[this.state.cursor.row] || ''
    const maxCol = this.state.mode === 'INSERT' ? line.length : Math.max(0, line.length - 1)
    this.state.cursor.col = Math.max(0, Math.min(maxCol, col))
  }

  public setMode(mode: VimMode) {
    this.state.mode = mode
    if (mode === 'INSERT') {
      this.state.statusMessage = '-- INSERT --'
    } else if (mode === 'NORMAL') {
      this.state.statusMessage = '-- NORMAL --'
    } else if (mode === 'COMMAND') {
      this.state.commandBuffer = ':'
    }
    this.clampCursor()
  }

  private recordUndo() {
    this.state.undoStack.push(this.getText())
    if (this.state.undoStack.length > 80) this.state.undoStack.shift()
    this.state.redoStack = []
  }

  private pushKey(key: string) {
    this.state.lastKeys.push(key)
    if (this.state.lastKeys.length > 8) {
      this.state.lastKeys.shift()
    }
  }

  public insertTextAtCursor(text: string) {
    this.recordUndo()
    const { row, col } = this.state.cursor
    const currLine = this.lines[row] || ''
    
    if (!text.includes('\n')) {
      this.lines[row] = currLine.slice(0, col) + text + currLine.slice(col)
      this.state.cursor.col += text.length
    } else {
      const parts = text.split('\n')
      const before = currLine.slice(0, col)
      const after = currLine.slice(col)
      
      this.lines[row] = before + parts[0]
      for (let i = 1; i < parts.length - 1; i++) {
        this.lines.splice(row + i, 0, parts[i])
      }
      const lastLineIdx = row + parts.length - 1
      this.lines.splice(lastLineIdx, 0, parts[parts.length - 1] + after)
      
      this.state.cursor.row = lastLineIdx
      this.state.cursor.col = parts[parts.length - 1].length
    }
  }

  public handleKeyDown(e: KeyboardEvent): { handled: boolean; commandExecuted?: string } {
    const key = e.key
    this.pushKey(key)

    // Handle Escape anywhere -> return to NORMAL mode
    if (key === 'Escape') {
      this.state.mode = 'NORMAL'
      this.state.commandBuffer = ''
      this.pendingOperator = ''
      this.state.statusMessage = '-- NORMAL --'
      this.clampCursor()
      return { handled: true }
    }

    // =========================================================
    // 1. COMMAND MODE (:w, :wq, :q, :q!, :12)
    // =========================================================
    if (this.state.mode === 'COMMAND') {
      if (key === 'Enter') {
        const cmd = this.state.commandBuffer.trim()
        const result = this.executeCommand(cmd)
        this.state.mode = 'NORMAL'
        this.state.commandBuffer = ''
        return { handled: true, commandExecuted: cmd, ...result }
      } else if (key === 'Backspace') {
        this.state.commandBuffer = this.state.commandBuffer.slice(0, -1)
        if (!this.state.commandBuffer) {
          this.state.mode = 'NORMAL'
          this.state.statusMessage = '-- NORMAL --'
        }
        return { handled: true }
      } else if (key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        this.state.commandBuffer += key
        return { handled: true }
      }
      return { handled: true }
    }

    // =========================================================
    // 2. INSERT MODE (Free typing, Arrow keys, Delete, Tab)
    // =========================================================
    if (this.state.mode === 'INSERT') {
      // Arrow navigation in INSERT mode
      if (key === 'ArrowLeft') {
        this.state.cursor.col = Math.max(0, this.state.cursor.col - 1)
        return { handled: true }
      }
      if (key === 'ArrowRight') {
        const currLine = this.lines[this.state.cursor.row] || ''
        this.state.cursor.col = Math.min(currLine.length, this.state.cursor.col + 1)
        return { handled: true }
      }
      if (key === 'ArrowUp') {
        if (this.state.cursor.row > 0) {
          this.state.cursor.row--
          this.clampCursor()
        }
        return { handled: true }
      }
      if (key === 'ArrowDown') {
        if (this.state.cursor.row < this.lines.length - 1) {
          this.state.cursor.row++
          this.clampCursor()
        }
        return { handled: true }
      }
      if (key === 'Home') {
        this.state.cursor.col = 0
        return { handled: true }
      }
      if (key === 'End') {
        const currLine = this.lines[this.state.cursor.row] || ''
        this.state.cursor.col = currLine.length
        return { handled: true }
      }

      // Backspace
      if (key === 'Backspace') {
        this.recordUndo()
        const { row, col } = this.state.cursor
        const currLine = this.lines[row] || ''
        if (col > 0) {
          this.lines[row] = currLine.slice(0, col - 1) + currLine.slice(col)
          this.state.cursor.col--
        } else if (row > 0) {
          // Merge with previous line
          const prevLine = this.lines[row - 1]
          const newCol = prevLine.length
          this.lines[row - 1] = prevLine + currLine
          this.lines.splice(row, 1)
          this.state.cursor.row--
          this.state.cursor.col = newCol
        }
        return { handled: true }
      }

      // Delete forward
      if (key === 'Delete') {
        this.recordUndo()
        const { row, col } = this.state.cursor
        const currLine = this.lines[row] || ''
        if (col < currLine.length) {
          this.lines[row] = currLine.slice(0, col) + currLine.slice(col + 1)
        } else if (row < this.lines.length - 1) {
          // Merge next line into current
          const nextLine = this.lines[row + 1]
          this.lines[row] = currLine + nextLine
          this.lines.splice(row + 1, 1)
        }
        return { handled: true }
      }

      // Enter
      if (key === 'Enter') {
        this.recordUndo()
        const { row, col } = this.state.cursor
        const currLine = this.lines[row] || ''
        
        // Auto-indent matching previous line's leading whitespace
        const indentMatch = currLine.match(/^\s*/)
        const indent = indentMatch ? indentMatch[0] : ''

        const before = currLine.slice(0, col)
        const after = currLine.slice(col)
        this.lines[row] = before
        this.lines.splice(row + 1, 0, indent + after)
        this.state.cursor.row++
        this.state.cursor.col = indent.length
        return { handled: true }
      }

      // Tab (4 spaces)
      if (key === 'Tab') {
        this.recordUndo()
        const { row, col } = this.state.cursor
        const currLine = this.lines[row] || ''
        this.lines[row] = currLine.slice(0, col) + '    ' + currLine.slice(col)
        this.state.cursor.col += 4
        return { handled: true }
      }

      // Normal printable characters
      if (key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        this.recordUndo()
        const { row, col } = this.state.cursor
        const currLine = this.lines[row] || ''
        this.lines[row] = currLine.slice(0, col) + key + currLine.slice(col)
        this.state.cursor.col++
        return { handled: true }
      }

      return { handled: false }
    }

    // =========================================================
    // 3. NORMAL MODE (Vim commands & motions)
    // =========================================================
    if (this.state.mode === 'NORMAL') {
      // Colon enters command mode
      if (key === ':') {
        this.state.mode = 'COMMAND'
        this.state.commandBuffer = ':'
        this.state.statusMessage = ':'
        return { handled: true }
      }

      // Enter insert mode (i, a, I, A, o, O)
      if (key === 'i') {
        this.state.mode = 'INSERT'
        this.state.statusMessage = '-- INSERT --'
        return { handled: true }
      }
      if (key === 'a') {
        this.state.mode = 'INSERT'
        this.state.statusMessage = '-- INSERT --'
        const curr = this.lines[this.state.cursor.row] || ''
        this.state.cursor.col = Math.min(curr.length, this.state.cursor.col + 1)
        return { handled: true }
      }
      if (key === 'I') {
        this.state.mode = 'INSERT'
        this.state.statusMessage = '-- INSERT --'
        const curr = this.lines[this.state.cursor.row] || ''
        const firstCharIdx = curr.search(/\S/)
        this.state.cursor.col = firstCharIdx >= 0 ? firstCharIdx : 0
        return { handled: true }
      }
      if (key === 'A') {
        this.state.mode = 'INSERT'
        this.state.statusMessage = '-- INSERT --'
        const curr = this.lines[this.state.cursor.row] || ''
        this.state.cursor.col = curr.length
        return { handled: true }
      }
      if (key === 'o') {
        this.recordUndo()
        const curr = this.lines[this.state.cursor.row] || ''
        const indentMatch = curr.match(/^\s*/)
        const indent = indentMatch ? indentMatch[0] : ''
        this.lines.splice(this.state.cursor.row + 1, 0, indent)
        this.state.cursor.row++
        this.state.cursor.col = indent.length
        this.state.mode = 'INSERT'
        this.state.statusMessage = '-- INSERT --'
        return { handled: true }
      }
      if (key === 'O') {
        this.recordUndo()
        const curr = this.lines[this.state.cursor.row] || ''
        const indentMatch = curr.match(/^\s*/)
        const indent = indentMatch ? indentMatch[0] : ''
        this.lines.splice(this.state.cursor.row, 0, indent)
        this.state.cursor.col = indent.length
        this.state.mode = 'INSERT'
        this.state.statusMessage = '-- INSERT --'
        return { handled: true }
      }

      // Undo (u) & Redo (Ctrl+r)
      if (key === 'u' && !e.ctrlKey) {
        if (this.state.undoStack.length > 1) {
          const current = this.state.undoStack.pop()!
          this.state.redoStack.push(current)
          const prev = this.state.undoStack[this.state.undoStack.length - 1]
          this.lines = prev.split('\n')
          this.clampCursor()
          this.state.statusMessage = '1 change; -before #'
        } else {
          this.state.statusMessage = 'Already at oldest change'
        }
        return { handled: true }
      }
      if (e.ctrlKey && key.toLowerCase() === 'r') {
        if (this.state.redoStack.length > 0) {
          const next = this.state.redoStack.pop()!
          this.state.undoStack.push(next)
          this.lines = next.split('\n')
          this.clampCursor()
          this.state.statusMessage = '1 change; -after #'
        } else {
          this.state.statusMessage = 'Already at newest change'
        }
        return { handled: true }
      }

      // Navigation: h, j, k, l and Arrow keys
      if (key === 'h' || key === 'ArrowLeft') {
        this.state.cursor.col = Math.max(0, this.state.cursor.col - 1)
        return { handled: true }
      }
      if (key === 'l' || key === 'ArrowRight') {
        const curr = this.lines[this.state.cursor.row] || ''
        this.state.cursor.col = Math.min(Math.max(0, curr.length - 1), this.state.cursor.col + 1)
        return { handled: true }
      }
      if (key === 'j' || key === 'ArrowDown') {
        this.state.cursor.row = Math.min(this.lines.length - 1, this.state.cursor.row + 1)
        this.clampCursor()
        return { handled: true }
      }
      if (key === 'k' || key === 'ArrowUp') {
        this.state.cursor.row = Math.max(0, this.state.cursor.row - 1)
        this.clampCursor()
        return { handled: true }
      }

      // Word motions (w, b)
      if (key === 'w') {
        const curr = this.lines[this.state.cursor.row] || ''
        const rest = curr.slice(this.state.cursor.col)
        const match = rest.match(/^[a-zA-Z0-9_]+\s*|\S+\s*|\s+/)
        if (match && this.state.cursor.col + match[0].length < curr.length) {
          this.state.cursor.col += match[0].length
        } else if (this.state.cursor.row < this.lines.length - 1) {
          this.state.cursor.row++
          this.state.cursor.col = 0
        }
        return { handled: true }
      }
      if (key === 'b') {
        if (this.state.cursor.col > 0) {
          const before = (this.lines[this.state.cursor.row] || '').slice(0, this.state.cursor.col)
          const match = before.match(/(\s*[a-zA-Z0-9_]+|\s*\S+)$/)
          if (match) {
            this.state.cursor.col = Math.max(0, this.state.cursor.col - match[0].length)
          } else {
            this.state.cursor.col = 0
          }
        } else if (this.state.cursor.row > 0) {
          this.state.cursor.row--
          const prev = this.lines[this.state.cursor.row] || ''
          this.state.cursor.col = Math.max(0, prev.length - 1)
        }
        return { handled: true }
      }

      // Line jumps (0, ^, $, gg, G)
      if (key === '0' || key === 'Home') {
        this.state.cursor.col = 0
        return { handled: true }
      }
      if (key === '^') {
        const curr = this.lines[this.state.cursor.row] || ''
        const idx = curr.search(/\S/)
        this.state.cursor.col = idx >= 0 ? idx : 0
        return { handled: true }
      }
      if (key === '$' || key === 'End') {
        const curr = this.lines[this.state.cursor.row] || ''
        this.state.cursor.col = Math.max(0, curr.length - 1)
        return { handled: true }
      }
      if (key === 'G') {
        this.state.cursor.row = this.lines.length - 1
        this.clampCursor()
        return { handled: true }
      }

      // Pending Operators (gg, dd, yy)
      if (this.pendingOperator === 'g') {
        if (key === 'g') {
          this.state.cursor.row = 0
          this.state.cursor.col = 0
          this.pendingOperator = ''
          return { handled: true }
        }
        this.pendingOperator = ''
      }
      if (key === 'g') {
        this.pendingOperator = 'g'
        return { handled: true }
      }

      if (this.pendingOperator === 'd') {
        if (key === 'd') {
          this.recordUndo()
          this.state.yankBuffer = this.lines[this.state.cursor.row] || ''
          this.lines.splice(this.state.cursor.row, 1)
          if (this.lines.length === 0) this.lines = ['']
          this.clampCursor()
          this.state.statusMessage = '1 line deleted'
          this.pendingOperator = ''
          return { handled: true }
        }
        this.pendingOperator = ''
      }
      if (key === 'd') {
        this.pendingOperator = 'd'
        return { handled: true }
      }

      if (this.pendingOperator === 'y') {
        if (key === 'y') {
          this.state.yankBuffer = this.lines[this.state.cursor.row] || ''
          this.state.statusMessage = '1 line yanked (copied)'
          this.pendingOperator = ''
          return { handled: true }
        }
        this.pendingOperator = ''
      }
      if (key === 'y') {
        this.pendingOperator = 'y'
        return { handled: true }
      }

      // Paste (p: below, P: above)
      if (key === 'p') {
        if (this.state.yankBuffer !== undefined) {
          this.recordUndo()
          this.lines.splice(this.state.cursor.row + 1, 0, this.state.yankBuffer)
          this.state.cursor.row++
          this.state.statusMessage = '1 line pasted'
        }
        return { handled: true }
      }
      if (key === 'P') {
        if (this.state.yankBuffer !== undefined) {
          this.recordUndo()
          this.lines.splice(this.state.cursor.row, 0, this.state.yankBuffer)
          this.state.statusMessage = '1 line pasted'
        }
        return { handled: true }
      }

      // Delete character (x)
      if (key === 'x') {
        this.recordUndo()
        const { row, col } = this.state.cursor
        const curr = this.lines[row] || ''
        if (curr.length > 0) {
          this.lines[row] = curr.slice(0, col) + curr.slice(col + 1)
          this.clampCursor()
        }
        return { handled: true }
      }
    }

    return { handled: false }
  }

  private clampCursor() {
    this.state.cursor.row = Math.max(0, Math.min(this.lines.length - 1, this.state.cursor.row))
    const curr = this.lines[this.state.cursor.row] || ''
    const maxCol = this.state.mode === 'INSERT' ? curr.length : Math.max(0, curr.length - 1)
    this.state.cursor.col = Math.max(0, Math.min(maxCol, this.state.cursor.col))
  }

  public executeCommand(cmd: string): { success: boolean; message: string } {
    const trimmed = cmd.trim()
    if (trimmed === ':w') {
      if (this.onSaveCallback) this.onSaveCallback(this.getText())
      this.state.statusMessage = `"${this.lines.length}L written"`
      return { success: true, message: 'Đã lưu tệp tin' }
    }
    if (trimmed === ':q') {
      if (this.onQuitCallback) this.onQuitCallback(false)
      this.state.statusMessage = 'Đã thoát Vim'
      return { success: true, message: 'Đã thoát' }
    }
    if (trimmed === ':wq' || trimmed === ':x') {
      if (this.onSaveCallback) this.onSaveCallback(this.getText())
      if (this.onQuitCallback) this.onQuitCallback(false)
      this.state.statusMessage = 'Đã lưu và thực thi'
      return { success: true, message: 'Đã lưu và biên dịch gcc' }
    }
    if (trimmed === ':q!') {
      if (this.onQuitCallback) this.onQuitCallback(true)
      this.state.statusMessage = 'Đã hủy thay đổi'
      return { success: true, message: 'Thoát không lưu' }
    }
    if (trimmed === ':set nu' || trimmed === ':set number') {
      this.state.statusMessage = 'Line numbers enabled'
      return { success: true, message: 'Bật số dòng' }
    }
    if (/^:\d+$/.test(trimmed)) {
      const lineNum = parseInt(trimmed.slice(1), 10)
      this.state.cursor.row = Math.max(0, Math.min(this.lines.length - 1, lineNum - 1))
      this.state.cursor.col = 0
      this.state.statusMessage = `Line ${lineNum}`
      return { success: true, message: `Nhảy tới dòng ${lineNum}` }
    }

    this.state.statusMessage = `Not an editor command: ${trimmed}`
    return { success: false, message: `Lệnh không hợp lệ: ${trimmed}` }
  }
}
