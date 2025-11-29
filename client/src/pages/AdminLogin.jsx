import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', formData);
      const { user, accessToken, refreshToken } = response.data;

      // Check if user is admin
      if (user.role !== 'admin') {
        setError('Admin access required');
        setLoading(false);
        return;
      }

      // Store tokens and user info
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect to users list
      navigate('/admin/users');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
    }}>
      <div className="container" style={{ maxWidth: '450px' }}>
        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔐</div>
            <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Admin Login</h1>
            <p style={{ color: '#666' }}>Manage system users</p>
          </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email or Phone</label>
            <input
              type="text"
              name="identifier"
              value={formData.identifier}
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
            />
          </div>
          {error && (
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#fee', 
              borderRadius: '4px',
              marginBottom: '16px'
            }}>
              <div className="error">{error}</div>
            </div>
          )}
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '14px', backgroundColor: '#764ba2' }} 
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login as Admin'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link to="/" style={{ color: '#6c757d', textDecoration: 'none', fontSize: '14px' }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AdminLogin;
