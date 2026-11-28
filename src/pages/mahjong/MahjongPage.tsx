import React from 'react'
import { Link } from 'react-router-dom'
import PageHeading from '@components/PageHeading'

const PLACEHOLDERS = [
  { icon: '📊', title: '牌型统计', description: '统计常见胡牌类型的出现频率。' },
  { icon: '🎯', title: '常见牌型', description: '整理各模式下的番型与胡牌条件。' },
  { icon: '🔮', title: '更多功能', description: '牌局复盘与练习模式正在准备中。' },
]

const MahjongPage: React.FC = () => {
  return (
    <div className="page-transition">
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6 md:pt-16">
        <PageHeading
          eyebrow="MAHJONG TOOLKIT"
          title="麻将"
          subtitle="先在牌墙上摆出手牌，实时查看听牌候选与胡牌类型；成都麻将与幺鸡麻将规则分别计算。"
          className="pb-10 md:pb-12"
        />

        <div className="grid gap-5 md:grid-cols-2">
          <Link
            to="/mahjong/ting"
            className="group relative overflow-hidden rounded-2xl border border-red-300/20 bg-gradient-to-br from-[#3a1516]/95 via-[#2a1011]/95 to-felt-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-red-300/45 hover:shadow-[0_30px_60px_-28px_rgba(0,0,0,0.95),0_0_0_1px_rgba(248,113,113,0.22)] md:p-7"
          >
            <span className="pointer-events-none absolute -right-4 -top-10 select-none font-display text-[9rem] leading-none text-red-300/[0.06]" aria-hidden="true">
              中
            </span>
            <div className="relative flex items-start justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-300/25 bg-red-400/10 text-2xl">
                🀄
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-red-300/25 text-xs text-red-200 transition-all duration-300 group-hover:bg-red-300 group-hover:text-[#2a1011]">
                →
              </span>
            </div>
            <h2 className="relative mt-6 text-lg font-semibold tracking-wide text-cream">听牌器</h2>
            <p className="relative mt-2 text-sm leading-6 text-cream-muted">
              选择手牌，分析可能的听牌与胡牌组合，自动限制花色与单牌数量。
            </p>
            <div className="relative mt-5 flex flex-wrap gap-2">
              {['实时听牌', '胡牌类型', '14 张牌墙'].map(tag => (
                <span
                  key={tag}
                  className="rounded-md border border-white/[0.07] bg-white/[0.03] px-2 py-1 text-[10px] tracking-wide text-cream-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>

          {PLACEHOLDERS.map(item => (
            <div key={item.title} className="feature-card cursor-default opacity-50">
              <div className="flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-felt-950/50 text-xl">{item.icon}</span>
                <span className="rounded-full border border-white/10 px-2.5 py-1 text-[9px] tracking-[0.2em] text-cream-dim">
                  SOON
                </span>
              </div>
              <h2 className="mt-6 text-lg font-semibold tracking-wide text-cream-muted">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-cream-dim">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="ui-panel mt-8 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-300/25 bg-red-400/10 font-display text-lg text-red-200">
              听
            </span>
            <div>
              <p className="text-sm text-cream">支持成都 / 幺鸡两种规则</p>
              <p className="mt-0.5 text-xs text-cream-muted">切换模式会自动清空牌墙，按对应策略重新计算。</p>
            </div>
          </div>
          <Link to="/mahjong/ting" className="btn-gold shrink-0">
            开始找听牌
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default MahjongPage
