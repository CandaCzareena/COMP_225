import { useState, useEffect } from 'react';
import './Marketplace.css';

function Marketplace({ user, onContactSeller }) {
  const [items, setItems] = useState([
    {
      id: 1,
      title: "COMP228 Java Programming Textbook",
      price: 45,
      category: "Books",
      description: "Perfect condition, no highlights. Essential for Software Engineering Tech course.",
      icon: "book-icon",
      seller: { name: "Czareena Canda", email: "czareenacanda@my.centennialcollege.ca" }
    },
    {
      id: 2,
      title: "Custom Crocheted Tote Bag",
      price: 25,
      category: "Crafts",
      description: "Handmade 100% cotton yarn tote bag. Support local student creators!",
      icon: "craft-icon",
      seller: { name: "Angela Dela Cruz", email: "angela@my.centennialcollege.ca" }
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    price: '',
    category: 'Books',
    description: ''
  });

  // Fetch live items from backend API
  useEffect(() => {
    fetch('http://localhost:3000/api/items')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
        }
      })
      .catch((err) => console.log('Using local marketplace data:', err));
  }, []);

  // Handle Form Submission
  const handleCreateListing = async (e) => {
    e.preventDefault();
    if (!newItem.title || !newItem.price) return;

    const itemToPost = {
      id: Date.now(),
      ...newItem,
      price: Number(newItem.price),
      icon: newItem.category === 'Books' ? 'book-icon' : newItem.category === 'Electronics' ? 'electronics-icon' : 'craft-icon',
      seller: {
        name: user?.name || user?.username || 'Centennial Student',
        email: user?.email || 'student@my.centennialcollege.ca'
      }
    };

    try {
      const response = await fetch('http://localhost:3000/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemToPost)
      });

      if (response.ok) {
        const savedItem = await response.json();
        setItems((prev) => [savedItem, ...prev]);
      } else {
        setItems((prev) => [itemToPost, ...prev]);
      }
    } catch {
      setItems((prev) => [itemToPost, ...prev]);
    }

    setNewItem({ title: '', price: '', category: 'Books', description: '' });
    setShowForm(false);
  };

  const handleContact = (item) => {
    const sellerInfo = item.seller || {
      name: item.sellerName || 'Student Seller',
      email: item.sellerEmail || '',
      _id: item.sellerId || item.id
    };
    if (onContactSeller) onContactSeller(sellerInfo);
  };

  return (
    <div className="marketplace-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>
            <svg className="header-icon"><use href="/icons.svg#marketplace-icon" /></svg>
            Centennial Student Marketplace
          </h2>
          <p>Buy, sell, or trade textbooks, course supplies, and handmade items.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ padding: '10px 18px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {showForm ? 'Cancel' : '+ Sell Item'}
        </button>
      </div>

      {/* Post New Item Inline Form */}
      {showForm && (
        <form onSubmit={handleCreateListing} style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #ddd' }}>
          <h3>List an Item for Sale</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Item Title (e.g. COMP228 Textbook)"
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              required
              style={{ flex: 2, padding: '8px' }}
            />
            <input
              type="number"
              placeholder="Price ($)"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              required
              style={{ flex: 1, padding: '8px' }}
            />
            <select
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
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
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            rows="3"
            style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
          />
          <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Post Listing
          </button>
        </form>
      )}

      {/* Grid of Available Marketplace Items */}
      <div className="market-grid">
        {items.map((item) => (
          <div key={item._id || item.id} className="market-card">
            <div className="market-item-image">
              <span className="icon-badge">
                <svg><use href={`/icons.svg#${item.icon || 'marketplace-icon'}`} /></svg>
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
                Seller: <strong>{item.seller?.name || 'Student'}</strong>
              </p>
              <button className="interest-btn" onClick={() => handleContact(item)}>
                Contact Seller
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Marketplace;