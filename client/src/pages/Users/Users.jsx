import { useState, useEffect } from 'react';
import ProfilePhoto from '../../components/ProfilePhoto/ProfilePhoto';

export default function Users({ user, onConnectUser, onStartChat }) {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [connectedIds, setConnectedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('coltcircle_token');

    fetch('/api/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched users:', data);
        const userList = Array.isArray(data) ? data : data.users || [];
        setUsers(userList);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setLoading(false);
      });
  }, []);

  const handleAddFriend = async (targetUser) => {
    const targetUserId = targetUser._id || targetUser.id;
    try {
      const token = localStorage.getItem('coltcircle_token');
      await fetch(`/api/users/${user?._id || user?.id}/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({ friendId: targetUserId }),
      });
    } catch (err) {
      console.error('Failed to connect:', err);
    }

    setConnectedIds((prev) => [...prev, targetUserId]);
    if (onConnectUser) onConnectUser(targetUser); // 👈 Passes user object to App.jsx to switch to Connect tab
  };

  const filteredUsers = users.filter((u) => {
    const name = (u.name || u.username || '').toLowerCase();
    const email = (u.email || '').toLowerCase();
    const query = searchTerm.toLowerCase();
    return name.includes(query) || email.includes(query);
  });

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <h2>Student Directory</h2>

      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 14px',
            fontSize: '1rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filteredUsers.length === 0 ? (
            <p style={{ color: '#888' }}>No users match your search.</p>
          ) : (
            filteredUsers.map((u) => {
              const isSelf = u._id === user?._id || u.email === user?.email;
              const isConnected = connectedIds.includes(u._id || u.id);

              return (
                <li
                  key={u._id || u.id}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #eee',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <ProfilePhoto src={u.profilePhoto} name={u.name} size={44} />
                    <div>
                      <strong>{u.name || u.username}</strong>
                      <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>{u.email}</p>
                    </div>
                  </div>

                  {!isSelf && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleAddFriend(u)}
                        disabled={isConnected}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '20px',
                          border: 'none',
                          backgroundColor: isConnected ? '#ccc' : '#007bff',
                          color: '#fff',
                          cursor: isConnected ? 'default' : 'pointer',
                          fontWeight: 'bold',
                        }}
                      >
                        {isConnected ? 'Connected' : '+ Connect'}
                      </button>

                      {onStartChat && (
                        <button
                          onClick={() => onStartChat(u)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '20px',
                            border: '1px solid #007bff',
                            backgroundColor: '#fff',
                            color: '#007bff',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                          }}
                        >
                          Message
                        </button>
                      )}
                    </div>
                  )}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}