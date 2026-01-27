import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api/axios";
import "./Tea.css";
import { useDispatch, useSelector } from "react-redux";
import { enableNearby, disableNearby } from "../store/nearbySlice";
import NearbyLocationModal from "../components/NearbyLocationModal";
import { useLocation } from "react-router-dom";


const API = "http://localhost:5000/api/buy";

export default function Tea() {
  const location = useLocation();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [cart, setCart] = useState([]);
  const [maxPrice, setMaxPrice] = useState(200);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const nearby = useSelector(state => state.nearby);
  const [showLocationModal, setShowLocationModal] = useState(false);


  useEffect(() => {
    const savedCart = localStorage.getItem('farmCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('farmCart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('farmCart');
    }
  }, [cart]);
  useEffect(() => {
    const savedLocation = localStorage.getItem("nearbyLocation");
    if (savedLocation) {
      dispatch(enableNearby(JSON.parse(savedLocation)));
    }
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await api.get(`${API}/category/tea`, {
          params: {
            priceMax: maxPrice,
            nearby: nearby.enabled,
            city: nearby.location?.city || ""
          }
        });

        
        setListings(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch listings:", err);
        setError("Failed to load products");
        setListings([
          { _id: "1", cropName: "Assam Orthodox Tea", price: 160, images: ["https://images.unsplash.com/photo-1613769049987-48878e4ddaf1?w=300"], city: "Jorhat", state: "Assam", unit: "100g" },
          { _id: "2", cropName: "Green Tea Leaves", price: 180, images: ["https://images.unsplash.com/photo-1576091160399-1d65cdaa8782?w=300"], city: "Dibrugarh", state: "Assam", unit: "100g" },
          { _id: "3", cropName: "Premium CTC Tea", price: 140, images: ["https://images.unsplash.com/photo-1613769049987-48878e4ddaf1?w=300"], city: "Tinsukia", state: "Assam", unit: "100g" },
          { _id: "4", cropName: "Organic White Tea", price: 220, images: ["https://images.unsplash.com/photo-1576091160399-1d65cdaa8782?w=300"], city: "Sibsagar", state: "Assam", unit: "50g" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [maxPrice,nearby]);

  const filteredProducts = listings;



 const addToCart = (item) => {
  setCart(prevCart => {
    const existingItem = prevCart.find(cartItem => cartItem._id === item._id);
    
    if (existingItem) {
      return prevCart.map(cartItem =>
        cartItem._id === item._id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    } else {
      return [...prevCart, { ...item, quantity: 1 }];
    }
  });
};

const buyNow = (item) => {
  setCart(prevCart => {
    const existingItem = prevCart.find(cartItem => cartItem._id === item._id);
    
    if (existingItem) {
      return prevCart.map(cartItem =>
        cartItem._id === item._id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    } else {
      return [...prevCart, { ...item, quantity: 1 }];
    }
  });
  
  navigate("/cart", { state: { from: location.pathname } });

};

const handleAddToCart = (item) => {
  addToCart(item);
};

const handleBuyNow = (item) => {
  buyNow(item); 
};
  const handleCheckout = () => {
    navigate('/cart');
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (loading) {
    return (
      <div className="buying-page">
        <div className="banner">
          <h1 className="banner-title">Fresh and Organic Products</h1>
          <p>Directly from farms to your home</p>
        </div>
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="spinner"></div>
          <p>Loading fresh produce...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="buying-page">
      <div className="banner">
        <h1 className="banner-title">Fresh From Farms 🌾</h1>
      </div>

      <div className="main-layout">
        <div className="filters">
          <div className="nearby-box">
            <button
              className="nearby-toggle"
              onClick={() => {
                if (nearby.enabled) {
                  dispatch(disableNearby());
                } else {
                  setShowLocationModal(true);
                }
              }}
            >
               {nearby.enabled ? "Nearby Sells ON" : "See Nearby Sells"}
            </button>


            {nearby.enabled && (
              <p className="nearby-text">
                Showing sellers from <b>{nearby.location.city}</b>
              </p>
            )}

            <h3>Filter</h3>
          </div>


          <div className="filter-section">
            <h4>Price Range</h4>
            <input
              type="range"
              min="20"
              max="300"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
            <span>Up to ₹{maxPrice}</span>
          </div>

          <div className="info-box">
            <h4>Why Fresh From Farms?</h4>
            <p>🌱 Directly sourced from local farmers</p>
            <p>🚚 Same-day / next-day delivery</p>
            <p>✅ No chemicals, no middlemen</p>
            <p>📍 Currently serving nearby areas</p>
          </div>

          <div className="contact-box">
            <h4>Contact Us</h4>
            <div className="contact-icons">
              <a href="mailto:freshfromfarms@gmail.com">
                <img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" alt="Gmail" />
              </a>
              <a href="https://instagram.com/freshfromfarms" target="_blank" rel="noopener noreferrer">
                <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" />
              </a>
            </div>
          </div>
        </div>

        {/* PRODUCTS AREA WITH CART SECTION */}
        <div className="products-area">
          {/* CART SECTION */}
          {cart.length > 0 && (
            <div className="cart-section">
              <div className="cart-header">
                <h3>🛒 Your Cart ({totalItems} items)</h3>
                <span className="cart-total">₹{totalAmount.toLocaleString()}</span>
              </div>
              
              <div className="cart-items-preview">
                {cart.slice(0, 3).map((item) => (
                  <div key={item._id} className="cart-preview-item">
                    <img 
                      src={item.images?.[0] || "https://via.placeholder.com/50?text=?"} 
                      alt={item.cropName} 
                      className="cart-preview-img"
                    />
                    <div className="cart-preview-info">
                      <div className="cart-preview-name">{item.cropName}</div>
                      <div className="cart-preview-price">₹{item.price} x {item.quantity}</div>
                    </div>
                  </div>
                ))}
                {cart.length > 3 && (
                  <div className="cart-more-items">+{cart.length - 3} more</div>
                )}
              </div>
              
              <div className="cart-actions">
                <button className="clear-cart-btn" onClick={clearCart}>
                  Clear Cart
                </button>
                <button className="checkout-btn" onClick={handleCheckout}>
                  → View Cart & Checkout
                </button>
              </div>
            </div>
          )}

          <div className="product-grid">
            {filteredProducts.map((item) => (
              <div className="product-card" key={item._id || item.id}  onClick={() => navigate(`/product/${item._id}`)}>
                {nearby.enabled && (
                <button
                  className="chat-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/chat/${item._id}`);
                  }}
                >
                  💬 Chat with Farmer
                </button>
              )}
                <img 
                  src={item.images?.[0] || item.image || "https://via.placeholder.com/300x200/90EE90/228B22?text=No+Image"} 
                  alt={item.cropName || item.name} 
                />
                <h4>{item.cropName || item.name}</h4>

 

              <p>₹{item.price}/kg</p>
              <p className="location">{item.city}, {item.state}</p>


                <div className="btn-group">
                  <button 
                    className="cart-btn" 
                    onClick={() => handleAddToCart(item)}
                  >
                    🛒 Add to Cart
                  </button>
                  <button 
                    className="buy-btn" 
                    onClick={() => handleBuyNow(item)}
                  >
                    🚀 Buy Now
                  </button>
                </div>
              </div>
            ))}

            {filteredProducts.length === 0 && !loading && (
              <p className="no-results">No products found 😕</p>
            )}
          </div>
        </div>
      </div>
      {showLocationModal && (
      <NearbyLocationModal
        onClose={() => setShowLocationModal(false)}
        onConfirm={(locationData) => {
          dispatch(enableNearby(locationData));
          setShowLocationModal(false);
        }}
      />
    )}

    </div>
  );
}
