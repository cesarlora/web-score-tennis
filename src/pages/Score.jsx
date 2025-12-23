import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import AddMatch from '../components/AddMatch.jsx'
import AddGame from '../components/AddGame.jsx'

function Score() {
  const [modalAdd, setModalAdd] = useState(false)
  const [modalAddGame, setModalAddGame] = useState(false)
  const [matches, setMatches] = useState([])
  
  const addMatch = (newMatch) => {
    setMatches(prev => [...prev, newMatch])
  }
  
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
  

  const getTeamNames = (team = []) =>
  team.map(p => p.name).join(' & ')

  const renderWinner = (match) => {
    if (match.matchType !== 'Dobles') {
      return match.winner
    }

    if (match.winner === 'Equipo 1') {
      return (
        <>
          <strong>Equipo 1</strong>  
          <br />
          ({getTeamNames(match.team1)})
        </>
      )
    }

    if (match.winner === 'Equipo 2') {
      return (
        <>
          <strong>Equipo 2</strong> 
          <br />
          ({getTeamNames(match.team2)})
        </>
      )
    }

    return '—'
  }

    
  
  const renderPlayers = (match) => {
    if (match.matchType === 'Individual' || match.matchType === 'Tie-Break') {
      return `${match.player1} vs ${match.player2}`
    }

    if (match.matchType === 'Dobles') {
      return (
        <>
          <p>{getTeamNames(match.team1)}</p>
          vs
          <p>{getTeamNames(match.team2)}</p>
        </>
      )
    }

    return '—'
  }

  return (
    <>
       <div className="content-score">
        <div className="container">
          <div className="body">
            <div className="flex flex-col lg:flex-row lg:items-center md:justify-between gap-4">
              <h1>Score Tennis</h1>
              <div className="flex flex-col lg:flex-row gap-2">
                <button type="button" className="btn-add" onClick={() => setModalAdd(true)}>Agregar Resultados</button>
                <button type="button" className="btn-add" onClick={() => setModalAddGame(true)}>Agregar Juego</button>
              </div>
            </div>
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
                      <td>{renderWinner(match)}</td>
                      <td>{match.date}</td>
                  </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {modalAddGame && (
        <AddGame 
          closeModal={() => setModalAddGame(false)}
          onAddMatch={addMatch}
        />
      )}
      {modalAdd && (
        <AddMatch 
          closeModal={() => setModalAdd(false)} 
          onAddMatch={addMatch}
        />
      )}
    </>
  )
}

export default Score