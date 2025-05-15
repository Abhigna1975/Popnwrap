const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  id: {
    type: String, // or Number based on your frontend
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  image: {
    type: String // URL to the image
  }
});

module.exports = mongoose.model('CartItem', CartItemSchema);
