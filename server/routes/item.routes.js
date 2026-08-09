import express from 'express';

const router = express.Router();

// Temporary in-memory items store (or connect to a Mongoose model)
let items = [
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
];

// GET /api/items - Fetch all marketplace items
router.get('/api/items', (req, res) => {
  res.json(items);
});

// POST /api/items - Create a new marketplace listing
router.post('/api/items', (req, res) => {
  const newItem = {
    id: Date.now(),
    ...req.body
  };
  items.unshift(newItem);
  res.status(201).json(newItem);
});

export default router;