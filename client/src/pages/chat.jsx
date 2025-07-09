// src/pages/ChatPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaSearch } from 'react-icons/fa';
import '../styles/chat.css';

// DUMMY DATA: Real app mein yeh sab API se aayega
const dummyConversations = [
  { id: 1, name: 'Dr. Ananya Sharma', imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16e?w=100', lastMessage: "Yes, of course. Let's discuss this.", timestamp: "10:42 AM", unreadCount: 2 },
  { id: 2, name: 'Adv. Rohan Verma', imageUrl: 'https://images.unsplash.com/photo-1594744806549-5a76173d35b4?w=100', lastMessage: "I've sent the documents.", timestamp: "Yesterday", unreadCount: 0 },
  { id: 3, name: 'Isha Gupta', imageUrl: 'https://images.unsplash.com/photo-1554744512-d6c603f27c64?w=100', lastMessage: "Okay, I'll check it out.", timestamp: "18/10/24", unreadCount: 0 },
];

const dummyMessages = {
  1: [
    { id: 'm1', text: "Hello Dr. Sharma, I'd like to book an appointment.", sender: 'me', timestamp: "10:30 AM" },
    { id: 'm2', text: "Hello! Certainly. What time works best for you?", sender: 'them', timestamp: "10:31 AM" },
    { id: 'm3', text: "Would tomorrow at 11 AM be possible?", sender: 'me', timestamp: "10:35 AM" },
    { id: 'm4', text: "Yes, of course. Let's discuss this.", sender: 'them', timestamp: "10:42 AM" },
  ],
  2: [
    { id: 'm5', text: "Hi Rohan, could you please review the contract?", sender: 'me', timestamp: "Yesterday" },
    { id: 'm6', text: "I've sent the documents.", sender: 'them', timestamp: "Yesterday" },
  ],
  3: [],
};


const ChatPage = () => {
  const [conversations, setConversations] = useState(dummyConversations);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Set the first conversation as active on initial load
  useEffect(() => {
    if (conversations.length > 0) {
      setActiveConversation(conversations[0]);
    }
  }, []);

  // Fetch messages for the active conversation
  useEffect(() => {
    if (activeConversation) {
      setMessages(dummyMessages[activeConversation.id] || []);
    }
  }, [activeConversation]);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleConversationClick = (conversation) => {
    setActiveConversation(conversation);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const newMessageObj = {
      id: `m${Date.now()}`,
      text: newMessage,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessageObj]);
    setNewMessage('');
  };


  return (
    <div className="chat-page-layout">
      <div className="chat-container">

        {/* --- Sidebar (Conversation List) --- */}
        <aside className="sidebar">
          <header className="sidebar-header">
            <h2>Conversations</h2>
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input type="text" placeholder="Search professionals..." />
            </div>
          </header>
          <div className="conversation-list">
            {conversations.map(conv => (
              <div
                key={conv.id}
                className={`conversation-item ${activeConversation?.id === conv.id ? 'active' : ''}`}
                onClick={() => handleConversationClick(conv)}
              >
                <img src={conv.imageUrl} alt={conv.name} className="avatar" />
                <div className="conversation-details">
                  <div className="name-time">
                    <span className="name">{conv.name}</span>
                    <span className="timestamp">{conv.timestamp}</span>
                  </div>
                  <div className="message-preview">
                    <p>{conv.lastMessage}</p>
                    {conv.unreadCount > 0 && <span className="unread-badge">{conv.unreadCount}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* --- Main Chat Window --- */}
        <main className="chat-window">
          {activeConversation ? (
            <>
              <header className="chat-header">
                <img src={activeConversation.imageUrl} alt={activeConversation.name} className="avatar" />
                <div className="header-info">
                  <h3>{activeConversation.name}</h3>
                  <span className="status online">Online</span>
                </div>
              </header>

              <div className="message-area">
                {messages.map(msg => (
                  <div key={msg.id} className={`message-bubble-wrapper ${msg.sender === 'me' ? 'sent' : 'received'}`}>
                    <div className="message-bubble">
                      <p className="message-text">{msg.text}</p>
                      <span className="message-timestamp">{msg.timestamp}</span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form className="message-input-form" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit"><FaPaperPlane /></button>
              </form>
            </>
          ) : (
            <div className="no-chat-selected">
              <h2>Select a conversation to start chatting</h2>
            </div>
          )}
        </main>

      </div>
    </div>
  );
};

export default ChatPage;