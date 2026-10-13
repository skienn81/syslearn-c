import React, { useState, useEffect } from 'react'
import { 
  BookOpen, 
  Terminal, 
  FileText, 
  RotateCcw, 
  HelpCircle, 
  Search,
  Check,
  ChevronRight,
  ChevronDown,
  Cpu,
  Layers,
  GitFork,
  Radio,
  Network,
  ChevronsUpDown,
  FolderOpen,
  Folder
} from 'lucide-react'
import { SESSIONS_DATA } from '../../core/curriculum/curriculumData'

export type ActiveTab = 'practice' | 'guide'

interface SidebarProps {
  activeTab: ActiveTab
  setActiveTab: (tab: ActiveTab) => void
  activeLabId: string
  onSelectLab: (labId: string) => void
  completedLabIds?: string[]
  onResetVFS: () => void
}

// Icon mapper cho từng chủ đề lab
const getSessionIcon = (sessionNumber: number) => {
  switch (sessionNumber) {
    case 1: return Terminal
    case 2: return Cpu
    case 3: return Layers
    case 4: return GitFork
    case 5: return Radio
    case 6: return Network
    default: return BookOpen
  }
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  activeLabId,
  onSelectLab,
  completedLabIds = [],
  onResetVFS,
}) => {
  const [searchQuery, setSearchQuery] = useState('')

  // Tìm session chứa activeLabId để mặc định mở session đó
  const initialOpenSessionId = SESSIONS_DATA.find(s => s.labs.some(l => l.id === activeLabId))?.id || 'session_02'

  // Trạng thái đóng/mở của từng Lab Accordion (Record<sessionId, boolean>)
  const [expandedSessions, setExpandedSessions] = useState<Record<string, boolean>>({
    [initialOpenSessionId]: true,
  })

  // Khi activeLabId thay đổi từ ngoài vào, tự động expand session tương ứng
  useEffect(() => {
    const parentSession = SESSIONS_DATA.find(s => s.labs.some(l => l.id === activeLabId))
    if (parentSession) {
      setExpandedSessions(prev => ({ ...prev, [parentSession.id]: true }))
    }
  }, [activeLabId])

  // Khi tìm kiếm, tự động mở tất cả các session có bài khớp
  useEffect(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matching: Record<string, boolean> = {}
      SESSIONS_DATA.forEach(session => {
        const hasMatch = session.title.toLowerCase().includes(q) ||
          session.labs.some(l => 
            l.title.toLowerCase().includes(q) || 
            l.topic.toLowerCase().includes(q) || 
            l.number.toString().includes(q)
          )
        if (hasMatch) matching[session.id] = true
      })
      setExpandedSessions(prev => ({ ...prev, ...matching }))
    }
  }, [searchQuery])

  const toggleSession = (sessionId: string) => {
    setExpandedSessions(prev => ({
      ...prev,
      [sessionId]: !prev[sessionId],
    }))
  }

  const toggleAll = () => {
    const allExpanded = SESSIONS_DATA.every(s => expandedSessions[s.id])
    const nextState: Record<string, boolean> = {}
    SESSIONS_DATA.forEach(s => {
      nextState[s.id] = !allExpanded
    })
    setExpandedSessions(nextState)
  }

  // Tổng số bài trên toàn hệ thống
  const allLabs = SESSIONS_DATA.flatMap(s => s.labs)
  const totalLabsCount = allLabs.length
  const completedCount = completedLabIds.length

  return (
    <aside className="w-72 shrink-0 bg-[#0c111d] border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 select-none">
      {/* Top Header & Brand */}
      <div className="flex flex-col min-h-0 flex-1">
        {/* Brand */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-slate-800/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-500/20 to-indigo-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm tracking-tight text-slate-100 font-mono">
                SYS<span className="text-sky-400">LEARN</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Học Lập Trình Hệ Thống</span>
            </div>
          </div>

          <div className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono text-emerald-400" title="Tiến độ hoàn thành bài tập">
            {completedCount}/{totalLabsCount} Đạt
          </div>
        </div>

        {/* Section Header: THỰC HÀNH THEO CHỦ ĐỀ */}
        <div className="px-3 pt-3 pb-2 shrink-0 border-b border-slate-800/60 space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Thực hành theo chủ đề
            </span>
            <button
              onClick={toggleAll}
              className="text-[10px] text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
              title="Đóng / Mở tất cả các nhóm Lab"
            >
              <ChevronsUpDown className="w-3 h-3" />
              <span>Thu gọn/Mở</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3 h-3 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm bài học, bitwise, scanf, fork..."
              className="w-full bg-slate-900/90 border border-slate-800 rounded-md pl-7 pr-2.5 py-1 text-[11px] text-slate-200 placeholder-slate-500 outline-none focus:border-sky-500/60 transition-colors"
            />
          </div>
        </div>

        {/* Hierarchical Accordion Course Explorer (HackerRank / CodeLearn Standard) */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {SESSIONS_DATA.map((session) => {
            const isExpanded = !!expandedSessions[session.id]
            const Icon = getSessionIcon(session.sessionNumber)
            const sessionLabs = session.labs

            // Lọc các bài khớp tìm kiếm
            const filteredLabs = searchQuery.trim()
              ? sessionLabs.filter(lab => 
                  lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  lab.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  lab.number.toString().includes(searchQuery)
                )
              : sessionLabs

            // Đếm số bài đã hoàn thành trong session này
            const sessionPassedCount = sessionLabs.filter(l => completedLabIds.includes(l.id)).length

            // Rút gọn tiêu đề hiển thị: Bỏ chữ "Buổi X:"
            const cleanTitle = session.title.replace(/^Buổi \d+:\s*/, '')

            return (
              <div 
                key={session.id} 
                className="rounded-xl border border-slate-800/80 bg-[#090d18] overflow-hidden transition-colors"
              >
                {/* Accordion Header (Click để Đóng / Mở Lab) */}
                <button
                  onClick={() => toggleSession(session.id)}
                  className={`w-full p-2.5 flex items-center justify-between text-left transition-colors cursor-pointer select-none ${
                    isExpanded 
                      ? 'bg-slate-900/80 border-b border-slate-800/60' 
                      : 'hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 border ${
                      isExpanded
                        ? 'bg-sky-500/15 border-sky-500/30 text-sky-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-200 truncate flex items-center gap-1.5">
                        <span>Lab {session.sessionNumber}:</span>
                        <span className="font-normal text-slate-300 truncate">{cleanTitle}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {sessionLabs.length > 0 ? (
                          <span>{sessionLabs.length} bài tập</span>
                        ) : (
                          <span>Chưa có bài tập</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-1">
                    {sessionLabs.length > 0 ? (
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                        sessionPassedCount === sessionLabs.length && sessionLabs.length > 0
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}>
                        {sessionPassedCount}/{sessionLabs.length}
                      </span>
                    ) : null}

                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    )}
                  </div>
                </button>

                {/* Accordion Body: Danh sách bài tập của Lab này */}
                {isExpanded && (
                  <div className="p-1.5 space-y-1 bg-[#070b13]">
                    {filteredLabs.length > 0 ? (
                      filteredLabs.map((lab) => {
                        const isSelected = activeTab === 'practice' && activeLabId === lab.id
                        const isCompleted = completedLabIds.includes(lab.id)

                        return (
                          <button
                            key={lab.id}
                            onClick={() => {
                              onSelectLab(lab.id)
                              setActiveTab('practice')
                            }}
                            className={`w-full text-left py-1.5 px-2 rounded-lg text-xs transition-all flex items-start gap-2 cursor-pointer border ${
                              isSelected
                                ? 'bg-sky-500/15 border-sky-500/40 text-slate-100 shadow-sm'
                                : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                            }`}
                          >
                            {/* Number / Status Icon */}
                            <div className="shrink-0 mt-0.5">
                              {isCompleted ? (
                                <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                </div>
                              ) : (
                                <div className={`w-4 h-4 rounded font-mono text-[9px] font-bold flex items-center justify-center border ${
                                  isSelected
                                    ? 'bg-sky-500/30 border-sky-400 text-sky-200'
                                    : 'bg-slate-900 border-slate-800 text-slate-500'
                                }`}>
                                  {lab.number.toString().padStart(2, '0')}
                                </div>
                              )}
                            </div>

                            {/* Title & Topic */}
                            <div className="flex-1 min-w-0">
                              <div className={`truncate text-[11px] leading-tight ${isSelected ? 'text-sky-300 font-semibold' : 'text-slate-300'}`}>
                                {lab.title.replace(/^Bài \d+:\s*/, '')}
                              </div>
                              <div className="text-[10px] text-slate-500 truncate mt-0.5">
                                {lab.topic}
                              </div>
                            </div>

                            {isSelected && (
                              <ChevronRight className="w-3 h-3 text-sky-400 shrink-0 mt-0.5" />
                            )}
                          </button>
                        )
                      })
                    ) : sessionLabs.length === 0 ? (
                      <div className="p-3 text-center text-slate-500 text-[11px] space-y-1">
                        <p>Đang cập nhật bài tập thực hành cho chủ đề này.</p>
                      </div>
                    ) : (
                      <div className="p-2 text-center text-slate-500 text-[11px]">
                        Không có bài khớp tìm kiếm.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Supplementary Navigation: Hướng Dẫn Sử Dụng */}
        <div className="p-2 border-t border-slate-800/60 bg-slate-950/20 shrink-0">
          <button
            onClick={() => setActiveTab('guide')}
            className={`w-full flex items-center gap-2 h-8 px-2.5 rounded-lg text-xs transition-colors cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-indigo-500/15 text-indigo-300 font-medium border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">Hướng Dẫn Sử Dụng Nền Tảng</span>
          </button>
        </div>
      </div>

      {/* Bottom Footer & Environment State */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 text-xs space-y-2 shrink-0">
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 font-mono">
          <span className="truncate max-w-[140px] text-slate-500">~/student/syslearn</span>
          <span className="flex items-center gap-1.5 text-emerald-400 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            VFS Active
          </span>
        </div>

        <button
          onClick={onResetVFS}
          className="w-full flex items-center justify-center gap-1.5 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs transition-colors cursor-pointer"
          title="Khôi phục lại cây thư mục ảo ban đầu"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset File System</span>
        </button>
      </div>
    </aside>
  )
}
