import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-gold-500/15 bg-felt-950/70">
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
          <div className="flex flex-col items-center gap-1.5 md:items-start">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-gold-200 to-gold-600 text-[13px] text-felt-950">
                ♠
              </span>
              <span className="font-display text-sm font-bold tracking-wide">
                <span className="gold-text">Poker</span>
                <span className="text-cream">Util</span>
              </span>
              <span className="text-[10px] tracking-[0.22em] text-cream-dim">牌局工具箱</span>
            </div>
            <p className="text-xs text-cream-dim">
              © 2025 EdgeYu. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/EdgeYu"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-cream-dim transition-colors duration-200 hover:text-gold-200"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </a>
            <a
              href="https://edgeyu.top"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-cream-dim transition-colors duration-200 hover:text-gold-200"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19.875 3H4.125C2.953 3 2 3.897 2 5v14c0 1.103.953 2 2.125 2h15.75C21.047 21 22 20.103 22 19V5c0-1.103-.953-2-2.125-2zm0 16H4.125V5h15.75v14z" />
                <path d="M6 7h6v6H6zm7 8H6v2h12v-2h-5zm-5-3h8v2H8zm0 3h3v2H8zm0-6h3v2H8z" />
              </svg>
              <span>博客</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
