import React from 'react'
import { ActiveTab } from './Sidebar'
import { HelpCircle, Terminal } from 'lucide-react'

interface TopHeaderProps {
  activeTab: ActiveTab
  onOpenGuide: () => void
}

const TAB_TITLES: Record<ActiveTab, { title: string; subtitle: string; color: string }> = {
  practice: {
    title: 'Thực Hành Theo Chủ Đề: Hệ Thống & C Thực Chiến',
    subtitle: 'Luyện tập trực tiếp các bài tập lab hệ thống, tương tác terminal & trình soạn thảo Vim editor',
    color: 'text-sky-400',
  },
  guide: {
    title: 'Hướng Dẫn Sử Dụng Nền Tảng (Getting Started)',
    subtitle: 'Lộ trình 5 bước thực chiến, cẩm nang Vim & mẹo dòng lệnh Linux',
    color: 'text-indigo-400',
  },
}

export const TopHeader: React.FC<TopHeaderProps> = ({ activeTab, onOpenGuide }) => {
  const current = TAB_TITLES[activeTab] || TAB_TITLES.practice

  return (
    <header className="h-14 shrink-0 bg-[#0c111d]/90 backdrop-blur-sm border-b border-slate-800/80 px-6 flex items-center justify-between select-none">
      <div className="flex items-center gap-3">
        <div>
          <h1 className={`text-sm font-semibold flex items-center gap-2 ${current.color}`}>
            {current.title}
          </h1>
          <p className="text-[11px] text-slate-500 hidden sm:block">
            {current.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
        <button
          onClick={onOpenGuide}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-sans font-medium transition-colors cursor-pointer"
          title="Xem hướng dẫn sử dụng nền tảng"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Hướng Dẫn</span>
        </button>

        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-slate-400">Sandbox Client-Side Active</span>
        </div>
      </div>
    </header>
  )
}
