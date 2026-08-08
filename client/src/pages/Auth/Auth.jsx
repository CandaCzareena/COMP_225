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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const isCentennialEmail = formData.email.endsWith('@my.centennialcollege.ca');
    const isValidStudentNumber = /^\d{9}$/.test(formData.studentNumber || ''); // Validates exactly 9 digits

    // Registration Flow
    if (!isLogin) {
      if (!isCentennialEmail) {
        setError('Access Denied. Only Centennial student emails (@my.centennialcollege.ca) are allowed.');
        return;
      }

      if (!isValidStudentNumber) {
        setError('A valid 9-digit Student Number is mandatory.');
        return;
      }

      // Successful Registration -> Lift state up to App.jsx to unlock the dashboard
      onLoginSuccess({
        name: formData.name,
        email: formData.email,
        studentNumber: formData.studentNumber,
        program: formData.program,
        origin: formData.origin
      });
    } else {
      // Login Flow
      if (!isCentennialEmail) {
        setError('Please use your valid Centennial student email to login.');
        return;
      }

      // Successful Login Simulation -> Lift state up parsing name from email prefix
      const simulatedName = formData.email.split('@')[0];
      onLoginSuccess({
        name: simulatedName.charAt(0).toUpperCase() + simulatedName.slice(1),
        email: formData.email,
        studentNumber: '999999999',
        program: 'Software Engineering Technician'
      });
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
                <label>Country of Origin / Ethnicity (Optional)</label>
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
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          <button type="submit" className="auth-btn">
            {isLogin ? 'Login' : 'Sign Up'}
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