import { useState, useEffect } from 'react'
import { collection, addDoc, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import AddPlayer from './AddPlayer.jsx'


function AddMatch({ closeModal, onAddMatch }) {
  const [errors, setErrors] = useState({})
  const [players, setPlayers] = useState([])
  const [modalAddPlayer, setModalAddPlayer] = useState(false)

  useEffect(() => {
    const fetchPlayers = async () => {
      const snapshot = await getDocs(collection(db, 'players'))
      const playersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setPlayers(playersData)
    }

    fetchPlayers()
  }, [])

  const handleChange = (e) => {
    const { id, value } = e.target

    setMatch(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const initialMatchState = {
    player1: '',
    player2: '',
    matchType: '',
    result: '',
    date: ''
  }

  const [match, setMatch] = useState(initialMatchState)

  const resetForm = () => {
    setMatch(initialMatchState)
    setErrors({})
    closeModal()
  }

  const resultRegex = /^(\d{1,2}-\d{1,2})(\s\d{1,2}-\d{1,2})*$/

  const validate = () => {
    const newErrors = {}

    if (match.player1 === match.player2) {
      newErrors.player2 = 'No puede ser el mismo jugador'
    }

    if (!match.player1.trim()) {
      newErrors.player1 = 'Jugador 1 es obligatorio'
    }

    if (!match.player2.trim()) {
      newErrors.player2 = 'Jugador 2 es obligatorio'
    }

   if (!match.result.trim()) {
      newErrors.result = 'Debe ingresar el resultado'
    } else if (!resultRegex.test(match.result.trim())) {
      newErrors.result = 'Formato inválido. Ej: 6-3 6-4'
    }

    if (!match.matchType) {
      newErrors.matchType = 'Debe seleccionar el tipo de partido'
    }

    if (!match.date) {
      newErrors.date = 'Debe seleccionar una fecha'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const getWinner = (p1, p2, result) => {
    let p1Sets = 0
    let p2Sets = 0

    result.split(' ').forEach(set => {
      const [a, b] = set.split('-').map(Number)
      a > b ? p1Sets++ : p2Sets++
    })

    return p1Sets > p2Sets ? p1 : p2
  }

  const formatDate = (isoDate) => {
    if (!isoDate) return ''
    const [year, month, day] = isoDate.split('-')
    return `${day}-${month}-${year}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    const newMatch = {
      ...match,
      date: formatDate(match.date),
      winner: getWinner(match.player1, match.player2, match.result)
    }

    try {
      const docRef = await addDoc(collection(db, 'matches'), newMatch)

      onAddMatch({ id: docRef.id, ...newMatch })

      resetForm()
      closeModal()
    } catch (error) {
      console.error('Error guardando partido:', error)
    }
  }


  return (
    <>
      <div className="modal-add-match">
        <div className="container">
          <div className="body-modal">
            <div className="title">
              <h4>Agregar Partido</h4>
              <button type="button" className='btn-add' onClick={() => setModalAddPlayer(true)}>Agregar Jugador</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="block space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label htmlFor="player1">Jugador 1</label>
                    <select
                      id="player1"
                      value={match.player1}
                      onChange={handleChange}
                    >
                      <option value="">Seleccione jugador</option>
                      {players.map(player => (
                        <option key={player.id} value={player.namePlayer}>
                          {player.namePlayer}
                        </option>
                      ))}
                    </select>
                    {errors.player1 && (
                      <p className="text-semantic-error text-body-2">
                        {errors.player1}
                      </p>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="player2">Jugador 2</label>
                    <select
                      id="player2"
                      value={match.player2}
                      onChange={handleChange}
                    >
                      <option value="">Seleccione jugador</option>
                      {players.map(player => (
                        <option key={player.id} value={player.namePlayer}>
                          {player.namePlayer}
                        </option>
                      ))}
                    </select>
                    {errors.player2 && (
                      <p className="text-semantic-error text-body-2">
                        {errors.player2}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label htmlFor="matchType">Tipo de Partido</label>
                    <select name="matchType" id="matchType"  value={match.matchType} onChange={handleChange}>
                      <option value="">Seleccione tipo de partido</option>
                      <option value="Individual">Individual</option>
                      <option value="Dobles">Dobles</option>
                      <option value="Tie-Break">Tie-Break</option>
                    </select>
                    {errors.matchType && (
                      <p className="text-semantic-error text-body-2">
                        {errors.matchType}
                      </p>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="result">Resultado</label>
                    <input 
                      type="text" 
                      id="result"
                      value={match.result}
                      onChange={handleChange}
                      placeholder="Resultados"
                    />
                    {errors.result && (
                      <p className="text-semantic-error text-body-2">
                        {errors.result}
                      </p>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="date">Fecha</label>
                  <input 
                    type="date" 
                    id="date"
                    value={match.date}
                    onChange={handleChange}
                    placeholder="DD/MM/AAAA"
                  />
                  {errors.date && (
                    <p className="text-semantic-error text-body-2">
                      {errors.date}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <button type="submit">Agregar</button>
                <button type="button" onClick={resetForm}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {modalAddPlayer && (
        <AddPlayer
          closeModalPlayer={() => setModalAddPlayer(false)}
          onAddPlayer={(player) => {
            console.log('Jugador agregado:', player)
            setModalAddPlayer(false)
          }}
        />
      )}
    </>
  )
}

export default AddMatch