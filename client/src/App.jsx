import { useState } from 'react';
import Auth from './pages/Auth/Auth';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Connect from './pages/Connect/Connect';
import Marketplace from './pages/Marketplace/Marketplace';
import Messages from './pages/Messages/Messages';
import Profile from './pages/Profile/Profile';
import Users from './pages/Users/Users';
import Admin from './pages/Admin/Admin';
import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('coltcircle_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [activePage, setActivePage] = useState('home');
  const [chatRecipient, setChatRecipient] = useState(null);

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

  const handleNotificationNavigate = (link, note) => {
    if (link === 'messages') {
      const partnerId = note?.meta?.partnerId;
      if (partnerId) {
        setChatRecipient({
          _id: partnerId,
          name: note.actorName || 'Student',
        });
      }
      setActivePage('messages');
      return;
    }
    setActivePage(link || 'home');
  };

  const handleConnectUser = () => {
    setActivePage('connect');
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Home user={user} />;
      case 'connect':
        return (
          <Connect
            user={user}
            onStartChat={handleStartChat}
            onBrowseUsers={() => setActivePage('users')}
          />
        );
      case 'marketplace':
        return <Marketplace user={user} onContactSeller={handleStartChat} />;
      case 'messages':
        return <Messages user={user} chatRecipient={chatRecipient} />;
      case 'profile':
        return (
          <Profile
            user={user}
            onUserUpdate={setUser}
            onNavigateMarketplace={() => setActivePage('marketplace')}
          />
        );
      case 'users':
        return (
          <Users
            user={user}
            onConnectUser={handleConnectUser}
            onStartChat={handleStartChat}
          />
        );
      case 'admin':
        return user?.role === 'admin' ? <Admin /> : <Home user={user} />;
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
            user={user}
            activePage={activePage}
            setActivePage={setActivePage}
            onLogout={handleLogout}
            onNotificationNavigate={handleNotificationNavigate}
          />
          <main className="content-area">{renderPage()}</main>
        </div>
      )}
    </div>
  );
}

export default App;
