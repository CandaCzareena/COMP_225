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
    role: 'student',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const doSignin = async (email, password) => {
    const res = await fetch('/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    localStorage.setItem('coltcircle_token', data.token);
    localStorage.setItem('coltcircle_user', JSON.stringify(data.user));
    onLoginSuccess(data.user);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!isLogin) {
      if (!formData.name.trim()) {
        setError('Full name is required.');
        return;
      }
      if (formData.role === 'student' && formData.studentNumber && !/^\d{5,12}$/.test(formData.studentNumber)) {
        setError('Student number should be 5–12 digits if provided.');
        return;
      }

      setLoading(true);
      try {
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
            role: formData.role,
          }),
        });
        const signupData = await signupRes.json();

        if (!signupRes.ok) {
          throw new Error(
            signupData.error || signupData.message || `Signup failed (${signupRes.status})`
          );
        }

        await doSignin(formData.email, formData.password);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } else {
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
      <div className="auth-shell">
        <section className="auth-hero">
          <span className="auth-kicker">Campus social + marketplace</span>
          <h1>ColtCircle</h1>
          <p>
            Built for students and educators everywhere — post tips, trade gear,
            message tutors, and stay connected.
          </p>
        </section>

        <div className="auth-card">
          <div className="auth-brand">
            <span className="brand-mark">
              <img src={logo} alt="ColtCircle logo" />
            </span>
            <h2>{isLogin ? 'Welcome back' : 'Join the circle'}</h2>
          </div>
          <p className="auth-subtitle">
            {isLogin
              ? 'Sign in with any school or personal email'
              : 'Open to all students and educators — not just Centennial'}
          </p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="form-group">
                  <label>I am a</label>
                  <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="student">Student</option>
                    <option value="educator">Educator / Tutor</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                {formData.role === 'student' && (
                  <div className="form-group">
                    <label>Student Number (optional)</label>
                    <input
                      type="text"
                      name="studentNumber"
                      value={formData.studentNumber}
                      onChange={handleChange}
                      placeholder="e.g. 301234567"
                    />
                  </div>
                )}
                <div className="form-group">
                  <label>{formData.role === 'educator' ? 'Department / Subject' : 'Program'}</label>
                  <input
                    type="text"
                    name="program"
                    placeholder={
                      formData.role === 'educator'
                        ? 'e.g. Software Engineering'
                        : 'e.g. Software Engineering Technology'
                    }
                    value={formData.program}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Country of Origin (Optional)</label>
                  <input type="text" name="origin" value={formData.origin} onChange={handleChange} />
                </div>
              </>
            )}

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@school.edu"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>

          <p className="auth-toggle-text">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <span
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
            >
              {isLogin ? 'Register here' : 'Login here'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;
