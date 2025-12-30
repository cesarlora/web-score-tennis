import { useState, useEffect } from 'react'
import Select from 'react-select'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import ModalPoint from './ModalPoint.jsx'

function AddGame({closeModal}) {
  const [currentMatch, setCurrentMatch] = useState(null)
  const [modalAddPoint, setModalAddPoint] = useState(false)
  const [errors, setErrors] = useState({})
  const [players, setPlayers] = useState([])

  const initialMatchState = {
    Team1: [],
    Team2: [],
    player1: null,
    player2: null,
    matchType: 'Individual',
    numberGame: ''
  }

  const [match, setMatch] = useState(initialMatchState)

  useEffect(() => {
    const fetchPlayers = async () => {
      const snapshot = await getDocs(collection(db, 'players'))
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setPlayers(data)
    }

    fetchPlayers()
  }, [])

  const playerOptions = players.map(p => ({
    value: p.id,
    label: p.namePlayer
  }))
  

  const getDisabledOptions = team =>
    team.map(p => p.value)

  const handleChange = e => {
    const { id, value } = e.target
    setMatch(prev => ({ ...prev, [id]: value }))
  }

  const validate = () => {
    const newErrors = {}

    if (!match.numberGame || Number(match.numberGame) < 1) {
      newErrors.numberGame = 'Cantidad de juegos inválida'
    }

    if (match.matchType === 'Dobles') {
      if (match.Team1.length !== 2)
        newErrors.Team1 = 'Equipo 1 debe tener 2 jugadores'

      if (match.Team2.length !== 2)
        newErrors.Team2 = 'Equipo 2 debe tener 2 jugadores'

      const ids1 = match.Team1.map(p => p.value)
      const ids2 = match.Team2.map(p => p.value)

      if (ids1.some(id => ids2.includes(id)))
        newErrors.Team2 = 'Un jugador no puede estar en ambos equipos'
    } else {
      if (!match.player1) newErrors.player1 = 'Jugador 1 requerido'
      if (!match.player2) newErrors.player2 = 'Jugador 2 requerido'
      if (
        match.player1 &&
        match.player2 &&
        match.player1.value === match.player2.value
      ) {
        newErrors.player2 = 'No puede ser el mismo jugador'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = e => {
  e.preventDefault()
    if (!validate()) return

    const players =
      match.matchType === 'Dobles'
        ? [
            match.Team1.map(p => p.label).join(' & '),
            match.Team2.map(p => p.label).join(' & ')
          ]
        : [
            match.player1.label,
            match.player2.label
          ]

    setCurrentMatch({
      matchType: match.matchType,
      players,
      numberGame: Number(match.numberGame),
      team1: match.Team1.map(p => ({ id: p.value, name: p.label })),
      team2: match.Team2.map(p => ({ id: p.value, name: p.label }))
    })

    setModalAddPoint(true)
  }

  const resetForm = () => {
    setMatch(initialMatchState)
    setErrors({})
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
      <div className="modal-add-game">
        <div className="container">
          <div className="body-modal">
            <div className="title">
              <h4>Agregar Juego</h4>
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
                    <label htmlFor="numberGame">Cantidad de juegos</label>
                    <input 
                      type="number" 
                      min="1"
                      id="numberGame"
                      value={match.numberGame}
                      onChange={handleChange}
                      placeholder="Ej: 4, 6, 8"
                    />
                    {errors.numberGame && (
                      <p className="text-semantic-error text-body-2">
                        {errors.numberGame}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <button type="submit">Iniciar partido</button>
                <button type="button" onClick={resetForm}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {modalAddPoint && currentMatch && (  
        <ModalPoint 
          match={currentMatch}
          closeModal={() => setModalAddPoint(false)}
        />
      )}
    </>
  )
}

export default AddGame