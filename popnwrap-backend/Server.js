require('dotenv').config(); // Load environment variables

const express = require('express'); // ✅ Move this to the top
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cartRoutes = require('./routes/cart'); // ✅ Import routes

const app = express(); // ✅ Initialize app BEFORE using it
const PORT = process.env.PORT || 5000;

// ✅ Connect to MongoDB
const DB_URL = process.env.MONGO_URI || 'mongodb://localhost:27017/cartdb';

mongoose.connect(DB_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// ✅ Use Modular Cart Routes
app.use('/api/cart', cartRoutes); // No need to use app.use('/cart', ...) earlier

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
