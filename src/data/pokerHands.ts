export type CardSuit = 'spades' | 'hearts' | 'diamonds' | 'clubs'

export interface ExampleCard {
  rank: string
  suit: CardSuit
}

export interface PokerHandDefinition {
  /** 排名，1 为最大 */
  rank: number
  /** 中文牌型名称 */
  name: string
  /** 英文牌型名称 */
  englishName: string
  /** 牌型构成说明 */
  rule: string
  /** 同牌型之间的比牌规则 */
  compare: string
  /** 5 张示例牌 */
  example: ExampleCard[]
}

export const POKER_HANDS: PokerHandDefinition[] = [
  {
    rank: 1,
    name: '皇家同花顺',
    englishName: 'Royal Flush',
    rule: '同一花色的 A、K、Q、J、10。',
    compare: '最大的牌型，几乎不可能被超越。',
    example: [
      { rank: 'A', suit: 'spades' },
      { rank: 'K', suit: 'spades' },
      { rank: 'Q', suit: 'spades' },
      { rank: 'J', suit: 'spades' },
      { rank: '10', suit: 'spades' },
    ],
  },
  {
    rank: 2,
    name: '同花顺',
    englishName: 'Straight Flush',
    rule: '同一花色，连续的 5 张牌。',
    compare: '除皇家同花顺外，按最大一张牌的点数比较大小。',
    example: [
      { rank: '9', suit: 'hearts' },
      { rank: '8', suit: 'hearts' },
      { rank: '7', suit: 'hearts' },
      { rank: '6', suit: 'hearts' },
      { rank: '5', suit: 'hearts' },
    ],
  },
  {
    rank: 3,
    name: '四条',
    englishName: 'Four of a Kind',
    rule: '四张相同点数的牌。',
    compare: '先比较四条的点数，若相同则比较单张。',
    example: [
      { rank: '9', suit: 'clubs' },
      { rank: '9', suit: 'diamonds' },
      { rank: '9', suit: 'hearts' },
      { rank: '9', suit: 'spades' },
      { rank: 'K', suit: 'diamonds' },
    ],
  },
  {
    rank: 4,
    name: '葫芦',
    englishName: 'Full House',
    rule: '三张相同点数 + 一对。',
    compare: '先比较三条的点数，若相同再比较对子。',
    example: [
      { rank: 'Q', suit: 'spades' },
      { rank: 'Q', suit: 'hearts' },
      { rank: 'Q', suit: 'clubs' },
      { rank: '7', suit: 'diamonds' },
      { rank: '7', suit: 'spades' },
    ],
  },
  {
    rank: 5,
    name: '同花',
    englishName: 'Flush',
    rule: '五张同一花色的牌。',
    compare: '按最大一张牌，依次比较到最小一张。',
    example: [
      { rank: 'A', suit: 'clubs' },
      { rank: 'Q', suit: 'clubs' },
      { rank: '8', suit: 'clubs' },
      { rank: '6', suit: 'clubs' },
      { rank: '3', suit: 'clubs' },
    ],
  },
  {
    rank: 6,
    name: '顺子',
    englishName: 'Straight',
    rule: '五张连续点数的牌，花色不同。',
    compare: '按最大一张牌的点数比较大小。A 可作为最小的 1 组成 A‑2‑3‑4‑5，但不能以 K‑Q‑J‑10‑A 连成顺子。',
    example: [
      { rank: '8', suit: 'clubs' },
      { rank: '7', suit: 'diamonds' },
      { rank: '6', suit: 'spades' },
      { rank: '5', suit: 'hearts' },
      { rank: '4', suit: 'clubs' },
    ],
  },
  {
    rank: 7,
    name: '三条',
    englishName: 'Three of a Kind',
    rule: '三张相同点数的牌。',
    compare: '先比较三条的点数，若相同则比较剩余两张的最大牌。',
    example: [
      { rank: 'J', suit: 'spades' },
      { rank: 'J', suit: 'hearts' },
      { rank: 'J', suit: 'clubs' },
      { rank: '8', suit: 'diamonds' },
      { rank: '5', suit: 'spades' },
    ],
  },
  {
    rank: 8,
    name: '两对',
    englishName: 'Two Pair',
    rule: '两组相同点数的牌 + 一张单牌。',
    compare: '先比较较大的对子，再比较较小的对子，若相同则比较单牌。',
    example: [
      { rank: 'K', suit: 'spades' },
      { rank: 'K', suit: 'diamonds' },
      { rank: '6', suit: 'hearts' },
      { rank: '6', suit: 'clubs' },
      { rank: '3', suit: 'spades' },
    ],
  },
  {
    rank: 9,
    name: '一对',
    englishName: 'One Pair',
    rule: '两张相同点数的牌。',
    compare: '先比较对子的点数，若相同则依次比较剩余三张牌。',
    example: [
      { rank: 'A', suit: 'spades' },
      { rank: 'A', suit: 'hearts' },
      { rank: '9', suit: 'clubs' },
      { rank: '6', suit: 'diamonds' },
      { rank: '4', suit: 'spades' },
    ],
  },
  {
    rank: 10,
    name: '高牌',
    englishName: 'High Card',
    rule: '以上牌型都不满足时，按最大一张牌的点数比较。',
    compare: '若最大牌相同，再依次比较第二、第三……直到分出胜负。',
    example: [
      { rank: 'A', suit: 'diamonds' },
      { rank: 'K', suit: 'clubs' },
      { rank: '9', suit: 'spades' },
      { rank: '6', suit: 'hearts' },
      { rank: '2', suit: 'clubs' },
    ],
  },
]
