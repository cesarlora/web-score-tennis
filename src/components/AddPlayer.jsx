import { useState } from 'react'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '../firebase'

function AddPlayer({ closeModalPlayer , onAddPlayer}) {
  const [errors, setErrors] = useState({})
  const [player, setPlayer] = useState({
    namePlayer: '',
    agePlayer: ''
  })
  const handleChange = (e) => {
    const { id, value } = e.target

    setPlayer(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const resetForm = () => {
    setPlayer({ namePlayer: '', agePlayer: '' })
    setErrors({})
    closeModalPlayer()
  }


  const validate = () => {
    const newErrors = {}

    if (!player.namePlayer.trim()) {
      newErrors.namePlayer = 'Nombre es obligatorio'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    try {
      const newPlayer = {
        namePlayer: player.namePlayer.trim(),
        agePlayer: Number(player.agePlayer),
        createdAt: Timestamp.now()
      }

      const docRef = await addDoc(collection(db, 'players'), newPlayer)

      // 👇 enviar jugador al padre si lo necesitas
      onAddPlayer({
        id: docRef.id,
        ...newPlayer
      })

      resetForm()
    } catch (error) {
      console.error('Error guardando jugador:', error)
    }
  }

  return (
    <div className="modal-add-player">
      <div className="container">
        <div className="body-modal">
          <div className="title">
            <h5>Nuevo Jugador</h5>
            <button type="button" className='btn-close' onClick={resetForm}><i className="icon icon-close"></i></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label htmlFor="namePlayer">Nombre del Jugador</label>
                <input 
                  type="text" 
                  id="namePlayer"
                  value={player.namePlayer}
                  onChange={handleChange}
                  placeholder="Nombre del jugador"
                />
                {errors.namePlayer && (
                  <p className="text-semantic-error text-body-2">
                    {errors.namePlayer}
                  </p>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="agePlayer">Edad del Jugador</label>
                <input 
                  type="number" 
                  id="agePlayer"
                  value={player.agePlayer}
                  onChange={handleChange}
                  placeholder="Edad del jugador"
                />
              </div>
            </div>
            <button type="submit">Agregar</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddPlayer