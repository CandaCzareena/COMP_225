import { useState, useEffect, useRef } from 'react';
import ProfilePhoto from '../../components/ProfilePhoto/ProfilePhoto';
import { uploadMedia } from '../../utils/uploadMedia';
import './Messages.css';

function authHeaders() {
  const token = localStorage.getItem('coltcircle_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

function Messages({ user, chatRecipient }) {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [showMeeting, setShowMeeting] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [meetingForm, setMeetingForm] = useState({
    title: 'Tutor session',
    at: '',
    location: 'Online / campus',
  });
  const messagesEndRef = useRef(null);
  const activeChatIdRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    activeChatIdRef.current = activeChat?.id ? String(activeChat.id) : null;
  }, [activeChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      const res = await fetch('/api/messages', { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load conversations');
      setConversations(Array.isArray(data) ? data : []);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      setError(err.message);
      return [];
    }
  };

  const loadThread = async (partnerId, { silent = false } = {}) => {
    if (!partnerId) return;
    try {
      if (!silent) setLoading(true);
      const res = await fetch(`/api/messages/${partnerId}`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load messages');

      if (
        activeChatIdRef.current &&
        String(partnerId) !== activeChatIdRef.current &&
        silent
      ) {
        return;
      }

      setChatMessages(data.messages || []);
      setActiveChat((prev) => ({
        id: data.partner.id,
        name: data.partner.name,
        email: data.partner.email,
        role: data.partner.role,
        profilePhoto: data.partner.profilePhoto || '',
        lastMessage: prev?.lastMessage || data.messages?.at(-1)?.text || 'Start a conversation...',
        time: prev?.time || data.messages?.at(-1)?.time || '',
      }));
      setError('');
    } catch (err) {
      if (!silent) setError(err.message);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const resolvePartnerId = async (recipient) => {
      if (!recipient) return null;
      if (recipient._id || recipient.id) return String(recipient._id || recipient.id);
      if (!recipient.email) return null;

      const res = await fetch('/api/users', { headers: authHeaders() });
      const users = await res.json();
      const match = (Array.isArray(users) ? users : []).find(
        (u) => u.email === recipient.email
      );
      return match?._id ? String(match._id) : null;
    };

    const init = async () => {
      setLoading(true);
      const list = await loadConversations();
      if (cancelled) return;

      const partnerId = await resolvePartnerId(chatRecipient);
      if (cancelled) return;

      if (partnerId) {
        const existing = list.find((c) => String(c.id) === partnerId);
        setActiveChat(
          existing || {
            id: partnerId,
            name: chatRecipient.name || chatRecipient.username || 'Student',
            email: chatRecipient.email || '',
            lastMessage: 'Start a conversation...',
            time: 'Just now',
          }
        );
        setMobileShowChat(true);
        await loadThread(partnerId);
      } else if (chatRecipient) {
        setError(
          'That person is not a registered user yet, so messages cannot be delivered.'
        );
        setActiveChat(null);
        setChatMessages([]);
        setMobileShowChat(false);
        setLoading(false);
      } else if (list.length > 0) {
        setActiveChat(list[0]);
        setMobileShowChat(false);
        await loadThread(list[0].id);
      } else {
        setActiveChat(null);
        setChatMessages([]);
        setMobileShowChat(false);
        setLoading(false);
      }
    };

    init();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatRecipient]);

  useEffect(() => {
    if (!activeChat?.id) return undefined;

    const interval = setInterval(async () => {
      await loadThread(activeChat.id, { silent: true });
      await loadConversations();
    }, 3000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChat?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSelectChat = async (convo) => {
    setActiveChat(convo);
    setMobileShowChat(true);
    await loadThread(convo.id);
  };

  const pushLocalMessage = (data, preview) => {
    setChatMessages((prev) => [...prev, data]);
    setConversations((prev) => {
      const others = prev.filter((c) => String(c.id) !== String(activeChat.id));
      return [
        {
          ...activeChat,
          lastMessage: preview,
          time: data.time || 'Just now',
        },
        ...others,
      ];
    });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat?.id || sending) return;

    const text = newMessage.trim();
    setSending(true);
    setError('');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          recipientId: activeChat.id,
          text,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message');
      pushLocalMessage(data, text);
      setNewMessage('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const handleSendMedia = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !activeChat?.id || sending) return;

    setSending(true);
    setError('');
    try {
      const uploaded = await uploadMedia(file);
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          recipientId: activeChat.id,
          text: newMessage.trim() || '',
          mediaUrl: uploaded.url,
          mediaType: uploaded.mediaType,
          messageType: 'media',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send media');
      pushLocalMessage(data, uploaded.mediaType === 'video' ? 'Video' : 'Photo');
      setNewMessage('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const handleScheduleMeeting = async (e) => {
    e.preventDefault();
    if (!activeChat?.id || !meetingForm.title || !meetingForm.at) return;

    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          recipientId: activeChat.id,
          messageType: 'meeting',
          meetingTitle: meetingForm.title,
          meetingAt: meetingForm.at,
          meetingLocation: meetingForm.location,
          text: `Meeting scheduled: ${meetingForm.title}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to schedule meeting');
      pushLocalMessage(data, `Meeting: ${meetingForm.title}`);
      setShowMeeting(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const myId = user?._id || user?.id;

  return (
    <div className={`messages-page ${mobileShowChat ? 'mobile-chat-open' : ''}`}>
      <div className="conversations-sidebar">
        <h3>Chats</h3>
        <div className="conversation-list">
          {conversations.length === 0 ? (
            <p style={{ padding: '1rem', color: '#888', fontSize: '0.9rem' }}>
              No conversations yet. Open Users and click Message.
            </p>
          ) : (
            conversations.map((convo) => (
              <div
                key={convo.id}
                className={`convo-item ${String(activeChat?.id) === String(convo.id) ? 'active' : ''}`}
                onClick={() => handleSelectChat(convo)}
              >
                <div
                  className="convo-avatar"
                  style={{ background: 'transparent', border: 'none', padding: 0 }}
                >
                  <ProfilePhoto src={convo.profilePhoto} name={convo.name} size={44} />
                </div>
                <div className="convo-details">
                  <div className="convo-header">
                    <h4>{convo.name}</h4>
                    <span className="convo-time">{convo.time}</span>
                  </div>
                  <p className="convo-preview">{convo.lastMessage}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="chat-window">
        <div className="chat-header">
          <div className="chat-header-main">
            <button
              type="button"
              className="chat-back-btn"
              onClick={() => setMobileShowChat(false)}
            >
              Back
            </button>
            <div>
              <h3>{activeChat?.name || 'Select a conversation'}</h3>
              {activeChat?.role && (
                <span className="chat-role">{activeChat.role}</span>
              )}
            </div>
          </div>
          {activeChat && (
            <button
              type="button"
              className="meeting-toggle"
              onClick={() => setShowMeeting((v) => !v)}
            >
              {showMeeting ? 'Close' : 'Schedule'}
            </button>
          )}
        </div>

        {error && (
          <p style={{ color: '#c0392b', padding: '0.75rem 1rem', margin: 0 }}>
            {error}
          </p>
        )}

        {showMeeting && activeChat && (
          <form className="meeting-form" onSubmit={handleScheduleMeeting}>
            <input
              placeholder="Meeting title"
              value={meetingForm.title}
              onChange={(e) => setMeetingForm({ ...meetingForm, title: e.target.value })}
              required
            />
            <input
              type="datetime-local"
              value={meetingForm.at}
              onChange={(e) => setMeetingForm({ ...meetingForm, at: e.target.value })}
              required
            />
            <input
              placeholder="Location / Zoom link"
              value={meetingForm.location}
              onChange={(e) =>
                setMeetingForm({ ...meetingForm, location: e.target.value })
              }
            />
            <button type="submit" disabled={sending}>
              Send meeting invite
            </button>
          </form>
        )}

        <div className="chat-messages-area">
          {loading ? (
            <p style={{ color: '#888' }}>Loading messages...</p>
          ) : !activeChat ? (
            <p style={{ color: '#888' }}>
              Pick someone from Users → Message to start chatting.
            </p>
          ) : chatMessages.length === 0 ? (
            <p style={{ color: '#888' }}>No messages yet. Say hello!</p>
          ) : (
            chatMessages.map((msg) => {
              const isMe = String(msg.senderId) === String(myId);
              return (
                <div
                  key={msg.id}
                  className={`message-bubble-wrapper ${isMe ? 'outgoing' : 'incoming'}`}
                >
                  {!isMe && (
                    <span className="message-sender-name">{msg.sender}</span>
                  )}
                  <div className="message-bubble">
                    {msg.messageType === 'meeting' ? (
                      <div className="meeting-card">
                        <strong>{msg.meetingTitle || 'Tutor meeting'}</strong>
                        <p>
                          {msg.meetingAt
                            ? new Date(msg.meetingAt).toLocaleString()
                            : 'Time TBD'}
                        </p>
                        {msg.meetingLocation && <p>{msg.meetingLocation}</p>}
                      </div>
                    ) : (
                      <>
                        {msg.text && <p>{msg.text}</p>}
                        {msg.mediaUrl && msg.mediaType === 'image' && (
                          <img className="chat-media" src={msg.mediaUrl} alt="" />
                        )}
                        {msg.mediaUrl && msg.mediaType === 'video' && (
                          <video className="chat-media" src={msg.mediaUrl} controls />
                        )}
                      </>
                    )}
                    <span className="message-time">{msg.time}</span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="chat-input-bar">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            hidden
            onChange={handleSendMedia}
          />
          <button
            type="button"
            className="attach-btn"
            disabled={!activeChat || sending}
            onClick={() => fileInputRef.current?.click()}
          >
            Media
          </button>
          <input
            type="text"
            placeholder={
              activeChat
                ? `Message ${activeChat.name}...`
                : 'Select a conversation first'
            }
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={!activeChat || sending}
          />
          <button
            type="submit"
            className="chat-send-btn"
            disabled={!activeChat || sending || !newMessage.trim()}
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Messages;
