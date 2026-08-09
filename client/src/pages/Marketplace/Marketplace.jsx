import { useState, useEffect } from 'react';
import './Marketplace.css';

function authHeaders() {
  const token = localStorage.getItem('coltcircle_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

const emptyForm = {
  title: '',
  price: '',
  category: 'Books',
  description: '',
};

function Marketplace({ user, onContactSeller }) {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/items');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not load items');
      setItems(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price) return;

    const payload = {
      title: form.title,
      price: Number(form.price),
      category: form.category,
      description: form.description,
      sellerName: user?.name || 'Centennial Student',
      sellerEmail: user?.email || '',
    };

    try {
      const url = editingId ? `/api/items/${editingId}` : '/api/items';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save item');

      resetForm();
      fetchItems();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setForm({
      title: item.title || '',
      price: String(item.price ?? ''),
      category: item.category || 'Other',
      description: item.description || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      const res = await fetch(`/api/items/${itemId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not delete item');
      fetchItems();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleContact = (item) => {
    const sellerInfo = {
      _id: item.seller,
      name: item.sellerName || item.seller?.name || 'Student Seller',
      email: item.sellerEmail || item.seller?.email || '',
    };
    if (onContactSeller) onContactSeller(sellerInfo);
  };

  const isOwner = (item) => {
    const sellerId = item.seller?._id || item.seller;
    return sellerId && String(sellerId) === String(user?._id);
  };

  return (
    <div className="marketplace-page">
      <div
        className="page-header"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div>
          <h2>
            <svg className="header-icon">
              <use href="/icons.svg#marketplace-icon" />
            </svg>
            Centennial Student Marketplace
          </h2>
          <p>Buy, sell, or trade textbooks, course supplies, and handmade items.</p>
        </div>
        <button
          onClick={() => {
            if (showForm) resetForm();
            else setShowForm(true);
          }}
          style={{
            padding: '10px 18px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          {showForm ? 'Cancel' : '+ Sell Item'}
        </button>
      </div>

      {error && <p style={{ color: '#c0392b' }}>{error}</p>}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            background: '#f8f9fa',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            border: '1px solid #ddd',
          }}
        >
          <h3>{editingId ? 'Edit Listing' : 'List an Item for Sale'}</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Item Title (e.g. COMP228 Textbook)"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              style={{ flex: 2, padding: '8px' }}
            />
            <input
              type="number"
              placeholder="Price ($)"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
              style={{ flex: 1, padding: '8px' }}
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              style={{ flex: 1, padding: '8px' }}
            >
              <option value="Books">Books</option>
              <option value="Electronics">Electronics</option>
              <option value="Crafts">Crafts</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <textarea
            placeholder="Item Description..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows="3"
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '10px',
              boxSizing: 'border-box',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {editingId ? 'Save Changes' : 'Post Listing'}
          </button>
        </form>
      )}

      <div className="market-grid">
        {loading && <p>Loading marketplace...</p>}
        {!loading && items.length === 0 && <p>No listings yet. Be the first to sell something!</p>}

        {items.map((item) => (
          <div key={item._id} className="market-card">
            <div className="market-item-image">
              <span className="icon-badge">
                <svg>
                  <use href={`/icons.svg#${item.icon || 'marketplace-icon'}`} />
                </svg>
              </span>
            </div>
            <div className="market-card-content">
              <div className="market-card-header">
                <span className="item-category">{item.category}</span>
                <span className="item-price">${item.price}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '5px' }}>
                Seller: <strong>{item.sellerName || 'Student'}</strong>
              </p>

              <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                {!isOwner(item) && (
                  <button className="interest-btn" onClick={() => handleContact(item)}>
                    Contact Seller
                  </button>
                )}
                {isOwner(item) && (
                  <>
                    <button className="interest-btn" onClick={() => startEdit(item)}>
                      Edit
                    </button>
                    <button
                      className="interest-btn"
                      style={{ background: '#c0392b', borderColor: '#c0392b' }}
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Marketplace;
