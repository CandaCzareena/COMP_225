import { useState } from 'react';
import logo from '../../assets/logo.png';
import './Home.css';

function Home({ user }) {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Alex Mercer",
      program: "Artificial Intelligence",
      content: "Just finished debugging my neural network assignment! Anyone down to grab coffee at the Progress campus cafeteria later?",
      likes: 12,
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      author: "Sarah Jenkins",
      program: "Software Engineering Technology",
      content: "Extremely helpful tip for COMP228: Make sure your Java FX environment variables are correctly mapped in your IDE before running your project labs! Saved me hours.",
      likes: 24,
      timestamp: "5 hours ago"
    }
  ]);

  const [newPost, setNewPost] = useState('');

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const freshPost = {
      id: Date.now(),
      author: user?.name || "Centennial Student",
      program: user?.program || "Software Engineering",
      content: newPost,
      likes: 0,
      timestamp: "Just now"
    };

    setPosts([freshPost, ...posts]);
    setNewPost('');
  };

  return (
    <div className="home-page">
      <div className="welcome-banner">
        <h1>
          Welcome back, {user?.name || "Colt"}!
          <img className="header-icon" src={logo} alt="" />
        </h1>
        <p>Catch up with what's happening across Centennial College campuses today.</p>
      </div>

      {/* Create Post Card */}
      <div className="create-post-card">
        <form onSubmit={handlePostSubmit}>
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
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div className="author-info">
                <h3>{post.author}</h3>
                <span className="author-program">{post.program}</span>
              </div>
              <span className="post-time">{post.timestamp}</span>
            </div>
            <div className="post-body">
              <p>{post.content}</p>
            </div>
            <div className="post-footer">
              <button className="like-btn">
                <svg width="16" height="16"><use href="/icons.svg#like-icon" /></svg>
                {post.likes} Likes
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;