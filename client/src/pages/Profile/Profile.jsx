import { useState, useEffect, useRef } from 'react';
import ProfilePhoto from '../../components/ProfilePhoto/ProfilePhoto';
import './Profile.css';

function authHeaders() {
  const token = localStorage.getItem('coltcircle_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

function fileToResizedDataUrl(file, maxSize = 400, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read image file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Could not load image'));
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function Profile({ user, onUserUpdate, onNavigateMarketplace }) {
  const fileInputRef = useRef(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [myItems, setMyItems] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    program: '',
    studentNumber: '',
    origin: '',
  });

  const userId = user?._id || user?.id;

  const applyUserPayload = (data) => {
    setForm({
      name: data.name || '',
      email: data.email || '',
      program: data.program || '',
      studentNumber: data.studentNumber || '',
      origin: data.origin || '',
    });
    setProfilePhoto(data.profilePhoto || '');
  };

  const loadProfile = async () => {
    if (!userId) {
      setLoading(false);
      setError('No user id found. Please log out and sign in again.');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`/api/users/${userId}`, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not load profile');
      applyUserPayload(data);
      setError('');
    } catch (err) {
      setError(err.message);
      applyUserPayload(user || {});
    } finally {
      setLoading(false);
    }
  };

  const loadMyItems = async () => {
    try {
      const res = await fetch('/api/items');
      const data = await res.json();
      if (!res.ok) return;
      const mine = (Array.isArray(data) ? data : []).filter(
        (item) => String(item.seller) === String(userId)
      );
      setMyItems(mine);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadProfile();
    loadMyItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const persistUser = (updatedUser) => {
    localStorage.setItem('coltcircle_user', JSON.stringify(updatedUser));
    if (onUserUpdate) onUserUpdate(updatedUser);
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!userId) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          program: form.program,
          studentNumber: form.studentNumber,
          origin: form.origin,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not update profile');

      const updatedUser = {
        _id: data._id,
        name: data.name,
        email: data.email,
        studentNumber: data.studentNumber,
        program: data.program,
        origin: data.origin,
        profilePhoto: data.profilePhoto || profilePhoto,
      };

      persistUser(updatedUser);
      applyUserPayload(updatedUser);
      setEditing(false);
      setSuccess('Profile updated.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const savePhoto = async (photoDataUrl) => {
    if (!userId) return;

    setUploadingPhoto(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ profilePhoto: photoDataUrl }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not update photo');

      const updatedUser = {
        _id: data._id || userId,
        name: data.name || form.name,
        email: data.email || form.email,
        studentNumber: data.studentNumber || form.studentNumber,
        program: data.program || form.program,
        origin: data.origin || form.origin,
        profilePhoto: data.profilePhoto || photoDataUrl,
      };

      persistUser(updatedUser);
      setProfilePhoto(updatedUser.profilePhoto);
      setSuccess(
        photoDataUrl ? 'Profile photo updated.' : 'Profile photo removed.'
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePhotoPick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file (JPG, PNG, etc.).');
      return;
    }

    try {
      const dataUrl = await fileToResizedDataUrl(file);
      await savePhoto(dataUrl);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header-card">
        <ProfilePhoto src={profilePhoto} name={form.name} size={96} />
        <div className="profile-main-info">
          <h2>{form.name || 'Centennial Student'}</h2>
          <p className="profile-email">{form.email}</p>
          <span className="profile-badge">Active Student</span>
          <div className="profile-photo-actions">
            <button
              type="button"
              className="profile-btn"
              disabled={uploadingPhoto}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
            </button>
            {profilePhoto && (
              <button
                type="button"
                className="profile-btn"
                disabled={uploadingPhoto}
                onClick={() => savePhoto('')}
              >
                Remove
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handlePhotoPick}
          />
        </div>
      </div>

      {error && <p className="profile-alert profile-alert-error">{error}</p>}
      {success && <p className="profile-alert profile-alert-success">{success}</p>}

      <div className="profile-details-grid">
        <div className="details-card">
          <div className="details-card-header">
            <h3>Academic Information</h3>
            {!editing && (
              <button
                type="button"
                className="profile-btn"
                onClick={() => {
                  setSuccess('');
                  setError('');
                  setEditing(true);
                }}
              >
                Edit
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSave} className="profile-edit-form">
              <label className="profile-field">
                <span>Name</span>
                <input value={form.name} onChange={handleChange('name')} required />
              </label>
              <label className="profile-field">
                <span>Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  required
                />
              </label>
              <label className="profile-field">
                <span>Program</span>
                <input value={form.program} onChange={handleChange('program')} />
              </label>
              <label className="profile-field">
                <span>Student ID</span>
                <input
                  value={form.studentNumber}
                  onChange={handleChange('studentNumber')}
                />
              </label>
              <label className="profile-field">
                <span>Country / Origin</span>
                <input value={form.origin} onChange={handleChange('origin')} />
              </label>

              <div className="profile-edit-actions">
                <button type="submit" className="profile-btn profile-btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  className="profile-btn"
                  onClick={() => {
                    setEditing(false);
                    setSuccess('');
                    loadProfile();
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="info-row">
                <span className="info-label">Program:</span>
                <span className="info-value">{form.program || 'Not set'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Student ID:</span>
                <span className="info-value">{form.studentNumber || 'Not set'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Country/Origin:</span>
                <span className="info-value">{form.origin || 'Not set'}</span>
              </div>
            </>
          )}
        </div>

        <div className="details-card">
          <h3>My Marketplace Activity</h3>
          {myItems.length === 0 ? (
            <p className="empty-state-text">You haven&apos;t listed any items for sale yet.</p>
          ) : (
            <ul style={{ paddingLeft: '1.1rem', margin: '0 0 12px' }}>
              {myItems.map((item) => (
                <li key={item._id}>
                  {item.title} — ${item.price}
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            className="profile-btn"
            onClick={() => onNavigateMarketplace && onNavigateMarketplace()}
          >
            + Create a New Listing
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
