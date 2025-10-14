import React from 'react'
import { useNavigate } from 'react-router-dom'

const HomePage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 page-transition">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          选择游戏
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* 麻将按钮 */}
        <button
          onClick={() => navigate('/mahjong')}
          className="group relative bg-red-500 hover:bg-red-600 text-white p-8 rounded-2xl shadow-lg card-hover transform transition-all duration-300"
        >
          <div className="flex flex-col items-center">
            <span className="text-6xl mb-4">🀄</span>
            <span className="text-2xl font-semibold">麻将</span>
          </div>
        </button>

        {/* 德州扑克按钮 */}
        <button
          onClick={() => navigate('/poker')}
          className="group relative bg-blue-500 hover:bg-blue-600 text-white p-8 rounded-2xl shadow-lg card-hover transform transition-all duration-300"
        >
          <div className="flex flex-col items-center">
            <span className="text-6xl mb-4">♠️♥️♣️♦️</span>
            <span className="text-2xl font-semibold">德州扑克</span>
          </div>
        </button>
      </div>
    </div>
  )
}

export default HomePage