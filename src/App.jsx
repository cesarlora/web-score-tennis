import { useState, useEffect } from 'react'
import './components/utilities/text.css'
import './index.css'
import Header from './components/Header.jsx'
import AddMatch from './components/AddMatch.jsx'
import { collection, getDocs } from 'firebase/firestore'
import { db } from './firebase'

function App() {
  const [modalAdd, setModalAdd] = useState(false)
  const [matches, setMatches] = useState([])

 useEffect(() => {
    const fetchMatches = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'matches'))
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setMatches(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchMatches()
  }, [])

  const addMatch = (newMatch) => {
    setMatches(prev => [...prev, newMatch])
  }

   const renderPlayers = (match) => {
    if (match.matchType === 'Individual' || match.matchType === 'Tie-Break') {
      return `${match.player1?.name || match.player1} vs ${match.player2?.name || match.player2}`
    }

    if (match.matchType === 'Dobles') {
      const team1 = match.team1?.map(p => p.name).join(' & ')
      const team2 = match.team2?.map(p => p.name).join(' & ')
      return `${team1} vs ${team2}`
    }

    return '-'
  }
  

  return (
    <>
      <Header openModal={() => setModalAdd(true)} />
      <div className="content-score">
        <div className="container">
          <div className="block space-y-8">
            <h1>Score Tennis</h1>
            <div className="body-table">
              <table>
                <thead>
                  <tr>
                    <th>Jugadores</th>
                    <th>Tipo de partido</th>
                    <th>Resultado</th>
                    <th>Ganador</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center' }}>
                        No hay partidos registrados
                      </td>
                    </tr>
                  )}
                  {matches.map((match, index) => (
                    <tr key={index}>
                      <td>{renderPlayers(match)}</td>
                      <td>{match.matchType}</td>
                      <td>{match.result}</td>
                      <td>{match.winner}</td>
                      <td>{match.date}</td>
                  </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {modalAdd && (
        <AddMatch 
          closeModal={() => setModalAdd(false)} 
          onAddMatch={addMatch}
        />
      )}
    </>
  )
}

export default App
