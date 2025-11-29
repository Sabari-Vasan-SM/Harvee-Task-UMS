import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div>
      <div className="header">
        <div className="header-content">
          <h1>User Dashboard</h1>
          <div className="flex">
            <button onClick={() => navigate('/profile')} className="btn btn-primary">
              My Profile
            </button>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="card">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            {user.profile_image && (
              <img
                src={`http://localhost:5000${user.profile_image}`}
                alt={user.name}
                style={{ 
                  width: '120px', 
                  height: '120px', 
                  borderRadius: '50%', 
                  objectFit: 'cover',
                  marginBottom: '24px',
                  border: '4px solid #007bff'
                }}
              />
            )}
            <h2 style={{ fontSize: '32px', marginBottom: '8px' }}>
              Welcome, {user.name}! 👋
            </h2>
            <p style={{ color: '#666', fontSize: '16px', marginBottom: '32px' }}>
              {user.email}
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '20px',
            marginTop: '32px'
          }}>
            <div style={{ 
              padding: '24px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📧</div>
              <h3 style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Email</h3>
              <p style={{ fontSize: '16px', fontWeight: '500' }}>{user.email}</p>
            </div>

            <div style={{ 
              padding: '24px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📱</div>
              <h3 style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Phone</h3>
              <p style={{ fontSize: '16px', fontWeight: '500' }}>{user.phone}</p>
            </div>

            <div style={{ 
              padding: '24px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📍</div>
              <h3 style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Location</h3>
              <p style={{ fontSize: '16px', fontWeight: '500' }}>
                {user.city}, {user.state}
              </p>
            </div>

            <div style={{ 
              padding: '24px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>👤</div>
              <h3 style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Role</h3>
              <p style={{ fontSize: '16px', fontWeight: '500', textTransform: 'capitalize' }}>
                {user.role}
              </p>
            </div>
          </div>

          <div style={{ 
            marginTop: '32px', 
            padding: '24px', 
            backgroundColor: '#e7f3ff', 
            borderRadius: '8px',
            borderLeft: '4px solid #007bff'
          }}>
            <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>📌 Quick Actions</h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => navigate('/profile')}
                className="btn btn-primary"
              >
                Edit Profile
              </button>
              <button 
                onClick={() => navigate('/')}
                className="btn btn-secondary"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
