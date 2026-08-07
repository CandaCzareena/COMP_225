import { useState } from 'react';
import './Messages.css';

function Messages({ user }) {
  const [conversations, setConversations] = useState([
    { id: 1, name: "COMP228 Group Project Chat", lastMessage: "Did anyone push the final GUI changes?", time: "10m ago", active: true },
    { id: 2, name: "Emily Zhao", lastMessage: "Sounds good, see you at the library!", time: "2h ago", active: false },
    { id: 3, name: "Marcus Johnson (Tutor)", lastMessage: "I can help with JavaFX tomorrow.", time: "1d ago", active: false }
  ]);

  const [activeChat, setActiveChat] = useState(conversations[0]);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: "Sarah Jenkins", text: "Hey everyone, don't forget our project milestones submission is due soon!", time: "Yesterday" },
    { id: 2, sender: "Alex Mercer", text: "I finished the database connectivity layer.", time: "2 hours ago" },
    { id: 3, sender: "COMP228 Group Project Chat", text: "Did anyone push the final GUI changes?", time: "10m ago" }
  ]);

  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const freshMsg = {
      id: Date.now(),
      sender: user?.name || "Centennial Student",
      text: newMessage,
      time: "Just now"
    };

    setChatMessages([...chatMessages, freshMsg]);
    
    // Update the last message text in the conversation sidebar list
    setConversations(conversations.map(c => 
      c.id === activeChat.id ? { ...c, lastMessage: newMessage, time: "Just now" } : c
    ));
    
    setNewMessage('');
  };

  return (
    <div className="messages-page">
      {/* Sidebar List */}
      <div className="conversations-sidebar">
        <h3>Chats</h3>
        <div className="conversation-list">
          {conversations.map(convo => (
            <div 
              key={convo.id} 
              className={`convo-item ${activeChat.id === convo.id ? 'active' : ''}`}
              onClick={() => setActiveChat(convo)}
            >
              <div className="convo-avatar">
                <svg><use href="/icons.svg#messages-icon" /></svg>
              </div>
              <div className="convo-details">
                <div className="convo-header">
                  <h4>{convo.name}</h4>
                  <span className="convo-time">{convo.time}</span>
                </div>
                <p className="convo-preview">{convo.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Box Panel */}
      <div className="chat-window">
        <div className="chat-header">
          <h3>{activeChat.name}</h3>
        </div>

        <div className="chat-messages-area">
          {chatMessages.map(msg => {
            const isMe = msg.sender === user?.name || msg.sender === "Centennial Student";
            return (
              <div key={msg.id} className={`message-bubble-wrapper ${isMe ? 'outgoing' : 'incoming'}`}>
                {!isMe && <span className="message-sender-name">{msg.sender}</span>}
                <div className="message-bubble">
                  <p>{msg.text}</p>
                  <span className="message-time">{msg.time}</span>
                </div>
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSendMessage} className="chat-input-bar">
          <input 
            type="text" 
            placeholder={`Message ${activeChat.name}...`} 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            required
          />
          <button type="submit" className="chat-send-btn">Send</button>
        </form>
      </div>
    </div>
  );
}

export default Messages;