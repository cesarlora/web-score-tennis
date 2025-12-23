import { useState, useEffect } from 'react'
import AddPlayer from '../components/AddPlayer'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase'

function Players() {
  const [modalAddPlayer, setModalAddPlayer] = useState(false)
  const [players, setPlayers] = useState([])
  const [detailPlayer, setDetailPlayer] = useState(null)
  const [stats, setStats] = useState({})

  const toggleDetail = async (player) => {
    if (detailPlayer === player.id) {
      setDetailPlayer(null)
      return
    }

    setDetailPlayer(player.id)
    await loadStats(player)
  }

  const loadStats = async (player) => {
    try {
      const snapshot = await getDocs(collection(db, 'matches'))

      let played = 0
      let won = 0
      let lost = 0
      const matchTypes = {} // 👈 contador

      snapshot.docs.forEach(doc => {
        const match = doc.data()
        const playerName = player.namePlayer
        let isPlayerInMatch = false

        // Individual / Tie-Break
        if (
          match.player1 === playerName ||
          match.player2 === playerName
        ) {
          isPlayerInMatch = true
        }

        // Dobles
        if (
          match.team1?.some(p => p.name === playerName) ||
          match.team2?.some(p => p.name === playerName)
        ) {
          isPlayerInMatch = true
        }

        if (isPlayerInMatch) {
          played++

          // 👉 contar tipo de partido
          const type = match.matchType || 'Desconocido'
          matchTypes[type] = (matchTypes[type] || 0) + 1

          match.winner === playerName ? won++ : lost++
        }
      })

      setStats(prev => ({
        ...prev,
        [player.id]: {
          played,
          won,
          lost,
          matchTypes
        }
      }))
    } catch (error) {
      console.error('Error cargando stats:', error)
    }
  }

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
  
  


  return (
    <>
      <div className="content-players">
        <div className="container">
          <div className="block space-y-8 max-w-[800px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <h2>Lista de Jugadores</h2>
              <button type="button" className='btn-add' onClick={() => setModalAddPlayer(true)}>Agregar Jugador</button>
            </div>
            <ul className="list-players">
              {players.length === 0 && (
                <li><h6 className='empty'>No hay jugadores registrados</h6></li>
              )}
              {players.map(player => (
                <li key={player.id}>
                  <div className="description">
                    <div className="block space-y-1">
                      <h5>Nombre: {player.namePlayer}</h5>
                      <h5>Edad: {player.agePlayer === 0 ? 'Qué te importa ' : player.agePlayer}</h5>
                    </div>
                    <button type="button" className="btn-info" onClick={() => toggleDetail(player)}>Scores</button>
                  </div>
                  {detailPlayer === player.id && stats[player.id] && (  
                    <div className="detail">
                      <h6>Informacion general</h6>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-2">
                         <div className="info">
                          <p>Jugados</p>
                          <p>{stats[player.id].played}</p> 
                        </div>
                        <div className="info">
                          <p>Tipo de partidos</p>
                          <div className='block space-y-2'>
                            {Object.entries(stats[player.id].matchTypes).map(([type, count]) => (
                              <p key={type}>
                                {type} ({count})
                              </p>
                            ))}
                          </div>
                        </div>
                        <div className="info">
                          <p>Ganados</p>
                          <p>{stats[player.id].won}</p>
                        </div>
                        <div className="info">
                          <p>Perdidos</p>
                          <p>{stats[player.id].lost}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
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

export default Players