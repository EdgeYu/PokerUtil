import React from 'react'

export type CardSuit = 'spades' | 'hearts' | 'diamonds' | 'clubs'
export type CardSize = 'xs' | 'sm' | 'md' | 'lg' | 'responsive'

interface PlayingCardProps {
  rank: string
  suit: CardSuit
  size?: CardSize
  className?: string
  title?: string
}

const SUIT_META: Record<CardSuit, { symbol: string; red: boolean; label: string }> = {
  spades: { symbol: '♠', red: false, label: '黑桃' },
  hearts: { symbol: '♥', red: true, label: '红心' },
  diamonds: { symbol: '♦', red: true, label: '方块' },
  clubs: { symbol: '♣', red: false, label: '梅花' },
}

const SIZE_CLASSES: Record<CardSize, { box: string; corner: string; smallPip: string; center: string }> = {
  xs: {
    box: 'h-9 w-6 rounded-[3px]',
    corner: 'text-[8px]',
    smallPip: 'text-[7px]',
    center: 'text-[13px]',
  },
  sm: {
    box: 'h-[3.25rem] w-[2.15rem] rounded',
    corner: 'text-[11px]',
    smallPip: 'text-[8px]',
    center: 'text-[19px]',
  },
  md: {
    box: 'h-[4.25rem] w-[2.8rem] rounded-md',
    corner: 'text-[13px]',
    smallPip: 'text-[10px]',
    center: 'text-[26px]',
  },
  lg: {
    box: 'h-[5.5rem] w-[3.7rem] rounded-lg',
    corner: 'text-base',
    smallPip: 'text-xs',
    center: 'text-[34px]',
  },
  responsive: {
    box: 'h-[3.4rem] w-[2.05rem] rounded-[5px] sm:h-[4rem] sm:w-[2.6rem] md:h-[4.85rem] md:w-[3.25rem]',
    corner: 'text-[11px] sm:text-xs md:text-sm',
    smallPip: 'text-[8px] sm:text-[9px] md:text-[10px]',
    center: 'text-[20px] sm:text-[25px] md:text-[30px]',
  },
}

const PlayingCard: React.FC<PlayingCardProps> = ({
  rank,
  suit,
  size = 'md',
  className = '',
  title,
}) => {
  const meta = SUIT_META[suit]
  const sizes = SIZE_CLASSES[size]
  const suitColor = meta.red ? 'text-[#c0272d]' : 'text-[#161b18]'
  const isTen = rank.length > 1

  return (
    <div
      className={`
        relative shrink-0 select-none overflow-hidden border border-black/15
        bg-gradient-to-b from-white via-[#fffdf8] to-[#efe8da]
        shadow-[0_1px_0_rgba(255,255,255,0.75)_inset,0_3px_10px_-3px_rgba(0,0,0,0.7)]
        ${sizes.box} ${className}
      `}
      title={title ?? `${meta.label}${rank}`}
      aria-label={title ?? `${meta.label}${rank}`}
    >
      <div className={`absolute left-[8%] top-[5%] flex flex-col items-center leading-none ${suitColor}`}>
        <span className={`font-display font-bold tracking-[-0.04em] ${sizes.corner} ${isTen ? 'tracking-[-0.08em]' : ''}`}>
          {rank}
        </span>
        <span className={`${sizes.smallPip} leading-none`}>{meta.symbol}</span>
      </div>

      <div className="flex h-full w-full items-center justify-center pt-[12%]">
        <span className={`${sizes.center} leading-none ${suitColor}`}>{meta.symbol}</span>
      </div>

      <span
        className="pointer-events-none absolute inset-[3px] rounded-[inherit] border border-black/[0.04]"
        aria-hidden="true"
      />
    </div>
  )
}

export default PlayingCard
