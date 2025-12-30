import { useState } from 'react'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '../firebase'

function AddDominoGame({ closeModal, onAddGame }) {
  const [gameType, setGameType] = useState('Individual')
  const [players, setPlayers] = useState(['', ''])
  const [team1, setTeam1] = useState(['', ''])
  const [team2, setTeam2] = useState(['', ''])
  const [score, setScore] = useState('')
  
  const [errors, setErrors] = useState({})
  
  const scoreRegex = /^\d{1,3}-\d{1,3}$/

  const getToday = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const [date, setDate] = useState(getToday())
  
  const validate = () => {
    const newErrors = {}

    if (!date) newErrors.date = 'La fecha es obligatoria'

    if (!score.trim()) {
      newErrors.score = 'El resultado es obligatorio'
    } else if (!scoreRegex.test(score)) {
      newErrors.score = 'Formato inválido. Ej: 200-150'
    } else {
      const [a, b] = score.split('-').map(Number)
      if (a === b) newErrors.score = 'No puede haber empate'
    }

    if (gameType === 'Individual') {
      if (!players[0].trim()) newErrors.player1 = 'Jugador 1 requerido'
      if (!players[1].trim()) newErrors.player2 = 'Jugador 2 requerido'
      if (players[0] && players[1] && players[0] === players[1]) {
        newErrors.player2 = 'Los jugadores no pueden ser iguales'
      }
    }

    if (gameType === 'Parejas') {
      const allPlayers = [...team1, ...team2]

      if (team1.some(p => !p.trim())) {
        newErrors.team1 = 'Equipo 1 incompleto'
      }

      if (team2.some(p => !p.trim())) {
        newErrors.team2 = 'Equipo 2 incompleto'
      }

      const duplicates = allPlayers.filter(
        (p, i) => allPlayers.indexOf(p) !== i
      )

      if (duplicates.length) {
        newErrors.team2 = 'Un jugador no puede repetirse'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    const [a, b] = score.split('-').map(Number)

    let newGame = {
      gameType,
      score,
      date,
      createdAt: Timestamp.now()
    }

    if (gameType === 'Individual') {
      newGame.players = players
      newGame.winner = a > b ? players[0] : players[1]
    }

    if (gameType === 'Parejas') {
      newGame.team1 = team1
      newGame.team2 = team2
      newGame.winner = a > b ? 'Equipo 1' : 'Equipo 2'
    }

    const docRef = await addDoc(collection(db, 'domino'), newGame)
    onAddGame({ id: docRef.id, ...newGame })
    closeModal()
  }


  return (
    <div className="modal-add-game">
      <div className="container">
        <div className="body-modal">
          <div className="title">
            <h4>Agregar Juego</h4>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="">Tipo de juego</label>
              <select value={gameType} onChange={e => setGameType(e.target.value)}>
                <option value="Individual">Individual</option>
                <option value="Parejas">Parejas</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gameType === 'Individual' && (
                <>
                  <div className="form-group">
                    <label htmlFor="">Jugador 1</label>
                    <input placeholder="Jugador 1" onChange={e => setPlayers([e.target.value, players[1]])} />
                     {errors.player1 && <p className="text-semantic-error text-body-2">{errors.player1}</p>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="">Jugador 2</label>
                    <input placeholder="Jugador 2" onChange={e => setPlayers([players[0], e.target.value])} />
                    {errors.player2 && <p className="text-semantic-error text-body-2">{errors.player2}</p>}
                  </div>
                </>
              )}

              {gameType === 'Parejas' && (
                <>
                  <div className="form-group">
                    <label htmlFor="">equipo 1</label>
                    <input 
                      placeholder="Equipo 1 - Jugador 1" 
                      onChange={e => setTeam1([e.target.value, team1[1]])} 
                    />
                    <input 
                      placeholder="Equipo 1 - Jugador 2" 
                      onChange={e => setTeam1([team1[0], e.target.value])} 
                    />
                    {errors.team1 && <p className="text-semantic-error text-body-2">{errors.team1}</p>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="">equipo 2</label>
                    <input 
                      placeholder="Equipo 2 - Jugador 1" 
                      onChange={e => setTeam2([e.target.value, team2[1]])} 
                    />
                    <input 
                      placeholder="Equipo 2 - Jugador 2" 
                      onChange={e => setTeam2([team2[0], e.target.value])} 
                    />
                    {errors.team2 && <p className="text-semantic-error text-body-2">{errors.team2}</p>}
                  </div>
                </>
              )}
              <div className="form-group">
                <label htmlFor="">Fecha</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={e => setDate(e.target.value)} 
                />
                {errors.date && <p className="text-semantic-error text-body-2">{errors.date}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="">Resultado</label>
                <input 
                  placeholder="Resultado ej: 200-150" 
                  onChange={e => setScore(e.target.value)} 
                />
                {errors.score && <p className="text-semantic-error text-body-2">{errors.score}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button type="submit">Guardar</button>
              <button type="button" onClick={closeModal}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddDominoGame