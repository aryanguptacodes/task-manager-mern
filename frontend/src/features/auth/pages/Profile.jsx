import { useAuth } from "../../../context/AuthContext";
import "../../../styles/profile.css";

const Profile = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1>{user.name}</h1>
            <p>{user.role}</p>
          </div>
        </div>

        <div className="profile-info">
          <div className="info-box">
            <span>👤 Full Name</span>
            <h3>{user.name}</h3>
          </div>

          <div className="info-box">
            <span>📧 Email</span>
            <h3>{user.email}</h3>
          </div>

          <div className="info-box">
            <span>🆔 Username</span>
            <h3>{user.username}</h3>
          </div>

          <div className="info-box">
            <span>🟢 Status</span>
            <h3 className="active">Active</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
