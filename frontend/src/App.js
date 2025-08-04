import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = 'http://localhost:3001/api';

function App() {
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
    <div className="App">
      <header className="App-header">
        <h1>Full-Stack User Management</h1>
      </header>

      <main className="App-main">
        {/* Add/Edit User Form */}
        <section className="add-user-section">
          <h2>{isEditing ? 'Edit User' : 'Add New User'}</h2>
          <form onSubmit={isEditing ? updateUser : addUser} className="user-form">
            <div className='itemWrap'>
              <div className='item'>
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
                    placeholder="Name"
                    value={isEditing ? editingUser.name : newUser.name}
                    onChange={(e) => isEditing 
                      ? setEditingUser({ ...editingUser, name: e.target.value })
                      : setNewUser({ ...newUser, name: e.target.value })
                    }
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <textarea
                    placeholder="Summary"
                    value={isEditing ? editingUser.summary : newUser.summary}
                    onChange={(e) => isEditing 
                      ? setEditingUser({ ...editingUser, summary: e.target.value })
                      : setNewUser({ ...newUser, summary: e.target.value })
                    }
                    className="form-input"
                    rows="1"
                  />
                </div>
              </div>

              <div className='item'>
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
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Email"
                    value={isEditing ? editingUser.email : newUser.email}
                    onChange={(e) => isEditing 
                      ? setEditingUser({ ...editingUser, email: e.target.value })
                      : setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="form-input"
                  />
                </div>
              </div>
            </div>
            
            <div className="form-buttons">
              <button type="submit" disabled={loading} className="btn btn-primary" style={{padding: "6px 21px"}}>
                {loading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update User' : 'Add User')}
              </button>
              {isEditing && (
                <button type="button" onClick={cancelEdit} className="btn btn-secondary " style={{marginLeft: '10px'}}>
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
            <h2>Users List</h2>
            <button onClick={fetchUsers} disabled={loading} className="btn btn-secondary" style={{padding: "6px 21px"}}>
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
          
          {loading && users.length === 0 ? (
            <div className="loading">Loading users...</div>
          ) : (
            <div className="users-grid">
              {users.map((user) => (
                <div key={user._id} className="user-card">
                  <h3>Name : {user.name}</h3>
                  <h5>Age : {user.age || 'Not specified'}</h5>
                  <h5>Profession : {user.profession || 'Not specified'}</h5>
                  <p style={{display: "flex", alignItems: "center"}}><h5>Email :</h5> {user.email}</p>
                  <p>{user.summary || 'No summary available'}</p>
                  <span className="user-id">ID: {user.id || 'Not specified'}</span>
                  
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
      </main>
    </div>
  );
}

export default App;
