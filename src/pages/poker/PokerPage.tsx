import React from 'react'
import { Link } from 'react-router-dom'
import PageHeading from '@components/PageHeading'

interface PokerFeature {
  to: string
  suit: string
  suitClass: string
  title: string
  description: string
  tags: string[]
}

const FEATURES: PokerFeature[] = [
  {
    to: '/poker/analyzer',
    suit: '♠',
    suitClass: 'text-cream',
    title: '牌型分析工具',
    description: '选择手牌和公牌，实时分析当前牌力、未来牌型与对手可能范围。',
    tags: ['实时识别', '胜率模拟', '对手范围'],
  },
  {
    to: '/poker/hands',
    suit: '♥',
    suitClass: 'text-red-400',
    title: '常见牌型',
    description: '从皇家同花顺到高牌，查看 10 种牌型的大小顺序与比牌规则。',
    tags: ['10 种牌型', '比牌规则', '示例牌面'],
  },
  {
    to: '/poker/odds',
    suit: '♦',
    suitClass: 'text-red-400',
    title: '翻前胜率表',
    description: '常见起手牌面对不同数量对手时的获胜概率速查。',
    tags: ['起手牌', '多对手', '胜率速查'],
  },
]

const PokerPage: React.FC = () => {
  return (
    <div className="page-transition">
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6 md:pt-16">
        <PageHeading
          eyebrow="TEXAS HOLD'EM"
          title="德州扑克"
          subtitle="从规则到实战：先认清牌型大小，再分析手牌，最后用胜率表校准翻前决策。"
          className="pb-10 md:pb-12"
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {FEATURES.map(feature => (
            <Link key={feature.to} to={feature.to} className="feature-card group">
              <span
                className="pointer-events-none absolute -bottom-8 -right-3 select-none font-display text-[7rem] leading-none text-gold-300/[0.05]"
                aria-hidden="true"
              >
                {feature.suit}
              </span>

              <div className="relative flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold-400/25 bg-felt-950/50 text-2xl">
                  <span className={feature.suitClass}>{feature.suit}</span>
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-gold-400/25 text-xs text-gold-300 transition-all duration-300 group-hover:bg-gold-400 group-hover:text-felt-950">
                  →
                </span>
              </div>

              <h2 className="relative mt-6 text-lg font-semibold tracking-wide text-cream">
                {feature.title}
              </h2>
              <p className="relative mt-2 text-sm leading-6 text-cream-muted">
                {feature.description}
              </p>

              <div className="relative mt-5 flex flex-wrap gap-2">
                {feature.tags.map(tag => (
                  <span
                    key={tag}
                    className="rounded-md border border-white/[0.07] bg-white/[0.03] px-2 py-1 text-[10px] tracking-wide text-cream-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}

          <div className="feature-card flex cursor-default flex-col gap-4 opacity-50 pointer-events-none md:col-span-2 md:flex-row md:items-center md:justify-between xl:col-span-3">
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-felt-950/50 text-2xl text-cream-dim">
                ♣
              </span>
              <div>
                <h2 className="text-lg font-semibold tracking-wide text-cream-muted">更多功能</h2>
                <p className="mt-1 text-sm leading-6 text-cream-dim">
                  ICM、范围表与牌局复盘正在整理中。
                </p>
              </div>
            </div>
            <span className="shrink-0 self-start rounded-full border border-white/10 px-2.5 py-1 text-[9px] tracking-[0.2em] text-cream-dim md:self-auto">
              SOON
            </span>
          </div>
        </div>

        <div className="ui-panel mt-8 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold-400/25 bg-gold-400/10 font-display text-lg text-gold-200">
              10
            </span>
            <div>
              <p className="text-sm text-cream">不确定牌型大小？</p>
              <p className="mt-0.5 text-xs text-cream-muted">一页看完 10 种牌型与逐级比牌规则。</p>
            </div>
          </div>
          <Link to="/poker/hands" className="btn-gold shrink-0">
            查看牌型规则
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PokerPage
