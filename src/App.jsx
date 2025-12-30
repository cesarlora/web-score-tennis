import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './components/utilities/text.css'
import './index.css'
import Header from './components/Header.jsx'
import Home from './pages/Home.jsx'
import Players from './pages/Players.jsx'
import Score from './pages/Score.jsx'
import Tenis from './pages/Tenis.jsx'
import Domino from './pages/Domino.jsx'
import ScoreDomino from './pages/ScoreDomino.jsx'

function App() { 

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/score" element={<Score />} />
        <Route path="/players" element={<Players />} />
        <Route path="/tenis" element={<Tenis />} />
        <Route path="/domino" element={<Domino />} />
        <Route path="/domino/score-domino" element={<ScoreDomino />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
