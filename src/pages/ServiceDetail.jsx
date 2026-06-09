import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import usePageMetadata from '../lib/usePageMetadata'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import geneSetuImg from '../assets/images/products-nav/genesetu-nav.webp'
import eviNoteImg from '../assets/images/products-nav/evinote-nav.webp'
import luminaryImg from '../assets/images/products-nav/luminary-nav.webp'
import './Shop.css'
import './ServiceDetail.css'

// In a real app, this would come from a shared data file or API
const PRODUCTS = [
    {
        id: 'genesetu',
        name: 'GeneSetu',
        description: 'AI-enabled health intelligence using genomic insights and longitudinal records.',
        image: geneSetuImg,
        price: '₹249',
        rating: 4.9,
        reviews: 345,
        discount: 'Save 15%',
        tags: ['AI', 'Health', 'Wellness', 'Genomics', 'Analytics']
    },
    {
        id: 'luminary',
        name: 'Luminary',
        description: 'Adaptive learning experiences with AI-assisted assessments and analytics.',
        image: luminaryImg,
        price: '₹129',
        rating: 4.6,
        reviews: 218,
        discount: 'Save 10%',
        tags: ['AI', 'Education', 'Analytics']
    },
    {
        id: 'evinote',
        name: 'EviNote',
        description: 'An AI-powered lab platform for experiments, resources, and research operations.',
        image: eviNoteImg,
        price: '₹199',
        rating: 4.8,
        reviews: 402,
        discount: 'Save 12%',
        tags: ['AI', 'Research', 'Lab', 'Analytics']
    }
]

const SERVICES = [
    {
        id: 'blood-analysis',
        name: 'Blood Report Analysis',
        description: 'Comprehensive, AI-driven analysis of your blood test results for personalized health insights. Our system cross-references your biomarkers with thousands of clinical data points to identify trends and potential risks before they become critical.',
        longDescription: 'Our Blood Report Analysis service transforms raw lab data into actionable health intelligence. Using advanced AI models, we analyze your complete blood count (CBC), metabolic panels, and lipid profiles to provide a holistic view of your health. You receive a detailed report that explains what your numbers actually mean, highlighting areas of concern and suggesting lifestyle adjustments or further medical consultations.',
        price: '₹59',
        rating: 4.7,
        reviews: 196,
        discount: 'Save 20%',
        tags: ['AI', 'Health', 'Diagnostics'],
        images: [
            'https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-158159467659a-76d57327e271?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
        ],
        features: ['AI-Driven Insights', 'Certified Report', 'Trend Analysis', 'Doctor-Ready Summary']
    },
    {
        id: 'mri-analysis',
        name: 'MRI Results Analysis',
        description: 'Advanced interpretation of MRI scans for detailed overview of your internal structures. We use computer vision to highlight anomalies and provide a second opinion based on global radiology standards.',
        longDescription: 'MRI scans can be complex and intimidating. Our MRI Analysis service provides a clear, simplified interpretation of your imaging results. By leveraging state-of-the-art AI radiology tools, we help you understand the findings of your scan, providing visual markers and plain-language explanations that you can discuss with your specialist.',
        price: '₹129',
        rating: 4.5,
        reviews: 152,
        discount: 'Save 18%',
        tags: ['AI', 'Health', 'Imaging', 'Diagnostics'],
        images: [
            'https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1559757175-5700dde675bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
        ],
        features: ['Computer Vision Analysis', 'Anomaly Detection', 'Radiology Standards', 'Detailed Mapping']
    },
    {
        id: 'health-tests',
        name: 'Healthcare Tests Assessment',
        description: 'Book a consultation for interpreting and mapping various healthcare diagnostics. We help you connect the dots between different tests to see the bigger picture of your health.',
        longDescription: 'Often, health tests are done in isolation. Our Assessment service looks at your entire diagnostic history—from blood work to imaging—to create a comprehensive health map. We identify correlations between different test results that might be missed when looking at reports individually.',
        price: '₹89',
        rating: 4.4,
        reviews: 128,
        discount: 'Save 14%',
        tags: ['Health', 'Diagnostics', 'Wellness'],
        images: [
            'https://images.unsplash.com/photo-1584362917165-526a968579e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1584362917165-526a968579e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
        ],
        features: ['Cross-Test Correlation', 'Holistic Health Mapping', 'Expert Consultation', 'Diagnostic Timeline']
    },
    {
        id: 'dev-services',
        name: 'Software / Web Development',
        description: 'End-to-end custom software and web application development services spanning all modern tech stacks. From AI integration to scalable cloud architectures.',
        longDescription: 'We build production-grade digital products that scale. Whether you need a complex AI-powered dashboard, a high-performance e-commerce engine, or a custom enterprise tool, our team handles everything from architecture design to deployment and maintenance.',
        price: '₹899',
        rating: 4.8,
        reviews: 92,
        discount: 'Save 8%',
        tags: ['Software', 'Development', 'Analytics'],
        images: [
            'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1460925895917-afbe65ae8364?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
        ],
        features: ['Full-Stack Development', 'AI/ML Integration', 'Cloud Architecture', 'UI/UX Design']
    }
]

export default function ServiceDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const { addToCart, cartItems, updateQuantity } = useCart()
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const service = SERVICES.find(s => s.id === id)

    usePageMetadata({
        title: service ? `${service.name} - Evionex` : 'Service Detail - Evionex',
        description: service ? service.description : 'Explore our professional services.'
    })

    if (!service) {
        return (
            <div className="service-detail-error">
                <h2>Service not found</h2>
                <Link to="/shop" className="service-detail-error__link">Return to Shop</Link>
            </div>
        )
    }

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % service.images.length)
    }

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + service.images.length) % service.images.length)
    }

    const handleBuyNow = () => {
        if (!user) {
            navigate('/portal/login')
            return
        }
        navigate(`/shop/${service.id}`)
    }

    const getCartQuantity = (itemId) => {
        return cartItems?.find(item => item.id === itemId)?.quantity || 0
    }

    const handleAddToCart = () => {
        if (!user) {
            navigate('/portal/login')
            return
        }
        addToCart(service)
    }

    const handleUpdateQuantity = (delta) => {
        if (!user) {
            navigate('/portal/login')
            return
        }
        const currentQuantity = getCartQuantity(service.id)
        updateQuantity(service.id, currentQuantity + delta)
    }

    const handleAddToCartItem = (item) => {
        if (!user) {
            navigate('/portal/login')
            return
        }
        addToCart(item)
    }

    const handleUpdateQuantityItem = (item, delta) => {
        if (!user) {
            navigate('/portal/login')
            return
        }
        const currentQuantity = getCartQuantity(item.id)
        updateQuantity(item.id, currentQuantity + delta)
    }

    const similarItems = (() => {
        const baseTags = new Set(service.tags || [])
        const countOverlap = (tags = []) => tags.filter((tag) => baseTags.has(tag)).length
        const products = PRODUCTS.map((item) => ({
            ...item,
            itemType: 'product',
            overlap: countOverlap(item.tags)
        }))
        const services = SERVICES.filter((item) => item.id !== service.id).map((item) => ({
            ...item,
            itemType: 'service',
            overlap: countOverlap(item.tags)
        }))
        return [...products, ...services]
            .filter((item) => item.overlap > 0)
            .sort((a, b) => b.overlap - a.overlap)
            .slice(0, 3)
    })()

    const formatRating = (rating) => Number(rating).toFixed(1)
    const getStarStates = (rating) => {
        const safeRating = Math.max(0, Math.min(5, Number(rating) || 0))
        return Array.from({ length: 5 }, (_, index) => {
            const starFill = safeRating - index
            if (starFill >= 1) return 'full'
            if (starFill >= 0.5) return 'half'
            return 'empty'
        })
    }

    return (
        <div className="service-detail-page">
            <div className="service-detail-container">
                <div className="service-detail-layout">
                    {/* Left Side: Image Carousel */}
                    <div className="service-detail-visuals">
                        <div className="service-carousel">
                            <div className="service-carousel__track">
                                <img 
                                    src={service.images[currentImageIndex]} 
                                    alt={`${service.name} view ${currentImageIndex + 1}`} 
                                    className="service-carousel__image" 
                                />
                            </div>
                            <div className="service-carousel__controls">
                                <button onClick={prevImage} className="service-carousel__btn">←</button>
                                <div className="service-carousel__indicators">
                                    {service.images.map((_, idx) => (
                                        <span 
                                            key={idx} 
                                            className={`service-carousel__dot ${idx === currentImageIndex ? 'active' : ''}`}
                                            onClick={() => setCurrentImageIndex(idx)}
                                        />
                                    ))}
                                </div>
                                <button onClick={nextImage} className="service-carousel__btn">→</button>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Content */}
                    <div className="service-detail-info">
                        <div className="service-detail-header">
                            <Link to="/shop" className="service-detail-back">← Back to Shop</Link>
                            <h1 className="service-detail-title">{service.name}</h1>
                            <div className="service-detail-price">{service.price}</div>
                        </div>

                        <div className="service-detail-body">
                            <p className="service-detail-description">{service.description}</p>
                            
                            <div className="service-detail-features">
                                <h3>Key Highlights</h3>
                                <ul className="service-detail-feature-list">
                                    {service.features.map((feature, idx) => (
                                        <li key={idx} className="service-detail-feature-item">
                                            <span className="service-detail-feature-icon">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="service-detail-long-desc">
                                <h3>About this Service</h3>
                                <p>{service.longDescription}</p>
                            </div>
                        </div>

                        <div className="service-detail-footer">
                            <button
                                onClick={handleBuyNow}
                                className="service-detail-buy-btn"
                            >
                                Buy Now
                            </button>
                            {getCartQuantity(service.id) > 0 ? (
                                <div
                                    className="service-detail-quantity"
                                    role="group"
                                    aria-label={`${service.name} cart quantity`}
                                >
                                    <button
                                        type="button"
                                        className="service-detail-quantity-btn"
                                        aria-label="Decrease quantity"
                                        onClick={() => handleUpdateQuantity(-1)}
                                    >
                                        −
                                    </button>
                                    <span className="service-detail-quantity-value" aria-live="polite">
                                        {getCartQuantity(service.id)}
                                    </span>
                                    <button
                                        type="button"
                                        className="service-detail-quantity-btn"
                                        aria-label="Increase quantity"
                                        onClick={() => handleUpdateQuantity(1)}
                                    >
                                        +
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleAddToCart}
                                    className="service-detail-cart-btn"
                                >
                                    Add to cart
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <section className="service-detail-similar">
                    <div className="service-detail-similar__header">
                        <h2>Similar Products and Services</h2>
                    </div>
                    <div className="service-detail-similar__grid shop-grid">
                        {similarItems.length === 0 ? (
                            <p className="service-detail-similar__empty">No related items yet.</p>
                        ) : (
                            similarItems.map((item) => (
                                item.itemType === 'product' ? (
                                    <div key={`product-${item.id}`} className="amazon-card amazon-card--product">
                                        <div className="amazon-card__image-wrapper">
                                            <img src={item.image} alt={item.name} className="amazon-card__image" />
                                        </div>
                                        <div className="amazon-card__content">
                                            <h3 className="amazon-card__title">{item.name}</h3>
                                            <div className="amazon-card__details">
                                                <p className="amazon-card__desc">{item.description}</p>
                                                <div className="amazon-card__meta">
                                                    <div
                                                        className="amazon-card__rating"
                                                        role="img"
                                                        aria-label={`Rated ${formatRating(item.rating)} out of 5`}
                                                    >
                                                        <span className="amazon-card__rating-stars" aria-hidden="true">
                                                            {getStarStates(item.rating).map((state, index) => (
                                                                <span
                                                                    key={`${item.id}-star-${index}`}
                                                                    className={`amazon-card__star amazon-card__star--${state}`}
                                                                >
                                                                    ★
                                                                </span>
                                                            ))}
                                                        </span>
                                                        <span className="amazon-card__rating-text">{formatRating(item.rating)}</span>
                                                    </div>
                                                    <span
                                                        className="amazon-card__reviews amazon-card__meta-item--right"
                                                        aria-label={`${item.reviews} Reviews`}
                                                    >
                                                        ({item.reviews} Reviews)
                                                    </span>
                                                    <div className="amazon-card__price">
                                                        <span className="amazon-card__price-label">Starting from</span>
                                                        <span className="amazon-card__price-value">{item.price}</span>
                                                    </div>
                                                    <div className="amazon-card__discount amazon-card__meta-item--right">
                                                        <span className="amazon-card__discount-label">Discount</span>
                                                        <span className="amazon-card__discount-value">{item.discount}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="amazon-card__action">
                                                <Link
                                                    to={`/products/${item.id}`}
                                                    className="amazon-card__button amazon-card__button--learn-more"
                                                >
                                                    Learn More
                                                </Link>
                                                <Link to={`/shop/${item.id}`} className="amazon-card__button">
                                                    Buy Now
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div key={`service-${item.id}`} className="amazon-card amazon-card--service">
                                        <Link
                                            to={`/service/${item.id}`}
                                            className="amazon-card__image-link"
                                            aria-label={`View ${item.name} details`}
                                        >
                                            <div className="amazon-card__image-wrapper">
                                                <img src={item.images?.[0] || item.image} alt={item.name} className="amazon-card__image" />
                                            </div>
                                        </Link>
                                        <div className="amazon-card__content">
                                            <h3 className="amazon-card__title">
                                                <Link
                                                    to={`/service/${item.id}`}
                                                    className="amazon-card__title-link"
                                                >
                                                    {item.name}
                                                </Link>
                                            </h3>
                                            <div className="amazon-card__details">
                                                <p className="amazon-card__desc">{item.description}</p>
                                                <div className="amazon-card__meta">
                                                    <div
                                                        className="amazon-card__rating"
                                                        role="img"
                                                        aria-label={`Rated ${formatRating(item.rating)} out of 5`}
                                                    >
                                                        <span className="amazon-card__rating-stars" aria-hidden="true">
                                                            {getStarStates(item.rating).map((state, index) => (
                                                                <span
                                                                    key={`${item.id}-star-${index}`}
                                                                    className={`amazon-card__star amazon-card__star--${state}`}
                                                                >
                                                                    ★
                                                                </span>
                                                            ))}
                                                        </span>
                                                        <span className="amazon-card__rating-text">{formatRating(item.rating)}</span>
                                                    </div>
                                                    <span
                                                        className="amazon-card__reviews amazon-card__meta-item--right"
                                                        aria-label={`${item.reviews} Reviews`}
                                                    >
                                                        ({item.reviews} Reviews)
                                                    </span>
                                                    <div className="amazon-card__price">
                                                        <span className="amazon-card__price-label">Starting from</span>
                                                        <span className="amazon-card__price-value">{item.price}</span>
                                                    </div>
                                                    <div className="amazon-card__discount amazon-card__meta-item--right">
                                                        <span className="amazon-card__discount-label">Discount</span>
                                                        <span className="amazon-card__discount-value">{item.discount}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="amazon-card__action">
                                                {getCartQuantity(item.id) > 0 ? (
                                                    <div
                                                        className="amazon-card__quantity"
                                                        role="group"
                                                        aria-label={`${item.name} cart quantity`}
                                                    >
                                                        <button
                                                            type="button"
                                                            className="amazon-card__quantity-btn"
                                                            aria-label="Decrease quantity"
                                                            onClick={() => handleUpdateQuantityItem(item, -1)}
                                                        >
                                                            −
                                                        </button>
                                                        <span className="amazon-card__quantity-value" aria-live="polite">
                                                            {getCartQuantity(item.id)}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            className="amazon-card__quantity-btn"
                                                            aria-label="Increase quantity"
                                                            onClick={() => handleUpdateQuantityItem(item, 1)}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        className="amazon-card__button amazon-card__button--service"
                                                        onClick={() => handleAddToCartItem(item)}
                                                    >
                                                        Add to cart
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}
