import React from 'react'

interface PageHeadingProps {
  eyebrow?: string
  title: string
  subtitle?: string
  tone?: 'cream' | 'gold'
  align?: 'center' | 'left'
  /** 加宽副标题，适合单行较长的规则说明 */
  wideSubtitle?: boolean
  className?: string
}

const PageHeading: React.FC<PageHeadingProps> = ({
  eyebrow,
  title,
  subtitle,
  tone = 'cream',
  align = 'center',
  wideSubtitle = false,
  className = '',
}) => {
  const isCenter = align === 'center'

  return (
    <header className={`${isCenter ? 'text-center' : 'text-left'} ${className}`}>
      {eyebrow && (
        <div className={`mb-4 flex items-center gap-3 ${isCenter ? 'justify-center' : ''}`}>
          <span className="hidden h-px w-8 bg-gradient-to-r from-transparent to-gold-500/60 sm:block" aria-hidden="true" />
          <span className="text-[10px] font-medium uppercase tracking-[0.38em] text-gold-400/75">
            {eyebrow}
          </span>
          <span className="hidden h-px w-8 bg-gradient-to-l from-transparent to-gold-500/60 sm:block" aria-hidden="true" />
        </div>
      )}

      <h1
        className={`font-display text-3xl font-bold leading-tight tracking-[0.02em] sm:text-4xl md:text-[2.75rem] ${
          tone === 'gold' ? 'gold-text' : 'text-cream'
        }`}
      >
        {title}
      </h1>

      {subtitle && (
        <p
          className={`mt-4 text-sm leading-7 text-cream-muted md:text-[15px] ${
            isCenter ? 'mx-auto' : ''
          } ${wideSubtitle ? 'max-w-5xl' : 'max-w-3xl'}`}
        >
          {subtitle}
        </p>
      )}
    </header>
  )
}

export default PageHeading
