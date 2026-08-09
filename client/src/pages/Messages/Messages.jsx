import { useState, useEffect, useRef } from 'react';
import ProfilePhoto from '../../components/ProfilePhoto/ProfilePhoto';
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
  const messagesEndRef = useRef(null);
  const activeChatIdRef = useRef(null);

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

      // Ignore stale responses if user switched chats
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

  // Initial load + open chatRecipient if provided
  useEffect(() => {
    let cancelled = false;

    const resolvePartnerId = async (recipient) => {
      if (!recipient) return null;
      if (recipient._id || recipient.id) return String(recipient._id || recipient.id);
      if (!recipient.email) return null;

      // Marketplace sellers may only have email — map to a real user id
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
        await loadThread(partnerId);
      } else if (chatRecipient) {
        setError(
          'That person is not a registered user yet, so messages cannot be delivered.'
        );
        setActiveChat(null);
        setChatMessages([]);
        setLoading(false);
      } else if (list.length > 0) {
        setActiveChat(list[0]);
        await loadThread(list[0].id);
      } else {
        setActiveChat(null);
        setChatMessages([]);
        setLoading(false);
      }
    };

    init();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatRecipient]);

  // Poll active thread + conversation list so user2 sees new messages
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
    await loadThread(convo.id);
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

      setChatMessages((prev) => [...prev, data]);
      setConversations((prev) => {
        const others = prev.filter((c) => String(c.id) !== String(activeChat.id));
        return [
          {
            ...activeChat,
            lastMessage: text,
            time: data.time || 'Just now',
          },
          ...others,
        ];
      });
      setNewMessage('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const myId = user?._id || user?.id;

  return (
    <div className="messages-page">
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
              <div className="convo-avatar" style={{ background: 'transparent', border: 'none', padding: 0 }}>
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
          <h3>{activeChat?.name || 'Select a conversation'}</h3>
        </div>

        {error && (
          <p style={{ color: '#c0392b', padding: '0.75rem 1rem', margin: 0 }}>
            {error}
          </p>
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
                    <p>{msg.text}</p>
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
            type="text"
            placeholder={
              activeChat
                ? `Message ${activeChat.name}...`
                : 'Select a conversation first'
            }
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={!activeChat || sending}
            required
          />
          <button
            type="submit"
            className="chat-send-btn"
            disabled={!activeChat || sending}
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Messages;
