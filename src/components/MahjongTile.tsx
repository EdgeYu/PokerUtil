import React from 'react'
import { MahjongTile as MahjongTileType } from '../types/mahjong'

interface MahjongTileProps {
  tile: MahjongTileType | null
  onClick?: () => void
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
  variant?: 'wall' | 'selector' | 'ting'
}

const MahjongTile: React.FC<MahjongTileProps> = ({
  tile,
  onClick,
  disabled = false,
  size = 'medium',
  variant = 'wall'
}) => {
  if (!tile) {
    // 空牌位
    return (
      <div
        className={`
          aspect-[3/4] flex items-center justify-center rounded-lg
          border-2 border-dashed border-gray-300
          bg-gradient-to-br from-gray-50 to-gray-100
          shadow-inner
          ${size === 'small' ? 'text-xl' : size === 'medium' ? 'text-2xl' : 'text-4xl'}
          ${variant === 'wall' ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
        `}
        onClick={onClick}
      >
        {/* 空牌位显示虚线 */}
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-3/4 h-3/4 border-2 border-dashed border-gray-300 rounded"></div>
        </div>
      </div>
    )
  }

  const { suit, value } = tile

  // 花色对应的颜色和样式
  const suitConfig = {
    characters: {
      bg: 'from-red-100 to-red-200',
      border: 'border-red-400',
      text: 'text-red-800',
      symbol: '万'
    },
    dots: {
      bg: 'from-blue-100 to-blue-200', 
      border: 'border-blue-400',
      text: 'text-blue-800',
      symbol: '筒'
    },
    bamboos: {
      bg: 'from-green-100 to-green-200',
      border: 'border-green-400',
      text: 'text-green-800',
      symbol: '条'
    }
  }

  const config = suitConfig[suit]

  // 根据变体设置不同的样式
  const variantStyles = {
    wall: `
      bg-gradient-to-br ${config.bg}
      border-2 ${config.border}
      shadow-lg hover:shadow-xl
      transform hover:scale-105
      transition-all duration-200
      cursor-pointer
    `,
    selector: `
      bg-gradient-to-br ${config.bg}
      border-2 ${config.border}
      shadow-md hover:shadow-lg
      transform hover:scale-105
      transition-all duration-200
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    `,
    ting: `
      bg-gradient-to-br from-white to-gray-50
      border-2 border-blue-400
      shadow-lg
      ${config.text}
    `
  }

  const sizeStyles = {
    small: 'text-sm p-1',
    medium: 'text-lg p-2', 
    large: 'text-2xl p-3'
  }

  return (
    <div
      className={`
        aspect-[3/4] flex flex-col items-center justify-center rounded-lg
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        relative overflow-hidden
      `}
      onClick={disabled ? undefined : onClick}
      title={`${suit}-${value}`}
    >
      {/* 牌面装饰 - 顶部圆角装饰 */}
      <div className="absolute top-1 left-1 right-1 h-2 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"></div>
      
      {/* 牌面内容 */}
      <div className="flex flex-col items-center justify-center space-y-1 z-10">
        {/* 数字 */}
        <div className={`font-bold ${config.text} leading-none`}>
          {value}
        </div>
        
        {/* 花色符号 */}
        <div className={`text-xs font-semibold ${config.text} font-mono`}>
          {config.symbol}
        </div>
      </div>

      {/* 底部装饰 */}
      <div className="absolute bottom-1 left-1 right-1 h-2 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"></div>
      
      {/* 牌边效果 */}
      <div className="absolute inset-1 border border-white/50 rounded-md"></div>
    </div>
  )
}

export default MahjongTile