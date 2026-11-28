import React from 'react'
import { Link } from 'react-router-dom'
import PlayingCard from '@components/PlayingCard'

const HERO_CARDS = [
  { rank: 'A', suit: 'spades' as const },
  { rank: 'K', suit: 'hearts' as const },
  { rank: 'Q', suit: 'diamonds' as const },
  { rank: 'J', suit: 'clubs' as const },
  { rank: '10', suit: 'spades' as const },
]

const MAHJONG_TILES = [
  { char: '中', color: 'text-red-600' },
  { char: '發', color: 'text-emerald-700' },
  { char: '九', color: 'text-sky-700' },
]

const FEATURES = [
  { label: '牌型识别', detail: '52 张牌完整覆盖' },
  { label: '实时胜率', detail: '蒙特卡洛模拟' },
  { label: '麻将听牌', detail: '成都 / 幺鸡规则' },
]

const HomePage: React.FC = () => {
  return (
    <div className="page-transition">
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 md:pt-20">
        <header className="text-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="hidden h-px w-10 bg-gradient-to-r from-transparent to-gold-500/60 sm:block" aria-hidden="true" />
            <span className="text-[10px] font-medium uppercase tracking-[0.42em] text-gold-400/75">
              Texas Hold'em × Mahjong
            </span>
            <span className="hidden h-px w-10 bg-gradient-to-l from-transparent to-gold-500/60 sm:block" aria-hidden="true" />
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight tracking-[0.02em] sm:text-5xl md:text-6xl">
            <span className="text-cream">牌局</span>
            <span className="gold-text">工具箱</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-cream-muted md:text-[15px]">
            为德州扑克与麻将准备的一组桌面工具。查牌型、算胜率、找听牌，一页直达。
          </p>
        </header>

        <div className="mt-12 grid gap-6 md:mt-14 md:grid-cols-2">
          {/* 德州扑克 */}
          <Link
            to="/poker"
            className="group relative overflow-hidden rounded-3xl border border-gold-500/25 bg-gradient-to-br from-felt-600/90 via-felt-700/95 to-felt-900 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/50 hover:shadow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-felt-950 md:p-7"
          >
            <span className="pointer-events-none absolute -right-6 -top-8 select-none font-display text-[10rem] leading-none text-gold-400/[0.06]" aria-hidden="true">
              ♠
            </span>
            <div className="relative flex items-center justify-between">
              <span className="rounded-full border border-gold-400/30 bg-gold-400/10 px-3 py-1 text-[10px] font-medium tracking-[0.22em] text-gold-200">
                POKER
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-400/30 text-gold-200 transition-all duration-300 group-hover:bg-gold-400 group-hover:text-felt-950">
                →
              </span>
            </div>

            <div className="relative my-8 flex items-center justify-center">
              {HERO_CARDS.map((card, index) => (
                <PlayingCard
                  key={card.rank}
                  rank={card.rank}
                  suit={card.suit}
                  size="responsive"
                  className={`transition-transform duration-300 ${
                    index === 0 ? '-rotate-6 -mr-1' : index === HERO_CARDS.length - 1 ? 'rotate-6 -ml-1' : index % 2 === 0 ? '-translate-y-1' : ''
                  } group-hover:rotate-0 group-hover:translate-y-0 group-hover:-mr-0 group-hover:-ml-0`}
                />
              ))}
            </div>

            <h2 className="relative font-display text-2xl font-bold tracking-wide text-cream">
              德州扑克
            </h2>
            <p className="relative mt-2 text-sm leading-6 text-cream-muted">
              牌型分析 · 胜率速查 · 规则速览
            </p>
            <div className="relative mt-5 flex flex-wrap gap-2">
              {['牌型分析', '常见牌型', '翻前胜率'].map(tag => (
                <span
                  key={tag}
                  className="rounded-md border border-white/[0.07] bg-white/[0.03] px-2 py-1 text-[10px] tracking-wide text-cream-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>

          {/* 麻将 */}
          <Link
            to="/mahjong"
            className="group relative overflow-hidden rounded-3xl border border-red-400/20 bg-gradient-to-br from-[#3a1516]/95 via-[#2a1011]/95 to-felt-900 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-red-300/40 hover:shadow-[0_30px_60px_-28px_rgba(0,0,0,0.95),0_0_0_1px_rgba(248,113,113,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-felt-950 md:p-7"
          >
            <span className="pointer-events-none absolute -right-4 -top-10 select-none font-display text-[10rem] leading-none text-red-300/[0.06]" aria-hidden="true">
              中
            </span>
            <div className="relative flex items-center justify-between">
              <span className="rounded-full border border-red-300/30 bg-red-400/10 px-3 py-1 text-[10px] font-medium tracking-[0.22em] text-red-200">
                MAHJONG
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-red-300/30 text-red-200 transition-all duration-300 group-hover:bg-red-300 group-hover:text-[#2a1011]">
                →
              </span>
            </div>

            <div className="relative my-8 flex items-center justify-center gap-2">
              {MAHJONG_TILES.map((tile, index) => (
                <div
                  key={tile.char}
                  className={`flex h-20 w-14 items-center justify-center rounded-lg border border-black/10 bg-gradient-to-b from-[#fdfaf1] to-[#e9e1d0] shadow-card transition-transform duration-300 ${
                    index === 1 ? '-translate-y-2' : ''
                  } group-hover:-translate-y-1`}
                >
                  <span className={`font-display text-2xl font-bold ${tile.color}`}>{tile.char}</span>
                </div>
              ))}
            </div>

            <h2 className="relative font-display text-2xl font-bold tracking-wide text-cream">
              麻将
            </h2>
            <p className="relative mt-2 text-sm leading-6 text-cream-muted">
              听牌识别 · 胡牌判断 · 牌墙练习
            </p>
            <div className="relative mt-5 flex flex-wrap gap-2">
              {['听牌器', '成都麻将', '幺鸡麻将'].map(tag => (
                <span
                  key={tag}
                  className="rounded-md border border-white/[0.07] bg-white/[0.03] px-2 py-1 text-[10px] tracking-wide text-cream-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {FEATURES.map(feature => (
            <div key={feature.label} className="ui-panel-soft flex items-center gap-3 px-4 py-3.5">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400/80" aria-hidden="true" />
              <div>
                <p className="text-sm text-cream">{feature.label}</p>
                <p className="mt-0.5 text-[11px] tracking-wide text-cream-dim">{feature.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomePage
