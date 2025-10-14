import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MahjongTile, MAHJONG_TILES, createEmptyWall } from '../types/mahjong'

type Suit = MahjongTile['suit']
type SimpleTile = { suit: Suit; value: number }

const keyOf = (t: SimpleTile | MahjongTile) => `${t.suit}-${t.value}`

const countMap = (tiles: SimpleTile[]) => {
  const m = new Map<string, number>()
  tiles.forEach(t => {
    const k = keyOf(t)
    m.set(k, (m.get(k) || 0) + 1)
  })
  return m
}

const suitsUsed = (tiles: SimpleTile[]) => {
  const s = new Set<Suit>()
  tiles.forEach(t => s.add(t.suit))
  return s
}

// 七对/龙七对判断：所有牌能分成七对；四张算两对（龙七对）
const isSevenPairs = (tiles14: SimpleTile[]) => {
  if (tiles14.length !== 14) return false
  const m = countMap(tiles14)
  let pairs = 0
  for (const c of m.values()) {
    if (c === 2) pairs += 1
    else if (c === 4) pairs += 2
    else return false
  }
  return pairs === 7
}

// 标准胡（平胡/对对胡）：选一对将，剩余12张能分成4个面子（顺子或刻子）
// 返回分类：allPungs=true 则对对胡；否则平胡
const canFormStandardWin = (tiles14: SimpleTile[]) => {
  if (tiles14.length !== 14) return { win: false, allPungs: false }
  const bySuit: Record<Suit, number[]> = { characters: [], dots: [], bamboos: [] }
  tiles14.forEach(t => bySuit[t.suit].push(t.value))
  for (const s of Object.keys(bySuit) as Suit[]) bySuit[s].sort((a, b) => a - b)

  // 尝试每种将（任意牌>=2）
  const m = countMap(tiles14)
  for (const [k, c] of m) {
    if (c >= 2) {
      // 移除一对作为将
      const [suitStr, valStr] = k.split('-')
      const suit = suitStr as Suit
      const val = parseInt(valStr, 10)

      const work: Record<Suit, number[]> = {
        characters: [...bySuit.characters],
        dots: [...bySuit.dots],
        bamboos: [...bySuit.bamboos]
      }

      const idx1 = work[suit].indexOf(val)
      if (idx1 === -1) continue
      work[suit].splice(idx1, 1)
      const idx2 = work[suit].indexOf(val)
      if (idx2 === -1) continue
      work[suit].splice(idx2, 1)

      // 递归分面子：刻子或顺子
      let allPungs = true

      const consumeMelds = (arrs: Record<Suit, number[]>) => {
        // 所有剩余共12张 => 4面子；递归消耗
        const totalLen = arrs.characters.length + arrs.dots.length + arrs.bamboos.length
        if (totalLen === 0) return true

        // 找到第一个存在的牌
        const pickSuit: Suit =
          arrs.characters.length ? 'characters' :
          arrs.dots.length ? 'dots' : 'bamboos'
        const v = arrs[pickSuit][0]

        // 尝试刻子
        {
          const idxA = arrs[pickSuit].indexOf(v)
          const idxB = arrs[pickSuit].indexOf(v, idxA + 1)
          const idxC = arrs[pickSuit].indexOf(v, idxB + 1)
          if (idxA !== -1 && idxB !== -1 && idxC !== -1) {
            const next: Record<Suit, number[]> = {
              characters: [...arrs.characters],
              dots: [...arrs.dots],
              bamboos: [...arrs.bamboos]
            }
            // 删除三个相同值（按索引降序删除）
            const delIdxs = [idxA, idxB, idxC].filter(i => Number.isInteger(i) && i >= 0).sort((a, b) => b - a)
            delIdxs.forEach(i => next[pickSuit].splice(i, 1))
            const ok = consumeMelds(next)
            if (ok) return true
          }
        }

        // 尝试顺子（同花色 v,v+1,v+2）
        {
          const v1 = v, v2 = v + 1, v3 = v + 2
          const i1 = arrs[pickSuit].indexOf(v1)
          const i2 = arrs[pickSuit].indexOf(v2)
          const i3 = arrs[pickSuit].indexOf(v3)
          if (i1 !== -1 && i2 !== -1 && i3 !== -1) {
            const next: Record<Suit, number[]> = {
              characters: [...arrs.characters],
              dots: [...arrs.dots],
              bamboos: [...arrs.bamboos]
            }
            // 顺子出现则不全是刻子
            allPungs = false
            // 删除三个值
            const seqIdxs = [i1, i2, i3].filter(i => Number.isInteger(i) && i >= 0).sort((a, b) => b - a)
            seqIdxs.forEach(i => next[pickSuit].splice(i, 1))
            const ok = consumeMelds(next)
            if (ok) return true
          }
        }

        return false
      }

      const ok = consumeMelds(work)
      if (ok) return { win: true, allPungs }
    }
  }

  return { win: false, allPungs: false }
}

const MahjongPage: React.FC = () => {
  const navigate = useNavigate()
  const [wall, setWall] = useState(createEmptyWall())
  const [selectedTiles, setSelectedTiles] = useState<MahjongTile[]>([])
  const [message, setMessage] = useState<string | null>(null)

  // 当前是否允许添加：整体容量、最多两个花色、单牌最多4张
  const canAddTile = (tile: MahjongTile) => {
    if (selectedTiles.length >= 14) return false

    // 单牌最多4张
    const sameCount = selectedTiles.filter(t => keyOf(t) === keyOf(tile)).length
    if (sameCount >= 4) return false

    // 只允许两个花色
    const suits = suitsUsed(selectedTiles.map(t => ({ suit: t.suit, value: t.value })))
    if (suits.size >= 2 && !suits.has(tile.suit)) {
      // 添加第三花色则禁止
      return false
    }
    return true
  }

  const addTileToWall = (tile: MahjongTile) => {
    setMessage(null)
    if (selectedTiles.length >= 14) return

    // 限制：最多4张同牌 & 仅两个花色
    const sameCount = selectedTiles.filter(t => keyOf(t) === keyOf(tile)).length
    if (sameCount >= 4) {
      setMessage('同一张牌最多只能添加4个')
      return
    }
    const suits = suitsUsed(selectedTiles.map(t => ({ suit: t.suit, value: t.value })))
    if (suits.size >= 2 && !suits.has(tile.suit)) {
      setMessage('只能添加两个花色的牌')
      return
    }

    // 添加到牌墙
    const newWall = { ...wall }
    const emptySlotIndex = newWall.tiles.findIndex(t => t === null)
    if (emptySlotIndex !== -1) {
      newWall.tiles[emptySlotIndex] = tile
      setWall(newWall)
      // 同步 selectedTiles 来自墙
      const newSelected = newWall.tiles.filter(Boolean) as MahjongTile[]
      setSelectedTiles(newSelected)
    }
  }

  const removeTileFromWall = (index: number) => {
    const newWall = { ...wall }
    newWall.tiles[index] = null
    setWall(newWall)
    // 移除后用墙重建 selectedTiles，避免按 id 误删全部同牌
    const newSelected = newWall.tiles.filter(Boolean) as MahjongTile[]
    setSelectedTiles(newSelected)
    setMessage(null)
  }

  const isWallFull = selectedTiles.length === 14
  const canAddMore = selectedTiles.length < 14

  // 计算听牌：对当前手牌（长度<=13），找出所有能补成胡的牌
  const tingCandidates = useMemo(() => {
    if (selectedTiles.length >= 14) return []
    const base = selectedTiles.map(t => ({ suit: t.suit, value: t.value }))
    const baseCounts = countMap(base)

    // 已用花色集合（限制最多两个花色）
    const usedSuits = suitsUsed(base)
    return MAHJONG_TILES
      .filter(tile => {
        const k = keyOf(tile)
        const cnt = baseCounts.get(k) || 0
        if (cnt >= 4) return false
        if (usedSuits.size >= 2 && !usedSuits.has(tile.suit)) return false
        return true
      })
      .filter(tile => {
        const test = [...base, { suit: tile.suit, value: tile.value }]
        // 七对/龙七对
        if (isSevenPairs(test)) return true
        const std = canFormStandardWin(test)
        return std.win
      })
      // 去重（同一张牌只保留一个）
      .reduce((acc: MahjongTile[], t) => {
        if (!acc.find(x => keyOf(x) === keyOf(t))) acc.push(t)
        return acc
      }, [])
  }, [selectedTiles])

  // 满14张时判断胡牌及胡型
  const finalResult = useMemo(() => {
    if (!isWallFull) return null
    const tiles = selectedTiles.map(t => ({ suit: t.suit, value: t.value }))
    if (isSevenPairs(tiles)) {
      // 判定是否龙七对（是否存在四张）
      const cm = countMap(tiles)
      const hasQuad = Array.from(cm.values()).some(c => c === 4)
      return { type: hasQuad ? '龙七对' : '七对', win: true }
    }
    const std = canFormStandardWin(tiles)
    if (std.win) {
      return { type: std.allPungs ? '对对胡' : '平胡', win: true }
    }
    return { type: '未成胡', win: false }
  }, [selectedTiles, isWallFull])

  const adviceView = () => {
    if (isWallFull) {
      if (finalResult?.win) {
        return { cls: 'bg-green-500', msg: `恭喜！胡牌类型：${finalResult.type}` }
      }
      return { cls: 'bg-red-500', msg: '未成胡，请调整手牌' }
    } else {
      if (selectedTiles.length === 0) return null
      if (tingCandidates.length === 0) {
        return { cls: 'bg-yellow-500', msg: '当前手牌没有听牌' }
      }
      return { cls: 'bg-blue-500', msg: `听牌（${tingCandidates.length}种）如下：` }
    }
  }

  const advice = adviceView()

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
                    <div
                      key={t.id}
                      className={`aspect-[3/4] flex items-center justify-center text-3xl text-gray-800 bg-white rounded-lg shadow-md border-2 ${
                        'border-blue-400'
                      }`}
                      title={`${t.suit}-${t.value}`}
                    >
                      {t.unicode}
                    </div>
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
                    <button
                      key={tile.id}
                      onClick={() => !disabled && addTileToWall(tile)}
                      disabled={disabled}
                      className="aspect-[3/4] text-3xl bg-red-100 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-md transition-colors"
                    >
                      {tile.unicode}
                    </button>
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
                    <button
                      key={tile.id}
                      onClick={() => !disabled && addTileToWall(tile)}
                      disabled={disabled}
                      className="aspect-[3/4] text-3xl bg-blue-100 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-md transition-colors"
                    >
                      {tile.unicode}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 条子 */}
            <div>
              <h3 className="text-xl font-medium mb-3 text-green-600">条子</h3>
              <div className="grid grid-cols-9 gap-2">
                {MAHJONG_TILES.filter(tile => tile.suit === 'bamboos').map(tile => {
                  const disabled = !canAddTile(tile) || !canAddMore
                  return (
                    <button
                      key={tile.id}
                      onClick={() => !disabled && addTileToWall(tile)}
                      disabled={disabled}
                      className="aspect-[3/4] text-3xl bg-green-100 hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-md transition-colors"
                    >
                      {tile.unicode}
                    </button>
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

export default MahjongPage