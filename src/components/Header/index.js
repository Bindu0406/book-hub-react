import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const {activeTab} = props

  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  const homeClassName =
    activeTab === 'Home' ? 'nav-item active-nav' : 'nav-item'
  const shelfClassName =
    activeTab === 'Bookshelves' ? 'nav-item active-nav' : 'nav-item'

  return (
    <nav className="nav-header">
      <div className="nav-content">
        <Link to="/" className="logo-link">
          <img
            className="website-logo"
            src="https://i.ibb.co/23Ln8thH/Group-7732.png"
            onError={e => {
              e.target.onerror = null
              e.target.src =
                'https://res.cloudinary.com/dkxxgpfd8/image/upload/v1647087074/Group_7731_login_logo_jphq4m.png'
            }}
            alt="website logo"
          />
        </Link>
        <ul className="nav-menu">
          <li className={homeClassName}>
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className={shelfClassName}>
            <Link to="/shelf" className="nav-link">
              Bookshelves
            </Link>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className="logout-desktop-btn"
              onClick={onClickLogout}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default withRouter(Header)
