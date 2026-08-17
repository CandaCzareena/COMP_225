import { useEffect, useRef, useState } from 'react';
import './NotificationBell.css';

function authHeaders() {
  const token = localStorage.getItem('coltcircle_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

function typeLabel(type) {
  if (type === 'connect') return 'Connect';
  if (type === 'message') return 'Message';
  if (type === 'meeting') return 'Tutor session';
  if (type === 'post') return 'Post';
  return 'Update';
}

function NotificationBell({ onNavigate, compact = false }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const panelRef = useRef(null);

  const load = async () => {
    try {
      const res = await fetch('/api/notifications', { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) return;
      setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
      setUnreadCount(Number(data.unreadCount) || 0);
    } catch {
      // ignore transient poll errors
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onClickAway = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickAway);
    return () => document.removeEventListener('mousedown', onClickAway);
  }, []);

  const markAllRead = async () => {
    try {
      await fetch('/api/notifications/read-all', {
        method: 'PUT',
        headers: authHeaders(),
      });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      // ignore
    }
  };

  const handleOpenNotification = async (note) => {
    try {
      if (!note.read) {
        await fetch(`/api/notifications/${note.id}/read`, {
          method: 'PUT',
          headers: authHeaders(),
        });
        setNotifications((prev) =>
          prev.map((n) => (n.id === note.id ? { ...n, read: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      }
    } catch {
      // still navigate
    }
    setOpen(false);
    if (onNavigate) onNavigate(note.link || 'home', note);
  };

  return (
    <div className={`notification-bell ${compact ? 'compact' : ''}`} ref={panelRef}>
      <button
        type="button"
        className="notification-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
      >
        <span className="notification-icon" aria-hidden="true">
          ●
        </span>
        {!compact && 'Alerts'}
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="notification-panel">
          <div className="notification-panel-header">
            <strong>Notifications</strong>
            <button type="button" onClick={markAllRead}>
              Mark all read
            </button>
          </div>
          <div className="notification-list">
            {notifications.length === 0 ? (
              <p className="notification-empty">No notifications yet.</p>
            ) : (
              notifications.map((note) => (
                <button
                  key={note.id}
                  type="button"
                  className={`notification-item ${note.read ? '' : 'unread'}`}
                  onClick={() => handleOpenNotification(note)}
                >
                  <span className="notification-type">{typeLabel(note.type)}</span>
                  <strong>{note.title}</strong>
                  {note.body && <span className="notification-body">{note.body}</span>}
                  <span className="notification-time">{note.time}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
