import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductPage.css'; // Create this CSS file for styling

const ProductPage = () => {
  const navigate = useNavigate();
  const [addingProduct, setAddingProduct] = useState(null);
  const [error, setError] = useState(null);
  
  // Simulating product data (replace with actual data)
  const productsData = [
    { id: 1, name: 'Balloon 1', description: 'Beautiful balloon with flowers', price: 10 },
    { id: 2, name: 'Balloon 2', description: 'Stylish balloon bouquet with a toy', price: 12 },
    { id: 3, name: 'Balloon 3', description: 'Elegant balloon bouquet with 1Zee', price: 15 },
    { id: 4, name: 'Balloon 4', description: 'Gorgeous bouquet of flowers', price: 8 },
  ];

  // Add product to cart
  const addToCart = async (product) => {
    try {
      setAddingProduct(product.id);
      setError(null);
      
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }
      
      const data = await response.json();
      console.log('Product added to cart:', data);
      
      // Show success message or notification
      alert(`${product.name} added to cart!`);
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add product to cart');
    } finally {
      setAddingProduct(null);
    }
  };

  return (
    <div className="product-page">
      <div className="product-header">
        <h1>PopNWrap Products</h1>
        <button onClick={() => navigate('/cart')} className="view-cart-btn">
          View Cart
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="products-grid">
        {productsData.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              {/* Replace with actual product images */}
              <div className="placeholder-image">
                Image of {product.name}
              </div>
            </div>
            <div className="product-details">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className="product-price">${product.price}</p>
              <button 
                onClick={() => addToCart(product)}
                className="add-to-cart-btn"
                disabled={addingProduct === product.id}
              >
                {addingProduct === product.id ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;