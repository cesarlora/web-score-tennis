import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './components/utilities/text.css'
import './index.css'
import Header from './components/Header.jsx'
import Home from './pages/Home.jsx'
import Players from './pages/Players.jsx'
import Score from './pages/Score.jsx'

function App() { 

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/score" element={<Score />} />
        <Route path="/players" element={<Players />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
