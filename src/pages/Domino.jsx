import { Link } from "react-router-dom"

function Domino() {
  return (
    <section className="content-home-tenis">
      <div className="container">
        <div className="block space-y-2 pb-8">
          <h1>Bienvenido a la App de Score de Domino</h1>
          <p>Gestiona y consulta los resultados de tus partidos de domino de manera fácil y rápida.</p>
        </div>
        <ul className="navigation-list">
          <li>
            <Link to="/domino/score-domino">Jugar</Link>
          </li>
        </ul>
      </div>
    </section>
  )
}

export default Domino