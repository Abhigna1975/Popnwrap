const express = require('express');
const router = express.Router();
const CartItem = require('../models/CartItem');

// Test route to insert a sample item
router.get('/test-cart', async (req, res) => {
  try {
    const testItem = new CartItem({
      id: "test010",
      name: "Balloon Bouquet",
      price: 19.99,
      quantity: 1,
      image: "https://via.placeholder.com/100"
    });
    await testItem.save();
    res.send("✅ Test item saved to MongoDB!");
  } catch (err) {
    res.status(500).send("❌ Error saving test item: " + err.message);
  }
});

// GET all cart items
router.get('/', async (req, res) => {
  try {
    const items = await CartItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).send("❌ Error fetching cart items: " + err.message);
  }
});

// ADD or UPDATE a cart item
router.post('/', async (req, res) => {
  const { id, name, price, quantity, image } = req.body;
  
  if (!id || !name || price === undefined || quantity === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  
  try {
    let item = await CartItem.findOne({ id });

    if (item) {
      // If item exists, increment quantity
      item.quantity += quantity;
      await item.save();
    } else {
      // Create new item
      item = new CartItem({ id, name, price, quantity, image });
      await item.save();
    }

    const cart = await CartItem.find();
    res.json({ cart });
  } catch (err) {
    res.status(500).json({ error: "❌ Error saving item: " + err.message });
  }
});

// UPDATE quantity for a specific item
router.put('/:id', async (req, res) => {
  const { quantity } = req.body;
  
  if (quantity === undefined) {
    return res.status(400).json({ error: "Missing quantity field" });
  }
  
  try {
    const item = await CartItem.findOne({ id: req.params.id });
    
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    
    item.quantity = quantity;
    await item.save();
    
    const cart = await CartItem.find();
    res.json({ cart });
  } catch (err) {
    res.status(500).json({ error: "❌ Error updating item: " + err.message });
  }
});

// DELETE single item by ID
router.delete('/:id', async (req, res) => {
  try {
    await CartItem.deleteOne({ id: req.params.id });
    const cart = await CartItem.find();
    res.json({ cart });
  } catch (err) {
    res.status(500).json({ error: "❌ Error deleting item: " + err.message });
  }
});

// DELETE entire cart
router.delete('/', async (req, res) => {
  try {
    await CartItem.deleteMany({});
    const cart = await CartItem.find();
    res.json({ cart });
  } catch (err) {
    res.status(500).json({ error: "❌ Error deleting cart: " + err.message });
  }
});

module.exports = router;