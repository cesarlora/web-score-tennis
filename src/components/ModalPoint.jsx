import { useState, useEffect, useRef } from 'react'
import { addDoc, collection, Timestamp } from 'firebase/firestore'
import { db } from '../firebase'

const POINTS = ['0', '15', '30', '40', 'AD']


function ModalPoint({ match, closeModal }) {
  const { players, numberGame, matchType } = match

  const [score, setScore] = useState({
    points: [0, 0],
    games: [0, 0],
    finished: false,
    winnerIndex: null
  })

  const savedRef = useRef(false)

  const addPoint = (player) => {
    setScore(prev => {
      if (prev.finished) return prev

      const opponent = player === 0 ? 1 : 0
      const points = [...prev.points]
      const games = [...prev.games]

      // Deuce
      if (points[player] === 3 && points[opponent] === 3) {
        points[player] = 4
        return { ...prev, points }
      }

      // Gana con ventaja
      if (points[player] === 4) {
        games[player]++
        return checkWinner({ points: [0, 0], games })
      }

      // Pierde ventaja
      if (points[opponent] === 4) {
        points[opponent] = 3
        return { ...prev, points }
      }

      points[player]++

      // Gana desde 40
      if (points[player] > 3) {
        games[player]++
        return checkWinner({ points: [0, 0], games })
      }

      return { ...prev, points }
    })
  }

   const checkWinner = (state) => {
    const [g1, g2] = state.games

    if (g1 === numberGame) {
      return { ...state, finished: true, winnerIndex: 0 }
    }

    if (g2 === numberGame) {
      return { ...state, finished: true, winnerIndex: 1 }
    }

    return { ...state }
  }

  useEffect(() => {
    if (!score.finished || savedRef.current) return
    savedRef.current = true

    const today = new Date()
    const date = today.toLocaleDateString('es-ES')
    const result = `${score.games[0]}-${score.games[1]}`

    const saveMatch = async () => {
      if (matchType === 'Dobles') {
        await addDoc(collection(db, 'matches'), {
          date,
          matchType,
          result,
          winner: score.winnerIndex === 0 ? 'Equipo 1' : 'Equipo 2',
          team1: match.team1, // ← ARRAY DE JUGADORES
          team2: match.team2,
          createdAt: Timestamp.now()
        })
      } else {
        await addDoc(collection(db, 'matches'), {
          date,
          matchType,
          player1: players[0],
          player2: players[1],
          result,
          winner: players[score.winnerIndex],
          createdAt: Timestamp.now()
        })
      }

      closeModal()
    }

    saveMatch()
  }, [score.finished])


  return (
    <>
      <div className="modal-pointer">
        <div className="body-modal">
          <div className="title">
            <h3>Marcado</h3>
          </div>
          <div className="description">
            {players.map((name, i) => (
              <div className="info" key={i}>
                <h4>{name}</h4>
                <h5>Puntos: {POINTS[score.points[i]]}</h5>
                <h5>Games: {score.games[i]}</h5>
                <button disabled={score.finished} onClick={() => addPoint(i)}>+ Punto</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 px-2 md:px-4">
            <button className="btn-sent">Reinciar</button>
            <button className="btn-sent" onClick={closeModal}>Cancelar</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ModalPoint