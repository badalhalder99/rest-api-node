import React, { useState, useEffect } from 'react';
import api from '../services/api';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newUser, setNewUser] = useState({ 
    id: '', 
    name: '', 
    email: '', 
    age: '', 
    profession: '', 
    summary: '' 
  });
  const [editingUser, setEditingUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/api/users');
      
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        setError('Failed to fetch users');
      }
    } catch (err) {
      setError('Error connecting to server: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) {
      setError('Name and email are required');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await api.post('/api/users', newUser);
      
      if (response.data.success) {
        setUsers([...users, response.data.data]);
        setNewUser({ id: '', name: '', email: '', age: '', profession: '', summary: '' });
      } else {
        setError('Failed to add user');
      }
    } catch (err) {
      setError('Error adding user: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (user) => {
    setEditingUser({ ...user });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setIsEditing(false);
  };

  const updateUser = async (e) => {
    e.preventDefault();
    if (!editingUser.name || !editingUser.email) {
      setError('Name and email are required');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await api.put(`/api/users/${editingUser._id}`, editingUser);
      
      if (response.data.success) {
        setUsers(users.map(user => user._id === editingUser._id ? response.data.data : user));
        setEditingUser(null);
        setIsEditing(false);
      } else {
        setError('Failed to update user');
      }
    } catch (err) {
      setError('Error updating user: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await api.delete(`/api/users/${userId}`);
      
      if (response.data.success) {
        setUsers(users.filter(user => user._id !== userId));
      } else {
        setError('Failed to delete user');
      }
    } catch (err) {
      setError('Error deleting user: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="user-manager">
      {/* Add/Edit User Form */}
      <section className="add-user-section">
        <h3>{isEditing ? 'Edit User' : 'Add New User'}</h3>
        <form onSubmit={isEditing ? updateUser : addUser} className="user-form">
          <div className='form-grid'>
            <div className='form-column'>
              <div className="form-group">
                <input
                  type="number"
                  placeholder="ID (optional)"
                  value={isEditing ? editingUser.id || '' : newUser.id}
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
                  placeholder="Name *"
                  value={isEditing ? editingUser.name : newUser.name}
                  onChange={(e) => isEditing 
                    ? setEditingUser({ ...editingUser, name: e.target.value })
                    : setNewUser({ ...newUser, name: e.target.value })
                  }
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  placeholder="Summary"
                  value={isEditing ? editingUser.summary || '' : newUser.summary}
                  onChange={(e) => isEditing 
                    ? setEditingUser({ ...editingUser, summary: e.target.value })
                    : setNewUser({ ...newUser, summary: e.target.value })
                  }
                  className="form-input"
                  rows="2"
                />
              </div>
            </div>

            <div className='form-column'>
              <div className="form-group">
                <input
                  type="number"
                  placeholder="Age"
                  value={isEditing ? editingUser.age || '' : newUser.age}
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
                  value={isEditing ? editingUser.profession || '' : newUser.profession}
                  onChange={(e) => isEditing 
                    ? setEditingUser({ ...editingUser, profession: e.target.value })
                    : setNewUser({ ...newUser, profession: e.target.value })
                  }
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email *"
                  value={isEditing ? editingUser.email : newUser.email}
                  onChange={(e) => isEditing 
                    ? setEditingUser({ ...editingUser, email: e.target.value })
                    : setNewUser({ ...newUser, email: e.target.value })
                  }
                  className="form-input"
                  required
                />
              </div>
            </div>
          </div>
          
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
      </section>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Users List */}
      <section className="users-section">
        <div className="section-header">
          <h3>Users List</h3>
          <button onClick={fetchUsers} disabled={loading} className="btn btn-secondary">
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
        
        {loading && users.length === 0 ? (
          <div className="loading">Loading users...</div>
        ) : (
          <div className="users-grid">
            {users.map((user) => (
              <div key={user._id} className="user-card">
                <div className="user-avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt="User Avatar" />
                  ) : (
                    <div className="avatar-placeholder">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="user-info">
                  <h4>{user.name}</h4>
                  <p className="user-email">{user.email}</p>
                  {user.age && <p><strong>Age:</strong> {user.age}</p>}
                  {user.profession && <p><strong>Profession:</strong> {user.profession}</p>}
                  {user.summary && <p className="user-summary">{user.summary}</p>}
                  {user.id && <span className="user-id">ID: {user.id}</span>}
                </div>
                
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
              <div className="no-users">No users found</div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default UserManager;