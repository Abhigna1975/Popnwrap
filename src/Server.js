// server.js (Backend)
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory cart data
let cart = [];

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to PopNWrap Backend!');
});

app.post('/api/cart', (req, res) => {
  const product = req.body;
  console.log('🛒 Product added:', product); // <--- Add this
  cart.push(product);
  res.status(201).json({ message: 'Product added to cart', cart });
});


// POST: Add product to cart
app.post('/api/cart', (req, res) => {
  const { id, name, quantity, price } = req.body;

  if (!id || !name || !quantity || !price) {
    return res.status(400).json({ message: 'Please provide id, name, quantity, and price.' });
  }

  // Check if item already exists in cart
  const existingItemIndex = cart.findIndex(item => item.id === id);
  
  if (existingItemIndex !== -1) {
    // Update existing item
    cart[existingItemIndex] = { id, name, quantity, price };
  } else {
    // Add new item
    cart.push({ id, name, quantity, price });
  }

  res.status(201).json({ message: 'Item added to cart!', cart });
});

// GET: Get all cart items
app.get('/api/cart', (req, res) => {
  res.json(cart);
});

// DELETE: Remove specific item from cart
app.delete('/api/cart/:id', (req, res) => {
  const itemId = parseInt(req.params.id) || req.params.id;
  
  // Filter out the item with the specified id
  cart = cart.filter(item => item.id !== itemId);
  
  res.json({ message: 'Item removed from cart', cart });
});

// DELETE: Clear cart
app.delete('/api/cart', (req, res) => {
  cart = [];
  res.json({ success: true, cart });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});