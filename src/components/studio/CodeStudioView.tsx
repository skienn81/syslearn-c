import React, { useState } from 'react'
import { VirtualFileSystem } from '../../core/vfs/VirtualFileSystem'
import { VimEditor } from '../vim/VimEditor'
import { TerminalView } from '../terminal/TerminalView'
import { FileCode, Check } from 'lucide-react'

interface CodeStudioViewProps {
  vfs: VirtualFileSystem
  activeFileName?: string
  initialCode?: string
}

export const CodeStudioView: React.FC<CodeStudioViewProps> = ({
  vfs,
  activeFileName = 'bai01_io.c',
  initialCode,
}) => {
  const [currentFile, setCurrentFile] = useState<string>(activeFileName)
  const fileRes = vfs.readFile(currentFile)
  const initialContent = initialCode !== undefined ? initialCode : fileRes.success ? fileRes.content || '' : ''
  const [editorKey, setEditorKey] = useState<number>(0)
  const [savedNotification, setSavedNotification] = useState<boolean>(false)

  const handleSaveFile = (content: string) => {
    vfs.writeFile(currentFile, content)
    setSavedNotification(true)
    setTimeout(() => setSavedNotification(false), 2000)
  }

  const handleOpenFile = (fileName: string) => {
    setCurrentFile(fileName)
    setEditorKey(prev => prev + 1)
  }

  const currentList = vfs.listDirectory()
  const cFiles = typeof currentList === 'string' ? [] : currentList.filter(f => f.name.endsWith('.c') || f.name.endsWith('.txt'))

  return (
    <div className="space-y-3">
      {/* File Tabs Strip */}
      <div className="bg-[#0e1422] border border-slate-800 rounded-lg px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1 overflow-x-auto">
          {cFiles.map(f => (
            <button
              key={f.name}
              onClick={() => handleOpenFile(f.name)}
              className={`px-3 py-1.5 rounded-md font-mono text-xs transition-colors flex items-center gap-1.5 ${
                f.name === currentFile
                  ? 'bg-slate-800 text-sky-400 font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>{f.name}</span>
            </button>
          ))}
        </div>

        {savedNotification && (
          <div className="flex items-center gap-1 text-emerald-400 text-xs font-mono">
            <Check className="w-3.5 h-3.5" /> Đã lưu vào VFS
          </div>
        )}
      </div>

      {/* Split Pane: Vim on Left, Terminal on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[670px]">
        <div className="h-full flex flex-col">
          <VimEditor
            key={`${currentFile}_${editorKey}`}
            fileName={currentFile}
            initialContent={initialContent}
            onSave={handleSaveFile}
          />
        </div>

        <div className="h-full flex flex-col">
          <TerminalView
            vfs={vfs}
            onOpenVim={(fName) => handleOpenFile(fName)}
          />
        </div>
      </div>
    </div>
  )
}
