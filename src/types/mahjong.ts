export interface MahjongTile {
  id: string
  suit: 'characters' | 'bamboos' | 'dots'
  value: number
  unicode: string
  name: string
}

export interface MahjongWall {
  tiles: (MahjongTile | null)[]
}

export const MAHJONG_TILES: MahjongTile[] = [
  // 万子 (Characters)
  { id: 'c1', suit: 'characters', value: 1, unicode: '🀇', name: '一万' },
  { id: 'c2', suit: 'characters', value: 2, unicode: '🀈', name: '二万' },
  { id: 'c3', suit: 'characters', value: 3, unicode: '🀉', name: '三万' },
  { id: 'c4', suit: 'characters', value: 4, unicode: '🀊', name: '四万' },
  { id: 'c5', suit: 'characters', value: 5, unicode: '🀋', name: '五万' },
  { id: 'c6', suit: 'characters', value: 6, unicode: '🀌', name: '六万' },
  { id: 'c7', suit: 'characters', value: 7, unicode: '🀍', name: '七万' },
  { id: 'c8', suit: 'characters', value: 8, unicode: '🀎', name: '八万' },
  { id: 'c9', suit: 'characters', value: 9, unicode: '🀏', name: '九万' },
  
  // 筒子 (Dots)
  { id: 'd1', suit: 'dots', value: 1, unicode: '🀙', name: '一筒' },
  { id: 'd2', suit: 'dots', value: 2, unicode: '🀚', name: '二筒' },
  { id: 'd3', suit: 'dots', value: 3, unicode: '🀛', name: '三筒' },
  { id: 'd4', suit: 'dots', value: 4, unicode: '🀜', name: '四筒' },
  { id: 'd5', suit: 'dots', value: 5, unicode: '🀝', name: '五筒' },
  { id: 'd6', suit: 'dots', value: 6, unicode: '🀞', name: '六筒' },
  { id: 'd7', suit: 'dots', value: 7, unicode: '🀟', name: '七筒' },
  { id: 'd8', suit: 'dots', value: 8, unicode: '🀠', name: '八筒' },
  { id: 'd9', suit: 'dots', value: 9, unicode: '🀡', name: '九筒' },
  
  // 条子 (Bamboos)
  { id: 'b1', suit: 'bamboos', value: 1, unicode: '🀐', name: '一条' },
  { id: 'b2', suit: 'bamboos', value: 2, unicode: '🀑', name: '二条' },
  { id: 'b3', suit: 'bamboos', value: 3, unicode: '🀒', name: '三条' },
  { id: 'b4', suit: 'bamboos', value: 4, unicode: '🀓', name: '四条' },
  { id: 'b5', suit: 'bamboos', value: 5, unicode: '🀔', name: '五条' },
  { id: 'b6', suit: 'bamboos', value: 6, unicode: '🀕', name: '六条' },
  { id: 'b7', suit: 'bamboos', value: 7, unicode: '🀖', name: '七条' },
  { id: 'b8', suit: 'bamboos', value: 8, unicode: '🀗', name: '八条' },
  { id: 'b9', suit: 'bamboos', value: 9, unicode: '🀘', name: '九条' },
]

export const createEmptyWall = (): MahjongWall => ({
  tiles: Array(14).fill(null)
})