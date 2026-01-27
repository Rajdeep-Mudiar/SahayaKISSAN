import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Cart.css";
import { useLocation } from "react-router-dom";


export default function Cart() {
  const [cart, setCart] = useState([]);
  const location = useLocation();
  const previousPage = location.state?.from;

  const [address, setAddress] = useState({
    name: '',
    phone: '',
    street: '',
    city: 'Sibsagar',
    state: 'Assam',
    pincode: '785640'
  });
  const [deliveryDate, setDeliveryDate] = useState('');
  const navigate = useNavigate();

  const nearby = useSelector(state => state.nearby);
  const isNearby = nearby.enabled;

  useEffect(() => {
    const syncCart = () => {
      const savedCart = localStorage.getItem('farmCart');
      if (savedCart) setCart(JSON.parse(savedCart));
      else setCart([]);
    };

    syncCart();
    window.addEventListener('storage', syncCart);
    const interval = setInterval(syncCart, 500);

    return () => {
      window.removeEventListener('storage', syncCart);
      clearInterval(interval);
    };
  }, []);

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) return removeItem(id);

    setCart(prev => {
      const updated = prev.map(item =>
        item._id === id ? { ...item, quantity } : item
      );
      localStorage.setItem('farmCart', JSON.stringify(updated));
      return updated;
    });
  };

  const removeItem = (id) => {
    const updated = cart.filter(item => item._id !== id);
    setCart(updated);
    localStorage.setItem('farmCart', JSON.stringify(updated));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('farmCart');
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const gst = isNearby ? 0 : subtotal * 0.05;
  const delivery = isNearby ? 0 : 50;
  const totalAmount = subtotal + gst + delivery;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleContinueShopping = () => {
    if (previousPage) {
      navigate(previousPage);
    } else {
      navigate("/");
    }
  };

  const nextDeliveryDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 2);
    setDeliveryDate(today.toISOString().split('T')[0]);
  };

  useEffect(() => {
    nextDeliveryDate();
  }, []);

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <div>
            <h1>🛒 Shopping Cart</h1>
            <span className="cart-count">{totalItems} items</span>
          </div>
          <button onClick={handleContinueShopping} className="back-button">
            ← Continue Shopping
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <button onClick={handleContinueShopping} className="shop-button">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="cart-main-content">
            <div className="cart-items-section">
              <div className="section-header">
                <h2>Items ({totalItems})</h2>
              </div>

              <div className="cart-items">
                {cart.map(item => (
                  <div key={item._id} className="cart-item">
                    <img src={item.images?.[0]} alt={item.cropName} className="item-image" />

                    <div className="item-info">
                      <h3>{item.cropName}</h3>
                      <p className="item-price">₹{item.price}/{item.unit || 'kg'}</p>
                      <p className="item-location">{item.city}, {item.state}</p>
                    </div>

                    <div className="quantity-control">
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="qty-button">-</button>
                      <span className="qty-number">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="qty-button">+</button>
                    </div>

                    <div className="item-total">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </div>

                    <button className="delete-button" onClick={() => removeItem(item._id)}>×</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="checkout-section">
              <div className="price-summary">
                <h3>Price Details</h3>

                <div className="price-row">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>

                {!isNearby && (
                  <>
                    <div className="price-row">
                      <span>GST (5%)</span>
                      <span>₹{gst.toLocaleString()}</span>
                    </div>
                    <div className="price-row">
                      <span>Delivery Charges</span>
                      <span>₹{delivery.toLocaleString()}</span>
                    </div>
                  </>
                )}

                {isNearby && (
                  <div className="nearby-note">
                    🤝 You will pay the farmer directly after confirming via chat.  
                    No GST or delivery charges applied.
                  </div>
                )}

                <div className="price-row total-row">
                  <span>Total Amount</span>
                  <span className="total-price">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="cart-actions">
                <button onClick={clearCart} className="clear-button">
                  Clear Cart
                </button>
                <button className="checkout-button">
                  PLACE ORDER → ₹{totalAmount.toLocaleString()}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
