import { useState, useEffect } from 'react';
import logo from '../../assets/logo.png';
import { uploadMedia } from '../../utils/uploadMedia';
import './Home.css';

function authHeaders() {
  const token = localStorage.getItem('coltcircle_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

function Home({ user }) {
  const [posts, setPosts] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newPost, setNewPost] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [posting, setPosting] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/blogs');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not load posts');
      setPosts(data.reverse());
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim() || !newTitle.trim()) return;

    setPosting(true);
    try {
      let mediaUrl = '';
      let mediaType = '';
      if (mediaFile) {
        const uploaded = await uploadMedia(mediaFile);
        mediaUrl = uploaded.url;
        mediaType = uploaded.mediaType;
      }

      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          title: newTitle,
          username: user?.name || 'Student',
          content: newPost,
          mediaUrl,
          mediaType,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not create post');

      setNewTitle('');
      setNewPost('');
      setMediaFile(null);
      fetchPosts();
    } catch (err) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  };

  const startEdit = (post) => {
    setEditingId(post._id);
    setEditTitle(post.title || '');
    setEditContent(post.content || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditContent('');
  };

  const handleUpdate = async (e, postId) => {
    e.preventDefault();
    if (!editTitle.trim() || !editContent.trim()) return;

    try {
      const res = await fetch(`/api/blogs/${postId}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
          username: user?.name || 'Student',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not update post');
      cancelEdit();
      fetchPosts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (postId) => {
    try {
      const res = await fetch(`/api/blogs/${postId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not delete post');
      fetchPosts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="home-page">
      <div className="welcome-banner">
        <h1>
          Welcome back, {user?.name || 'Colt'}!
          <img className="header-icon" src={logo} alt="" />
        </h1>
        <p>
          Good to see you — share tips, wins, and short videos with students and
          educators in your circle.
        </p>
      </div>

      {error && <div className="auth-error">{error}</div>}

      <div className="create-post-card">
        <form onSubmit={handlePostSubmit}>
          <input
            type="text"
            placeholder="Post title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
            style={{ width: '100%', marginBottom: '8px', padding: '8px' }}
          />
          <textarea
            placeholder="Share an assignment tip, project update, or ask a question..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            required
          />
          <div className="form-actions" style={{ gap: '10px', flexWrap: 'wrap' }}>
            <label className="media-picker">
              Photo / video
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
              />
            </label>
            {mediaFile && <span className="media-name">{mediaFile.name}</span>}
            <button type="submit" className="post-submit-btn" disabled={posting}>
              {posting ? 'Posting...' : 'Share to Circle'}
            </button>
          </div>
        </form>
      </div>

      <div className="feed-container">
        {loading && <p>Loading posts...</p>}
        {!loading && posts.length === 0 && (
          <p>No posts yet - be the first to share something!</p>
        )}

        {posts.map((post) => (
          <div key={post._id} className="post-card">
            <div className="post-header">
              <div className="author-info">
                <h3>{post.username}</h3>
                <span className="author-program">{post.title}</span>
              </div>
              <span className="post-time">
                {new Date(post.posted || post.created || Date.now()).toLocaleString()}
              </span>
            </div>

            {editingId === post._id ? (
              <form onSubmit={(e) => handleUpdate(e, post._id)} className="post-body">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  style={{ width: '100%', marginBottom: '8px', padding: '8px' }}
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  required
                  rows={3}
                  style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                />
                <div className="post-footer" style={{ gap: '8px' }}>
                  <button type="submit" className="like-btn">
                    Save
                  </button>
                  <button type="button" className="like-btn" onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="post-body">
                  <p>{post.content}</p>
                  {post.mediaUrl && post.mediaType === 'image' && (
                    <img className="post-media" src={post.mediaUrl} alt="" />
                  )}
                  {post.mediaUrl && post.mediaType === 'video' && (
                    <video className="post-media" src={post.mediaUrl} controls />
                  )}
                </div>
                <div className="post-footer" style={{ gap: '8px' }}>
                  {user?.name === post.username && (
                    <>
                      <button className="like-btn" onClick={() => startEdit(post)}>
                        Edit
                      </button>
                      <button className="like-btn" onClick={() => handleDelete(post._id)}>
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
