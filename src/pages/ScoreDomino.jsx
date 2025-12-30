import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import AddDominoGame from '../components/AddDominoGame.jsx'
import { Link } from 'react-router-dom'


function ScoreDomino() {
  const [games, setGames] = useState([])
  const [modalAdd, setModalAdd] = useState(true)

   useEffect(() => {
    const fetchGames = async () => {
      const snapshot = await getDocs(collection(db, 'domino'))
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setGames(data)
    }

    fetchGames()
  }, [])

  const renderPlayers = (game) => {
    if (game.gameType === 'Individual') {
      return `${game.players[0]} vs ${game.players[1]}`
    }

    if (game.gameType === 'Parejas') {
      return (
        <>
          <p>{game.team1.join(' & ')}</p>
          vs
          <p>{game.team2.join(' & ')}</p>
        </>
      )
    }

    return '—'
  }

  const renderWinner = (game) => {
    if (game.gameType === 'Individual') {
      return game.winner
    }

    if (game.gameType === 'Parejas') {
      return game.winner === 'Equipo 1'
        ? `Equipo 1 (${game.team1.join(' & ')})`
        : `Equipo 2 (${game.team2.join(' & ')})`
    }

    return '—'
  }

  return (
    <>
      <div className="content-score">
        <div className="container">
          <div className="body">
            <Link to="/domino" className='btn-back'><i className='icon icon-arrow-left'></i>Atras</Link>
            <div className="flex flex-col lg:flex-row lg:items-center md:justify-between gap-4">
              <h1>Score Dominos</h1>
              <button type="button" className="btn-add" onClick={() => setModalAdd(true)}>Comenzar a jugar</button>
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
                  {games.length === 0 && (
                    <tr>
                      <td colSpan="5">No hay juegos registrados</td>
                    </tr>
                  )}
                  {games.map(game => (
                    <tr key={game.id}>
                      <td>{renderPlayers(game)}</td>
                      <td>{game.gameType}</td>
                      <td>{game.score}</td>
                      <td>{renderWinner(game)}</td>
                      <td>{game.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {modalAdd && (
        <AddDominoGame
          closeModal={() => setModalAdd(false)}
          onAddGame={(newGame) =>
            setGames(prev => [...prev, newGame])
          }
        />
      )}
    </>
  )
}

export default ScoreDomino