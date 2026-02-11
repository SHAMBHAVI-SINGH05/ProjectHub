import { useEffect, useState } from "react";
import "./Profile.css";

interface ProfileProps {
  user: any;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [profile, setProfile] = useState<any>(null);
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("csh_token");

    fetch(`http://127.0.0.1:5000/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setBio(data.bio || "");
      })
      .catch(err => console.error(err));
  }, []);

  const saveBio = async () => {
    const token = localStorage.getItem("csh_token");

    await fetch("http://127.0.0.1:5000/api/users/update-bio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bio }),
    });

    setEditingBio(false);
  };

  if (!profile) return <div className="loading">Loading profile...</div>;

  return (
    <div className="profile-container">

      {/* HEADER */}
      <div className="profile-header">
        <div className="avatar">
          {profile.name?.charAt(0).toUpperCase()}
        </div>

        <div className="profile-info">
          <h2>{profile.name}</h2>
          <p>{profile.email}</p>
          <span className="role">{profile.role}</span>

          <div className="bio">
            {editingBio ? (
              <>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
                <button onClick={saveBio}>Save</button>
              </>
            ) : (
              <>
                <p>{profile.bio || "No bio added yet"}</p>
                <button onClick={() => setEditingBio(true)}>
                  Edit Bio
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats">
        <div className="stat">
          <h3>{profile.projects?.length || 0}</h3>
          <p>Projects</p>
        </div>

        <div className="stat">
          <h3>{profile.connections?.length || 0}</h3>
          <p>Connections</p>
        </div>

        <div className="stat">
          <h3>{profile.skills?.length || 0}</h3>
          <p>Skills</p>
        </div>

        <div className="stat">
          <h3>{profile.interests?.length || 0}</h3>
          <p>Interests</p>
        </div>
      </div>

      <div className="profile-grid">

        {/* SKILLS */}
        <div className="card">
          <h3>Skills</h3>
          <div className="tags">
            {profile.skills?.map((s: string) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </div>

        {/* INTERESTS */}
        <div className="card">
          <h3>Interests</h3>
          <div className="tags">
            {profile.interests?.map((i: string) => (
              <span key={i}>{i}</span>
            ))}
          </div>
        </div>

        {/* LOOKING FOR */}
        <div className="card">
          <h3>Looking For</h3>
          <div className="tags">
            {profile.lookingFor?.map((l: string) => (
              <span key={l}>{l}</span>
            ))}
          </div>
        </div>

        {/* RECENT PROJECTS */}
        <div className="card wide">
          <h3>Recent Projects</h3>
          {profile.projects?.length ? (
            profile.projects.map((p: any) => (
              <div className="project" key={p.id}>
                <h4>{p.title}</h4>
                <p>{p.description}</p>
              </div>
            ))
          ) : (
            <p>No projects yet</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
