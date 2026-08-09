import logo from '../../assets/logo.png';
import './Navbar.css';

function Navbar({ activePage, setActivePage, onLogout }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: 'home-icon' },
    { id: 'connect', label: 'Connect', icon: 'connect-icon' },
    { id: 'marketplace', label: 'Marketplace', icon: 'marketplace-icon' },
    { id: 'messages', label: 'Messages', icon: 'messages-icon' },
    { id: 'profile', label: 'My Profile', icon: 'profile-icon' },
    { id: 'users', label: 'Users', icon: 'profile-icon' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-mark">
          <img src={logo} alt="ColtCircle logo" />
        </span>
        <span className="brand-name">ColtCircle</span>
      </div>

      <ul className="navbar-links">
        {navItems.map((item) => (
          <li
            key={item.id}
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => setActivePage(item.id)}
          >
            <span className="nav-icon">
              <svg><use href={`/icons.svg#${item.icon}`} /></svg>
            </span>
            <span className="nav-label">{item.label}</span>
          </li>
        ))}
      </ul>

      <div className="navbar-footer">
        <button className="logout-btn" onClick={onLogout}>
          <svg width="16" height="16" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
            <use href="/icons.svg#logout-icon" />
          </svg>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;