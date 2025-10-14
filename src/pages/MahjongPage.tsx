import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MahjongTile, MAHJONG_TILES, createEmptyWall } from '../types/mahjong'

const MahjongPage: React.FC = () => {
  const navigate = useNavigate()
  const [wall, setWall] = useState(createEmptyWall())
  const [selectedTiles, setSelectedTiles] = useState<MahjongTile[]>([])

  const addTileToWall = (tile: MahjongTile) => {
    if (selectedTiles.length >= 13) return
    
    const newSelectedTiles = [...selectedTiles, tile]
    setSelectedTiles(newSelectedTiles)
    
    const newWall = { ...wall }
    const emptySlotIndex = newWall.tiles.findIndex(t => t === null)
    if (emptySlotIndex !== -1) {
      newWall.tiles[emptySlotIndex] = tile
      setWall(newWall)
    }
  }

  const removeTileFromWall = (index: number) => {
    const newWall = { ...wall }
    const removedTile = newWall.tiles[index]
    newWall.tiles[index] = null
    setWall(newWall)
    
    if (removedTile) {
      setSelectedTiles(selectedTiles.filter(t => t.id !== removedTile.id))
    }
  }

  const isWallFull = selectedTiles.length === 14
  const canAddMore = selectedTiles.length < 14

  // 简单的麻将逻辑判断
  const getAdvice = () => {
    if (!isWallFull) return null
    
    const tiles = selectedTiles.map(t => ({ suit: t.suit, value: t.value }))
    
    // 检查是否可以听牌（简化版）
    const hasSequences = checkSequences(tiles)
    const hasTriplets = checkTriplets(tiles)
    
    if (hasSequences && hasTriplets) {
      return { type: 'win', message: '恭喜！可以胡牌！' }
    } else {
      return { type: 'discard', message: '建议打出单张或边缘牌' }
    }
  }

  const checkSequences = (tiles: any[]) => {
    // 简化版顺子检查
    return tiles.length >= 3
  }

  const checkTriplets = (tiles: any[]) => {
    // 简化版刻子检查
    const valueCount = new Map()
    tiles.forEach(tile => {
      const key = `${tile.suit}-${tile.value}`
      valueCount.set(key, (valueCount.get(key) || 0) + 1)
    })
    return Array.from(valueCount.values()).some(count => count >= 3)
  }

  const advice = getAdvice()

  return (
    <div className="min-h-screen p-4 page-transition">
      {/* 返回首页按钮 */}
      <button
        onClick={() => navigate('/')}
        className="mb-6 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg shadow-md transition-colors"
      >
        ← 回到首页
      </button>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">麻将</h1>

        {/* 牌墙区域 */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">牌墙 (14张)</h2>
          <div className="grid grid-cols-7 md:grid-cols-14 gap-2 bg-green-100 p-6 rounded-2xl shadow-lg">
            {wall.tiles.map((tile, index) => (
              <div
                key={index}
                className={`aspect-[3/4] flex items-center justify-center text-4xl bg-white rounded-lg shadow-md border-2 ${
                  tile ? 'border-green-500' : 'border-dashed border-gray-300'
                } ${isWallFull ? 'animate-pulse' : ''}`}
                onClick={() => tile && removeTileFromWall(index)}
              >
                {tile ? tile.unicode : ``}
              </div>
            ))}
          </div>
          
          {/* 建议区域 */}
          {advice && (
            <div className={`mt-4 p-4 rounded-lg text-white text-center ${
              advice.type === 'win' ? 'bg-green-500' : 'bg-yellow-500'
            }`}>
              {advice.message}
            </div>
          )}
        </div>

        {/* 选牌区域 */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">选择牌张</h2>
          <div className="space-y-6">
            {/* 万子 */}
            <div>
              <h3 className="text-xl font-medium mb-3 text-red-600">万子</h3>
              <div className="grid grid-cols-9 gap-2">
                {MAHJONG_TILES.filter(tile => tile.suit === 'characters').map(tile => (
                  <button
                    key={tile.id}
                    onClick={() => canAddMore && addTileToWall(tile)}
                    disabled={!canAddMore}
                    className="aspect-[3/4] text-3xl bg-red-100 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-md transition-colors"
                  >
                    {tile.unicode}
                  </button>
                ))}
              </div>
            </div>

            {/* 筒子 */}
            <div>
              <h3 className="text-xl font-medium mb-3 text-blue-600">筒子</h3>
              <div className="grid grid-cols-9 gap-2">
                {MAHJONG_TILES.filter(tile => tile.suit === 'dots').map(tile => (
                  <button
                    key={tile.id}
                    onClick={() => canAddMore && addTileToWall(tile)}
                    disabled={!canAddMore}
                    className="aspect-[3/4] text-3xl bg-blue-100 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-md transition-colors"
                  >
                    {tile.unicode}
                  </button>
                ))}
              </div>
            </div>

            {/* 条子 */}
            <div>
              <h3 className="text-xl font-medium mb-3 text-green-600">条子</h3>
              <div className="grid grid-cols-9 gap-2">
                {MAHJONG_TILES.filter(tile => tile.suit === 'bamboos').map(tile => (
                  <button
                    key={tile.id}
                    onClick={() => canAddMore && addTileToWall(tile)}
                    disabled={!canAddMore}
                    className="aspect-[3/4] text-3xl bg-green-100 hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-md transition-colors"
                  >
                    {tile.unicode}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MahjongPage