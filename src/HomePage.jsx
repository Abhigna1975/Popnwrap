import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-page">

      {/* Header section */}
      <header className="homepage-header">
        <h1>Popnwrap</h1>
      </header>

      {/* Product categories */}
      <div className="category-box">
        <img src="/assets/categories/Balloon Bouquet With Flowers.jpeg" alt="Balloon Bouquet With Flowers" />
        <h3>Balloon Bouquet With Flowers</h3>
        <Link to="/category/Balloon Bouquet With Flowers" className="view-link">View Products</Link>
      </div>
      
      <div className="category-box">
        <img src="/assets/categories/Balloon Bouquet With Toy.jpeg" alt="Balloon Bouquet With Toy" />
        <h3>Balloon Bouquet With Toy</h3>
        <Link to="/category/Balloon Bouquet With Toy" className="view-link">View Products</Link>
      </div>
      
      <div className="category-box">
        <img src="/assets/categories/Balloon Bouquet With 1Zee.jpeg" alt="Balloon Bouquet With 1Zee" />
        <h3>Balloon Bouquet With 1Zee</h3>
        <Link to="/category/Balloon Bouquet With 1Zee" className="view-link">View Products</Link>
      </div>
      
      <div className="category-box">
        <img src="/assets/categories/Bouquet Of Flowers.jpeg" alt="Bouquet Of Flowers" />
        <h3>Bouquet of Flowers</h3>
        <Link to="/category/Bouquet Of Flowers" className="view-link">View Products</Link>
      </div>
    </div>
  );
}

export default HomePage;
