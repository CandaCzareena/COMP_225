import { useEffect, useState } from 'react';
import './Admin.css';

function authHeaders() {
  const token = localStorage.getItem('coltcircle_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

const emptyUser = {
  name: '',
  email: '',
  password: '',
  role: 'student',
  studentNumber: '',
  program: '',
  origin: '',
};

const emptyItem = {
  title: '',
  price: '',
  category: 'Other',
  description: '',
  sellerId: '',
};

function Admin() {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [userForm, setUserForm] = useState(emptyUser);
  const [editingUserId, setEditingUserId] = useState(null);
  const [itemForm, setItemForm] = useState(emptyItem);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [uRes, iRes] = await Promise.all([
        fetch('/api/admin/users', { headers: authHeaders() }),
        fetch('/api/admin/items', { headers: authHeaders() }),
      ]);
      const uData = await uRes.json();
      const iData = await iRes.json();
      if (!uRes.ok) throw new Error(uData.error || 'Could not load users');
      if (!iRes.ok) throw new Error(iData.error || 'Could not load items');
      setUsers(Array.isArray(uData) ? uData : []);
      setItems(Array.isArray(iData) ? iData : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetUserForm = () => {
    setUserForm(emptyUser);
    setEditingUserId(null);
  };

  const startEditUser = (u) => {
    setEditingUserId(u._id);
    setUserForm({
      name: u.name || '',
      email: u.email || '',
      password: '',
      role: u.role || 'student',
      studentNumber: u.studentNumber || '',
      program: u.program || '',
      origin: u.origin || '',
    });
    setTab('users');
  };

  const saveUser = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...userForm };
      if (!payload.password) delete payload.password;

      const url = editingUserId
        ? `/api/admin/users/${editingUserId}`
        : '/api/admin/users';
      const method = editingUserId ? 'PUT' : 'POST';
      if (!editingUserId && !userForm.password) {
        throw new Error('Password is required for new users');
      }

      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save user');
      resetUserForm();
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      const token = localStorage.getItem('coltcircle_token');
      if (!token) throw new Error('Not signed in. Please log out and log in again.');

      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }
      if (!res.ok) throw new Error(data.error || `Could not delete user (${res.status})`);
      await load();
    } catch (err) {
      setError(err.message || 'Failed to delete user');
    }
  };

  const saveItem = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/admin/items', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          title: itemForm.title,
          price: Number(itemForm.price),
          category: itemForm.category,
          description: itemForm.description,
          sellerId: itemForm.sellerId || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not create item');
      setItemForm(emptyItem);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this marketplace item?')) return;
    try {
      const res = await fetch(`/api/admin/items/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not delete item');
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h2>Admin Console</h2>
          <p>Manage users, credentials, profiles, and marketplace listings.</p>
        </div>
        <div className="admin-tabs">
          <button
            className={tab === 'users' ? 'active' : ''}
            onClick={() => setTab('users')}
          >
            Users
          </button>
          <button
            className={tab === 'items' ? 'active' : ''}
            onClick={() => setTab('items')}
          >
            Marketplace
          </button>
        </div>
      </header>

      {error && <p className="admin-error">{error}</p>}
      {loading && <p>Loading admin data...</p>}

      {tab === 'users' && (
        <section className="admin-section">
          <form className="admin-form" onSubmit={saveUser}>
            <h3>{editingUserId ? 'Edit user' : 'Add user'}</h3>
            <div className="admin-form-grid">
              <input
                placeholder="Full name"
                value={userForm.name}
                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder={editingUserId ? 'New password (optional)' : 'Password'}
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                required={!editingUserId}
              />
              <select
                value={userForm.role}
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
              >
                <option value="student">Student</option>
                <option value="educator">Educator</option>
                <option value="admin">Admin</option>
              </select>
              <input
                placeholder="Student number"
                value={userForm.studentNumber}
                onChange={(e) =>
                  setUserForm({ ...userForm, studentNumber: e.target.value })
                }
              />
              <input
                placeholder="Program / department"
                value={userForm.program}
                onChange={(e) => setUserForm({ ...userForm, program: e.target.value })}
              />
              <input
                placeholder="Origin"
                value={userForm.origin}
                onChange={(e) => setUserForm({ ...userForm, origin: e.target.value })}
              />
            </div>
            <div className="admin-form-actions">
              <button type="submit">{editingUserId ? 'Save user' : 'Create user'}</button>
              {editingUserId && (
                <button type="button" className="ghost" onClick={resetUserForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Role</th>
                  <th>Program</th>
                  <th>Student #</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td className="mono">{u.password}</td>
                    <td>
                      <span className={`role-pill role-${u.role}`}>{u.role}</span>
                    </td>
                    <td>{u.program || '—'}</td>
                    <td>{u.studentNumber || '—'}</td>
                    <td className="row-actions">
                      <button type="button" onClick={() => startEditUser(u)}>
                        Edit
                      </button>
                      <button type="button" className="danger" onClick={() => deleteUser(u._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tab === 'items' && (
        <section className="admin-section">
          <form className="admin-form" onSubmit={saveItem}>
            <h3>Add marketplace item for a user</h3>
            <div className="admin-form-grid">
              <input
                placeholder="Title"
                value={itemForm.title}
                onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={itemForm.price}
                onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                required
              />
              <select
                value={itemForm.category}
                onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
              >
                <option value="Books">Books</option>
                <option value="Electronics">Electronics</option>
                <option value="Crafts">Crafts</option>
                <option value="Other">Other</option>
              </select>
              <select
                value={itemForm.sellerId}
                onChange={(e) => setItemForm({ ...itemForm, sellerId: e.target.value })}
                required
              >
                <option value="">Assign seller...</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
              <input
                placeholder="Description"
                value={itemForm.description}
                onChange={(e) =>
                  setItemForm({ ...itemForm, description: e.target.value })
                }
              />
            </div>
            <div className="admin-form-actions">
              <button type="submit">Create listing</button>
            </div>
          </form>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Seller</th>
                  <th>Category</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td>{item.title}</td>
                    <td>${item.price}</td>
                    <td>
                      {item.sellerName}
                      <div className="muted">{item.sellerEmail}</div>
                    </td>
                    <td>{item.category}</td>
                    <td className="row-actions">
                      <button
                        type="button"
                        className="danger"
                        onClick={() => deleteItem(item._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

export default Admin;
