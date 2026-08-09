import { useState } from 'react';
import logo from '../../assets/logo.png';
import './Auth.css';

function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentNumber: '',
    program: '',
    origin: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Calls POST /auth/signin, stores the token + user in localStorage,
  // and tells App.jsx that login succeeded.
  const doSignin = async (email, password) => {
    const res = await fetch('/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      // res.ok is false for any 4xx/5xx status
      throw new Error(data.error || 'Login failed');
    }

    // Save the session so a page refresh doesn't log the user out
    localStorage.setItem('coltcircle_token', data.token);
    localStorage.setItem('coltcircle_user', JSON.stringify(data.user));

    onLoginSuccess(data.user);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const isCentennialEmail = formData.email.endsWith('@my.centennialcollege.ca');
    const isValidStudentNumber = /^\d{9}$/.test(formData.studentNumber || '');

    if (!isLogin) {
      // ---------- Registration flow ----------
      if (!isCentennialEmail) {
        setError('Access Denied. Only Centennial student emails (@my.centennialcollege.ca) are allowed.');
        return;
      }
      if (!isValidStudentNumber) {
        setError('A valid 9-digit Student Number is mandatory.');
        return;
      }

      setLoading(true);
      try {
        // Step 1: create the user in the database.
        // Note: the backend expects "password", not "hashed_password" -
        // the User model has a virtual "password" field that hashes it automatically.
        const signupRes = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            studentNumber: formData.studentNumber,
            program: formData.program,
            origin: formData.origin,
          }),
        });
        const signupData = await signupRes.json();

        if (!signupRes.ok) {
          throw new Error(signupData.error || 'Signup failed');
        }

        // Step 2: log the new user in right away so they land on the dashboard
        await doSignin(formData.email, formData.password);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      // ---------- Login flow ----------
      if (!isCentennialEmail) {
        setError('Please use your valid Centennial student email to login.');
        return;
      }

      setLoading(true);
      try {
        await doSignin(formData.email, formData.password);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="brand-mark">
            <img src={logo} alt="ColtCircle logo" />
          </span>
          <h2>ColtCircle</h2>
        </div>
        <p className="auth-subtitle">
          {isLogin ? 'Connect with your Centennial peers' : 'Create your private student account'}
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Student Number (9 Digits)</label>
                <input type="text" name="studentNumber" value={formData.studentNumber} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Program</label>
                <input type="text" name="program" placeholder="e.g., Software Engineering" value={formData.program} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Country of Origin (Optional)</label>
                <input type="text" name="origin" value={formData.origin} onChange={handleChange} />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Centennial Student Email</label>
            <input type="email" name="email" placeholder="username@my.centennialcollege.ca" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={6} />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <p className="auth-toggle-text">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => { setIsLogin(!isLogin); setError(''); }}>
            {isLogin ? 'Register here' : 'Login here'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Auth;
