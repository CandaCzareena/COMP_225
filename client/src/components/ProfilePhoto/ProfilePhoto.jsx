import './ProfilePhoto.css';

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function ProfilePhoto({ src, name = '', size = 96, className = '' }) {
  if (src) {
    return (
      <img
        className={`profile-photo ${className}`}
        src={src}
        alt={`${name || 'User'} profile`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`profile-photo profile-photo-fallback ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.34 }}
      aria-label={`${name || 'User'} profile`}
    >
      {getInitials(name)}
    </div>
  );
}

export default ProfilePhoto;
