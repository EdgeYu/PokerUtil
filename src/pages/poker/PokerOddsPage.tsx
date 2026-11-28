import React from 'react'
import PageHeading from '@components/PageHeading'

const PREFLOP_ODDS = [
  { hand: 'AA', vsRandom: '85.3%', vs1Opponent: '85.2%', vs2Opponents: '73.4%', vs9Opponents: '31.1%' },
  { hand: 'KK', vsRandom: '82.4%', vs1Opponent: '82.1%', vs2Opponents: '68.7%', vs9Opponents: '26.1%' },
  { hand: 'QQ', vsRandom: '79.9%', vs1Opponent: '79.6%', vs2Opponents: '64.9%', vs9Opponents: '23.1%' },
  { hand: 'JJ', vsRandom: '77.5%', vs1Opponent: '77.2%', vs2Opponents: '61.5%', vs9Opponents: '20.4%' },
  { hand: 'TT', vsRandom: '75.1%', vs1Opponent: '74.8%', vs2Opponents: '58.2%', vs9Opponents: '18.1%' },
  { hand: '99', vsRandom: '72.1%', vs1Opponent: '71.7%', vs2Opponents: '54.7%', vs9Opponents: '15.8%' },
  { hand: '88', vsRandom: '69.1%', vs1Opponent: '68.7%', vs2Opponents: '51.3%', vs9Opponents: '13.8%' },
  { hand: '77', vsRandom: '66.2%', vs1Opponent: '65.8%', vs2Opponents: '48.1%', vs9Opponents: '12.1%' },
  { hand: '66', vsRandom: '63.3%', vs1Opponent: '62.9%', vs2Opponents: '45.1%', vs9Opponents: '10.6%' },
  { hand: '55', vsRandom: '60.4%', vs1Opponent: '60.0%', vs2Opponents: '42.3%', vs9Opponents: '9.3%' },
  { hand: '44', vsRandom: '57.6%', vs1Opponent: '57.2%', vs2Opponents: '39.6%', vs9Opponents: '8.2%' },
  { hand: '33', vsRandom: '54.8%', vs1Opponent: '54.4%', vs2Opponents: '37.1%', vs9Opponents: '7.2%' },
  { hand: '22', vsRandom: '52.0%', vs1Opponent: '51.6%', vs2Opponents: '34.7%', vs9Opponents: '6.4%' },
  { hand: 'AKs', vsRandom: '67.0%', vs1Opponent: '66.5%', vs2Opponents: '50.7%', vs9Opponents: '20.7%' },
  { hand: 'AQs', vsRandom: '66.1%', vs1Opponent: '65.6%', vs2Opponents: '49.8%', vs9Opponents: '19.5%' },
  { hand: 'AJs', vsRandom: '65.4%', vs1Opponent: '64.9%', vs2Opponents: '49.0%', vs9Opponents: '18.5%' },
  { hand: 'ATs', vsRandom: '64.7%', vs1Opponent: '64.2%', vs2Opponents: '48.2%', vs9Opponents: '17.6%' },
  { hand: 'AKo', vsRandom: '65.4%', vs1Opponent: '64.9%', vs2Opponents: '49.0%', vs9Opponents: '18.5%' },
  { hand: 'AQo', vsRandom: '64.5%', vs1Opponent: '64.0%', vs2Opponents: '48.1%', vs9Opponents: '17.4%' },
  { hand: 'AJo', vsRandom: '63.6%', vs1Opponent: '63.1%', vs2Opponents: '47.2%', vs9Opponents: '16.4%' },
  { hand: 'KQs', vsRandom: '63.4%', vs1Opponent: '62.9%', vs2Opponents: '47.0%', vs9Opponents: '16.2%' },
]

const getHandTone = (hand: string) => {
  if (hand.endsWith('s')) return 'text-emerald-300'
  if (hand.endsWith('o')) return 'text-sky-300'
  return 'text-gold-200'
}

const PokerOddsPage: React.FC = () => {
  return (
    <div className="page-transition">
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6 md:pt-16">
        <PageHeading
          eyebrow="PREFLOP EQUITY"
          title="翻前胜率速查表"
          subtitle="常见起手牌在面对随机牌、1 个、2 个与 9 个对手时的近似胜率，用于校准翻前入池与加注决策。"
          className="pb-8 md:pb-10"
        />

        <p className="mb-3 flex items-center justify-center gap-2 text-[11px] text-cream-dim md:hidden">
          <span aria-hidden="true">←</span>
          左右滑动查看完整数据
          <span aria-hidden="true">→</span>
        </p>

        <section className="overflow-hidden rounded-2xl border border-gold-500/25 shadow-panel">
          <div className="overflow-x-auto no-scrollbar">
            <table className="min-w-[720px] w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-b from-gold-200 via-gold-300 to-gold-500 text-felt-950">
                  <th className="sticky left-0 z-10 bg-gold-300 px-6 py-3.5 text-left text-xs font-bold tracking-[0.18em] shadow-[6px_0_12px_-8px_rgba(0,0,0,0.8)]">手牌</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold tracking-[0.18em]">vs 随机牌</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold tracking-[0.18em]">vs 1 个对手</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold tracking-[0.18em]">vs 2 个对手</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold tracking-[0.18em]">vs 9 个对手</th>
                </tr>
              </thead>
              <tbody>
                {PREFLOP_ODDS.map((odds, index) => (
                  <tr
                    key={odds.hand}
                    className={`border-t border-gold-500/10 transition-colors hover:bg-gold-400/[0.05] ${
                      index % 2 === 0 ? 'bg-felt-800/40' : 'bg-transparent'
                    }`}
                  >
                    <td className="sticky left-0 z-10 bg-[#0a1d16] px-6 py-3.5 shadow-[6px_0_12px_-8px_rgba(0,0,0,0.8)]">
                      <span className={`inline-flex min-w-[3.5rem] items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 font-display text-sm font-bold tracking-wide ${getHandTone(odds.hand)}`}>
                        {odds.hand}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="w-12 shrink-0 tabular-nums text-sm font-semibold text-cream">{odds.vsRandom}</span>
                        <span className="hidden h-1 w-24 overflow-hidden rounded-full bg-white/[0.06] sm:block" aria-hidden="true">
                          <span
                            className="block h-full rounded-full bg-gradient-to-r from-gold-500/70 to-gold-300"
                            style={{ width: odds.vsRandom }}
                          />
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 tabular-nums text-sm text-cream-muted">{odds.vs1Opponent}</td>
                    <td className="px-6 py-3.5 tabular-nums text-sm text-cream-muted">{odds.vs2Opponents}</td>
                    <td className="px-6 py-3.5 tabular-nums text-sm text-cream-muted">{odds.vs9Opponents}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="rounded-md border border-emerald-300/25 bg-emerald-400/10 px-2 py-1 text-[10px] tracking-wide text-emerald-300">s · 同花 Suited</span>
          <span className="rounded-md border border-sky-300/25 bg-sky-400/10 px-2 py-1 text-[10px] tracking-wide text-sky-300">o · 不同花 Off-suited</span>
          <span className="text-[11px] text-cream-dim">对子不区分花色。</span>
        </div>

        <div className="mt-6 rounded-xl border-l-2 border-gold-400/70 bg-gold-400/[0.06] px-4 py-3.5">
          <p className="text-xs leading-6 text-cream-muted">
            <strong className="text-gold-200">注：</strong>
            胜率为近似值，实际游戏可能因具体牌局情况、位置与对手范围有所不同。翻前胜率高不代表必然盈利，还需结合位置、筹码深度与对手风格决策。
          </p>
        </div>
      </div>
    </div>
  )
}

export default PokerOddsPage
