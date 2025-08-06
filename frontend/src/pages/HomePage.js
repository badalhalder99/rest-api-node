import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = 'http://localhost:3002/api';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  // CRUD operations state - Your original functionality
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newUser, setNewUser] = useState({ id: '', name: '', email: '', age: '', profession: '', summary: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      const data = await response.json();

      if (data.success) {
        setUsers(data.data);
      } else {
        setError('Failed to fetch users');
      }
    } catch (err) {
      setError('Error connecting to server: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add new user
  const addUser = async (e) => {
    e.preventDefault();
    if (!newUser.id || !newUser.name || !newUser.email || !newUser.age || !newUser.profession || !newUser.summary) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();

      if (data.success) {
        setUsers([...users, data.data]);
        setNewUser({ id: '', name: '', email: '', age: '', profession: '', summary: '' });
        setError('');
      } else {
        setError('Failed to add user');
      }
    } catch (err) {
      setError('Error adding user: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Start editing user
  const startEdit = (user) => {
    setEditingUser({ ...user });
    setIsEditing(true);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingUser(null);
    setIsEditing(false);
  };

  // Update user
  const updateUser = async (e) => {
    e.preventDefault();
    if (!editingUser.id || !editingUser.name || !editingUser.email || !editingUser.age || !editingUser.profession || !editingUser.summary) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/users/${editingUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingUser),
      });

      const data = await response.json();

      if (data.success) {
        setUsers(users.map(user => user._id === editingUser._id ? data.data : user));
        setEditingUser(null);
        setIsEditing(false);
        setError('');
      } else {
        setError('Failed to update user');
      }
    } catch (err) {
      setError('Error updating user: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setUsers(users.filter(user => user._id !== userId));
        setError('');
      } else {
        setError('Failed to delete user');
      }
    } catch (err) {
      setError('Error deleting user: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Welcome to VitalApp</h1>
            <p>Your comprehensive user management solution with secure authentication, Google OAuth integration, and powerful CRUD operations.</p>
            {!isAuthenticated ? (
              <div className="hero-buttons">
                <Link to="/signup" className="btn btn-primary btn-large">Get Started</Link>
                <Link to="/signin" className="btn btn-secondary btn-large">Sign In</Link>
              </div>
            ) : (
              <div className="hero-buttons">
                <Link to="/dashboard" className="btn btn-primary btn-large">Go to Dashboard</Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CRUD Operations Section - Main Feature */}
      <section className="crud-section">
        <div className="container">
          <div className="crud-header">
            <h2>User Management System</h2>
            <p>Complete CRUD operations for managing users - The main feature of VitalApp</p>
          </div>

          {/* Add/Edit User Form */}
          <div className="add-user-section">
            <h2>{isEditing ? 'Edit User' : 'Add New User'}</h2>
            <form onSubmit={isEditing ? updateUser : addUser} className="user-form">
              <div className="itemWrap">
                <div className="form-group">
                  <input
                    type="number"
                    placeholder="Write your ID within 2 digit!"
                    value={isEditing ? editingUser.id : newUser.id}
                    onChange={(e) => isEditing
                      ? setEditingUser({ ...editingUser, id: e.target.value })
                      : setNewUser({ ...newUser, id: e.target.value })
                    }
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={isEditing ? editingUser.name : newUser.name}
                    onChange={(e) => isEditing
                      ? setEditingUser({ ...editingUser, name: e.target.value })
                      : setNewUser({ ...newUser, name: e.target.value })
                    }
                    className="form-input"
                  />
                </div>
              </div>

              <div className="itemWrap">
                <div className="form-group">
                  <input
                    type="number"
                    placeholder="Age"
                    value={isEditing ? editingUser.age : newUser.age}
                    onChange={(e) => isEditing
                      ? setEditingUser({ ...editingUser, age: e.target.value })
                      : setNewUser({ ...newUser, age: e.target.value })
                    }
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Profession"
                    value={isEditing ? editingUser.profession : newUser.profession}
                    onChange={(e) => isEditing
                      ? setEditingUser({ ...editingUser, profession: e.target.value })
                      : setNewUser({ ...newUser, profession: e.target.value })
                    }
                    className="form-input"
                  />
                </div>
              </div>

              <input
                type="email"
                placeholder="Email Address"
                value={isEditing ? editingUser.email : newUser.email}
                onChange={(e) => isEditing
                  ? setEditingUser({ ...editingUser, email: e.target.value })
                  : setNewUser({ ...newUser, email: e.target.value })
                }
                className="form-input"
              />

              <textarea
                placeholder="Brief summary about the user"
                value={isEditing ? editingUser.summary : newUser.summary}
                onChange={(e) => isEditing
                  ? setEditingUser({ ...editingUser, summary: e.target.value })
                  : setNewUser({ ...newUser, summary: e.target.value })
                }
                className="form-input"
                rows="3"
              />

              <div className="form-buttons">
                <button type="submit" disabled={loading} className="btn btn-primary">
                  {loading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update User' : 'Add User')}
                </button>
                {isEditing && (
                  <button type="button" onClick={cancelEdit} className="btn btn-secondary">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Error Display */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Users List */}
          <div className="users-section">
            <div className="section-header">
              <h2>All Users ({users.length})</h2>
              <button onClick={fetchUsers} disabled={loading} className="btn btn-secondary">
                {loading ? 'Loading...' : '🔄 Refresh'}
              </button>
            </div>

            {loading && users.length === 0 ? (
              <div className="loading">
                Loading users...
              </div>
            ) : (
              <div className="users-grid">
                {users.map((user) => (
                  <div key={user._id} className="user-card">
                    <div className="user-id">#{user.id || 'N/A'}</div>
                    <h3>{user.name}</h3>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Age:</strong> {user.age || 'Not specified'}</p>
                    <p><strong>Profession:</strong> {user.profession || 'Not specified'}</p>
                    {user.summary && (
                      <p><strong>Summary:</strong> {user.summary}</p>
                    )}
                    <div className="user-actions">
                      <button
                        onClick={() => startEdit(user)}
                        className="btn btn-edit"
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="btn btn-delete"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {users.length === 0 && !loading && (
                  <div className="no-users">
                    <h3>No users found</h3>
                    <p>Start by adding your first user above.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>


      {/* Call to Action Section - Only show if not authenticated */}
      {!isAuthenticated && (
        <section className="cta">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to Get Started?</h2>
              <p>Join thousands of users who trust VitalApp for their user management needs.</p>
              <Link to="/signup" className="btn btn-primary btn-large">Create Your Account</Link>
            </div>
          </div>
        </section>
      )}
      
    </div>
  );
};

export default HomePage;