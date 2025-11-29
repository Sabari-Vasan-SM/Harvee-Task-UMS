import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const UsersList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    search: '',
    state: '',
    city: '',
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page,
        limit: 10,
        ...filters,
      };
      const response = await api.get('/users', { params });
      setUsers(response.data.results);
      setTotalPages(response.data.totalPages);
      setTotal(response.data.total);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await api.delete(`/users/${userId}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading && users.length === 0) {
    return <div className="loader">Loading users...</div>;
  }

  return (
    <div>
      <div className="header">
        <div className="header-content">
          <h1>User Management System</h1>
          <div className="flex">
            <span>Welcome, {user.name}</span>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="card">
          <h2>Users List ({total} total)</h2>
          
          <form onSubmit={handleSearch} style={{ marginTop: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <input
                  type="text"
                  name="search"
                  placeholder="Search by name, email, or phone"
                  value={filters.search}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <input
                  type="text"
                  name="state"
                  placeholder="Filter by state"
                  value={filters.state}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <input
                  type="text"
                  name="city"
                  placeholder="Filter by city"
                  value={filters.city}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
              Search
            </button>
          </form>

          {error && <div className="error" style={{ marginTop: '10px' }}>{error}</div>}

          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>City</th>
                <th>State</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                  <td>{u.city}</td>
                  <td>{u.state}</td>
                  <td>{u.role}</td>
                  <td>
                    <div className="flex">
                      <button
                        onClick={() => navigate(`/admin/users/${u._id}`)}
                        className="btn btn-primary"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        View
                      </button>
                      <button
                        onClick={() => navigate(`/admin/users/${u._id}/edit`)}
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="btn btn-danger"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              No users found
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="btn btn-secondary"
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="btn btn-secondary"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersList;
