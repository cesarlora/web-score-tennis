import LogoTennis from '../assets/logo.webp'
import './header.css'

function Header({ openModal }) {
 
  return (
    <header>
      <div className="container-fluid">
        <a href="#!" className='logo'>
          <img src={LogoTennis} className='logo' alt="logo" />
        </a>
        <nav className='main-nav'>
          <ul className='main-menu'>
            <li>
              <button type='button'>Puntajes</button>
            </li>
            <li>
              <button type='button' onClick={openModal}>Agregar Partido</button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header