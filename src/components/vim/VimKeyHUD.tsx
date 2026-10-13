import React from 'react'
import { VimMode } from '../../types/vim'
import { Keyboard } from 'lucide-react'

interface VimKeyHUDProps {
  mode: VimMode
  lastKeys: string[]
  allowedKeysHint?: string[]
}

export const VimKeyHUD: React.FC<VimKeyHUDProps> = ({
  mode,
  lastKeys,
  allowedKeysHint = [],
}) => {
  const currentKey = lastKeys.length > 0 ? lastKeys[lastKeys.length - 1] : null

  const getModeBadge = (m: VimMode) => {
    switch (m) {
      case 'NORMAL':
        return {
          text: '-- NORMAL --',
          style: 'bg-slate-800 text-slate-200 border-slate-700',
        }
      case 'INSERT':
        return {
          text: '-- INSERT --',
          style: 'bg-sky-500/15 text-sky-300 border-sky-500/30 font-semibold',
        }
      case 'COMMAND':
        return {
          text: '-- COMMAND --',
          style: 'bg-slate-800 text-sky-400 border-slate-700',
        }
      case 'VISUAL':
        return {
          text: '-- VISUAL --',
          style: 'bg-slate-800 text-slate-300 border-slate-700',
        }
    }
  }

  const badge = getModeBadge(mode)

  return (
    <div className="bg-[#0e1422] border border-slate-800 rounded-lg px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
      {/* Mode Indicator */}
      <div className="flex items-center gap-2">
        <span className={`px-2 py-0.5 rounded font-mono text-[11px] border ${badge.style}`}>
          {badge.text}
        </span>
        <span className="text-slate-500 text-[11px] hidden sm:inline">
          {mode === 'INSERT' ? 'Nhấn [Esc] để về Normal' : 'Nhấn [i] để sửa code, [:wq] để lưu thoát'}
        </span>
      </div>

      {/* Keystroke Stream & Focus */}
      <div className="flex items-center gap-2">
        {allowedKeysHint.length > 0 && (
          <div className="hidden md:flex items-center gap-1 text-[11px] text-slate-400 mr-2">
            <span className="text-slate-500">Gợi ý:</span>
            {allowedKeysHint.map((k, i) => (
              <kbd
                key={i}
                className="px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[10px]"
              >
                {k}
              </kbd>
            ))}
          </div>
        )}

        <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded border border-slate-800 font-mono text-[11px]">
          <Keyboard className="w-3.5 h-3.5 text-slate-500" />
          <div className="flex items-center gap-1">
            {lastKeys.slice(-4).map((k, idx) => (
              <span key={idx} className="text-slate-400">
                {k === ' ' ? '␣' : k}
              </span>
            ))}
            {lastKeys.length === 0 && <span className="text-slate-600 text-[10px]">Chờ phím...</span>}
          </div>
        </div>

        {currentKey && (
          <div className="px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/30 text-sky-300 font-mono font-bold text-xs">
            {currentKey === ' ' ? 'SPACE' : currentKey.toUpperCase()}
          </div>
        )}
      </div>
    </div>
  )
}
