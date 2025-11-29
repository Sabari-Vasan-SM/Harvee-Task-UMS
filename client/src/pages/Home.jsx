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
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '100px',
        height: '100px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        top: '70%',
        right: '15%',
        width: '60px',
        height: '60px',
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '50%',
        animation: 'float 4s ease-in-out infinite reverse'
      }} />
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .user-card, .admin-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        .user-card::before, .admin-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transition: left 0.6s;
        }
        .user-card:hover::before, .admin-card:hover::before {
          left: 100%;
        }
        .user-card:hover, .admin-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        .feature-item {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .feature-item:nth-child(1) { animation-delay: 0.1s; }
        .feature-item:nth-child(2) { animation-delay: 0.2s; }
        .feature-item:nth-child(3) { animation-delay: 0.3s; }
        .feature-item:nth-child(4) { animation-delay: 0.4s; }
        .feature-item:nth-child(5) { animation-delay: 0.5s; }
        .feature-item:nth-child(6) { animation-delay: 0.6s; }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <div className="container" style={{ maxWidth: '900px' }}>
          <div className="card" style={{ textAlign: 'center', padding: '48px', position: 'relative', zIndex: 1 }}>
            <div style={{ 
              opacity: 0,
              animation: 'slideUp 0.8s ease-out 0.2s forwards'
            }}>
              <h1 style={{ 
                fontSize: '48px', 
                marginBottom: '16px', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: '800'
              }}>
                User Management System
              </h1>
              <p style={{ fontSize: '18px', color: '#666', marginBottom: '48px', opacity: '0.8' }}>
                Welcome! Please choose how you'd like to continue
              </p>
            </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '32px',
            marginBottom: '32px'
          }}>
            {/* User Section */}
            <div className="user-card" style={{ 
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '20px', 
              padding: '32px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              cursor: 'pointer',
              opacity: 0,
              animation: 'slideUp 0.6s ease-out 0.4s forwards'
            }}>
              <div style={{ 
                fontSize: '64px', 
                marginBottom: '20px',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
              }}>👤</div>
              <h2 style={{ fontSize: '28px', marginBottom: '16px', color: '#2d3748', fontWeight: '700' }}>User</h2>
              <p style={{ color: '#4a5568', marginBottom: '28px', fontSize: '15px', lineHeight: '1.6' }}>
                Create an account or login to manage your profile and settings
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <button 
                  onClick={() => navigate('/register')}
                  className="btn btn-primary" 
                  style={{ width: '100%', fontSize: '16px' }}
                >
                  Create Account
                </button>
                <button 
                  onClick={() => navigate('/user/login')}
                  className="btn btn-secondary" 
                  style={{ width: '100%', fontSize: '16px' }}
                >
                  Login
                </button>
              </div>
            </div>

            {/* Admin Section */}
            <div className="admin-card" style={{ 
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '20px', 
              padding: '32px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              cursor: 'pointer',
              opacity: 0,
              animation: 'slideUp 0.6s ease-out 0.6s forwards'
            }}>
              <div style={{ 
                fontSize: '64px', 
                marginBottom: '20px',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
              }}>🔐</div>
              <h2 style={{ fontSize: '28px', marginBottom: '16px', color: '#2d3748', fontWeight: '700' }}>Admin</h2>
              <p style={{ color: '#4a5568', marginBottom: '28px', fontSize: '15px', lineHeight: '1.6' }}>
                Manage all users, monitor activity and configure system settings
              </p>
              <button 
                onClick={() => navigate('/admin/login')}
                className="btn btn-primary" 
                style={{ 
                  width: '100%', 
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  fontSize: '16px'
                }}
              >
                Admin Login
              </button>
            </div>
          </div>

          <div style={{ 
            padding: '32px', 
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            marginTop: '32px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            opacity: 0,
            animation: 'slideUp 0.6s ease-out 0.8s forwards'
          }}>
            <h3 style={{ 
              fontSize: '20px', 
              marginBottom: '20px', 
              color: '#2d3748',
              fontWeight: '700',
              textAlign: 'center'
            }}>
              ✨ Features
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '20px',
              fontSize: '14px',
              color: '#4a5568'
            }}>
              <div className="feature-item" style={{ textAlign: 'center', padding: '16px' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔒</div>
                <div style={{ fontWeight: '600' }}>Secure Authentication</div>
              </div>
              <div className="feature-item" style={{ textAlign: 'center', padding: '16px' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>👤</div>
                <div style={{ fontWeight: '600' }}>Profile Management</div>
              </div>
              <div className="feature-item" style={{ textAlign: 'center', padding: '16px' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>📸</div>
                <div style={{ fontWeight: '600' }}>Image Upload</div>
              </div>
              <div className="feature-item" style={{ textAlign: 'center', padding: '16px' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎯</div>
                <div style={{ fontWeight: '600' }}>Role-Based Access</div>
              </div>
              <div className="feature-item" style={{ textAlign: 'center', padding: '16px' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔍</div>
                <div style={{ fontWeight: '600' }}>Search & Filter</div>
              </div>
              <div className="feature-item" style={{ textAlign: 'center', padding: '16px' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚡</div>
                <div style={{ fontWeight: '600' }}>Real-time Updates</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ 
            padding: '24px', 
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            marginTop: '24px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
            opacity: 0,
            animation: 'slideUp 0.6s ease-out 1s forwards'
          }}>
            <p style={{ 
              fontSize: '14px', 
              color: '#4a5568', 
              marginBottom: '16px',
              fontWeight: '500'
            }}>
              Designed and Developed by <span style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: '700'
              }}>Sabarivasan</span>
            </p>
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <a 
                href="https://github.com/Sabari-Vasan-SM/Harvee-Task-UMS"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#2d3748',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <span>🐙</span> GitHub
              </a>
              <a 
                href="https://portfolio.vasan.tech/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#2d3748',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <span>💼</span> Portfolio
              </a>
              <a 
                href="https://www.linkedin.com/in/sabarivasan-s-m-b10229255/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#2d3748',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <span>💼</span> LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
