import { FSNode, FSTree } from '../../types/vfs'
import { INITIAL_FS, DEFAULT_ROOT_ID, DEFAULT_STUDENT_ID, DEFAULT_LAB2_ID } from './defaultFiles'

const STORAGE_KEY = 'syslearn_vfs_data_v1'

export class VirtualFileSystem {
  private tree: FSTree
  private currentDirId: string

  constructor() {
    this.tree = this.loadFromStorage()
    // Default working directory: /home/student/lab2
    this.currentDirId = this.tree[DEFAULT_LAB2_ID] ? DEFAULT_LAB2_ID : DEFAULT_ROOT_ID
  }

  private loadFromStorage(): FSTree {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch {
      // ignore
    }
    return JSON.parse(JSON.stringify(INITIAL_FS))
  }

  public saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tree))
    } catch {
      // ignore
    }
  }

  public resetToDefault(): void {
    this.tree = JSON.parse(JSON.stringify(INITIAL_FS))
    this.currentDirId = DEFAULT_LAB2_ID
    this.saveToStorage()
  }

  public getCurrentDirId(): string {
    return this.currentDirId
  }

  public getTree(): FSTree {
    return this.tree
  }

  public getNode(id: string): FSNode | undefined {
    return this.tree[id]
  }

  // Get absolute path from node ID
  public getAbsolutePath(nodeId: string): string {
    if (nodeId === DEFAULT_ROOT_ID) return '/'
    const parts: string[] = []
    let curr = this.tree[nodeId]
    while (curr && curr.parentId !== null) {
      parts.unshift(curr.name)
      curr = this.tree[curr.parentId]
    }
    return '/' + parts.join('/')
  }

  public getCurrentPath(): string {
    return this.getAbsolutePath(this.currentDirId)
  }

  // Resolve a path string to a node ID
  public resolvePath(pathStr: string): string | null {
    const trimmed = pathStr.trim()
    if (!trimmed || trimmed === '.') return this.currentDirId
    if (trimmed === '/') return DEFAULT_ROOT_ID
    if (trimmed === '~' || trimmed === '/home/student') return DEFAULT_STUDENT_ID

    const isAbsolute = trimmed.startsWith('/')
    const segments = trimmed.split('/').filter(Boolean)

    let currentId = isAbsolute ? DEFAULT_ROOT_ID : this.currentDirId

    for (const segment of segments) {
      if (segment === '.') continue
      if (segment === '..') {
        const currNode = this.tree[currentId]
        if (currNode && currNode.parentId) {
          currentId = currNode.parentId
        }
        continue
      }
      if (segment === '~') {
        currentId = DEFAULT_STUDENT_ID
        continue
      }

      const currNode = this.tree[currentId]
      if (!currNode || currNode.type !== 'dir' || !currNode.children) {
        return null
      }

      const childId = currNode.children.find(cid => this.tree[cid]?.name === segment)
      if (!childId) return null
      currentId = childId
    }

    return currentId
  }

  public changeDirectory(targetPath: string): { success: boolean; error?: string } {
    const targetId = this.resolvePath(targetPath)
    if (!targetId) {
      return { success: false, error: `cd: no such file or directory: ${targetPath}` }
    }
    const node = this.tree[targetId]
    if (node.type !== 'dir') {
      return { success: false, error: `cd: not a directory: ${targetPath}` }
    }
    this.currentDirId = targetId
    return { success: true }
  }

  public listDirectory(targetPath?: string): { name: string; type: 'file' | 'dir'; size: number; updatedAt: number }[] | string {
    const dirId = targetPath ? this.resolvePath(targetPath) : this.currentDirId
    if (!dirId) return 'ls: cannot access: No such file or directory'
    const dirNode = this.tree[dirId]
    if (dirNode.type !== 'dir' || !dirNode.children) {
      return 'ls: not a directory'
    }

    return dirNode.children.map(cid => {
      const child = this.tree[cid]
      return {
        name: child.name,
        type: child.type,
        size: child.content ? child.content.length : 4096,
        updatedAt: child.updatedAt,
      }
    })
  }

  public readFile(filePath: string): { success: boolean; content?: string; error?: string } {
    const fileId = this.resolvePath(filePath)
    if (!fileId) return { success: false, error: `cat: ${filePath}: No such file or directory` }
    const node = this.tree[fileId]
    if (node.type === 'dir') return { success: false, error: `cat: ${filePath}: Is a directory` }
    return { success: true, content: node.content || '' }
  }

  public writeFile(filePath: string, content: string): { success: boolean; error?: string; node?: FSNode } {
    const segments = filePath.split('/').filter(Boolean)
    const fileName = segments.pop()
    if (!fileName) return { success: false, error: 'Invalid filename' }

    const parentPath = filePath.startsWith('/') ? '/' + segments.join('/') : segments.join('/')
    const parentId = parentPath ? this.resolvePath(parentPath) : this.currentDirId
    if (!parentId || !this.tree[parentId] || this.tree[parentId].type !== 'dir') {
      return { success: false, error: 'Cannot create file: Parent directory not found' }
    }

    const parentNode = this.tree[parentId]
    const existingChildId = parentNode.children?.find(cid => this.tree[cid]?.name === fileName)

    if (existingChildId) {
      // Update existing
      this.tree[existingChildId].content = content
      this.tree[existingChildId].updatedAt = Date.now()
      this.saveToStorage()
      return { success: true, node: this.tree[existingChildId] }
    } else {
      // Create new
      const newId = 'file_' + Math.random().toString(36).substring(2, 9)
      const newNode: FSNode = {
        id: newId,
        name: fileName,
        type: 'file',
        content,
        parentId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      this.tree[newId] = newNode
      if (!parentNode.children) parentNode.children = []
      parentNode.children.push(newId)
      this.saveToStorage()
      return { success: true, node: newNode }
    }
  }

  public makeDirectory(dirName: string): { success: boolean; error?: string } {
    const parentNode = this.tree[this.currentDirId]
    if (!parentNode || parentNode.type !== 'dir') {
      return { success: false, error: 'Current directory invalid' }
    }

    if (parentNode.children?.some(cid => this.tree[cid]?.name === dirName)) {
      return { success: false, error: `mkdir: cannot create directory '${dirName}': File exists` }
    }

    const newId = 'dir_' + Math.random().toString(36).substring(2, 9)
    const newDir: FSNode = {
      id: newId,
      name: dirName,
      type: 'dir',
      parentId: this.currentDirId,
      children: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    this.tree[newId] = newDir
    if (!parentNode.children) parentNode.children = []
    parentNode.children.push(newId)
    this.saveToStorage()
    return { success: true }
  }

  public removeNode(targetPath: string): { success: boolean; error?: string } {
    const targetId = this.resolvePath(targetPath)
    if (!targetId || targetId === DEFAULT_ROOT_ID) {
      return { success: false, error: `rm: cannot remove '${targetPath}': No such file or directory` }
    }

    const node = this.tree[targetId]
    const parentId = node.parentId
    if (parentId && this.tree[parentId]?.children) {
      this.tree[parentId].children = this.tree[parentId].children!.filter(cid => cid !== targetId)
    }

    delete this.tree[targetId]
    this.saveToStorage()
    return { success: true }
  }
}
