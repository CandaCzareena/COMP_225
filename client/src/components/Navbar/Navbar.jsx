import { useEffect, useState } from 'react';
import logo from '../../assets/logo.png';
import NotificationBell from '../NotificationBell/NotificationBell';
import './Navbar.css';

function Navbar({ user, activePage, setActivePage, onLogout, onNotificationNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const primaryItems = [
    { id: 'home', label: 'Home', icon: 'home-icon' },
    { id: 'connect', label: 'Connect', icon: 'connect-icon' },
    { id: 'marketplace', label: 'Market', icon: 'marketplace-icon' },
    { id: 'messages', label: 'Chats', icon: 'messages-icon' },
    { id: 'profile', label: 'Profile', icon: 'profile-icon' },
  ];

  const extraItems = [
    { id: 'users', label: 'Users', icon: 'profile-icon' },
    ...(user?.role === 'admin'
      ? [{ id: 'admin', label: 'Admin', icon: 'profile-icon' }]
      : []),
  ];

  const desktopItems = [
    ...primaryItems.map((item) =>
      item.id === 'marketplace'
        ? { ...item, label: 'Marketplace' }
        : item.id === 'messages'
          ? { ...item, label: 'Messages' }
          : item.id === 'profile'
            ? { ...item, label: 'My Profile' }
            : item
    ),
    ...extraItems,
  ];

  useEffect(() => {
    setMenuOpen(false);
  }, [activePage]);

  const goTo = (id) => {
    setActivePage(id);
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="mobile-topbar">
        <div className="navbar-brand mobile-brand">
          <span className="brand-mark">
            <img src={logo} alt="ColtCircle logo" />
          </span>
          <span className="brand-name">ColtCircle</span>
        </div>
        <div className="mobile-top-actions">
          <NotificationBell onNavigate={onNotificationNavigate} compact />
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="Open menu"
          >
            Menu
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-sheet">
          <div className="navbar-user">
            <strong>{user?.name || 'Member'}</strong>
            <span>{user?.role || 'student'}</span>
          </div>
          {extraItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`mobile-sheet-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => goTo(item.id)}
            >
              {item.label}
            </button>
          ))}
          <button type="button" className="logout-btn" onClick={onLogout}>
            Sign out
          </button>
        </div>
      )}

      <div className="navbar-desktop">
        <div className="navbar-brand">
          <span className="brand-mark">
            <img src={logo} alt="ColtCircle logo" />
          </span>
          <span className="brand-name">ColtCircle</span>
        </div>

        <NotificationBell onNavigate={onNotificationNavigate} />

        <ul className="navbar-links">
          {desktopItems.map((item) => (
            <li
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => goTo(item.id)}
            >
              <span className="nav-icon">
                <svg>
                  <use href={`/icons.svg#${item.icon}`} />
                </svg>
              </span>
              <span className="nav-label">{item.label}</span>
            </li>
          ))}
        </ul>

        <div className="navbar-footer">
          <div className="navbar-user">
            <strong>{user?.name || 'Member'}</strong>
            <span>{user?.role || 'student'}</span>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            Sign out
          </button>
        </div>
      </div>

      <ul className="mobile-bottom-nav">
        {primaryItems.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className={`mobile-nav-btn ${activePage === item.id ? 'active' : ''}`}
              onClick={() => goTo(item.id)}
            >
              <span className="nav-icon">
                <svg>
                  <use href={`/icons.svg#${item.icon}`} />
                </svg>
              </span>
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
