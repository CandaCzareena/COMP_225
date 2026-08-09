import './Profile.css';

function Profile({ user }) {
  return (
    <div className="profile-page">
      <div className="profile-header-card">
        <div className="profile-avatar-large">
          <svg><use href="/icons.svg#profile-icon" /></svg>
        </div>
        <div className="profile-main-info">
          <h2>{user?.name || "Centennial Student"}</h2>
          <p className="profile-email">{user?.email || "student@my.centennialcollege.ca"}</p>
          <span className="profile-badge">Active Student</span>
        </div>
      </div>

      <div className="profile-details-grid">
        <div className="details-card">
          <h3>Academic Information</h3>
          <div className="info-row">
            <span className="info-label">Program:</span>
            <span className="info-value">{user?.program || "Software Engineering Technician"}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Student ID:</span>
            <span className="info-value">{user?.studentNumber || "999999999"}</span>
          </div>
          {user?.origin && (
            <div className="info-row">
              <span className="info-label">Country/Origin:</span>
              <span className="info-value">{user.origin}</span>
            </div>
          )}
        </div>

        <div className="details-card">
          <h3>My Marketplace Activity</h3>
          <p className="empty-state-text">You haven't listed any items for sale yet.</p>
          <button className="action-link-btn">+ Create a New Listing</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;