import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

interface User {
  name: string;
  role: string;
  photo?: string | null;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      navigate("/");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!user) return <div className="dashboard-loading">Loading...</div>;

  const profileImage = user.photo
    ? `http://localhost:4000${user.photo}` 
    : null;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="profile-section">
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="profile-pic" />
          ) : (
            <div className="profile-placeholder">{user.name[0]}</div>
          )}
          <div className="profile-text">
            <h1>Welcome, {user.name}</h1>
            <p className="role">{user.role.toUpperCase()}</p>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-card">
          <h2>Dashboard Overview</h2>
          <p>Here you can manage your classes, tasks, and profile details.</p>
        </div>

        <div className="dashboard-card">
          <h2>Profile Details</h2>
          <ul>
            <li><b>Name:</b> {user.name}</li>
            <li><b>Role:</b> {user.role}</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
