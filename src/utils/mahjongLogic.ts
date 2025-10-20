// 麻将胡牌判断逻辑工具函数 - 策略模式重构（数组存储优化）
import { MahjongTile, MahjongMode } from '../types/mahjong'

type Suit = MahjongTile['suit']
type SimpleTile = { suit: Suit; value: number }

// 数组索引映射：0-9: 万子, 10-19: 筒子, 20-29: 条子
const SUIT_BASE: Record<Suit, number> = {
  'characters': 0,
  'dots': 10, 
  'bamboos': 20
}

const getTileIndex = (tile: SimpleTile | MahjongTile): number => {
  return SUIT_BASE[tile.suit] + tile.value
}

const indexToTile = (index: number): SimpleTile => {
  if (index < 10) return { suit: 'characters', value: index }
  if (index < 20) return { suit: 'dots', value: index - 10 }
  return { suit: 'bamboos', value: index - 20 }
}

// 数组存储类 - 高性能麻将牌存储
class MahjongArrayStorage {
  private data: number[] = new Array(30).fill(0)
  
  // 从牌列表初始化
  static fromTiles(tiles: SimpleTile[]): MahjongArrayStorage {
    const storage = new MahjongArrayStorage()
    tiles.forEach(tile => storage.addTile(tile))
    return storage
  }
  
  // 添加牌
  addTile(tile: SimpleTile): void {
    const index = getTileIndex(tile)
    this.data[index]++
  }
  
  // 移除牌
  removeTile(tile: SimpleTile): void {
    const index = getTileIndex(tile)
    if (this.data[index] > 0) {
      this.data[index]--
    }
  }
  
  // 获取牌数量
  getCount(tile: SimpleTile): number {
    return this.data[getTileIndex(tile)]
  }
  
  // 获取所有牌（用于序列化）
  toTiles(): SimpleTile[] {
    const tiles: SimpleTile[] = []
    for (let i = 0; i < 30; i++) {
      for (let j = 0; j < this.data[i]; j++) {
        tiles.push(indexToTile(i))
      }
    }
    return tiles
  }
  
  // 获取非零牌索引（用于快速遍历）
  getNonZeroIndices(): number[] {
    const indices: number[] = []
    for (let i = 0; i < 30; i++) {
      if (this.data[i] > 0) indices.push(i)
    }
    return indices
  }
  
  // 获取指定索引的牌数量（替代直接访问data）
  getCountByIndex(index: number): number {
    return this.data[index]
  }
  
  // 克隆数据数组（替代直接访问data）
  cloneData(): number[] {
    return [...this.data]
  }
  
  // 克隆存储
  clone(): MahjongArrayStorage {
    const cloned = new MahjongArrayStorage()
    cloned.data = [...this.data]
    return cloned
  }
}

// 保持向后兼容的keyOf函数
const keyOf = (t: SimpleTile | MahjongTile) => `${t.suit}-${t.value}`

/**
 * 麻将策略接口
 */
interface MahjongStrategy {
  // 判断是否可以添加牌
  canAddTile(selectedTiles: MahjongTile[], tile: MahjongTile): boolean
  
  // 判断胡牌
  canHu(tiles14: SimpleTile[], mode: MahjongMode): { win: boolean; allPungs?: boolean; type?: string }
  
  // 计算听牌候选
  calculateTingCandidates(selectedTiles: MahjongTile[], mode: MahjongMode, MAHJONG_TILES: MahjongTile[]): MahjongTile[]
  
  // 判断是否是特殊牌（如幺鸡麻将中的幺鸡）
  isSpecialTile?(tile: SimpleTile | MahjongTile): boolean
}

/**
 * 成都麻将策略
 */
class ChengduMahjongStrategy implements MahjongStrategy {
  canAddTile(selectedTiles: MahjongTile[], tile: MahjongTile): boolean {
    if (selectedTiles.length >= 14) return false

    // 单牌最多4张
    const sameCount = selectedTiles.filter(t => keyOf(t) === keyOf(tile)).length
    if (sameCount >= 4) return false

    // 获取当前已选牌的花色
    const suits = suitsUsed(selectedTiles.map(t => ({ suit: t.suit, value: t.value })))
    
    // 如果当前牌的花色已经在已选花色中，可以添加
    if (suits.has(tile.suit)) return true
    
    // 如果当前牌的花色不在已选花色中，但已选花色少于2个，可以添加
    if (suits.size < 2) return true
    
    return false
  }

  canHu(tiles14: SimpleTile[], mode: MahjongMode): { win: boolean; allPungs?: boolean; type?: string } {
    if (tiles14.length !== 14) return { win: false }
    
    // 七对/龙七对判断
    if (isSevenPairs(tiles14)) {
      const cm = countMap(tiles14)
      const hasQuad = Array.from(cm.values()).some(c => c === 4)
      return { win: true, type: hasQuad ? '龙七对' : '七对' }
    }
    
    // 对对胡判断（优先检查，性能优化）
    if (isAllPungs(tiles14)) {
      return { win: true, type: '对对胡', allPungs: true }
    }
    
    // 标准胡牌判断（平胡）
    const std = canFormStandardWin(tiles14)
    if (std.win) {
      return { win: true, type: '平胡', allPungs: false }
    }
    
    return { win: false }
  }

  calculateTingCandidates(selectedTiles: MahjongTile[], mode: MahjongMode, MAHJONG_TILES: MahjongTile[]): MahjongTile[] {
    if (selectedTiles.length >= 14) return []
    
    const base = selectedTiles.map(t => ({ suit: t.suit, value: t.value }))
    const baseStorage = MahjongArrayStorage.fromTiles(base)
    
    // 已用花色集合（限制最多两个花色）
    const usedSuits = suitsUsed(base)
    
    // 预计算可能的听牌候选
    const candidates: MahjongTile[] = []
    
    // 快速遍历所有可能的牌
    for (const tile of MAHJONG_TILES) {
      const tileIndex = getTileIndex(tile)
      const currentCount = baseStorage.getCountByIndex(tileIndex)
      
      // 检查牌数限制
      if (currentCount >= 4) continue
      
      // 检查花色限制
      if (usedSuits.size >= 2 && !usedSuits.has(tile.suit)) continue
      
      // 快速胡牌判断
      const testStorage = baseStorage.clone()
      testStorage.addTile(tile)
      const testTiles = testStorage.toTiles()
      
      // 检查七对
      if (isSevenPairs(testTiles)) {
        candidates.push(tile)
        continue
      }
      
      // 检查标准胡牌
      const stdResult = canFormStandardWin(testTiles)
      if (stdResult.win) {
        candidates.push(tile)
      }
    }
    
    // 去重（同一张牌只保留一个）
    return candidates.filter((tile, index, self) => 
      index === self.findIndex(t => keyOf(t) === keyOf(tile))
    )
  }
}

/**
 * 幺鸡麻将策略
 */
class YaojiMahjongStrategy implements MahjongStrategy {
  isSpecialTile(tile: SimpleTile | MahjongTile): boolean {
    return tile.suit === 'bamboos' && tile.value === 1
  }

  canAddTile(selectedTiles: MahjongTile[], tile: MahjongTile): boolean {
    if (selectedTiles.length >= 14) return false

    // 单牌最多4张
    const sameCount = selectedTiles.filter(t => keyOf(t) === keyOf(tile)).length
    if (sameCount >= 4) return false

    // 幺鸡（一条）作为癞子，任何时候都可以选择
    if (isYaoji(tile)) {
      return true
    }

    // 获取当前已选牌的花色（排除幺鸡）
    const nonYaojiTiles = selectedTiles.filter(t => !isYaoji(t))
    
    if (nonYaojiTiles.length === 0) return true
    
    // 获取当前已选牌的花色（排除幺鸡）
    const suits = suitsUsed(nonYaojiTiles.map(t => ({ suit: t.suit, value: t.value })))
    
    // 幺鸡麻将特殊规则：如果同时选择了万子和筒子，就不能再选择条子（除了幺鸡）
    const hasBothCharacterAndDot = suits.has('characters') && suits.has('dots')
    
    // 如果已选牌中同时有万子和筒子，且当前牌是条子（非幺鸡），则不能添加
    if (hasBothCharacterAndDot && tile.suit === 'bamboos' && !isYaoji(tile)) {
      return false
    }

    // 如果当前牌的花色已经在已选花色中，可以添加
    if (suits.has(tile.suit)) return true
    
    // 如果当前牌的花色不在已选花色中，但已选花色少于2个，可以添加
    if (suits.size < 2) return true
    
    return false
  }

  canHu(tiles14: SimpleTile[], mode: MahjongMode): { win: boolean; allPungs?: boolean; type?: string } {
    if (tiles14.length !== 14) return { win: false }
    
    // 七对/龙七对判断（支持幺鸡）
    if (isSevenPairsWithYaoji(tiles14)) {
      const cm = countMap(tiles14.filter(t => !this.isSpecialTile(t)))
      const hasQuad = Array.from(cm.values()).some(c => c === 4)
      return { win: true, type: hasQuad ? '龙七对' : '七对' }
    }
    
    // 标准胡牌判断（支持幺鸡）
    const std = canFormStandardWinWithYaoji(tiles14)
    if (std.win) {
      return { win: true, type: std.allPungs ? '对对胡' : '平胡', allPungs: std.allPungs }
    }
    
    return { win: false }
  }

  calculateTingCandidates(selectedTiles: MahjongTile[], mode: MahjongMode, MAHJONG_TILES: MahjongTile[]): MahjongTile[] {
    if (selectedTiles.length >= 14) return []
    
    const base = selectedTiles.map(t => ({ suit: t.suit, value: t.value }))
    const baseCounts = countMap(base)

    // 已用花色集合（限制最多两个花色）
    const usedSuits = suitsUsed(base.filter(t => !this.isSpecialTile(t)))
    
    return MAHJONG_TILES
      .filter(tile => {
        const k = keyOf(tile)
        const cnt = baseCounts.get(k) || 0
        if (cnt >= 4) return false
        
        // 幺鸡（一条）作为癞子，任何时候都可以选择
        if (this.isSpecialTile(tile)) {
          return true
        }
        
        // 幺鸡麻将特殊规则：花色限制
        const hasCharacterOrDot = usedSuits.has('characters') || usedSuits.has('dots')
        const hasBamboo = usedSuits.has('bamboos')
        
        // 如果已选牌中有万子或筒子，且当前牌是条子（非幺鸡），则不能添加
        if (hasCharacterOrDot && tile.suit === 'bamboos' && !this.isSpecialTile(tile)) {
          return false
        }
        
        // 如果已选牌中有条子（非幺鸡），且当前牌是万子或筒子，则不能添加
        if (hasBamboo && (tile.suit === 'characters' || tile.suit === 'dots')) {
          return false
        }
        
        // 标准花色限制
        if (usedSuits.size >= 2 && !usedSuits.has(tile.suit)) return false
        return true
      })
      .filter(tile => {
        const test = [...base, { suit: tile.suit, value: tile.value }]
        // 七对/龙七对（支持幺鸡）
        if (isSevenPairsWithYaoji(test)) return true
        const std = canFormStandardWinWithYaoji(test)
        return std.win
      })
      // 去重（同一张牌只保留一个）
      .reduce((acc: MahjongTile[], t) => {
        if (!acc.find(x => keyOf(x) === keyOf(t))) acc.push(t)
        return acc
      }, [])
  }
}

/**
 * 策略工厂
 */
class MahjongStrategyFactory {
  static createStrategy(mode: MahjongMode): MahjongStrategy {
    switch (mode) {
      case 'yaoji':
        return new YaojiMahjongStrategy()
      case 'chengdu':
      default:
        return new ChengduMahjongStrategy()
    }
  }
}

// ========== 基础工具函数 ==========

/**
 * 统计牌的数量映射（数组优化版）
 */
export const countMap = (tiles: SimpleTile[]) => {
  const storage = MahjongArrayStorage.fromTiles(tiles)
  // 保持Map接口兼容性
  const m = new Map<string, number>()
  for (let i = 0; i < 30; i++) {
    const count = storage.getCountByIndex(i)
    if (count > 0) {
      const tile = indexToTile(i)
      m.set(keyOf(tile), count)
    }
  }
  return m
}

/**
 * 获取已使用的花色集合
 */
export const suitsUsed = (tiles: SimpleTile[]) => {
  const s = new Set<Suit>()
  tiles.forEach(t => s.add(t.suit))
  return s
}

/**
 * 七对/龙七对判断（数组优化版）：所有牌能分成七对；四张算两对（龙七对）
 */
export const isSevenPairs = (tiles14: SimpleTile[]) => {
  if (tiles14.length !== 14) return false
  
  const storage = MahjongArrayStorage.fromTiles(tiles14)
  let pairs = 0
  for (let i = 0; i < 30; i++) {
    const count = storage.getCountByIndex(i)
    if (count === 0) continue
    if (count === 2) pairs += 1
    else if (count === 4) pairs += 2
    else return false
  }
  return pairs === 7
}

/**
 * 对对胡判断（数组优化版）：所有面子都是刻子（三张相同牌）
 */
export const isAllPungs = (tiles14: SimpleTile[]) => {
  if (tiles14.length !== 14) return false
  
  const storage = MahjongArrayStorage.fromTiles(tiles14)
  const data = storage.cloneData()
  
  // 对对胡必须满足：一对将 + 4个刻子
  let pairCount = 0
  let pungsCount = 0
  
  for (let i = 0; i < 30; i++) {
    const count = data[i]
    if (count === 0) continue
    
    if (count === 2) {
      pairCount++
    } else if (count === 3) {
      pungsCount++
    } else if (count === 4) {
      // 对对胡不能有4张牌，因为无法组成标准对对胡结构
      return false
    } else if (count === 1) {
      // 对对胡不能有单张牌
      return false
    }
  }
  
  // 必须正好有一对将和4个刻子
  return pairCount === 1 && pungsCount === 4
}

/**
 * 七对/龙七对判断（支持幺鸡）
 */
export const isSevenPairsWithYaoji = (tiles14: SimpleTile[]) => {
  if (tiles14.length !== 14) return false
  
  const yaojiTiles = tiles14.filter(t => t.suit === 'bamboos' && t.value === 1)
  const yaojiCount = yaojiTiles.length
  const otherTiles = tiles14.filter(t => !(t.suit === 'bamboos' && t.value === 1))
  const m = countMap(otherTiles)
  
  // 统计非幺鸡牌的对数
  let pairs = 0
  let remainingYaoji = yaojiCount // 使用可变变量处理幺鸡计数
  
  for (const c of m.values()) {
    if (c === 2) pairs += 1
    else if (c === 4) pairs += 2
    else if (c === 1 || c === 3) {
      // 单张或三张需要幺鸡来配对
      if (remainingYaoji >= 1) {
        pairs += 1
        // 消耗一个幺鸡
        remainingYaoji--
      } else {
        return false
      }
    }
  }
  
  // 剩余的幺鸡需要成对
  if (remainingYaoji % 2 !== 0) return false
  pairs += remainingYaoji / 2
  
  return pairs === 7
}

/**
 * 标准胡牌判断（数组优化版）：选一对将，剩余12张能分成4个面子（顺子或刻子）
 */
export const canFormStandardWin = (tiles14: SimpleTile[]) => {
  if (tiles14.length !== 14) return { win: false, allPungs: false }
  
  // 先检查是否是对对胡（性能优化：直接调用专门函数）
  if (isAllPungs(tiles14)) {
    return { win: true, allPungs: true }
  }
  
  const storage = MahjongArrayStorage.fromTiles(tiles14)
  
  // 递归函数：判断是否能组成面子
  const canFormMelds = (data: number[], remainingTiles: number): boolean => {
    if (remainingTiles === 0) return true
    
    // 找到第一个非零牌
    let firstIndex = -1
    for (let i = 0; i < 30; i++) {
      if (data[i] > 0) {
        firstIndex = i
        break
      }
    }
    if (firstIndex === -1) return false
    
    // 尝试刻子（三张相同牌）
    if (data[firstIndex] >= 3) {
      const newData = [...data]
      newData[firstIndex] -= 3
      if (canFormMelds(newData, remainingTiles - 3)) {
        return true
      }
    }
    
    // 尝试顺子（同花色连续三张）
    const suit = indexToTile(firstIndex).suit
    const base = SUIT_BASE[suit]
    const value = firstIndex - base
    
    // 检查是否能组成顺子（v, v+1, v+2）
    if (value <= 7 && data[firstIndex] > 0 && data[firstIndex + 1] > 0 && data[firstIndex + 2] > 0) {
      const newData = [...data]
      newData[firstIndex]--
      newData[firstIndex + 1]--
      newData[firstIndex + 2]--
      if (canFormMelds(newData, remainingTiles - 3)) {
        return true
      }
    }
    
    return false
  }
  
  // 尝试每种将（任意牌>=2）
  for (let i = 0; i < 30; i++) {
    if (storage.getCountByIndex(i) >= 2) {
      const newData = storage.cloneData()
      newData[i] -= 2 // 移除一对将
      
      if (canFormMelds(newData, 12)) {
        return { win: true, allPungs: false }
      }
    }
  }
  
  return { win: false, allPungs: false }
}

/**
 * 标准胡牌判断（支持幺鸡）
 */
export const canFormStandardWinWithYaoji = (tiles14: SimpleTile[]) => {
  if (tiles14.length !== 14) return { win: false, allPungs: false }
  
  const yaojiTiles = tiles14.filter(t => t.suit === 'bamboos' && t.value === 1)
  const normalTiles = tiles14.filter(t => !(t.suit === 'bamboos' && t.value === 1))
  const yaojiCount = yaojiTiles.length
  
  // 递归函数，尝试用幺鸡作为癞子来组成面子
  const tryFormMeldsWithYaoji = (tiles: SimpleTile[], remainingYaoji: number): { win: boolean, allPungs: boolean } => {
    if (tiles.length === 0) return { win: true, allPungs: true }
    
    // 尝试刻子
    if (tiles.length >= 3) {
      const firstTile = tiles[0]
      const sameTiles = tiles.filter(t => keyOf(t) === keyOf(firstTile))
      if (sameTiles.length >= 3) {
        const result = tryFormMeldsWithYaoji(tiles.slice(3), remainingYaoji)
        if (result.win) return { win: true, allPungs: result.allPungs }
      }
      
      // 用幺鸡补刻子
      if (sameTiles.length >= 2 && remainingYaoji >= 1) {
        const result = tryFormMeldsWithYaoji(tiles.slice(2), remainingYaoji - 1)
        if (result.win) return { win: true, allPungs: false }
      }
      
      if (sameTiles.length >= 1 && remainingYaoji >= 2) {
        const result = tryFormMeldsWithYaoji(tiles.slice(1), remainingYaoji - 2)
        if (result.win) return { win: true, allPungs: false }
      }
    }
    
    // 尝试顺子（同花色连续三张）
    if (tiles.length >= 3) {
      const firstTile = tiles[0]
      const secondTile = tiles.find(t => t.suit === firstTile.suit && t.value === firstTile.value + 1)
      const thirdTile = tiles.find(t => t.suit === firstTile.suit && t.value === firstTile.value + 2)
      
      if (secondTile && thirdTile) {
        const remaining = tiles.filter((t, i) => i !== 0 && keyOf(t) !== keyOf(secondTile) && keyOf(t) !== keyOf(thirdTile))
        const result = tryFormMeldsWithYaoji(remaining, remainingYaoji)
        if (result.win) return { win: true, allPungs: false }
      }
      
      // 用幺鸡补顺子
      if (secondTile && remainingYaoji >= 1) {
        const remaining = tiles.filter((t, i) => i !== 0 && keyOf(t) !== keyOf(secondTile))
        const result = tryFormMeldsWithYaoji(remaining, remainingYaoji - 1)
        if (result.win) return { win: true, allPungs: false }
      }
      
      if (thirdTile && remainingYaoji >= 1) {
        const remaining = tiles.filter((t, i) => i !== 0 && keyOf(t) !== keyOf(thirdTile))
        const result = tryFormMeldsWithYaoji(remaining, remainingYaoji - 1)
        if (result.win) return { win: true, allPungs: false }
      }
      
      if (remainingYaoji >= 2) {
        const remaining = tiles.slice(1)
        const result = tryFormMeldsWithYaoji(remaining, remainingYaoji - 2)
        if (result.win) return { win: true, allPungs: false }
      }
    }
    
    return { win: false, allPungs: false }
  }
  
  // 尝试每种将（任意牌>=2，或者用幺鸡补将）
  const m = countMap(normalTiles)
  const allKeys = Array.from(m.keys())
  
  // 尝试正常将
  for (const k of allKeys) {
    if (m.get(k)! >= 2) {
      const [suitStr, valStr] = k.split('-')
      const suit = suitStr as Suit
      const val = parseInt(valStr, 10)
      
      const remainingTiles = normalTiles.filter(t => !(t.suit === suit && t.value === val))
      const result = tryFormMeldsWithYaoji(remainingTiles, yaojiCount)
      if (result.win) return result
    }
  }
  
  // 尝试用幺鸡补将
  if (yaojiCount >= 2) {
    const result = tryFormMeldsWithYaoji(normalTiles, yaojiCount - 2)
    if (result.win) return result
  }
  
  return { win: false, allPungs: false }
}

/**
 * 麻将牌排序函数：按照花色（万、筒、条）和牌面数字排序
 */
export const sortMahjongTiles = (tiles: MahjongTile[]) => {
  // 花色优先级：万子 > 筒子 > 条子
  const suitOrder = { 'characters': 1, 'dots': 2, 'bamboos': 3 }
  
  return [...tiles].sort((a, b) => {
    // 先按花色排序
    if (suitOrder[a.suit] !== suitOrder[b.suit]) {
      return suitOrder[a.suit] - suitOrder[b.suit]
    }
    // 同花色按牌面数字排序
    return a.value - b.value
  })
}

/**
 * 判断是否是幺鸡（一条）
 */
export const isYaoji = (tile: SimpleTile | MahjongTile) => {
  return tile.suit === 'bamboos' && tile.value === 1
}



// 导出策略接口和工厂，供其他模块使用
export { MahjongStrategyFactory }
export type { MahjongStrategy }