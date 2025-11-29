import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState([]);
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
    role: 'user',
  });
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/users/${id}`);
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
          role: user.role || 'user',
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors([]);
  };

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setErrors([]);

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

      await api.put(`/users/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate(`/admin/users/${id}`);
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setError(err.response?.data?.message || 'Failed to update user');
      }
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loader">Loading user data...</div>;
  }

  return (
    <div>
      <div className="header">
        <div className="header-content">
          <h1>Edit User</h1>
          <button onClick={() => navigate(`/admin/users/${id}`)} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </div>

      <div className="container">
        <div className="card">
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
                />
              </div>

              <div className="form-group">
                <label>Role *</label>
                <select name="role" value={formData.role} onChange={handleChange} required>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="form-group">
                <label>Profile Image (JPG/PNG, max 2MB)</label>
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
              <button type="button" onClick={() => navigate(`/admin/users/${id}`)} className="btn btn-secondary">
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

export default UserEdit;
