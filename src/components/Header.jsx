import LogoTennis from '../assets/logo.webp'
import { Link } from 'react-router-dom'
import './header.css'

function Header() {
 
  return (
    <header>
      <div className="container-fluid">
        <Link to="/" className='logo'>
          <img src={LogoTennis} alt="logo" />
        </Link>
        <nav className='main-nav'>
          <ul className='main-menu'>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/score">Partidos</Link>
            </li>
            <li>
              <Link to="/players">Jugadores</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header