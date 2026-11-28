import React from 'react'
import { MAHJONG_TILES } from '../../types/mahjong'
import MahjongTileComponent from '@components/MahjongTile'
import PageHeading from '@components/PageHeading'
import { useMahjongTing } from '@hooks/useMahjongTing'

const MahjongTingPage: React.FC = () => {
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
  const wallCount = wall.tiles.filter(Boolean).length

  return (
    <div className="page-transition">
      <div className="mx-auto max-w-5xl px-4 pb-20 pt-12 sm:px-6 md:pt-16">
        <PageHeading
          eyebrow="MAHJONG · TING"
          title="麻将听牌器"
          subtitle="从下方选择牌张加入牌墙。牌墙满 14 张后自动判断胡牌，未满时实时提示听牌候选。"
          className="pb-8 md:pb-10"
        />

        {/* 模式切换 */}
        <div className="mx-auto mb-8 max-w-2xl">
          <div className="ui-panel p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-gold-400/70">Game Mode</p>
                <p className="mt-1 text-sm text-cream">选择麻将模式</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => changeMode('chengdu')}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    mode === 'chengdu'
                      ? 'bg-gradient-to-b from-gold-200 to-gold-500 text-felt-950 shadow-[0_10px_24px_-12px_rgba(217,180,90,0.8)]'
                      : 'border border-white/10 bg-white/[0.03] text-cream-muted hover:border-gold-400/30 hover:text-cream'
                  }`}
                >
                  成都麻将
                </button>
                <button
                  onClick={() => changeMode('yaoji')}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    mode === 'yaoji'
                      ? 'bg-gradient-to-b from-gold-200 to-gold-500 text-felt-950 shadow-[0_10px_24px_-12px_rgba(217,180,90,0.8)]'
                      : 'border border-white/10 bg-white/[0.03] text-cream-muted hover:border-gold-400/30 hover:text-cream'
                  }`}
                >
                  幺鸡麻将
                </button>
                <button
                  disabled
                  title="暂未开发"
                  className="cursor-not-allowed rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-2 text-sm text-cream-dim/60"
                >
                  一筒麻将
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 牌墙区域 */}
        <div className="mb-12">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex items-baseline gap-3">
              <h2 className="font-display text-xl font-bold tracking-wide text-cream">牌墙</h2>
              <span className="text-xs tabular-nums tracking-wide text-cream-dim">{wallCount} / 14</span>
            </div>
            <button
              onClick={clearWall}
              className="btn-danger px-3.5 py-1.5 text-xs"
            >
              一键清理
            </button>
          </div>

          <div className="ui-panel p-4 sm:p-6">
            <div className="grid grid-cols-7 gap-2 md:grid-cols-14">
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
              <div className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-center text-sm text-amber-200">
                {message}
              </div>
            )}

            {/* 建议/听牌/胡牌展示 */}
            {advice && (
              <div className={`mt-4 rounded-xl px-4 py-4 text-center text-white shadow-lg ${advice.cls}`}>
                <div className="font-medium">{advice.msg}</div>
                {/* 听牌列表 */}
                {!isWallFull && tingCandidates.length > 0 && (
                  <div className="mt-3 grid grid-cols-9 gap-2 md:grid-cols-14">
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
        </div>

        {/* 选牌区域 */}
        <div>
          <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-display text-xl font-bold tracking-wide text-cream">选择牌张</h2>
            <p className="text-xs text-cream-dim">点击加入牌墙；点击牌墙中的牌可移除</p>
          </div>

          <div className="space-y-7">
            {/* 万子 */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-red-300">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" aria-hidden="true" />
                万子
              </h3>
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
              <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-sky-300">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400" aria-hidden="true" />
                筒子
              </h3>
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
              <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                条子
              </h3>
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
