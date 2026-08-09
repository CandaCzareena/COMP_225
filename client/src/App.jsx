import { useState } from 'react';
import Auth from './pages/Auth/Auth';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Connect from './pages/Connect/Connect';
import Marketplace from './pages/Marketplace/Marketplace';
import Messages from './pages/Messages/Messages';
import Profile from './pages/Profile/Profile';
import Users from './pages/Users/Users';
import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('coltcircle_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [activePage, setActivePage] = useState('home');
  const [chatRecipient, setChatRecipient] = useState(null);
  const [connectedUsers, setConnectedUsers] = useState([]); // 👈 Holds connected peers

  const handleLogout = () => {
    localStorage.removeItem('coltcircle_token');
    localStorage.removeItem('coltcircle_user');
    setUser(null);
    setActivePage('home');
  };

  const handleStartChat = (recipient) => {
    setChatRecipient(recipient);
    setActivePage('messages');
  };

  // Triggered when clicking + Connect in Users Directory
  const handleConnectUser = (targetUser) => {
    if (!connectedUsers.some((u) => u._id === targetUser._id)) {
      setConnectedUsers((prev) => [...prev, targetUser]);
    }
    setActivePage('connect'); // 👈 Automatically redirects to Connect page
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Home user={user} />;
      case 'connect':
        return <Connect connectedUsers={connectedUsers} onStartChat={handleStartChat} />;
      case 'marketplace':
        return <Marketplace user={user} onContactSeller={handleStartChat} />;
      case 'messages':
        return <Messages user={user} chatRecipient={chatRecipient} />;
      case 'profile':
        return <Profile user={user} />;
      case 'users':
        return <Users user={user} onConnectUser={handleConnectUser} onStartChat={handleStartChat} />;
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
          <Navbar activePage={activePage} setActivePage={setActivePage} onLogout={handleLogout} />
          <main className="content-area">{renderPage()}</main>
        </div>
      )}
    </div>
  );
}

export default App;