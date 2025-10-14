import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import MahjongPage from './pages/MahjongPage'
import PokerPage from './pages/PokerPage'
import PokerHandsPage from './pages/PokerHandsPage'
import PokerOddsPage from './pages/PokerOddsPage'
import PokerAnalyzerPage from './pages/PokerAnalyzerPage'
import Footer from './components/Footer'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/mahjong" element={<MahjongPage />} />
            <Route path="/poker" element={<PokerPage />} />
            <Route path="/poker/hands" element={<PokerHandsPage />} />
            <Route path="/poker/odds" element={<PokerOddsPage />} />
            <Route path="/poker/analyzer" element={<PokerAnalyzerPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App