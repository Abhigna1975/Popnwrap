import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './CheckoutPage.css'; // Ensure this CSS file exists

// Enhanced header component with logo and improved styling
const Header = ({ cartCount = 0 }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-container">
          <h1 className="website-name">
            <span className="logo-text-pop">Pop</span>
            <span className="logo-text-n">n</span>
            <span className="logo-text-wrap">wrap</span>
            <span className="logo-tagline">Premium Balloon & Gift Bouquets</span>
          </h1>
        </div>
        <nav className="header-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/categories" className="nav-link">Categories</Link>
          <Link to="/about" className="nav-link">About Us</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </nav>
        <Link to="/cart" className="cart-icon">
          🛒 <span className="cart-count">({cartCount})</span>
        </Link>
      </div>
    </header>
  );
};

const HomePage = () => (
  <div className="page-content">
    <h1>Home Page</h1>
    <p>Welcome to Popnwrap!</p>
  </div>
);

const ProductsPage = () => (
  <div className="page-content">
    <h1>Products Page</h1>
    <p>Here are our amazing products.</p>
  </div>
);

const CheckoutPage = () => {
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    shippingOption: 'standard',
    saveInfo: false,
  });

  const [errors, setErrors] = React.useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zip.trim()) newErrors.zip = 'ZIP code is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form Data:', formData);
      alert('Order placed successfully! (See console for form data)');
    } else {
      console.log("Form has errors", errors);
    }
  };

  const cartItems = [
    { id: 1, name: 'Product 1', quantity: 2, price: 25.99 },
    { id: 2, name: 'Product 2', quantity: 1, price: 49.99 },
    { id: 3, name: 'Product 3', quantity: 3, price: 19.99 },
  ];

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingCost = formData.shippingOption === 'express' ? 15.0 : 7.99;
  const total = subtotal + shippingCost;

  const stateOptions = [
    { value: '', label: 'Select a state' },
    { value: 'CA', label: 'California' },
    { value: 'TX', label: 'Texas' },
    { value: 'NY', label: 'New York' },
    { value: 'FL', label: 'Florida' },
  ];

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Checkout</h1>
      </div>
      <div className="checkout-content">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Billing Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={errors.firstName ? 'input-error' : ''}
                />
                {errors.firstName && <p className="error-message">{errors.firstName}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={errors.lastName ? 'input-error' : ''}
                />
                {errors.lastName && <p className="error-message">{errors.lastName}</p>}
              </div>
            </div>
            {/* Email, Address, City, State, ZIP, Country fields follow... */}
            {/* Shipping Options */}
            <div className="form-section">
              <h2>Shipping Options</h2>
              <div className="form-group">
                <input
                  type="radio"
                  id="standard"
                  name="shippingOption"
                  value="standard"
                  checked={formData.shippingOption === 'standard'}
                  onChange={handleChange}
                />
                <label htmlFor="standard">Standard Shipping ($7.99)</label>
              </div>
              <div className="form-group">
                <input
                  type="radio"
                  id="express"
                  name="shippingOption"
                  value="express"
                  checked={formData.shippingOption === 'express'}
                  onChange={handleChange}
                />
                <label htmlFor="express">Express Shipping ($15.00)</label>
              </div>
            </div>
            <button type="submit">Place Order</button>
          </div>
        </form>

        <div className="order-summary">
          <h2>Order Summary</h2>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id}>
                {item.name} x{item.quantity} - ${item.price.toFixed(2)}
              </li>
            ))}
          </ul>
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <p>Shipping: ${shippingCost.toFixed(2)}</p>
          <h3>Total: ${total.toFixed(2)}</h3>
        </div>
      </div>
    </div>
  );
};

// Main App
export default function App() {
  // Calculate total cart items for the header
  const cartItems = [
    { id: 1, name: 'Product 1', quantity: 2, price: 25.99 },
    { id: 2, name: 'Product 2', quantity: 1, price: 49.99 },
    { id: 3, name: 'Product 3', quantity: 3, price: 19.99 },
  ];
  
  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <Router>
      <Header cartCount={totalCartItems} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        {/* Add Cart component if available */}
      </Routes>
    </Router>
  );
}