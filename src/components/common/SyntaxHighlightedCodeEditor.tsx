import React, { useState } from 'react'
import { renderHighlightedCCode } from '../../utils/cSyntaxHighlight'
import { DiagnosticIssue } from '../../types/cEngine'
import { Eye, Edit3, AlertTriangle, AlertCircle } from 'lucide-react'

interface SyntaxHighlightedCodeEditorProps {
  code: string
  onChange?: (newCode: string) => void
  readOnly?: boolean
  minHeight?: string
  fileName?: string
  diagnostics?: DiagnosticIssue[]
}

export const SyntaxHighlightedCodeEditor: React.FC<SyntaxHighlightedCodeEditorProps> = ({
  code,
  onChange,
  readOnly = false,
  minHeight = '360px',
  fileName,
  diagnostics = [],
}) => {
  const [viewMode, setViewMode] = useState<'editor' | 'highlight'>('editor')
  const lines = code.split('\n')

  return (
    <div className="relative rounded-xl border border-slate-800 bg-[#080c14] overflow-hidden flex flex-col font-mono text-xs shadow-inner h-full">
      {/* Top Code Bar */}
      <div className="px-3 py-1.5 bg-[#0e1422] border-b border-slate-800 flex items-center justify-between text-[11px] select-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-slate-300 font-medium">{fileName || 'main.c'}</span>
          <span className="text-slate-500 font-mono text-[10px]">{lines.length} dòng</span>

          {diagnostics.length > 0 && (
            <span className="px-1.5 py-0.5 rounded bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[10px] font-mono flex items-center gap-1 animate-pulse">
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              {diagnostics.length} lỗi
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setViewMode('editor')}
            className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 cursor-pointer ${
              viewMode === 'editor'
                ? 'bg-slate-800 text-sky-300 font-semibold'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Edit3 className="w-3 h-3" /> Soạn thảo
          </button>
          <button
            type="button"
            onClick={() => setViewMode('highlight')}
            className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 cursor-pointer ${
              viewMode === 'highlight'
                ? 'bg-slate-800 text-purple-300 font-semibold'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Eye className="w-3 h-3" /> Tô màu cú pháp
          </button>
        </div>
      </div>

      {/* Code Body with Line Numbers & Gutter Diagnostics */}
      <div className="relative flex-1 overflow-auto flex" style={{ minHeight }}>
        {/* Line Numbers Gutter */}
        <div className="w-12 shrink-0 bg-[#090d18] border-r border-slate-800/80 py-3 pr-2 text-right select-none text-[11px] font-mono space-y-0.5">
          {lines.map((_, i) => {
            const lineNum = i + 1
            const lineDiags = diagnostics.filter(d => d.line === lineNum)
            const hasError = lineDiags.some(d => d.type === 'error')
            const hasWarn = lineDiags.some(d => d.type === 'warning')

            return (
              <div
                key={i}
                className="h-6 flex items-center justify-end gap-1"
                title={lineDiags.length > 0 ? lineDiags.map(d => d.title).join(' | ') : undefined}
              >
                {hasError ? (
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block animate-pulse" />
                ) : hasWarn ? (
                  <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                ) : null}
                <span className={hasError ? 'text-rose-400 font-bold' : 'text-slate-600'}>
                  {lineNum}
                </span>
              </div>
            )
          })}
        </div>

        {/* Text Area or Highlighted View */}
        <div className="flex-1 p-3 overflow-auto">
          {viewMode === 'editor' ? (
            <textarea
              value={code}
              onChange={(e) => onChange && onChange(e.target.value)}
              readOnly={readOnly}
              spellCheck={false}
              className="w-full h-full min-h-[340px] bg-transparent text-slate-100 outline-none leading-6 font-mono text-xs resize-none"
              placeholder="Nhập mã nguồn C..."
            />
          ) : (
            <div className="font-mono text-xs leading-6 select-text">
              {renderHighlightedCCode(code)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
