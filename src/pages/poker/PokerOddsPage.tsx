import React from 'react'
import { useNavigate } from 'react-router-dom'

const PREFLOP_ODDS = [
  { hand: 'AA', vsRandom: '85.3%', vs1Opponent: '85.2%', vs2Opponents: '73.4%', vs9Opponents: '31.1%' },
  { hand: 'KK', vsRandom: '82.4%', vs1Opponent: '82.1%', vs2Opponents: '68.7%', vs9Opponents: '26.1%' },
  { hand: 'QQ', vsRandom: '79.9%', vs1Opponent: '79.6%', vs2Opponents: '64.9%', vs9Opponents: '23.1%' },
  { hand: 'JJ', vsRandom: '77.5%', vs1Opponent: '77.2%', vs2Opponents: '61.5%', vs9Opponents: '20.4%' },
  { hand: 'TT', vsRandom: '75.1%', vs1Opponent: '74.8%', vs2Opponents: '58.2%', vs9Opponents: '18.1%' },
  { hand: '99', vsRandom: '72.1%', vs1Opponent: '71.7%', vs2Opponents: '54.7%', vs9Opponents: '15.8%' },
  { hand: '88', vsRandom: '69.1%', vs1Opponent: '68.7%', vs2Opponents: '51.3%', vs9Opponents: '13.8%' },
  { hand: '77', vsRandom: '66.2%', vs1Opponent: '65.8%', vs2Opponents: '48.1%', vs9Opponents: '12.1%' },
  { hand: '66', vsRandom: '63.3%', vs1Opponent: '62.9%', vs2Opponents: '45.1%', vs9Opponents: '10.6%' },
  { hand: '55', vsRandom: '60.4%', vs1Opponent: '60.0%', vs2Opponents: '42.3%', vs9Opponents: '9.3%' },
  { hand: '44', vsRandom: '57.6%', vs1Opponent: '57.2%', vs2Opponents: '39.6%', vs9Opponents: '8.2%' },
  { hand: '33', vsRandom: '54.8%', vs1Opponent: '54.4%', vs2Opponents: '37.1%', vs9Opponents: '7.2%' },
  { hand: '22', vsRandom: '52.0%', vs1Opponent: '51.6%', vs2Opponents: '34.7%', vs9Opponents: '6.4%' },
  { hand: 'AKs', vsRandom: '67.0%', vs1Opponent: '66.5%', vs2Opponents: '50.7%', vs9Opponents: '20.7%' },
  { hand: 'AQs', vsRandom: '66.1%', vs1Opponent: '65.6%', vs2Opponents: '49.8%', vs9Opponents: '19.5%' },
  { hand: 'AJs', vsRandom: '65.4%', vs1Opponent: '64.9%', vs2Opponents: '49.0%', vs9Opponents: '18.5%' },
  { hand: 'ATs', vsRandom: '64.7%', vs1Opponent: '64.2%', vs2Opponents: '48.2%', vs9Opponents: '17.6%' },
  { hand: 'AKo', vsRandom: '65.4%', vs1Opponent: '64.9%', vs2Opponents: '49.0%', vs9Opponents: '18.5%' },
  { hand: 'AQo', vsRandom: '64.5%', vs1Opponent: '64.0%', vs2Opponents: '48.1%', vs9Opponents: '17.4%' },
  { hand: 'AJo', vsRandom: '63.6%', vs1Opponent: '63.1%', vs2Opponents: '47.2%', vs9Opponents: '16.4%' },
  { hand: 'KQs', vsRandom: '63.4%', vs1Opponent: '62.9%', vs2Opponents: '47.0%', vs9Opponents: '16.2%' },
]

const PokerOddsPage: React.FC = () => {
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

      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">德州扑克翻前胜率表</h1>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-orange-500 to-red-600">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">手牌</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">vs随机牌</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">vs1个对手</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">vs2个对手</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">vs9个对手</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {PREFLOP_ODDS.map((odds, index) => (
                  <tr 
                    key={odds.hand} 
                    className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {odds.hand}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{odds.vsRandom}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{odds.vs1Opponent}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{odds.vs2Opponents}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{odds.vs9Opponents}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>注：</strong>s表示同花(suited)，o表示不同花(off-suited)。胜率为近似值，实际游戏可能因具体牌局情况有所不同。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PokerOddsPage