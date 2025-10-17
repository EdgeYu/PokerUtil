import { useState, useMemo } from 'react'
import { MahjongTile, createEmptyWall, MAHJONG_TILES, MahjongMode } from '../types/mahjong'
import { 
  sortMahjongTiles, 
  MahjongStrategyFactory
} from '../utils/mahjongLogic'

/**
 * 麻将听牌器状态管理Hook
 */
export const useMahjongTing = () => {
  const [wall, setWall] = useState(createEmptyWall())
  const [selectedTiles, setSelectedTiles] = useState<MahjongTile[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [mode, setMode] = useState<MahjongMode>('chengdu')

  // 添加牌到牌墙
  const addTileToWall = (tile: MahjongTile) => {
    setMessage(null)
    
    // 验证是否可以添加
    if (selectedTiles.length >= 14) {
      setMessage('牌墙已满（最多14张）')
      return
    }

    const strategy = MahjongStrategyFactory.createStrategy(mode)
    if (!strategy.canAddTile(selectedTiles, tile)) {
      const sameCount = selectedTiles.filter(t => `${t.suit}-${t.value}` === `${tile.suit}-${tile.value}`).length
      if (sameCount >= 4) {
        setMessage('同一张牌最多只能添加4个')
        return
      }
      setMessage('只能添加两个花色的牌')
      return
    }

    // 添加到牌墙
    const newWall = { ...wall }
    const emptySlotIndex = newWall.tiles.findIndex(t => t === null)
    if (emptySlotIndex !== -1) {
      newWall.tiles[emptySlotIndex] = tile
      setWall(newWall)
      
      // 同步 selectedTiles 并自动排序
      const sortedTiles = sortMahjongTiles(newWall.tiles.filter(Boolean) as MahjongTile[])
      setSelectedTiles(sortedTiles)
      
      // 更新牌墙显示，按照排序后的顺序重新填充
      const updatedWall = createEmptyWall()
      sortedTiles.forEach((tile, index) => {
        updatedWall.tiles[index] = tile
      })
      setWall(updatedWall)
    }
  }

  // 从牌墙移除牌
  const removeTileFromWall = (index: number) => {
    const newWall = { ...wall }
    newWall.tiles[index] = null
    setWall(newWall)
    
    // 移除后用墙重建 selectedTiles，并自动排序
    const sortedTiles = sortMahjongTiles(newWall.tiles.filter(Boolean) as MahjongTile[])
    setSelectedTiles(sortedTiles)
    
    // 更新牌墙显示，按照排序后的顺序重新填充
    const updatedWall = createEmptyWall()
    sortedTiles.forEach((tile, index) => {
      updatedWall.tiles[index] = tile
    })
    setWall(updatedWall)
    setMessage(null)
  }

  // 清空牌墙
  const clearWall = () => {
    setWall(createEmptyWall())
    setSelectedTiles([])
    setMessage(null)
  }

  // 切换麻将模式
  const changeMode = (newMode: MahjongMode) => {
    setMode(newMode)
    clearWall() // 切换模式时清空牌墙
    setMessage(`已切换到${getModeName(newMode)}模式`)
  }

  // 获取模式名称
  const getModeName = (mode: MahjongMode) => {
    switch (mode) {
      case 'chengdu': return '成都麻将'
      case 'yaoji': return '幺鸡麻将'
      case 'yitong': return '一筒麻将'
      default: return '未知模式'
    }
  }

  // 自定义胡牌判断函数（使用策略模式）
  const customGetFinalResult = (tiles: MahjongTile[]) => {
    const strategy = MahjongStrategyFactory.createStrategy(mode)
    const simpleTiles = tiles.map(t => ({ suit: t.suit, value: t.value }))
    const result = strategy.canHu(simpleTiles, mode)
    return result.win ? { type: result.type || '胡牌', win: true } : { type: '未成胡', win: false }
  }

  // 自定义听牌候选计算函数（使用策略模式）
  const customCalculateTingCandidates = (tiles: MahjongTile[]) => {
    const strategy = MahjongStrategyFactory.createStrategy(mode)
    return strategy.calculateTingCandidates(tiles, mode, MAHJONG_TILES)
  }

  // 计算听牌候选
  const tingCandidates = useMemo(() => 
    customCalculateTingCandidates(selectedTiles), 
    [selectedTiles, mode]
  )

  // 判断是否满14张
  const isWallFull = selectedTiles.length === 14

  // 是否可以添加更多牌
  const canAddMore = selectedTiles.length < 14

  // 最终胡牌结果
  const finalResult = useMemo(() => 
    customGetFinalResult(selectedTiles), 
    [selectedTiles, mode]
  )

  // 获取建议视图数据
  const getAdviceView = () => {
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

  return {
    // 状态
    wall,
    selectedTiles,
    message,
    tingCandidates,
    isWallFull,
    canAddMore,
    finalResult,
    mode,
    
    // 操作方法
    addTileToWall,
    removeTileFromWall,
    clearWall,
    changeMode,
    
    // 计算属性
    getAdviceView,
    getModeName: () => getModeName(mode),
    
    // 工具函数
    canAddTile: (tile: MahjongTile) => {
      const strategy = MahjongStrategyFactory.createStrategy(mode)
      return strategy.canAddTile(selectedTiles, tile)
    }
  }
}