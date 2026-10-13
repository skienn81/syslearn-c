import React, { useState, useMemo } from 'react'
import { VirtualFileSystem } from './core/vfs/VirtualFileSystem'
import { UnifiedCodingWorkspace } from './components/workspace/UnifiedCodingWorkspace'
import { UserGuideView } from './components/guide/UserGuideView'
import { ArrowLeft } from 'lucide-react'

const STORAGE_KEY_COMPLETED_LABS = 'syslearn_completed_labs'
const STORAGE_KEY_ACTIVE_LAB = 'syslearn_active_lab_id'

export function App() {
  const [activeTab, setActiveTab] = useState<'practice' | 'guide'>('practice')
  const [activeLabId, setActiveLabId] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_ACTIVE_LAB) || 'lab2_01'
    } catch {
      return 'lab2_01'
    }
  })

  const handleSelectLab = (labId: string) => {
    setActiveLabId(labId)
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_LAB, labId)
    } catch {
      // ignore
    }
  }
  
  // Completed labs tracking in localStorage
  const [completedLabIds, setCompletedLabIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPLETED_LABS)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Single shared Virtual File System instance
  const vfs = useMemo(() => new VirtualFileSystem(), [])

  const handleCompleteLab = (labId: string) => {
    setCompletedLabIds(prev => {
      if (!prev.includes(labId)) {
        const next = [...prev, labId]
        localStorage.setItem(STORAGE_KEY_COMPLETED_LABS, JSON.stringify(next))
        return next
      }
      return prev
    })
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#070b12] text-slate-100 font-sans selection:bg-sky-500/20 selection:text-sky-200">
      {activeTab === 'practice' && (
        <main className="w-full h-full overflow-hidden">
          <UnifiedCodingWorkspace
            vfs={vfs}
            activeLabId={activeLabId}
            onSelectLab={handleSelectLab}
            onCompleteLab={handleCompleteLab}
            completedLabIds={completedLabIds}
            onOpenGuide={() => setActiveTab('guide')}
          />
        </main>
      )}

      {activeTab === 'guide' && (
        <div className="w-full h-full flex flex-col bg-[#080c14] overflow-hidden">
          <header className="h-14 px-6 border-b border-slate-800 bg-[#0c111e] flex items-center justify-between shrink-0">
            <button
              onClick={() => setActiveTab('practice')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 text-xs font-semibold cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay Lại Bàn Luyện Code C (HackerRank)</span>
            </button>
            <span className="text-xs text-slate-400 font-mono">
              Cẩm Nang Thực Hành &amp; Mẹo Phím Vim
            </span>
          </header>
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-5xl mx-auto w-full">
            <UserGuideView onNavigateToTab={() => setActiveTab('practice')} />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
