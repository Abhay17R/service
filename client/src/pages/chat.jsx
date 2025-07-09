import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaPaperPlane, FaSearch } from 'react-icons/fa';
import api from '../api/axios';
import { io } from 'socket.io-client';
import '../styles/chat.css';

const useAuth = () => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await api.get('/me');
                setUser(data.user);
            } catch (error) {
                console.error("Could not fetch user", error);
            }
        };
        fetchUser();
    }, []);
    return { currentUser: user };
};

const serviceLinkSupportChat = {
  id: 'servicelink_support',
  name: 'ServiceLink Support',
  imageUrl: 'https://i.ibb.co/6rFv5S4/servicelink-logo.png',
};

const serviceLinkSupportMessages = [
    {
        _id: 'slm1',
        message: "Welcome to ServiceLink Support! How can we help you today?",
        senderId: 'servicelink_support',
        createdAt: new Date().toISOString(),
    },
    {
        _id: 'slm2',
        message: "You can ask about booking appointments, payment issues, or any other queries.",
        senderId: 'servicelink_support',
        createdAt: new Date().toISOString(),
    }
];

const ChatPage = () => {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState({ conversations: true, messages: false });
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      const newSocket = io(import.meta.env.VITE_API_URL.replace("/api/v1", ""), {
          withCredentials: true,
      });
      setSocket(newSocket);
      return () => newSocket.close();
    }
  }, [currentUser]);

  useEffect(() => {
    if (!socket) return;
    socket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });
    socket.on("newMessage", (incomingMessage) => {
      if (activeConversation?.id === incomingMessage.senderId) {
        setMessages((prev) => [...prev, incomingMessage]);
      }
    });
    return () => {
        socket.off("getOnlineUsers");
        socket.off("newMessage");
    };
  }, [socket, activeConversation]);

  const handleConversationClick = useCallback(async (conversation) => {
    setActiveConversation(conversation);
    if (conversation.id === 'servicelink_support') {
        setMessages(serviceLinkSupportMessages);
        return;
    }
    setLoading(prev => ({...prev, messages: true}));
    try {
        const { data } = await api.get(`/chat/messages/${conversation.id}`);
        setMessages(data || []);
    } catch (err) {
        console.error("Failed to fetch messages:", err);
        setMessages([]);
    } finally {
        setLoading(prev => ({...prev, messages: false}));
    }
  }, []);

  const fetchConversations = useCallback(async () => {
    setLoading(prev => ({...prev, conversations: true}));
    try {
        const { data } = await api.get('/chat/conversations');
        const allConversations = [serviceLinkSupportChat, ...(data || [])];
        setConversations(allConversations);
        if (allConversations.length > 0 && !activeConversation) {
            handleConversationClick(allConversations[0]);
        }
    } catch (err) {
        console.error("Failed to fetch conversations:", err);
        setConversations([serviceLinkSupportChat]);
        handleConversationClick(serviceLinkSupportChat);
    } finally {
        setLoading(prev => ({...prev, conversations: false}));
    }
  }, [activeConversation, handleConversationClick]);

  useEffect(() => {
    if(currentUser) {
        fetchConversations();
    }
  }, [currentUser, fetchConversations]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !activeConversation) return;
    if (activeConversation.id === 'servicelink_support') {
        alert("This is a one-way support channel for now.");
        return;
    }
    try {
        const { data: sentMessage } = await api.post(`/chat/send/${activeConversation.id}`, { message: newMessage });
        setMessages([...messages, sentMessage]);
        setNewMessage('');
    } catch (err) {
        console.error("Failed to send message:", err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-page-layout">
      <div className="chat-container">
        <aside className="sidebar">
          <header className="sidebar-header">
            <h2>Conversations</h2>
          </header>
          <div className="conversation-list">
            {loading.conversations ? <p>Loading chats...</p> : conversations.map(conv => (
              <div
                key={conv.id}
                className={`conversation-item ${activeConversation?.id === conv.id ? 'active' : ''}`}
                onClick={() => handleConversationClick(conv)}
              >
                <div className="avatar-container">
                    <img src={conv.imageUrl} alt={conv.name} className="avatar" />
                    {onlineUsers.includes(conv.id) && <div className="online-indicator"></div>}
                </div>
                <div className="conversation-details">
                  <div className="name-time"><span className="name">{conv.name}</span></div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="chat-window">
          {activeConversation ? (
            <>
              <header className="chat-header">
                <img src={activeConversation.imageUrl} alt={activeConversation.name} className="avatar" />
                <div className="header-info">
                  <h3>{activeConversation.name}</h3>
                  {activeConversation.id !== 'servicelink_support' && (
                    onlineUsers.includes(activeConversation.id) ? 
                    <span className="status online">Online</span> :
                    <span className="status offline">Offline</span>
                  )}
                </div>
              </header>

              <div className="message-area">
                {loading.messages ? <p>Loading messages...</p> : messages.map(msg => (
                  <div key={msg._id} className={`message-bubble-wrapper ${msg.senderId === currentUser?._id ? 'sent' : 'received'}`}>
                    <div className="message-bubble">
                      <p className="message-text">{msg.message}</p>
                      <span className="message-timestamp">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form className="message-input-form" onSubmit={handleSendMessage}>
                <input type="text" placeholder="Type your message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                <button type="submit"><FaPaperPlane /></button>
              </form>
            </>
          ) : (
            <div className="no-chat-selected"><h2>Select a conversation to start chatting</h2></div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ChatPage;