// src/components/Home.tsx
import { useState } from 'react';
import type { User, Project, UserProfile, FundingApplication, Conversation, Message } from '../types/index.ts';
import './Home.css';
import AIProposalAssistant from './AIProposalAssistant';
import TeamFinder from './TeamFinder';
import FundingPortal from './fundingPortal';
import { io, Socket } from "socket.io-client";
import { useEffect } from "react";
import Profile from './Profile';
interface HomeProps {
  user: User;
  onLogout: () => void;
}


const Home: React.FC<HomeProps> = ({ user, onLogout }) => {
  // Update activeTab to include 'funding'
  const [activeTab, setActiveTab] = useState<
  'dashboard' | 'projects' | 'network' | 'ai' | 'funding' | 'profile'
>('dashboard');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connections] = useState<string[]>([]);
   const [showCreateProject, setShowCreateProject] = useState(false);
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'AI Study Assistant',
      description: 'An AI-powered platform that helps students create personalized study plans and track their progress.',
      category: 'Education Tech',
      stage: 'prototype',
      skillsNeeded: ['React', 'Node.js', 'Machine Learning'],
      creatorId: user.id,
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      title: 'Campus Marketplace',
      description: 'A peer-to-peer marketplace for students to buy, sell, and trade items within campus.',
      category: 'E-commerce',
      stage: 'ideation',
      skillsNeeded: ['React Native', 'Firebase', 'UI/UX Design'],
      creatorId: user.id,
      createdAt: new Date('2024-01-20')
    }
  ]);

  // Add state for funding applications
  const [fundingApplications, setFundingApplications] = useState<FundingApplication[]>([]);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    category: '',
    stage: 'ideation' as 'ideation' | 'prototype' | 'launched',
    skillsNeeded: [] as string[]
  });

  // Add Team Finder state
  useEffect(() => {
  const token = localStorage.getItem("csh_token");
  if (!token) return;

  const s = io("http://localhost:5000", {
    query: { token }
  });

  setSocket(s);

  s.on("connect", () => {
    console.log("✅ Connected to chat server");
  });

  return () => {
    s.disconnect();
  };
}, []);

  // Mock users data for Team Finder
  const [allUsers, setAllUsers] = useState<UserProfile[]>([
    {
      id: '2',
      name: 'Alex Chen',
      email: 'alex@college.edu',
      password: '',
      role: 'student',
      skills: ['React', 'Node.js', 'TypeScript'],
      interests: ['AI', 'Education Tech'],
      lookingFor: ['developer'],
      bio: 'Full-stack developer passionate about edtech',
      projects: ['1', '3'],
      connections: ['1'],
      pendingRequests: [],
      createdAt: new Date()
    },
    {
      id: '3', 
      name: 'Sarah Johnson',
      email: 'sarah@college.edu',
      password: '',
      role: 'student',
      skills: ['UI/UX Design', 'Figma', 'Product Management'],
      interests: ['Sustainability', 'Design'],
      lookingFor: ['designer'],
      bio: 'Product designer focused on sustainable solutions',
      projects: ['2'],
      connections: [],
      pendingRequests: [],
      createdAt: new Date()
    },
    {
      id: '4',
      name: 'Dr. Michael Brown',
      email: 'm.brown@college.edu',
      password: '',
      role: 'mentor',
      skills: ['Business Strategy', 'Funding', 'Startup Advisory'],
      interests: ['AI', 'Healthcare'],
      lookingFor: ['mentor'],
      bio: 'Experienced startup mentor and investor',
      projects: [],
      connections: ['1', '2'],
      pendingRequests: [],
      createdAt: new Date()
    }
  ]);
useEffect(() => {
  const token = localStorage.getItem("csh_token");
  if (!token) {
    console.warn("No token yet, skipping conversations fetch");
    return;
  }

  fetch("http://localhost:5000/api/conversations", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    })
    .then(data => setConversations(data.conversations))
    .catch(err => console.error("Conversation fetch failed:", err));
}, []);



  // Chat State
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<{ [conversationId: string]: Message[] }>({});

  const [currentConversationId, setCurrentConversationId] =
  useState<string | null>(null);

  const [showChatWidget, setShowChatWidget] = useState(false);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const project: Project = {
      ...newProject,
      id: Math.random().toString(36).substr(2, 9),
      creatorId: user.id,
      createdAt: new Date()
    };
    setProjects(prev => [...prev, project]);
    setNewProject({
      title: '',
      description: '',
      category: '',
      stage: 'ideation',
      skillsNeeded: []
    });
    setShowCreateProject(false);
  };

  // Updated connection handler function to create and open chat
  const handleSendConnection = (toUserId: string, message: string) => {
    // In real app, this would call your backend
     if (!socket) return;
    socket?.emit("start_conversation", {
  user1_id: user.id,
  user2_id: toUserId
});
const targetUser = allUsers.find(u => u.id === toUserId);
    alert(`Connection request sent to ${targetUser?.name} with message: "${message}"`);
    
    // Update the user's pending requests in state
    setAllUsers(prev => prev.map(u => 
      u.id === toUserId 
        ? { ...u, pendingRequests: [...u.pendingRequests, user.id] }
        : u
    ));

    // Create or find existing conversation with this user
    
    };
useEffect(() => {
  if (!socket) return;
const handleReceiveMessage = (msg: any) => {
  setMessages(prev => ({
    ...prev,
    [msg.conversationId]: [
      ...(prev[msg.conversationId] || []),
      {
        id: msg.id ?? crypto.randomUUID(),
        conversationId: msg.conversationId,
        senderId: msg.senderId,
        text: msg.text,
        timestamp: new Date(msg.timestamp),
      }
    ]
  }));
};


  socket.on("receive_message", handleReceiveMessage);

  return () => {
    socket.off("receive_message", handleReceiveMessage);
  };
}, [socket]);
useEffect(() => {
  if (!socket) return;

  const handleConversationHistory = (data: any) => {
    setMessages(prev => ({
      ...prev,
      [data.conversation_id]: data.messages.map((m: any) => ({
        id: m.id,
        conversationId: data.conversation_id,
        senderId: m.sender_id,
        text: m.text,
        timestamp: new Date(m.timestamp),
      }))
    }));
  };

  socket.on("conversation_history", handleConversationHistory);

  return () => {
    socket.off("conversation_history", handleConversationHistory);
  };
}, [socket]);

    
useEffect(() => {
  if (!socket) return;

  const handleConversationStarted = (data: any) => {
    setCurrentConversationId(data.conversation_id);
    setShowChatWidget(true);
  };

  socket.on("conversation_started", handleConversationStarted);

  return () => {
    socket.off("conversation_started", handleConversationStarted);
  };
}, [socket]);

  // Add handler for funding application submission
  const handleApplicationSubmit = (application: FundingApplication) => {
    setFundingApplications(prev => [...prev, application]);
    // You could also show a success message or notification here
    console.log('Funding application submitted:', application);
  };

  // Chat functions
  const handleSendMessage = (conversationId: string, text: string) => {
  socket?.emit("send_message", {
    conversation_id: conversationId,
    text
  });
};


  const handleCloseChat = () => {
    setShowChatWidget(false);
    setCurrentConversationId(null);
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🎓</span>
            <span className="logo-text">projectHub</span>
          </div>
          
          <nav className="main-nav">
            <button 
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              My Projects
            </button>
            <button 
              className={`nav-item ${activeTab === 'network' ? 'active' : ''}`}
              onClick={() => setActiveTab('network')}
            >
              Network
            </button>
            <button 
              className={`nav-item ${activeTab === 'funding' ? 'active' : ''}`}
              onClick={() => setActiveTab('funding')}
            >
              💰 Funding
            </button>
            <button 
              className={`nav-item ${activeTab === 'ai' ? 'active' : ''}`}
              onClick={() => setActiveTab('ai')}
            >
              🤖 AI Assistant
            </button>
            <button 
  className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
  onClick={() => setActiveTab('profile')}
>
  👤 Profile
</button>

          </nav>

          <div className="user-menu">
            <div className="user-info">
              <span className="user-name">Welcome, {user.name}</span>
              <span className="user-role">{user.role}</span>
            </div>
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="home-main">
        {activeTab === 'dashboard' && (
          <div className="dashboard">
            <div className="dashboard-header">
              <h1>Dashboard</h1>
              <p>Welcome to your project hub, {user.name}!</p>
            </div>

            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <h3>{projects.length}</h3>
                  <p>Active Projects</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>{connections.length}</h3>
                  <p>Connections</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <h3>{fundingApplications.length}</h3>
                  <p>Funding Applications</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🤖</div>
                <div className="stat-info">
                  <h3>12</h3>
                  <p>AI Analyses</p>
                </div>
              </div>
            </div>

            <div className="quick-actions">
              <h2>Quick Actions</h2>
              <div className="action-buttons">
                <button 
                  className="action-btn primary"
                  onClick={() => setShowCreateProject(true)}
                >
                  🚀 Launch New Project
                </button>
                <button 
                  className="action-btn secondary"
                  onClick={() => setActiveTab('ai')}
                >
                  🤖 AI Proposal Assistant
                </button>
                <button 
                  className="action-btn secondary"
                  onClick={() => setActiveTab('network')}
                >
                  👥 Find Team Members
                </button>
                <button 
                  className="action-btn secondary"
                  onClick={() => setActiveTab('funding')}
                >
                  💼 Apply for Funding
                </button>
              </div>
            </div>

            <div className="recent-projects">
              <h2>Recent Projects</h2>
              <div className="projects-grid">
                {projects.slice(0, 2).map(project => (
                  <div key={project.id} className="project-card">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="project-meta">
                      <span className={`stage ${project.stage}`}>
                        {project.stage}
                      </span>
                      <span className="category">{project.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="projects-tab">
            <div className="tab-header">
              <h1>My Projects</h1>
              <button 
                className="create-project-btn"
                onClick={() => setShowCreateProject(true)}
              >
                + New Project
              </button>
            </div>
            
            <div className="projects-list">
              {projects.map(project => (
                <div key={project.id} className="project-card detailed">
                  <div className="project-header">
                    <h3>{project.title}</h3>
                    <span className={`stage ${project.stage}`}>
                      {project.stage}
                    </span>
                  </div>
                  <p className="project-description">{project.description}</p>
                  <div className="project-details">
                    <span className="category">{project.category}</span>
                    <span className="date">
                      Created: {project.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="project-skills">
                    <h4>Skills Needed:</h4>
                    <div className="skills">
                      {project.skillsNeeded.map(skill => (
                        <span key={skill} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <div className="project-actions">
                    <button className="btn-outline">Edit Project</button>
                    <button className="btn-primary">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'network' && (
          <TeamFinder 
            currentUser={user}
            onSendConnection={handleSendConnection}
          />
        )}

        {/* Add Funding Tab */}
        {activeTab === 'funding' && (
          <div className="funding-tab">
            <FundingPortal 
              user={user}
              projects={projects}
              onApplicationSubmit={handleApplicationSubmit}
            />
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="ai-tab">
            <div className="tab-header">
              <h1>AI Proposal Assistant</h1>
              <p>Get instant feedback and improvements for your startup ideas</p>
            </div>
            <AIProposalAssistant />
          </div>
        )}
   {activeTab === 'profile' && (
  <Profile user={user} />
)}


      </main>

      {/* Chat Widget */}
      {showChatWidget && currentConversationId && (
        <div className="chat-widget">
          <div className="chat-header">
            <div className="chat-user-info">
              {(() => {
                const conversation = conversations.find(c => c.id === currentConversationId);
                const otherUserId = conversation?.participants.find(id => id !== user.id);
                const otherUser = allUsers.find(u => u.id === otherUserId);
                return (
                  <>
                    <div className="user-avatar">{otherUser?.name?.charAt(0)}</div>
                    <div className="user-details">
                      <div className="user-name">{otherUser?.name}</div>
                      <div className="user-status">Online</div>
                    </div>
                  </>
                );
              })()}
            </div>
            <button className="close-chat" onClick={handleCloseChat}>×</button>
          </div>
          
          <div className="chat-messages">
            {messages[currentConversationId]?.map(message => (
              <div 
                key={message.id} 
                className={`message ${message.senderId === user.id ? 'sent' : 'received'}`}
              >
                <div className="message-content">
                  {message.text}
                </div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
          
          <div className="chat-input">
            <input 
              type="text" 
              placeholder="Type a message..." 
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  handleSendMessage(currentConversationId, e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
            <button 
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                if (input.value.trim()) {
                  handleSendMessage(currentConversationId, input.value);
                  input.value = '';
                }
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateProject && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Launch New Project</h2>
              <button 
                className="close-btn"
                onClick={() => setShowCreateProject(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateProject} className="modal-form">
              <div className="input-group">
                <label>Project Title</label>
                <input
                  type="text"
                  value={newProject.title}
                  onChange={(e) => setNewProject(prev => ({...prev, title: e.target.value}))}
                  placeholder="Enter project title"
                  required
                />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({...prev, description: e.target.value}))}
                  placeholder="Describe your project..."
                  rows={4}
                  required
                />
              </div>
              <div className="input-group">
                <label>Category</label>
                <input
                  type="text"
                  value={newProject.category}
                  onChange={(e) => setNewProject(prev => ({...prev, category: e.target.value}))}
                  placeholder="e.g., Education Tech, E-commerce"
                  required
                />
              </div>
              <div className="input-group">
                <label>Current Stage</label>
                <select
                  value={newProject.stage}
                  onChange={(e) => setNewProject(prev => ({...prev, stage: e.target.value as any}))}
                >
                  <option value="ideation">Ideation</option>
                  <option value="prototype">Prototype</option>
                  <option value="launched">Launched</option>
                </select>
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowCreateProject(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;