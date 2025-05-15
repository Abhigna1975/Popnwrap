import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, Link } from 'react-router-dom';
import './CartPage.css';

// Cart Item Schema using PropTypes
const CartItemSchema = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  quantity: PropTypes.number.isRequired,
  image: PropTypes.string,
});

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch the current cart when the page loads
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/cart');
      if (!response.ok) throw new Error('Failed to fetch cart');
      const data = await response.json();
      setCart(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to load your cart. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle quantity change
  const handleQuantityChange = async (item, action) => {
    const newQuantity = action === 'add' ? item.quantity + 1 : Math.max(1, item.quantity - 1);
    
    if (action === 'remove' && item.quantity === 1) {
      // If removing and quantity is 1, just remove the item
      return removeFromCart(item.id);
    }
    
    try {
      // Update quantity using existing backend endpoints
      if (action === 'remove') {
        // First delete the item
        await fetch(`http://localhost:5000/api/cart/${item.id}`, { method: 'DELETE' });
      }
      
      // Then add it back with updated quantity
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: action === 'add' ? 1 : newQuantity,
          image: item.image
        }),
      });

      if (!response.ok) throw new Error('Failed to update cart');
      
      // Refresh cart
      fetchCart();
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError('Failed to update quantity. Please try again.');
    }
  };

  // Handle removing item from the cart
  const removeFromCart = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${itemId}`, { method: 'DELETE' });

      if (!response.ok) throw new Error('Failed to remove item from cart');
      
      // Refresh cart
      fetchCart();
    } catch (err) {
      console.error('Error removing item:', err);
      setError('Failed to remove item. Please try again.');
    }
  };

  // Calculate the total price of the cart
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  // Handle checkout
  const handleCheckout = () => {
    if (cart.length > 0) {
      navigate('/checkout');
    } else {
      alert('Your cart is empty!');
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cart', { method: 'DELETE' });

      if (!response.ok) throw new Error('Failed to clear cart');
      
      // Refresh cart
      fetchCart();
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError('Failed to clear cart. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="cart-page loading-container">
        <div className="loading">Loading your cart...</div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h2>Shopping Cart</h2>
        <button onClick={() => navigate('/')} className="back-button">← Back to Products</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty. Start shopping now!</p>
          <Link to="/" className="continue-shopping-btn">Browse Products</Link>
        </div>
      ) : (
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-info">
                {item.image && <img src={item.image} alt={item.name} className="cart-item-image" style={{width: '400px', height: '500px', objectFit: 'cover'}} />}
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p className="cart-item-price">${item.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="cart-item-actions">
                <div className="cart-item-quantity">
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item, 'remove')}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item, 'add')}
                  >
                    +
                  </button>
                </div>
                <button className="remove-button" onClick={() => removeFromCart(item.id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}

          <button className="clear-cart-btn" onClick={clearCart}>
            Clear Cart
          </button>
        </div>
      )}

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="cart-footer">
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${calculateTotal()}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${calculateTotal()}</span>
            </div>
          </div>
          <button onClick={handleCheckout} className="checkout-btn">
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

CartPage.propTypes = {
  cart: PropTypes.arrayOf(CartItemSchema),
};

export default CartPage;
export { CartItemSchema }; // Exporting the schema for use in other components