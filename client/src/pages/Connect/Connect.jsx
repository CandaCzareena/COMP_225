import { useState, useEffect } from 'react';
import ProfilePhoto from '../../components/ProfilePhoto/ProfilePhoto';
import './Connect.css';

function authHeaders() {
  const token = localStorage.getItem('coltcircle_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

function Connect({ user, onStartChat, onBrowseUsers }) {
  const [peers, setPeers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userId = user?._id || user?.id;

  const loadConnections = async () => {
    if (!userId) {
      setLoading(false);
      setError('Please sign in again to view connections.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/users/${userId}/connections`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not load connections');

      const list = (Array.isArray(data) ? data : []).map((u) => ({
        id: u._id || u.id,
        name: u.name || 'Student',
        email: u.email || '',
        program: u.program || 'Centennial Student',
        origin: u.origin || '',
        profilePhoto: u.profilePhoto || '',
        userObj: u,
      }));

      setPeers(list);
      setError('');
    } catch (err) {
      setError(err.message);
      setPeers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConnections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleSendMessage = (peer) => {
    const recipient = peer.userObj || {
      _id: peer.id,
      name: peer.name,
      email: peer.email,
    };
    if (onStartChat) onStartChat(recipient);
  };

  return (
    <div className="connect-page">
      <div className="page-header">
        <h2>
          <svg className="header-icon">
            <use href="/icons.svg#connect-icon" />
          </svg>
          Connect &amp; Study Hub
        </h2>
        <p>Your real connections from the Student Directory appear here.</p>
      </div>

      {error && <p style={{ color: '#c0392b' }}>{error}</p>}

      {loading ? (
        <p>Loading connections...</p>
      ) : peers.length === 0 ? (
        <div style={{ padding: '1.5rem 0' }}>
          <p style={{ color: '#666' }}>
            No connections yet. Go to Users and click <strong>+ Connect</strong> on a classmate.
          </p>
          {onBrowseUsers && (
            <button className="connect-action-btn" onClick={onBrowseUsers}>
              Browse Users
            </button>
          )}
        </div>
      ) : (
        <div className="peers-grid">
          {peers.map((peer) => (
            <div key={peer.id} className="peer-card">
              <div className="peer-badge" data-type="Connected Student">
                Connected Student
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
                <ProfilePhoto src={peer.profilePhoto} name={peer.name} size={72} />
              </div>
              <h3>{peer.name}</h3>
              <p className="peer-sub">{peer.program}</p>
              <p className="peer-sub" style={{ marginTop: '4px' }}>
                {peer.email}
              </p>
              <div className="skills-tags">
                {peer.origin ? (
                  <span className="skill-tag">{peer.origin}</span>
                ) : (
                  <span className="skill-tag">Connected</span>
                )}
              </div>
              <button
                className="connect-action-btn"
                onClick={() => handleSendMessage(peer)}
              >
                Send Message
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Connect;
