import { Link } from "react-router-dom"

function SubMenuGames({ closeSubMenu }) {

  return (
    <div className="sub-menu">
      <ul className="list-sub-menu">
        <li>
          <Link to="/tenis" onClick={closeSubMenu}>Tenis</Link>
        </li>
        <li>
          <Link to="/domino" onClick={closeSubMenu}>Domino</Link>
        </li>
      </ul>
    </div>
  )
}

export default SubMenuGames