import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const UserView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/users/${id}`);
        setUser(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return <div className="loader">Loading user details...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className="card">
          <div className="error">{error}</div>
          <button onClick={() => navigate('/admin/users')} className="btn btn-secondary" style={{ marginTop: '16px' }}>
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="header">
        <div className="header-content">
          <h1>User Details</h1>
          <button onClick={() => navigate('/admin/users')} className="btn btn-secondary">
            Back to Users
          </button>
        </div>
      </div>

      <div className="container">
        <div className="card">
          {user.profile_image && (
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <img
                src={`http://localhost:5000${user.profile_image}`}
                alt={user.name}
                style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
              />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <strong>Name:</strong>
              <p>{user.name}</p>
            </div>
            <div>
              <strong>Email:</strong>
              <p>{user.email}</p>
            </div>
            <div>
              <strong>Phone:</strong>
              <p>{user.phone}</p>
            </div>
            <div>
              <strong>Role:</strong>
              <p>{user.role}</p>
            </div>
            <div>
              <strong>City:</strong>
              <p>{user.city}</p>
            </div>
            <div>
              <strong>State:</strong>
              <p>{user.state}</p>
            </div>
            <div>
              <strong>Country:</strong>
              <p>{user.country}</p>
            </div>
            <div>
              <strong>Pincode:</strong>
              <p>{user.pincode}</p>
            </div>
            {user.address && (
              <div style={{ gridColumn: '1 / -1' }}>
                <strong>Address:</strong>
                <p>{user.address}</p>
              </div>
            )}
          </div>

          <div className="flex flex-end" style={{ marginTop: '24px' }}>
            <button onClick={() => navigate(`/admin/users/${id}/edit`)} className="btn btn-primary">
              Edit User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserView;
