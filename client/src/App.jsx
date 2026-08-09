import { useState } from 'react';
import Auth from './pages/Auth/Auth';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Connect from './pages/Connect/Connect';
import Marketplace from './pages/Marketplace/Marketplace';
import Messages from './pages/Messages/Messages';
import Profile from './pages/Profile/Profile';
import './App.css';

function App() {
  // Lazy initializer: this function only runs ONCE, on the very first render.
  // It checks localStorage for a saved session so that refreshing the page
  // doesn't log the user out.
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('coltcircle_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [activePage, setActivePage] = useState('home');

  const handleLogout = () => {
    // Clear the saved session, not just the in-memory state
    localStorage.removeItem('coltcircle_token');
    localStorage.removeItem('coltcircle_user');
    setUser(null);
    setActivePage('home');
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Home user={user} />;
      case 'connect':
        return <Connect />;
      case 'marketplace':
        return <Marketplace />;
      case 'messages':
        return <Messages user={user} />;
      case 'profile':
        return <Profile user={user} />;
      default:
        return <Home user={user} />;
    }
  };

  return (
    <div className="app-container">
      {!user ? (
        <Auth onLoginSuccess={(userData) => setUser(userData)} />
      ) : (
        <div className="main-layout">
          <Navbar
            activePage={activePage}
            setActivePage={setActivePage}
            onLogout={handleLogout}
          />
          <main className="content-area">
            {renderPage()}
          </main>
        </div>
      )}
    </div>
  );
}

export default App;