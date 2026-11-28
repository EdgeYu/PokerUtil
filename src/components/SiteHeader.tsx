import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', label: '首页', shortLabel: '首页', end: true },
  { to: '/poker', label: '德州扑克', shortLabel: '扑克', end: false },
  { to: '/mahjong', label: '麻将', shortLabel: '麻将', end: false },
]

const SiteHeader: React.FC = () => {
  const location = useLocation()

  return (
    <header className="sticky top-0 z-40 border-b border-gold-500/15 bg-felt-950/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <NavLink to="/" className="group flex min-w-0 items-center gap-2.5" aria-label="PokerUtil 首页">
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-gold-100 via-gold-300 to-gold-600 text-felt-950 shadow-[0_6px_16px_-6px_rgba(217,180,90,0.9)]">
            <span className="absolute inset-[2px] rounded-md border border-white/30" aria-hidden="true" />
            <span className="relative text-xl leading-none">♠</span>
          </span>
          <span className="hidden min-w-0 min-[360px]:block">
            <span className="block truncate font-display text-lg font-bold leading-none tracking-wide">
              <span className="gold-text">Poker</span>
              <span className="text-cream">Util</span>
            </span>
            <span className="mt-1 hidden text-[9px] uppercase tracking-[0.32em] text-gold-400/60 sm:block">
              Table Toolkit
            </span>
          </span>
        </NavLink>

        <nav className="flex items-center gap-1" aria-label="主导航">
          {NAV_ITEMS.map(item => {
            const isActive = item.end
              ? location.pathname === item.to
              : location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={`nav-pill ${
                  isActive
                    ? 'bg-gold-400/10 text-gold-200 ring-1 ring-inset ring-gold-400/25'
                    : 'text-cream-muted hover:bg-white/[0.04] hover:text-cream'
                }`}
              >
                <span className="hidden min-[400px]:inline">{item.label}</span>
                <span className="min-[400px]:hidden">{item.shortLabel}</span>
              </NavLink>
            )
          })}
        </nav>
      </div>
    </header>
  )
}

export default SiteHeader
