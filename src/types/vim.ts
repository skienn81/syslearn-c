export type VimMode = 'NORMAL' | 'INSERT' | 'COMMAND' | 'VISUAL'

export interface VimState {
  mode: VimMode
  cursor: { row: number; col: number }
  commandBuffer: string
  statusMessage: string
  lastKeys: string[]
  yankBuffer: string
  undoStack: string[]
  redoStack: string[]
}

export interface VimDrill {
  id: string
  title: string
  level: 'Novice' | 'Adept' | 'Master'
  description: string
  instructions: string
  initialContent: string
  targetContent: string
  allowedKeysHint: string[]
  targetMode?: VimMode
  validationType: 'content_match' | 'mode_match' | 'command_executed'
  expectedCommand?: string
}
