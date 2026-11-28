import React from 'react'
import { Link } from 'react-router-dom'
import PageHeading from '@components/PageHeading'
import PlayingCard from '@components/PlayingCard'
import { POKER_HANDS } from '../../data/pokerHands'

const CrownIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M3.2 8.4a1.1 1.1 0 0 1 1.7-.9l3.5 2.6 2.7-4.6a1.2 1.2 0 0 1 2.1 0l2.7 4.6 3.5-2.6a1.1 1.1 0 0 1 1.7.9l-1.5 9.1a1.2 1.2 0 0 1-1.2 1H5.9a1.2 1.2 0 0 1-1.2-1L3.2 8.4Z" />
    <rect x="5.4" y="19.7" width="13.2" height="1.9" rx="0.95" />
  </svg>
)

const TABLE_COLUMNS = 'lg:grid-cols-[4rem_10.5rem_minmax(18.5rem,auto)_minmax(0,1fr)]'

const TABLE_CHIPS = ['52 张扑克牌', '任选 5 张组合', '10 种牌型', '由大到小排序']

const PokerHandsPage: React.FC = () => {
  return (
    <div className="page-transition pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <PageHeading
          eyebrow="TEXAS HOLD'EM · HAND RANKINGS"
          title="德州扑克牌型及大小规则"
          subtitle="德州扑克使用 52 张扑克牌，玩家从手牌和公共牌中任意选出 5 张组成最好的牌型进行比较。牌型按以下顺序从大到小排列："
          tone="gold"
          wideSubtitle
          className="pb-6 pt-12 md:pt-16"
        />

        <div className="mb-8 flex flex-wrap items-center justify-center gap-2 md:mb-10">
          {TABLE_CHIPS.map((chip, index) => (
            <span
              key={chip}
              className={`rounded-full border px-3.5 py-1.5 text-[11px] tracking-wide ${
                index === 0
                  ? 'border-gold-400/40 bg-gold-400/10 text-gold-200'
                  : 'border-gold-500/15 bg-white/[0.03] text-cream-muted'
              }`}
            >
              {chip}
            </span>
          ))}
        </div>

        <section
          className="relative overflow-hidden rounded-2xl border border-gold-500/25 shadow-panel"
          aria-label="德州扑克牌型排名表"
        >
          <span className="pointer-events-none absolute left-2.5 top-2.5 h-6 w-6 rounded-tl-lg border-l border-t border-gold-300/30" aria-hidden="true" />
          <span className="pointer-events-none absolute right-2.5 top-2.5 h-6 w-6 rounded-tr-lg border-r border-t border-gold-300/30" aria-hidden="true" />
          <span className="pointer-events-none absolute bottom-2.5 left-2.5 h-6 w-6 rounded-bl-lg border-b border-l border-gold-300/30" aria-hidden="true" />
          <span className="pointer-events-none absolute bottom-2.5 right-2.5 h-6 w-6 rounded-br-lg border-b border-r border-gold-300/30" aria-hidden="true" />

          <div className="relative bg-gradient-to-b from-felt-700/90 via-felt-800/95 to-felt-900">
            {/* 桌面端表头 */}
            <div
              className={`hidden items-center gap-6 border-b border-gold-600/40 bg-gradient-to-b from-gold-200 via-gold-300 to-gold-500 px-6 py-3.5 text-felt-950 lg:grid ${TABLE_COLUMNS}`}
            >
              <span className="text-center text-xs font-bold tracking-[0.18em]">排名</span>
              <span className="text-xs font-bold tracking-[0.18em]">牌型名称</span>
              <span className="text-xs font-bold tracking-[0.18em]">示例牌型（5 张牌）</span>
              <span className="text-xs font-bold tracking-[0.18em]">牌型说明</span>
            </div>

            <ol>
              {POKER_HANDS.map(hand => {
                const isRoyal = hand.rank === 1

                return (
                  <li
                    key={hand.rank}
                    className={`group relative border-t border-gold-500/10 transition-colors duration-200 first:border-t-0 ${
                      isRoyal
                        ? 'bg-gradient-to-r from-gold-400/[0.13] via-gold-400/[0.04] to-transparent'
                        : 'hover:bg-gold-400/[0.035]'
                    }`}
                  >
                    {isRoyal && (
                      <span
                        className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-gold-300/90 via-gold-400/60 to-transparent"
                        aria-hidden="true"
                      />
                    )}

                    <div
                      className={`grid grid-cols-[2.75rem_minmax(0,1fr)] items-start gap-x-3 gap-y-3 px-4 py-5 md:px-6 md:py-6 lg:items-center lg:gap-6 ${TABLE_COLUMNS}`}
                    >
                      {/* 排名 */}
                      <div className="flex justify-center lg:justify-center" aria-label={`第 ${hand.rank} 名`}>
                        {isRoyal ? (
                          <div className="flex flex-col items-center gap-1">
                            <CrownIcon className="h-8 w-8 text-gold-300 drop-shadow-[0_2px_6px_rgba(217,180,90,0.35)] md:h-9 md:w-9" />
                            <span className="text-[8px] font-semibold tracking-[0.22em] text-gold-400/75">
                              TOP
                            </span>
                          </div>
                        ) : (
                          <span className="gold-text font-display text-3xl font-bold leading-none md:text-[2.15rem]">
                            {hand.rank}
                          </span>
                        )}
                      </div>

                      {/* 牌型名称 */}
                      <div className="min-w-0">
                        <h2 className="text-lg font-semibold tracking-wide text-cream md:text-xl">
                          {hand.name}
                        </h2>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-gold-300/65 md:text-[11px]">
                          {hand.englishName}
                        </p>
                      </div>

                      {/* 示例牌 */}
                      <div className="col-span-2 flex items-center gap-1.5 sm:gap-2 lg:col-span-1">
                        {hand.example.map((card, index) => (
                          <PlayingCard
                            key={`${hand.rank}-${card.suit}-${card.rank}-${index}`}
                            rank={card.rank}
                            suit={card.suit}
                            size="responsive"
                          />
                        ))}
                      </div>

                      {/* 牌型说明 */}
                      <div className="col-span-2 lg:col-span-1">
                        <p className="text-[13px] leading-6 text-cream-muted md:text-sm">
                          {hand.rule}
                        </p>
                        <p className="mt-2 border-l border-gold-400/25 pl-2.5 text-[12px] leading-5 text-gold-200/65 md:text-xs">
                          {hand.compare}
                        </p>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </section>

        <section className="mt-8 flex flex-col gap-5 rounded-2xl border border-gold-500/20 bg-white/[0.02] p-5 md:mt-10 md:flex-row md:items-center md:justify-between md:p-6">
          <div>
            <p className="text-[10px] tracking-[0.3em] text-gold-400/70">NEXT STEP</p>
            <h2 className="mt-2 font-display text-xl font-bold text-cream md:text-2xl">
              想验证手上的牌？
            </h2>
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-cream-muted">
              把已知的手牌与公牌放进分析工具，实时查看当前牌力、未来牌型与胜率。
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link to="/poker/analyzer" className="btn-gold">
              牌型分析工具
              <span aria-hidden="true">→</span>
            </Link>
            <Link to="/poker/odds" className="btn-ghost">
              翻前胜率表
            </Link>
          </div>
        </section>

        <p className="mt-6 text-center text-xs leading-6 text-cream-dim">
          牌型强弱由 5 张组合决定；同一牌型按上述规则逐级比较，直至分出胜负。
        </p>
      </div>
    </div>
  )
}

export default PokerHandsPage
