import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './CategoryPage.css';

// Header component (remains the same)
const Header = ({ cartCount }) => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="website-name">Popnwrap</h1>
        <nav className="header-nav">
          <Link to="/" className="nav-link"></Link>
        </nav>
        <Link to="/cart" className="cart-icon">
          🛒 ({cartCount})
        </Link>
      </div>
    </header>
  );
};

// Example Product Component
const ProductPage = ({ product, addToCart }) => {
  return (
    <div className="product">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={() => addToCart(product)}>Add to Cart</button>
    </div>
  );
};


const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState({});
  const [cart, setCart] = useState([]);
  const [productQuantities, setProductQuantities] = useState({});
  const videoRefs = useRef({});
  const [isPlaying, setIsPlaying] = useState({});

  const categoryMap = {
    "Balloon Bouquet With Flowers": "Balloon Bouquet With Flowers",
    "Balloon Bouquet With Toy": "Balloon Bouquet With Toy",
    "Balloon Bouquet With 1Zee": "Balloon Bouquet With 1Zee",
    "Bouquet Of Flowers": "Bouquet Of Flowers"
  };

  const checkFileExists = (path) => {
    return new Promise((resolve) => {
      if (path.endsWith('.mp4')) {
        fetch(path)
          .then(response => resolve(response.ok))
          .catch(() => resolve(false));
      } else {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = path;
      }
    });
  };

  // Load cart items from API
  const fetchCartItems = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cart');
      if (!response.ok) throw new Error('Failed to fetch cart');
      const cartItems = await response.json();
     
      // Create a map of product quantities from cart items
      const quantityMap = {};
      cartItems.forEach(item => {
        quantityMap[item.id] = item.quantity;
      });
     
      setProductQuantities(quantityMap);
      setCart(cartItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  // Calculate price based on category
  const calculatePriceForCategory = (normalizedCategory, productIndex) => {
    let basePrice = 29.99; // Updated default base price

    // Different base prices for different categories
    if (normalizedCategory === "Balloon Bouquet With Flowers") {
      basePrice = 34.99;
    } else if (normalizedCategory === "Balloon Bouquet With Flowers 1") {
      basePrice = 39.99;
    } else if (normalizedCategory === "Balloon Bouquet With Flowers 2") {
      basePrice = 39.99;
    } else if (normalizedCategory === "Balloon Bouquet With Flowers 3") {
      basePrice = 39.99;  
    } else if (normalizedCategory === "Balloon Bouquet With Flowers 4") {
      basePrice = 39.99;
    } else if (normalizedCategory === "Balloon Bouquet With Toy") {
      basePrice = 39.99;
    } else if (normalizedCategory === "Balloon Bouquet With 1Zee") {
      basePrice = 44.99;
    } else if (normalizedCategory === "Bouquet Of Flowers") {
      basePrice = 49.99;
    }
   
    // Reduced the price variation to make prices look cleaner
    const price = basePrice + (productIndex * 0.25); // Reduced variation
    return parseFloat(price.toFixed(2));
  };

  useEffect(() => {
    // Load cart from API instead of local storage
    fetchCartItems();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);

      const normalizedCategory = categoryMap[category];
      if (!normalizedCategory) {
        console.error(`Category not found: ${category}`);
        navigate('/');
        return;
      }

      setCurrentCategory(normalizedCategory);

      try {
        const categoryPath = normalizedCategory.replace(/ /g, '%20');
        const basePath = `/assets/${categoryPath}`;
        const productList = [];
        const maxProducts = 10;

        for (let i = 1; i <= maxProducts; i++) {
          const productItems = [];
          let hasImage = false; // Flag to track if at least one image was found

          // First, load all images (up to 5)
          for (let j = 1; j <= 5; j++) {
            const extensions = ['jpeg', 'jpg', 'png'];
            let imageFound = false;

            for (const ext of extensions) {
              const imagePath = `${basePath}/prd-${i}/i-${j}.${ext}`;
              const exists = await checkFileExists(imagePath);

              if (exists) {
                productItems.push({
                  id: `prd-${i}-img-${j}`,
                  type: 'image',
                  src: imagePath
                });
                imageFound = true;
                hasImage = true; // Set the flag if an image is found
                break;
              }
            }
            if (!imageFound) break;
          }

          // Only check for video if we have at least one image
          if (hasImage) {
            const videoPath = `${basePath}/prd-${i}/v-1.mp4`;
            const videoExists = await checkFileExists(videoPath);
            if (videoExists) {
              productItems.push({
                id: `prd-${i}-vid-1`,
                type: 'video',
                src: videoPath
              });
            }

            // Use the dedicated function to calculate price
            const price = calculatePriceForCategory(normalizedCategory, i);
           
            // Add this product to our list if it has at least one item (which we now ensure is an image)
            productList.push({
              id: `${normalizedCategory}-${i}`, // Create unique ID with category prefix
              name: `${normalizedCategory} ${i}`, // Create a name for the product
              price: price, // Price with variation, limited to 2 decimal places
              items: productItems
            });
          }
        }

        setProducts(productList);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [category, navigate]);

  const handleNextImage = (productId) => {
    setActiveImageIndex(prevState => {
      const newIndex = (prevState[productId] || 0) + 1;
      const product = products.find(p => p.id === productId);
      const maxIndex = product.items.length - 1;

      return {
        ...prevState,
        [productId]: newIndex > maxIndex ? maxIndex : newIndex
      };
    });
  };

  const handlePrevImage = (productId) => {
    setActiveImageIndex(prevState => {
      const newIndex = (prevState[productId] || 0) - 1;

      return {
        ...prevState,
        [productId]: newIndex < 0 ? 0 : newIndex
      };
    });
  };

  const addToCart = async (productId) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product) return;
     
      // Get the first image to use as product image
      const firstImage = product.items.find(item => item.type === 'image');
      const imageUrl = firstImage ? firstImage.src : '';
     
      // Create product object to send to API
      const productData = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: imageUrl
      };
     
      // Send to API
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
     
      if (!response.ok) throw new Error('Failed to add to cart');
     
      // Refresh cart after adding item
      await fetchCartItems();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (productId) => {
    if (!productQuantities[productId] || productQuantities[productId] <= 0) {
      return; // Don't remove if quantity is already 0
    }

    try {
      // Delete one item from the cart
      const response = await fetch(`http://localhost:5000/api/cart/${productId}`, {
        method: 'DELETE',
      });
     
      if (!response.ok) throw new Error('Failed to remove from cart');
     
      // Refresh cart after removing item
      await fetchCartItems();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const isFirstItem = (productId) => {
    return (activeImageIndex[productId] || 0) === 0;
  };

  const isLastItem = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? (activeImageIndex[productId] || 0) === product.items.length - 1 : true;
  };

  const togglePlay = (productId) => {
    const videoElement = videoRefs.current[productId];
    if (videoElement) {
      const currentlyPlaying = isPlaying[productId] || false;
      if (currentlyPlaying) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
      setIsPlaying(prev => ({ ...prev, [productId]: !currentlyPlaying }));
    }
  };

  return (
    <div className="category-page">
      <Header cartCount={cart.reduce((total, item) => total + item.quantity, 0)} />
      <div className="category-header">
        <Link to="/" className="back-button">← Back to Categories</Link>
        <h2 className="carousel-title">{currentCategory} Collection</h2>
      </div>

      {isLoading ? (
        <div className="loading">
          <p>Loading products for {category}...</p>
          <div className="spinner"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="no-products">
          <p>No products found for this category.</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => {
            const currentItemIndex = activeImageIndex[product.id] || 0;
            const currentItem = product.items[currentItemIndex];
            const isFirstImage = isFirstItem(product.id);
            const isLastImage = isLastItem(product.id);
            const quantity = productQuantities[product.id] || 0;
            const isVideo = currentItem && currentItem.type === 'video';
            const playing = isPlaying[product.id] || false;

            return (
              <div key={`product-${product.id}`} className="product-card">
                <div className="slider-container">
                  <div className="product-image-container">
                    {currentItem && currentItem.type === 'image' ? (
                      <img
                        src={currentItem.src}
                        alt={`Product ${product.id}`}
                        className="product-image"
                      />
                    ) : currentItem && currentItem.type === 'video' ? (
                      <>
                        <video
                          src={currentItem.src}
                          className="product-video"
                          ref={(el) => (videoRefs.current[product.id] = el)} // Add the ref
                        />
                        <button className="video-control-button" onClick={() => togglePlay(product.id)}>
                          {playing ? '⏸' : '▶'}
                        </button>
                      </>
                    ) : null}

                    {product.items.length > 1 && (
                      <>
                        <button
                          className={`nav-arrow nav-arrow-left ${isFirstImage ? 'disabled' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isFirstImage) handlePrevImage(product.id);
                          }}
                          disabled={isFirstImage}
                          aria-label="Previous image"
                        >
                          ❮
                        </button>
                        <button
                          className={`nav-arrow nav-arrow-right ${isLastImage ? 'disabled' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isLastImage) handleNextImage(product.id);
                          }}
                          disabled={isLastImage}
                          aria-label="Next image"
                        >
                          ❯
                        </button>
                      </>
                    )}

                    {product.items.length > 1 && (
                      <div className="image-indicators">
                        {product.items.map((item, index) => (
                          <span
                            key={index}
                            className={`indicator ${index === currentItemIndex ? 'active' : ''} ${item.type === 'video' ? 'video-indicator' : ''}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p>${product.price.toFixed(2)}</p>
                </div>

                {/* Enhanced cart controls */}
                <div className="cart-controls">
                  <button
                    className="cart-button minus-button"
                    onClick={() => removeFromCart(product.id)}
                    disabled={quantity <= 0}
                  >
                    -
                  </button>
                  <span className="quantity-display">{quantity}</span>
                  <button
                    className="cart-button plus-button"
                    onClick={() => addToCart(product.id)}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;