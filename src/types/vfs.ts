export interface FSNode {
  id: string
  name: string
  type: 'file' | 'dir'
  content?: string
  parentId: string | null
  children?: string[] // IDs of children
  createdAt: number
  updatedAt: number
}

export interface FSTree {
  [id: string]: FSNode
}

export interface TerminalHistoryItem {
  id: string
  command?: string
  output?: string
  isError?: boolean
  isSystem?: boolean
  cwd: string
  timestamp: number
}
