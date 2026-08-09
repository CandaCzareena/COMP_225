import { useState, useEffect } from 'react';
import logo from '../../assets/logo.png';
import './Home.css';

function Home({ user }) {
  const [posts, setPosts] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pulls the real list of posts from the backend.
  // We call this both on page load AND after creating/deleting a post,
  // since the create endpoint doesn't send back the new post - just a message.
  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/blogs');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not load posts');
      // Show newest posts first
      setPosts(data.reverse());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // useEffect with an empty [] dependency array runs ONCE,
  // right when the component first mounts (loads on screen).
  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim() || !newTitle.trim()) return;

    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          username: user?.name || 'Centennial Student',
          content: newPost,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not create post');

      setNewTitle('');
      setNewPost('');
      fetchPosts(); // refresh the list so the new post shows up
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (postId) => {
    try {
      const res = await fetch(`/api/blogs/${postId}`, { method: 'DELETE' });
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
        <p>Catch up with what's happening across Centennial College campuses today.</p>
      </div>

      {error && <div className="auth-error">{error}</div>}

      {/* Create Post Card */}
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
          <div className="form-actions">
            <button type="submit" className="post-submit-btn">Share to Circle</button>
          </div>
        </form>
      </div>

      {/* Feed Area */}
      <div className="feed-container">
        {loading && <p>Loading posts...</p>}
        {!loading && posts.length === 0 && <p>No posts yet - be the first to share something!</p>}

        {posts.map((post) => (
          <div key={post._id} className="post-card">
            <div className="post-header">
              <div className="author-info">
                <h3>{post.username}</h3>
                <span className="author-program">{post.title}</span>
              </div>
              <span className="post-time">
                {new Date(post.posted || post.created).toLocaleString()}
              </span>
            </div>
            <div className="post-body">
              <p>{post.content}</p>
            </div>
            <div className="post-footer">
              {/* Only the post's own author can delete it */}
              {user?.name === post.username && (
                <button className="like-btn" onClick={() => handleDelete(post._id)}>
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
