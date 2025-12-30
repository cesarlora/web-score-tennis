import LogoTennis from '../assets/logo.webp'
import { Link } from 'react-router-dom'
import './header.css'
import SubMenuGames from './SubMenuGames'
import { useState, useRef, useEffect } from 'react'

function Header() {
  const [subMenu, setSubMenu] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setSubMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])


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
            <li className='relative' ref={menuRef}>
              <button onClick={() => setSubMenu(prev => !prev)}>Tipos de juegos</button>
              {subMenu && (
                <SubMenuGames 
                  closeSubMenu={() => setSubMenu(false)}
                />)
              }
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header