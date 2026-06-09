import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import usePageMetadata from '../lib/usePageMetadata';
import './CartPage.css';

export default function CartPage() {
    const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    usePageMetadata({
        title: 'Your Cart - Evionex',
        description: 'Review your selected products and services before checkout.',
    });

    const handleCheckout = () => {
        if (!user) {
            navigate('/portal/login');
            return;
        }
        // For now, we'll just redirect to the first item's checkout if there's only one, 
        // or just alert. In a real app, this would go to a multi-item checkout flow.
        if (cartItems.length > 0) {
            navigate(`/shop/${cartItems[0].id}`);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="cart-empty">
                <div className="cart-empty__content">
                    <h1 className="cart-empty__title">Your cart is empty</h1>
                    <p className="cart-empty__desc">Looks like you haven't added anything to your cart yet.</p>
                    <Link to="/shop" className="cart-empty__btn">
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="cart-page">
            <div className="cart-container">
                <section className="cart-main">
                    <h1 className="cart-title">Shopping Cart</h1>
                    
                    <div className="cart-items-list">
                        {cartItems.map((item) => (
                            <div key={item.id} className="cart-item">
                                <div className="cart-item__image-wrapper">
                                    <img src={item.image} alt={item.name} className="cart-item__image" />
                                </div>
                                <div className="cart-item__details">
                                    <Link to={item.type === 'service' ? `/service/${item.id}` : `/products/${item.id}`} className="cart-item__name-link">
                                        <h3 className="cart-item__name">{item.name}</h3>
                                    </Link>
                                    <p className="cart-item__desc">{item.description}</p>
                                    <div className="cart-item__price">
                                        {typeof item.price === 'string' 
                                            ? item.price 
                                            : `₹${item.price.toLocaleString('en-IN')}`}
                                    </div>
                                </div>
                                <div className="cart-item__actions">
                                    <div className="cart-item__quantity">
                                        <button 
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            −
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                            +
                                        </button>
                                    </div>
                                    <button 
                                        className="cart-item__remove"
                                        onClick={() => removeFromCart(item.id)}
                                        aria-label="Remove item"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {cartItems.length > 1 && (
                        <button className="cart-clear-all" onClick={clearCart}>
                            Clear All Items
                        </button>
                    )}
                </section>

                <aside className="cart-sidebar">
                    <div className="cart-summary-card">
                        <h2 className="cart-summary-title">Order Summary</h2>
                        <div className="cart-summary-row">
                            <span>Subtotal</span>
                            <span>
                                {typeof cartTotal === 'string' 
                                    ? cartTotal 
                                    : `₹${cartTotal.toLocaleString('en-IN')}`}
                            </span>
                        </div>
                        <div className="cart-summary-row cart-summary-row--discount">
                            <span>Discount</span>
                            <span>Applied</span>
                        </div>
                        <div className="cart-summary-divider" />
                        <div className="cart-summary-row cart-summary-row--total">
                            <span>Total</span>
                            <span>
                                {typeof cartTotal === 'string' 
                                    ? cartTotal 
                                    : `₹${cartTotal.toLocaleString('en-IN')}`}
                            </span>
                        </div>
                        <button 
                            className="cart-checkout-btn"
                            onClick={handleCheckout}
                        >
                            Proceed to Checkout
                        </button>
                        <p className="cart-secure-note">
                            🔒 Secure checkout powered by Razorpay.
                        </p>
                    </div>
                </aside>
            </div>
        </main>
    );
}
