import { useState } from 'react';
import Auth from './pages/Auth/Auth';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Connect from './pages/Connect/Connect';
import Marketplace from './pages/Marketplace/Marketplace';
import Messages from './pages/Messages/Messages';       // 👈 Added Import
import Profile from './pages/Profile/Profile';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState('home');

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Home user={user} />;
      case 'connect':
        return <Connect />;
      case 'marketplace':
        return <Marketplace />;
      case 'messages':
        return <Messages user={user} />; // 👈 Rendering Messages Component with user state
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
            onLogout={() => { setUser(null); setActivePage('home'); }} 
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