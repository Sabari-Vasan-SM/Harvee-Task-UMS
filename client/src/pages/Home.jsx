import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('accessToken');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (token && user.role === 'admin') {
      navigate('/admin/users');
    } else if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <h1 style={{ fontSize: '42px', marginBottom: '16px', color: '#333' }}>
            User Management System
          </h1>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '48px' }}>
            Welcome! Please choose how you'd like to continue
          </p>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '32px',
            marginBottom: '32px'
          }}>
            {/* User Section */}
            <div style={{ 
              border: '2px solid #e0e0e0', 
              borderRadius: '12px', 
              padding: '32px',
              transition: 'all 0.3s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#667eea';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e0e0e0';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>👤</div>
              <h2 style={{ fontSize: '24px', marginBottom: '12px', color: '#333' }}>User</h2>
              <p style={{ color: '#666', marginBottom: '24px', fontSize: '14px' }}>
                Create an account or login to manage your profile
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button 
                  onClick={() => navigate('/register')}
                  className="btn btn-primary" 
                  style={{ width: '100%' }}
                >
                  Create Account
                </button>
                <button 
                  onClick={() => navigate('/user/login')}
                  className="btn btn-secondary" 
                  style={{ width: '100%' }}
                >
                  Login
                </button>
              </div>
            </div>

            {/* Admin Section */}
            <div style={{ 
              border: '2px solid #e0e0e0', 
              borderRadius: '12px', 
              padding: '32px',
              transition: 'all 0.3s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#764ba2';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e0e0e0';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔐</div>
              <h2 style={{ fontSize: '24px', marginBottom: '12px', color: '#333' }}>Admin</h2>
              <p style={{ color: '#666', marginBottom: '24px', fontSize: '14px' }}>
                Manage all users and system settings
              </p>
              <button 
                onClick={() => navigate('/admin/login')}
                className="btn btn-primary" 
                style={{ width: '100%', backgroundColor: '#764ba2' }}
              >
                Admin Login
              </button>
            </div>
          </div>

          <div style={{ 
            padding: '24px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px',
            marginTop: '24px'
          }}>
            <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#333' }}>
              🎯 Features
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '16px',
              fontSize: '14px',
              color: '#666'
            }}>
              <div>✓ Secure Authentication</div>
              <div>✓ Profile Management</div>
              <div>✓ Image Upload</div>
              <div>✓ Role-Based Access</div>
              <div>✓ Search & Filter</div>
              <div>✓ Real-time Updates</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
