import { useState, useEffect } from 'react'
import Select from 'react-select'
import { collection, addDoc, getDocs, Timestamp } from 'firebase/firestore'
import { db } from '../firebase'
import AddPlayer from './AddPlayer.jsx'


function AddMatch({ closeModal, onAddMatch }) {
  const [errors, setErrors] = useState({})
  const [players, setPlayers] = useState([])
  const [modalAddPlayer, setModalAddPlayer] = useState(false)

  const getToday = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

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

  const getDisabledOptions = (team) => {
    return team.map(p => p.value)
  }

  const handleChange = (e) => {
    const { id, value } = e.target

    setMatch(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const playerOptions = players.map(p => ({
    value: p.id,
    label: p.namePlayer
  }))

  const initialMatchState = {
    Team1: [],
    Team2: [],
    player1: null,
    player2: null,
    matchType: 'Individual',
    result: '',
    date: getToday()
  }

  const [match, setMatch] = useState(initialMatchState)

  const resetForm = () => {
    setMatch({
      ...initialMatchState,
      date: getToday()
    })
    setErrors({})
    closeModal()
  }

  const resultRegex = /^(\d{1,2}-\d{1,2})(\s\d{1,2}-\d{1,2})*$/

  const validate = () => {
    const newErrors = {}

    if (!match.matchType) {
      newErrors.matchType = 'Debe seleccionar el tipo de partido'
    }

    if (!match.date) {
      newErrors.date = 'Debe seleccionar una fecha'
    }

    if (!match.result?.trim()) {
      newErrors.result = 'Debe ingresar el resultado'
    } else if (!resultRegex.test(match.result.trim())) {
      newErrors.result = 'Formato inválido. Ej: 6-3 6-4'
    }

    // ▶️ PARTIDO INDIVIDUAL
    if (match.matchType === 'Individual' || match.matchType === 'Tie-Break') {
      if (!match.player1) {
        newErrors.player1 = 'Jugador 1 es obligatorio'
      }

      if (!match.player2) {
        newErrors.player2 = 'Jugador 2 es obligatorio'
      }

      if (
        match.player1 &&
        match.player2 &&
        match.player1.value === match.player2.value
      ) {
        newErrors.player2 = 'No puede ser el mismo jugador'
      }
    }

    // ▶️ PARTIDO DOBLES
    if (match.matchType === 'Dobles') {
      if (match.Team1.length !== 2) {
        newErrors.Team1 = 'Equipo 1 debe tener 2 jugadores'
      }

      if (match.Team2.length !== 2) {
        newErrors.Team2 = 'Equipo 2 debe tener 2 jugadores'
      }

      const team1Ids = match.Team1.map(p => p.value)
      const team2Ids = match.Team2.map(p => p.value)

      const repeated = team1Ids.some(id => team2Ids.includes(id))

      if (repeated) {
        newErrors.Team2 = 'Un jugador no puede estar en ambos equipos'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const getWinner = (a, b, result) => {
    let aSets = 0
    let bSets = 0

    result.split(' ').forEach(set => {
      const [x, y] = set.split('-').map(Number)
      x > y ? aSets++ : bSets++
    })

    return aSets > bSets ? a : b
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    const newMatch = {
      matchType: match.matchType,
      result: match.result,
      date: match.date,
      createdAt: Timestamp.now()
    }

    // 🎾 INDIVIDUAL / TIE-BREAK
    if (match.matchType === 'Individual' || match.matchType === 'Tie-Break') {
      newMatch.player1 = match.player1.label
      newMatch.player2 = match.player2.label
      newMatch.winner = getWinner(
        match.player1.label,
        match.player2.label,
        match.result
      )
    }

    // 🎾 DOBLES (CORRECTO)
    if (match.matchType === 'Dobles') {
      newMatch.team1 = match.Team1.map(p => ({
        id: p.value,
        name: p.label
      }))

      newMatch.team2 = match.Team2.map(p => ({
        id: p.value,
        name: p.label
      }))

      newMatch.winner = getWinner('Equipo 1', 'Equipo 2', match.result)
    }

    const docRef = await addDoc(collection(db, 'matches'), newMatch)
    onAddMatch({ id: docRef.id, ...newMatch })
    closeModal()
  }

  useEffect(() => {
    setMatch(prev => ({
      ...prev,
      Team1: [],
      Team2: [],
      player1: null,
      player2: null
    }))
  }, [match.matchType])

  return (
    <>
      <div className="modal-add-match">
        <div className="container">
          <div className="body-modal">
            <div className="title">
              <h4>Agregar Resultado</h4>
              <button type="button" className='btn-add' onClick={() => setModalAddPlayer(true)}>Agregar Jugador</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="block space-y-6">
                {match.matchType === 'Dobles' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label htmlFor="Team1">Equipo 1</label>
                      <Select
                        className='form-control'
                        isMulti
                        options={playerOptions}
                        value={match.Team1}
                        maxMenuHeight={160}
                        closeMenuOnSelect={false}
                        onChange={(selected) => {
                          if (selected.length <= 2) {
                            setMatch(prev => ({ ...prev, Team1: selected }))
                          }
                        }}
                        isOptionDisabled={(option) =>
                          getDisabledOptions(match.Team2).includes(option.value)
                        }
                        placeholder="Seleccione jugadores"
                      />

                      {errors.Team1 && <p className="text-semantic-error text-body-2">{errors.Team1}</p>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="Team2">Equipo 2</label>
                      <Select
                        className='form-control'
                        isMulti
                        options={playerOptions}
                        value={match.Team2}
                        maxMenuHeight={160}
                        closeMenuOnSelect={false}
                        onChange={(selected) => {
                          if (selected.length <= 2) {
                            setMatch(prev => ({ ...prev, Team2: selected }))
                          }
                        }}
                        isOptionDisabled={(option) =>
                          getDisabledOptions(match.Team1).includes(option.value)
                        }
                        placeholder="Seleccione jugadores"
                      />

                      {errors.Team2 && <p className="text-semantic-error text-body-2">{errors.Team2}</p>}
                    </div>
                  </div>
                )}
                {(match.matchType === 'Individual' || match.matchType === 'Tie-Break') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label htmlFor="player1">Jugador 1</label>
                      <Select
                        className='form-control'
                        options={playerOptions}
                        value={match.player1}
                        onChange={(value) =>
                          setMatch(prev => ({ ...prev, player1: value }))
                        }
                        placeholder="Seleccione jugador"
                      />
                      {errors.player1 && (
                        <p className="text-semantic-error text-body-2">
                          {errors.player1}
                        </p>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="player2">Jugador 2</label>
                      <Select
                        className='form-control'
                        options={playerOptions}
                        value={match.player2}
                        onChange={(value) =>
                          setMatch(prev => ({ ...prev, player2: value }))
                        }
                        isOptionDisabled={(option) =>
                          option.value === match.player1?.value
                        }
                        placeholder="Seleccione jugador"
                      />
                      {errors.player2 && (
                        <p className="text-semantic-error text-body-2">
                          {errors.player2}
                        </p>
                      )}
                    </div>
                  </div>
                )}
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