import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import usePageMetadata from '../lib/usePageMetadata'
import './Checkout.css'

// Product and service catalog (same as Shop.jsx for now)
const PRODUCTS = [
    {
        id: 'genesetu',
        name: 'GeneSetu',
        description: 'AI-enabled health intelligence using genomic insights and longitudinal records.',
        price: 24900,
        discount: 'Save 15%',
    },
    {
        id: 'luminary',
        name: 'Luminary',
        description: 'Adaptive learning experiences with AI-assisted assessments and analytics.',
        price: 12900,
        discount: 'Save 10%',
    },
    {
        id: 'evinote',
        name: 'EviNote',
        description: 'An AI-powered lab platform for experiments, resources, and research operations.',
        price: 19900,
        discount: 'Save 12%',
    }
]

const SERVICES = [
    {
        id: 'blood-analysis',
        name: 'Blood Report Analysis',
        description: 'Comprehensive, AI-driven analysis of your blood test results for personalized health insights.',
        price: 5900,
        discount: 'Save 20%',
    },
    {
        id: 'mri-analysis',
        name: 'MRI Results Analysis',
        description: 'Advanced interpretation of MRI scans for detailed overview of your internal structures.',
        price: 12900,
        discount: 'Save 18%',
    },
    {
        id: 'health-tests',
        name: 'Healthcare Tests Assessment',
        description: 'Book a consultation for interpreting and mapping various healthcare diagnostics.',
        price: 8900,
        discount: 'Save 14%',
    },
    {
        id: 'dev-services',
        name: 'Software / Web Development',
        description: 'End-to-end custom software and web application development services spanning all modern tech stacks.',
        price: 89900,
        discount: 'Save 8%',
    }
]

const ALL_ITEMS = [...PRODUCTS, ...SERVICES]

export default function Checkout() {
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useAuth()
    const [item, setItem] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [loading, setLoading] = useState(false)

    usePageMetadata({
        title: `Checkout - ${item?.name || 'Product'} | Evionex`,
        description: `Complete your purchase of ${item?.name || 'this product'}`,
    })

    useEffect(() => {
        // Find item by ID
        const foundItem = ALL_ITEMS.find(i => i.id === id)
        if (!foundItem) {
            navigate('/shop', { replace: true })
        } else {
            setItem(foundItem)
        }
    }, [id, navigate])

    const handleProceedToPayment = async () => {
        if (!item) return

        setLoading(true)
        try {
            // Future: Integrate Razorpay payment here
            // For now, just log the order details
            console.log('Proceeding to payment:', {
                itemId: item.id,
                itemName: item.name,
                quantity,
                amount: item.price * quantity,
                userId: user.id,
            })

            // Placeholder: Show success message or redirect to payment
            alert('Payment integration coming soon. Order details logged.')
        } catch (error) {
            console.error('Payment error:', error)
            alert('An error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (!item) {
        return (
            <main className="checkout-page">
                <div className="loading-spinner">
                    <div className="loading-spinner__ring" />
                </div>
            </main>
        )
    }

    const totalPrice = item.price * quantity

    return (
        <main className="checkout-page">
            <div className="checkout-container">
                <section className="checkout-main">
                    <div className="checkout-header">
                        <h1>Order Summary</h1>
                        <button 
                            className="checkout-back-btn"
                            onClick={() => navigate('/shop')}
                        >
                            ← Back to Shop
                        </button>
                    </div>

                    <div className="checkout-card">
                        <div className="checkout-item-preview">
                            <h2 className="checkout-item-name">{item.name}</h2>
                            <p className="checkout-item-desc">{item.description}</p>
                        </div>

                        <div className="checkout-divider"></div>

                        <div className="checkout-form-section">
                            <label className="checkout-label">
                                <span>Quantity</span>
                                <div className="quantity-selector">
                                    <button 
                                        type="button"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                    >
                                        −
                                    </button>
                                    <input 
                                        type="number" 
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                        min="1"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setQuantity(quantity + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </label>
                        </div>

                        <div className="checkout-divider"></div>

                        <div className="checkout-pricing">
                            <div className="checkout-price-row">
                                <span>Unit Price</span>
                                <span>₹{(item.price / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="checkout-price-row">
                                <span>Quantity</span>
                                <span>{quantity}x</span>
                            </div>
                            <div className="checkout-price-row checkout-price-row--discount">
                                <span>{item.discount}</span>
                                <span>Applied</span>
                            </div>
                            <div className="checkout-divider"></div>
                            <div className="checkout-price-row checkout-price-row--total">
                                <span>Total Amount</span>
                                <span>₹{(totalPrice / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>

                        <button 
                            className="checkout-btn-primary"
                            onClick={handleProceedToPayment}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Proceed to Payment'}
                        </button>

                        <p className="checkout-secure-note">
                            🔒 Secure checkout powered by Razorpay. Your payment details are encrypted.
                        </p>
                    </div>
                </section>

                <aside className="checkout-sidebar">
                    <div className="checkout-user-info">
                        <h3>Billing Information</h3>
                        <div className="user-detail">
                            <span className="label">Email</span>
                            <span className="value">{user?.email}</span>
                        </div>
                        <p className="checkout-info-note">
                            Make sure this email matches the one associated with your Razorpay account.
                        </p>
                    </div>
                </aside>
            </div>
        </main>
    )
}
