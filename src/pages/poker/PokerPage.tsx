import React from 'react'
import { useNavigate } from 'react-router-dom'

// 翻前胜率表

const PokerPage: React.FC = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen p-4 page-transition">
            {/* 返回首页按钮 */}
            <button
                onClick={() => navigate('/')}
                className="mb-6 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg shadow-md transition-colors"
            >
                ← 回到首页
            </button>

            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">德州扑克</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* 牌型分析工具 */}
                    <div
                        onClick={() => navigate('/poker/analyzer')}
                        className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-2xl shadow-lg cursor-pointer hover:scale-105 transition-transform"
                    >
                        <div className="text-white text-center">
                            <div className="text-6xl mb-4">🃏</div>
                            <h2 className="text-2xl font-bold mb-2">牌型分析工具</h2>
                            <p className="text-blue-100">选择手牌和公牌，分析可能的牌型组合</p>
                        </div>
                    </div>

                    {/* 常见牌型 */}
                    <div
                        onClick={() => navigate('/poker/hands')}
                        className="bg-gradient-to-br from-green-500 to-teal-600 p-8 rounded-2xl shadow-lg cursor-pointer hover:scale-105 transition-transform"
                    >
                        <div className="text-white text-center">
                            <div className="text-6xl mb-4">🎯</div>
                            <h2 className="text-2xl font-bold mb-2">常见牌型</h2>
                            <p className="text-green-100">查看所有德州扑克牌型及其大小顺序</p>
                        </div>
                    </div>

                    {/* 翻前胜率表 */}
                    <div
                        onClick={() => navigate('/poker/odds')}
                        className="bg-gradient-to-br from-orange-500 to-red-600 p-8 rounded-2xl shadow-lg cursor-pointer hover:scale-105 transition-transform"
                    >
                        <div className="text-white text-center">
                            <div className="text-6xl mb-4">📊</div>
                            <h2 className="text-2xl font-bold mb-2">翻前胜率表</h2>
                            <p className="text-orange-100">查看不同手牌在不同对手数量下的胜率</p>
                        </div>
                    </div>

                    {/* 占位符 */}
                    <div className="bg-gradient-to-br from-gray-500 to-gray-600 p-8 rounded-2xl shadow-lg opacity-50">
                        <div className="text-white text-center">
                            <div className="text-6xl mb-4">🔮</div>
                            <h2 className="text-2xl font-bold mb-2">更多功能</h2>
                            <p className="text-gray-100">敬请期待</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PokerPage