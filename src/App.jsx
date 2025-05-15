import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CategoryPage from './CategoryPage';
import CartPage from './CartPage';
import HomePage from './HomePage';
import ProductPage from './ProductPage';
import CheckoutPage from './CheckoutPage'; // Import the new checkout page
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './App.css';

const App = () => {
  const [cart, setCart] = useState([]);
  const [productQuantities, setProductQuantities] = useState({});

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const storedProductQuantities = JSON.parse(localStorage.getItem('productQuantities')) || {};
    setCart(storedCart);
    setProductQuantities(storedProductQuantities);
  }, []);

  const addToCart = (productId) => {
    setCart((prevCart) => {
      const newCart = [...prevCart, productId];
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });

    setProductQuantities((prevQuantities) => {
      const newQuantities = {
        ...prevQuantities,
        [productId]: (prevQuantities[productId] || 0) + 1,
      };
      localStorage.setItem('productQuantities', JSON.stringify(newQuantities));
      return newQuantities;
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item !== productId);
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });

    setProductQuantities((prevQuantities) => {
      const { [productId]: _, ...rest } = prevQuantities;
      localStorage.setItem('productQuantities', JSON.stringify(rest));
      return rest;
    });
  };

  const updateQuantity = (productId, amount) => {
    setProductQuantities((prevQuantities) => {
      const currentQuantity = prevQuantities[productId] || 0;
      const newQuantity = currentQuantity + amount;
      if (newQuantity <= 0) {
        const { [productId]: _, ...rest } = prevQuantities;
        localStorage.setItem('productQuantities', JSON.stringify(rest));
        return rest;
      }
      const newQuantities = { ...prevQuantities, [productId]: newQuantity };
      localStorage.setItem('productQuantities', JSON.stringify(newQuantities));
      return newQuantities;
    });
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage addToCart={addToCart} />} />
          <Route path="/category/:category" element={<CategoryPage addToCart={addToCart} />} />
          <Route path="/cart" element={
            <CartPage 
              cart={cart} 
              productQuantities={productQuantities} 
              removeFromCart={removeFromCart} 
              updateQuantity={updateQuantity} 
            />} 
          />
          <Route path="/product" element={<ProductPage />} />
          {/* Add checkout route */}
          <Route path="/checkout" element={
            <CheckoutPage 
              cart={cart} 
              productQuantities={productQuantities} 
            />}
          />
        </Routes>
      </div>

      <footer className="site-footer">
        <p>© 2025 Popnwrap. All rights reserved.</p>
      </footer>
    </Router>
  );
};

export default App;