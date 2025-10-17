import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MahjongTile, MAHJONG_TILES } from '../../types/mahjong'
import MahjongTileComponent from '@components/MahjongTile'
import { useMahjongTing } from '@hooks/useMahjongTing'

const MahjongTingPage: React.FC = () => {
  const navigate = useNavigate()
  
  // 使用自定义Hook管理状态逻辑
  const {
    wall,
    message,
    tingCandidates,
    isWallFull,
    canAddMore,
    finalResult,
    addTileToWall,
    removeTileFromWall,
    clearWall,
    getAdviceView,
    canAddTile,
    mode,
    changeMode
  } = useMahjongTing()

  // 获取建议视图数据
  const advice = getAdviceView()

  return (
    <div className="min-h-screen p-4 page-transition">
      {/* 返回麻将主页按钮 */}
      <button
        onClick={() => navigate('/mahjong')}
        className="mb-6 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg shadow-md transition-colors"
      >
        ← 回到麻将主页
      </button>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">麻将听牌器</h1>
        
        {/* 模式切换 */}
        <div className="flex justify-center mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2 text-center">选择麻将模式</h3>
            <div className="flex gap-4">
              <button
                onClick={() => changeMode('chengdu')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  mode === 'chengdu' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                成都麻将
              </button>
              <button
                onClick={() => changeMode('yaoji')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  mode === 'yaoji' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                幺鸡麻将
              </button>
              <button
                onClick={() => changeMode('yitong')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  mode === 'yitong' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                disabled
                title="暂未开发"
              >
                一筒麻将
              </button>
            </div>
          </div>
        </div>

        {/* 牌墙区域 */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-700">牌墙 (14张)</h2>
            <button
              onClick={clearWall}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors"
            >
              一键清理
            </button>
          </div>
          <div className="grid grid-cols-7 md:grid-cols-14 gap-2 bg-green-100 p-6 rounded-2xl shadow-lg">
            {wall.tiles.map((tile, index) => (
              <MahjongTileComponent
                key={index}
                tile={tile}
                onClick={() => tile && removeTileFromWall(index)}
                size="large"
                variant="wall"
              />
            ))}
          </div>

          {/* 限制/提示信息 */}
          {message && (
            <div className="mt-4 p-3 rounded-lg text-white text-center bg-orange-500">
              {message}
            </div>
          )}

          {/* 建议/听牌/胡牌展示 */}
          {advice && (
            <div className={`mt-4 p-4 rounded-lg text-white text-center ${advice.cls}`}>
              <div className="mb-2">{advice.msg}</div>
              {/* 听牌列表 */}
              {!isWallFull && tingCandidates.length > 0 && (
                <div className="grid grid-cols-9 md:grid-cols-14 gap-2 justify-center">
                  {tingCandidates.map(t => (
                    <MahjongTileComponent
                      key={t.id}
                      tile={t}
                      size="small"
                      variant="ting"
                    />
                  ))}
                </div>
              )}
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
                {MAHJONG_TILES.filter(tile => tile.suit === 'characters').map(tile => {
                  const disabled = !canAddTile(tile) || !canAddMore
                  return (
                    <MahjongTileComponent
                      key={tile.id}
                      tile={tile}
                      onClick={() => !disabled && addTileToWall(tile)}
                      disabled={disabled}
                      size="medium"
                      variant="selector"
                    />
                  )
                })}
              </div>
            </div>

            {/* 筒子 */}
            <div>
              <h3 className="text-xl font-medium mb-3 text-blue-600">筒子</h3>
              <div className="grid grid-cols-9 gap-2">
                {MAHJONG_TILES.filter(tile => tile.suit === 'dots').map(tile => {
                  const disabled = !canAddTile(tile) || !canAddMore
                  return (
                    <MahjongTileComponent
                      key={tile.id}
                      tile={tile}
                      onClick={() => !disabled && addTileToWall(tile)}
                      disabled={disabled}
                      size="medium"
                      variant="selector"
                    />
                  )
                })}
              </div>
            </div>

            {/* 条子 */}
            <div>
              <h3 className="text-xl font-medium mb-3 text-green-600">条子</h3>
              <div className="grid grid-cols-9 gap-2">
                {MAHJONG_TILES.filter(tile => tile.suit === 'bamboos').map(tile => {
                  // 幺鸡模式下，幺鸡（一条）始终可选
                  const isYaoji = mode === 'yaoji' && tile.suit === 'bamboos' && tile.value === 1
                  const disabled = isYaoji ? !canAddMore : (!canAddTile(tile) || !canAddMore)
                  return (
                    <MahjongTileComponent
                      key={tile.id}
                      tile={tile}
                      onClick={() => !disabled && addTileToWall(tile)}
                      disabled={disabled}
                      size="medium"
                      variant="selector"
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MahjongTingPage