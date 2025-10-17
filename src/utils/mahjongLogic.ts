// 麻将胡牌判断逻辑工具函数 - 策略模式重构
import { MahjongTile, MahjongMode } from '../types/mahjong'

type Suit = MahjongTile['suit']
type SimpleTile = { suit: Suit; value: number }

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
    
    // 标准胡牌判断
    const std = canFormStandardWin(tiles14)
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
    const usedSuits = suitsUsed(base)
    
    return MAHJONG_TILES
      .filter(tile => {
        const k = keyOf(tile)
        const cnt = baseCounts.get(k) || 0
        if (cnt >= 4) return false
        
        // 标准花色限制
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
 * 统计牌的数量映射
 */
export const countMap = (tiles: SimpleTile[]) => {
  const m = new Map<string, number>()
  tiles.forEach(t => {
    const k = keyOf(t)
    m.set(k, (m.get(k) || 0) + 1)
  })
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
 * 七对/龙七对判断：所有牌能分成七对；四张算两对（龙七对）
 */
export const isSevenPairs = (tiles14: SimpleTile[]) => {
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
 * 标准胡牌判断（平胡/对对胡）：选一对将，剩余12张能分成4个面子（顺子或刻子）
 */
export const canFormStandardWin = (tiles14: SimpleTile[]) => {
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