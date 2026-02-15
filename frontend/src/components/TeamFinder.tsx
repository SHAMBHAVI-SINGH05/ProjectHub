// src/components/TeamFinder.tsx
import { useState, useEffect } from 'react';
import type { User, UserProfile, TeamSearchFilters } from '../types';
import './TeamFinder.css';

interface TeamFinderProps {
  currentUser: User;
  onSendConnection: (toUserId: string, message: string) => void;
}

const TeamFinder: React.FC<TeamFinderProps> = ({ currentUser, onSendConnection }) => {
  const [filters, setFilters] = useState<TeamSearchFilters>({
    skills: [],
    interests: [],
    role: '',
    availability: 'flexible'
  });
  const [users, setUsers] = useState<UserProfile[]>([]);
const [,setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [connectionMessage, setConnectionMessage] = useState('');

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    if (user.id === currentUser.id) return false;
    
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSkills = filters.skills.length === 0 || 
                         filters.skills.some(skill => user.skills.includes(skill));
    
    const matchesInterests = filters.interests.length === 0 ||
                           filters.interests.some(interest => user.interests.includes(interest));
    
    return matchesSearch && matchesSkills && matchesInterests;
  });

  const handleSendConnection = (userId: string) => {
    if (connectionMessage.trim()) {
      onSendConnection(userId, connectionMessage);
      setConnectionMessage('');
      setSelectedUser(null);
    }
  };
  
  useEffect(() => {
  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem("csh_token");
      console.log("TOKEN BEING SENT:", token);
      const res = await fetch("http://127.0.0.1:5000/api/users/match", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      // convert backend response to UI format
      const formatted = data.matches.map((u: any) => ({
  id: u.user_id || u.id,
  name: u.name || "Unknown User",
  role: u.role || "student",
  skills: u.skills || [],
  interests: u.interests || [],
  projects: u.projects || [],
  connections: u.connections || []
}));

      setUsers(formatted);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching matches:", err);
      setLoading(false);
    }
  };

  fetchMatches();
}, []);

  return (
    <div className="team-finder">
      <div className="team-finder-header">
        <h1>Find Your Dream Team</h1>
        <p>Connect with talented students and mentors to build your startup</p>
      </div>

      <div className="team-finder-content">
        {/* Search and Filters Sidebar */}
        <div className="filters-sidebar">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-section">
            <h3>Skills</h3>
            <div className="filter-tags">
              {['React', 'Node.js', 'Python', 'UI/UX', 'Marketing', 'Finance'].map(skill => (
                <button
                  key={skill}
                  className={`filter-tag ${filters.skills.includes(skill) ? 'active' : ''}`}
                  onClick={() => setFilters(prev => ({
                    ...prev,
                    skills: prev.skills.includes(skill) 
                      ? prev.skills.filter(s => s !== skill)
                      : [...prev.skills, skill]
                  }))}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Interests</h3>
            <div className="filter-tags">
              {['AI', 'Sustainability', 'Education', 'Healthcare', 'E-commerce'].map(interest => (
                <button
                  key={interest}
                  className={`filter-tag ${filters.interests.includes(interest) ? 'active' : ''}`}
                  onClick={() => setFilters(prev => ({
                    ...prev,
                    interests: prev.interests.includes(interest)
                      ? prev.interests.filter(i => i !== interest)
                      : [...prev.interests, interest]
                  }))}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Role</h3>
            <select 
              value={filters.role}
              onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
              className="role-select"
            >
              <option value="">Any Role</option>
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="marketing">Marketing</option>
              <option value="business">Business</option>
            </select>
          </div>
        </div>

        {/* Users Grid */}
        <div className="users-grid">
          {filteredUsers.map(user => (
            <div key={user.id} className="user-card">
              <div className="user-header">
                <div className="user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <h3>{user.name}</h3>
                  <span className="user-role">{user.role}</span>
                </div>
              </div>

              <div className="user-skills">
                <h4>Skills</h4>
                <div className="skill-tags">
                  {user.skills.slice(0, 4).map(skill => (
                    <span key={skill} className="skill-tag">{skill}</span>
                  ))}
                  {user.skills.length > 4 && (
                    <span className="skill-more">+{user.skills.length - 4} more</span>
                  )}
                </div>
              </div>

              <div className="user-interests">
                <h4>Interests</h4>
                <div className="interest-tags">
                  {user.interests.slice(0, 3).map(interest => (
                    <span key={interest} className="interest-tag">{interest}</span>
                  ))}
                </div>
              </div>

              <div className="user-stats">
                <div className="stat">
                  <strong>{user.projects?.length || 0}</strong>
                  <span>Projects</span>
                </div>
                <div className="stat">
                  <strong>{user.connections?.length || 0}</strong>
                  <span>Connections</span>
                </div>
              </div>

              <button 
                className="connect-btn"
                onClick={() => setSelectedUser(user)}
              >
                🤝 Connect
              </button>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="no-users">
              <h3>No users found</h3>
              <p>Try adjusting your search filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Connection Modal */}
      {selectedUser && (
        <div className="modal-overlay">
          <div className="connection-modal">
            <div className="modal-header">
              <h2>Connect with {selectedUser.name}</h2>
              <button 
                className="close-btn"
                onClick={() => setSelectedUser(null)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <p>Send a connection request to collaborate on projects</p>
              
              <div className="message-input">
                <label>Message (optional)</label>
                <textarea
                  value={connectionMessage}
                  onChange={(e) => setConnectionMessage(e.target.value)}
                  placeholder="Hi! I'd love to connect and discuss potential collaboration..."
                  rows={4}
                />
              </div>

              <div className="modal-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => setSelectedUser(null)}
                >
                  Cancel
                </button>
                <button 
                  className="btn-primary"
                  onClick={() => handleSendConnection(selectedUser.id)}
                >
                  Send Connection Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamFinder;