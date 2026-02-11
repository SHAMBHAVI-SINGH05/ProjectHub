// src/components/ChatInterface.tsx
import { useState, useEffect, useRef } from 'react';
import type { User, UserProfile } from '../types';
import './ChatInterface.css';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Date;
  read: boolean;
}

interface Conversation {
  id: string;
  participants: string[];
  lastMessage: Message;
  unreadCount: number;
}

interface ChatInterfaceProps {
  currentUser: User;
  connections: string[];
  users: UserProfile[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ currentUser, connections, users }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data - in real app, this would come from your backend
  useEffect(() => {
    const mockConversations: Conversation[] = [
      {
        id: '1',
        participants: [currentUser.id, '2'],
        lastMessage: {
          id: '1',
          senderId: '2',
          receiverId: currentUser.id,
          text: 'Hey, are you available for a call about the AI project?',
          timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
          read: false
        },
        unreadCount: 1
      },
      {
        id: '2',
        participants: [currentUser.id, '4'],
        lastMessage: {
          id: '2',
          senderId: '4',
          receiverId: currentUser.id,
          text: 'Great progress on the prototype! Let me know when you need funding advice.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
          read: true
        },
        unreadCount: 0
      }
    ];

    const mockMessages: Message[] = [
      {
        id: '1',
        senderId: '2',
        receiverId: currentUser.id,
        text: 'Hi! I saw your AI Study Assistant project. Looks amazing!',
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
        read: true
      },
      {
        id: '2',
        senderId: currentUser.id,
        receiverId: '2',
        text: 'Thanks Alex! Are you interested in collaborating?',
        timestamp: new Date(Date.now() - 1000 * 60 * 8),
        read: true
      },
      {
        id: '3',
        senderId: '2',
        receiverId: currentUser.id,
        text: 'Definitely! I have experience with React and Node.js. When can we discuss?',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        read: true
      },
      {
        id: '4',
        senderId: currentUser.id,
        receiverId: '2',
        text: 'How about tomorrow at 3 PM? I can share more details about the tech stack.',
        timestamp: new Date(Date.now() - 1000 * 60 * 3),
        read: true
      },
      {
        id: '5',
        senderId: '2',
        receiverId: currentUser.id,
        text: 'Hey, are you available for a call about the AI project?',
        timestamp: new Date(Date.now() - 1000 * 60 * 2),
        read: false
      }
    ];

    setConversations(mockConversations);
    setMessages(mockMessages);
  }, [currentUser.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const otherParticipant = selectedConversation.participants.find(id => id !== currentUser.id);
    if (!otherParticipant) return;

    const message: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: currentUser.id,
      receiverId: otherParticipant,
      text: newMessage,
      timestamp: new Date(),
      read: false
    };

    setMessages(prev => [...prev, message]);
    
    // Update conversation last message
    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { 
              ...conv, 
              lastMessage: message,
              unreadCount: 0 
            }
          : conv
      )
    );

    setNewMessage('');
  };

  const getOtherParticipant = (conversation: Conversation) => {
    const otherId = conversation.participants.find(id => id !== currentUser.id);
    return users.find(user => user.id === otherId);
  };

  const filteredConversations = conversations.filter(conv => {
    const otherUser = getOtherParticipant(conv);
    return otherUser?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const availableUsers = users.filter(user => 
    user.id !== currentUser.id && 
    !conversations.some(conv => conv.participants.includes(user.id))
  );

  const startNewConversation = (user: UserProfile) => {
    const newConversation: Conversation = {
      id: Math.random().toString(36).substr(2, 9),
      participants: [currentUser.id, user.id],
      lastMessage: {
        id: '0',
        senderId: currentUser.id,
        receiverId: user.id,
        text: 'Conversation started',
        timestamp: new Date(),
        read: true
      },
      unreadCount: 0
    };

    setConversations(prev => [newConversation, ...prev]);
    setSelectedConversation(newConversation);
    setMessages([]);
  };

  return (
    <div className="chat-interface">
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <h2>💬 Messages</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="conversations-list">
          {filteredConversations.map(conversation => {
            const otherUser = getOtherParticipant(conversation);
            if (!otherUser) return null;

            return (
              <div
                key={conversation.id}
                className={`conversation-item ${selectedConversation?.id === conversation.id ? 'active' : ''}`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="user-avatar">
                  {otherUser.name.charAt(0)}
                </div>
                <div className="conversation-info">
                  <div className="user-name">{otherUser.name}</div>
                  <div className="last-message">
                    {conversation.lastMessage.text}
                  </div>
                </div>
                <div className="conversation-meta">
                  <div className="message-time">
                    {conversation.lastMessage.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                  {conversation.unreadCount > 0 && (
                    <div className="unread-badge">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {availableUsers.length > 0 && (
          <div className="new-chat-section">
            <h3>Start New Chat</h3>
            {availableUsers.slice(0, 3).map(user => (
              <div
                key={user.id}
                className="user-item"
                onClick={() => startNewConversation(user)}
              >
                <div className="user-avatar">
                  {user.name.charAt(0)}
                </div>
                <div className="user-info">
                  <div className="user-name">{user.name}</div>
                  <div className="user-role">{user.role}</div>
                </div>
                <button className="start-chat-btn">💬</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="chat-main">
        {selectedConversation ? (
          <>
            <div className="chat-header">
              {(() => {
                const otherUser = getOtherParticipant(selectedConversation);
                return otherUser ? (
                  <>
                    <div className="user-avatar">
                      {otherUser.name.charAt(0)}
                    </div>
                    <div className="chat-user-info">
                      <div className="user-name">{otherUser.name}</div>
                      <div className="user-status">Online</div>
                    </div>
                  </>
                ) : null;
              })()}
            </div>

            <div className="messages-container">
              {messages
                .filter(msg => 
                  (msg.senderId === currentUser.id && msg.receiverId === selectedConversation.participants.find(id => id !== currentUser.id)) ||
                  (msg.receiverId === currentUser.id && msg.senderId === selectedConversation.participants.find(id => id !== currentUser.id))
                )
                .map(message => (
                  <div
                    key={message.id}
                    className={`message ${message.senderId === currentUser.id ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">
                      <p>{message.text}</p>
                      <span className="message-time">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="message-input-form">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="message-input"
              />
              <button 
                type="submit" 
                disabled={!newMessage.trim()}
                className="send-button"
              >
                📤
              </button>
            </form>
          </>
        ) : (
          <div className="no-conversation">
            <div className="no-chat-icon">💬</div>
            <h3>Select a conversation</h3>
            <p>Choose a conversation from the sidebar or start a new chat</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;