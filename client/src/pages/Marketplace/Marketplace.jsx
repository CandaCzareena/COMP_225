import { useState } from 'react';
import './Marketplace.css';

function Marketplace() {
  const [items] = useState([
    {
      id: 1,
      title: "COMP228 Java Programming Textbook",
      price: 45,
      category: "Books",
      description: "Perfect condition, no highlights. Essential for Software Engineering Tech course.",
      icon: "book-icon"
    },
    {
      id: 2,
      title: "Custom Crocheted Tote Bag",
      price: 25,
      category: "Crafts",
      description: "Handmade 100% cotton yarn tote bag. Support local student creators!",
      icon: "craft-icon"
    },
    {
      id: 3,
      title: "TI-84 Plus Graphing Calculator",
      price: 60,
      category: "Electronics",
      description: "Barely used, comes with batteries and slide case. Perfect for math/engineering labs.",
      icon: "electronics-icon"
    }
  ]);

  return (
    <div className="marketplace-page">
      <div className="page-header">
        <h2>
          <svg className="header-icon"><use href="/icons.svg#marketplace-icon" /></svg>
          Centennial Student Marketplace
        </h2>
        <p>Buy, sell, or trade textbooks, course supplies, and handmade items within our student community.</p>
      </div>

      <div className="market-grid">
        {items.map(item => (
          <div key={item.id} className="market-card">
            <div className="market-item-image">
              <span className="icon-badge">
                <svg><use href={`/icons.svg#${item.icon}`} /></svg>
              </span>
            </div>
            <div className="market-card-content">
              <div className="market-card-header">
                <span className="item-category">{item.category}</span>
                <span className="item-price">${item.price}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <button className="interest-btn">Contact Seller</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Marketplace;