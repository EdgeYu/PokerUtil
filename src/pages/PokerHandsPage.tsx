import React from 'react'
import { useNavigate } from 'react-router-dom'



const POKER_HANDS = [
  {
    name: '皇家同花顺',
    description: '同一花色的A、K、Q、J、10',
    example: [
      { rank: 'A', suit: 'spades', suitSymbol: '♠' },
      { rank: 'K', suit: 'spades', suitSymbol: '♠' },
      { rank: 'Q', suit: 'spades', suitSymbol: '♠' },
      { rank: 'J', suit: 'spades', suitSymbol: '♠' },
      { rank: '10', suit: 'spades', suitSymbol: '♠' }
    ],
    strength: 10
  },
  {
    name: '同花顺',
    description: '同一花色的连续五张牌',
    example: [
      { rank: '10', suit: 'hearts', suitSymbol: '♥' },
      { rank: '9', suit: 'hearts', suitSymbol: '♥' },
      { rank: '8', suit: 'hearts', suitSymbol: '♥' },
      { rank: '7', suit: 'hearts', suitSymbol: '♥' },
      { rank: '6', suit: 'hearts', suitSymbol: '♥' }
    ],
    strength: 9
  },
  {
    name: '四条',
    description: '四张相同点数的牌',
    example: [
      { rank: 'A', suit: 'spades', suitSymbol: '♠' },
      { rank: 'A', suit: 'hearts', suitSymbol: '♥' },
      { rank: 'A', suit: 'diamonds', suitSymbol: '♦' },
      { rank: 'A', suit: 'clubs', suitSymbol: '♣' },
      { rank: 'K', suit: 'spades', suitSymbol: '♠' }
    ],
    strength: 8
  },
  {
    name: '葫芦',
    description: '三条加一对',
    example: [
      { rank: 'A', suit: 'spades', suitSymbol: '♠' },
      { rank: 'A', suit: 'hearts', suitSymbol: '♥' },
      { rank: 'A', suit: 'diamonds', suitSymbol: '♦' },
      { rank: 'K', suit: 'spades', suitSymbol: '♠' },
      { rank: 'K', suit: 'hearts', suitSymbol: '♥' }
    ],
    strength: 7
  },
  {
    name: '同花',
    description: '同一花色的五张牌',
    example: [
      { rank: 'A', suit: 'spades', suitSymbol: '♠' },
      { rank: 'Q', suit: 'spades', suitSymbol: '♠' },
      { rank: 'J', suit: 'spades', suitSymbol: '♠' },
      { rank: '9', suit: 'spades', suitSymbol: '♠' },
      { rank: '7', suit: 'spades', suitSymbol: '♠' }
    ],
    strength: 6
  },
  {
    name: '顺子',
    description: '连续点数的五张牌',
    example: [
      { rank: 'A', suit: 'spades', suitSymbol: '♠' },
      { rank: 'K', suit: 'hearts', suitSymbol: '♥' },
      { rank: 'Q', suit: 'diamonds', suitSymbol: '♦' },
      { rank: 'J', suit: 'clubs', suitSymbol: '♣' },
      { rank: '10', suit: 'spades', suitSymbol: '♠' }
    ],
    strength: 5
  },
  {
    name: '三条',
    description: '三张相同点数的牌',
    example: [
      { rank: 'A', suit: 'spades', suitSymbol: '♠' },
      { rank: 'A', suit: 'hearts', suitSymbol: '♥' },
      { rank: 'A', suit: 'diamonds', suitSymbol: '♦' },
      { rank: 'K', suit: 'spades', suitSymbol: '♠' },
      { rank: 'Q', suit: 'hearts', suitSymbol: '♥' }
    ],
    strength: 3
  },
  {
    name: '两对',
    description: '两个不同的对子',
    example: [
      { rank: 'A', suit: 'spades', suitSymbol: '♠' },
      { rank: 'A', suit: 'hearts', suitSymbol: '♥' },
      { rank: 'K', suit: 'spades', suitSymbol: '♠' },
      { rank: 'K', suit: 'hearts', suitSymbol: '♥' },
      { rank: 'Q', suit: 'diamonds', suitSymbol: '♦' }
    ],
    strength: 2
  },
  {
    name: '一对',
    description: '两张相同点数的牌',
    example: [
      { rank: 'A', suit: 'spades', suitSymbol: '♠' },
      { rank: 'A', suit: 'hearts', suitSymbol: '♥' },
      { rank: 'K', suit: 'spades', suitSymbol: '♠' },
      { rank: 'Q', suit: 'hearts', suitSymbol: '♥' },
      { rank: 'J', suit: 'diamonds', suitSymbol: '♦' }
    ],
    strength: 1
  },
  {
    name: '高牌',
    description: '不符合以上任何牌型',
    example: [
      { rank: 'A', suit: 'spades', suitSymbol: '♠' },
      { rank: 'K', suit: 'hearts', suitSymbol: '♥' },
      { rank: 'Q', suit: 'diamonds', suitSymbol: '♦' },
      { rank: 'J', suit: 'clubs', suitSymbol: '♣' },
      { rank: '9', suit: 'spades', suitSymbol: '♠' }
    ],
    strength: 0
  }
]

const PokerHandsPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen p-4 page-transition">
      {/* 返回按钮 */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => navigate('/')}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors"
        >
          ← 回到首页
        </button>
        <button
          onClick={() => navigate('/poker')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors"
        >
          ← 返回扑克主页
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">德州扑克常见牌型</h1>

        <div className="space-y-6">
          {POKER_HANDS.map(hand => (
            <div key={hand.name} className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  {hand.strength}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{hand.name}</h3>
                  <p className="text-gray-600">{hand.description}</p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                {hand.example.map((card, index) => (
                  <div
                    key={index}
                    className={`
                      w-16 h-20 bg-white rounded-lg shadow-md border-2 flex flex-col items-center justify-center p-2
                      ${card.suit === 'hearts' || card.suit === 'diamonds' ? 'border-red-300' : 'border-gray-300'}
                    `}
                  >
                    <div className={`text-lg font-bold ${
                      card.suit === 'hearts' || card.suit === 'diamonds' ? 'text-red-600' : 'text-black'
                    }`}>
                      {card.rank}
                    </div>
                    <div className={`text-2xl ${
                      card.suit === 'hearts' || card.suit === 'diamonds' ? 'text-red-600' : 'text-black'
                    }`}>
                      {card.suitSymbol}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PokerHandsPage