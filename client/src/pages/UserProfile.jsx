import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const UserProfile = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    state: '',
    city: '',
    country: '',
    pincode: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [currentImage, setCurrentImage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/users/${currentUser._id}`);
        const user = response.data;
        setFormData({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          password: '',
          address: user.address || '',
          state: user.state || '',
          city: user.city || '',
          country: user.country || '',
          pincode: user.pincode || '',
        });
        setCurrentImage(user.profile_image || '');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser._id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors([]);
    setSuccess('');
  };

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setErrors([]);
    setSuccess('');

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== '' || key === 'address') {
          data.append(key, formData[key]);
        }
      });

      if (profileImage) {
        data.append('profile_image', profileImage);
      }

      const response = await api.put(`/users/${currentUser._id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update local storage with new user data
      const updatedUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setCurrentImage(updatedUser.profile_image || '');
      
      setSuccess('Profile updated successfully!');
      setSaving(false);
      
      // Clear password field
      setFormData({ ...formData, password: '' });
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setError(err.response?.data?.message || 'Failed to update profile');
      }
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return <div className="loader">Loading profile...</div>;
  }

  return (
    <div>
      <div className="header">
        <div className="header-content">
          <h1>My Profile</h1>
          <div className="flex">
            <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
              Back to Dashboard
            </button>
            <button onClick={handleLogout} className="btn btn-danger">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="card">
          {success && (
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#d4edda', 
              color: '#155724',
              borderRadius: '4px',
              marginBottom: '24px',
              border: '1px solid #c3e6cb'
            }}>
              ✓ {success}
            </div>
          )}

          {currentImage ? (
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <img
                src={
                  currentImage.startsWith('http')
                    ? currentImage
                    : `${(import.meta.env.VITE_API_BASE_URL?.replace(/\/api$/, '') || 'http://localhost:5000')}${currentImage}`
                }
                alt="Current profile"
                style={{ 
                  width: '120px', 
                  height: '120px', 
                  borderRadius: '50%', 
                  objectFit: 'cover',
                  border: '4px solid #007bff'
                }}
              />
            </div>
          ) : null}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password (leave blank to keep current)</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                />
              </div>

              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Country *</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter your address"
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Change Profile Image (JPG/PNG, max 2MB)</label>
                <input type="file" accept="image/jpeg,image/png" onChange={handleFileChange} />
              </div>
            </div>

            {error && <div className="error" style={{ marginTop: '16px' }}>{error}</div>}
            {errors.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                {errors.map((err, idx) => (
                  <div key={idx} className="error">
                    {err.field}: {err.msg}
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-end" style={{ marginTop: '24px' }}>
              <button 
                type="button" 
                onClick={() => navigate('/dashboard')} 
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
