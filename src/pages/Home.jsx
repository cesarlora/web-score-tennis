import { Link } from "react-router-dom"

function Home() {
  return (
    <section className="content-home">
      <div className="container">
        <div className="block space-y-2 pb-8">
          <h1>Bienvenido a la App de Score de Tenis</h1>
          <p>Gestiona y consulta los resultados de tus partidos de tenis de manera fácil y rápida.</p>
        </div>
        <ul className="navigation-list">
          <li>
            <Link to="/score">Ver Resultados</Link>
          </li>
          <li><Link to="/players">Gestionar Jugadores</Link></li>
        </ul>
      </div>
    </section>
  )
}

export default Home