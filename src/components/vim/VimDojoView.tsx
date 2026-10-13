import React, { useState } from 'react'
import { VIM_DRILLS } from '../../core/vim/vimDrills'
import { VimDrill } from '../../types/vim'
import { VimEditor } from './VimEditor'
import confetti from 'canvas-confetti'
import { ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react'

export const VimDojoView: React.FC = () => {
  const [currentDrillIndex, setCurrentDrillIndex] = useState<number>(0)
  const [editorKey, setEditorKey] = useState<number>(0)
  const [isCompleted, setIsCompleted] = useState<boolean>(false)

  const drill: VimDrill = VIM_DRILLS[currentDrillIndex]

  const handleContentChange = (content: string) => {
    if (drill.validationType === 'content_match') {
      if (content.trim() === drill.targetContent.trim()) {
        triggerSuccess()
      }
    }
  }

  const handleSave = (_content: string) => {
    if (drill.validationType === 'command_executed' && drill.expectedCommand === ':wq') {
      triggerSuccess()
    }
  }

  const handleExit = () => {
    if (drill.validationType === 'command_executed') {
      triggerSuccess()
    }
  }

  const triggerSuccess = () => {
    if (!isCompleted) {
      setIsCompleted(true)
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      })
    }
  }

  const nextDrill = () => {
    if (currentDrillIndex < VIM_DRILLS.length - 1) {
      setCurrentDrillIndex(prev => prev + 1)
      setIsCompleted(false)
      setEditorKey(prev => prev + 1)
    }
  }

  const resetCurrentDrill = () => {
    setIsCompleted(false)
    setEditorKey(prev => prev + 1)
  }

  return (
    <div className="space-y-4">
      {/* Drill Instruction Card */}
      <div className="p-4 rounded-xl bg-[#0e1422] border border-slate-800 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-sky-400">
                BÀI {currentDrillIndex + 1}/{VIM_DRILLS.length}
              </span>
              <span className="text-slate-600">·</span>
              <h2 className="text-sm font-semibold text-slate-100">{drill.title}</h2>
              {isCompleted && (
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 ml-2">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Hoàn thành
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">{drill.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetCurrentDrill}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
              title="Làm lại bài này"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            {isCompleted && (
              <button
                onClick={nextDrill}
                className="px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Bài Tiếp Theo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
          <strong className="text-sky-300">Nhiệm vụ:</strong> {drill.instructions}
        </div>
      </div>

      {/* Editor */}
      <div className="h-[520px]">
        <VimEditor
          key={editorKey}
          initialContent={drill.initialContent}
          fileName={`drill_${currentDrillIndex + 1}.txt`}
          allowedKeysHint={drill.allowedKeysHint}
          onContentChange={handleContentChange}
          onSave={handleSave}
          onExit={handleExit}
        />
      </div>
    </div>
  )
}
