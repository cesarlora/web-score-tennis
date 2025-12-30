import { Link } from "react-router-dom"

function Home() {
  return (
    <section className="content-home">
      <div className="container">
        <div className="block space-y-2 pb-8">
          <h1>Bienvenido a la App de Scores</h1>
          <p>Adonde puedes gestionar y consultar los resultados de juegos como tenis y domino</p>
        </div>
        <ul className="navigation-list">
          <li>
            <Link to="/tenis">Tenis</Link>
          </li>
          <li><Link to="/domino">Dominos</Link></li>
        </ul>
      </div>
    </section>
  )
}

export default Home