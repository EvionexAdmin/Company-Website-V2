import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import usePageMetadata from '../lib/usePageMetadata'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import geneSetuImg from '../assets/images/products-nav/genesetu-nav.webp'
import eviNoteImg from '../assets/images/products-nav/evinote-nav.webp'
import luminaryImg from '../assets/images/products-nav/luminary-nav.webp'
import './Shop.css'

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
        description: 'Comprehensive, AI-driven analysis of your blood test results for personalized health insights.',
        image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        price: '₹59',
        rating: 4.7,
        reviews: 196,
        discount: 'Save 20%',
        tags: ['AI', 'Health', 'Diagnostics']
    },
    {
        id: 'mri-analysis',
        name: 'MRI Results Analysis',
        description: 'Advanced interpretation of MRI scans for detailed overview of your internal structures.',
        image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        price: '₹129',
        rating: 4.5,
        reviews: 152,
        discount: 'Save 18%',
        tags: ['AI', 'Health', 'Imaging', 'Diagnostics']
    },
    {
        id: 'health-tests',
        name: 'Healthcare Tests Assessment',
        description: 'Book a consultation for interpreting and mapping various healthcare diagnostics.',
        image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        price: '₹89',
        rating: 4.4,
        reviews: 128,
        discount: 'Save 14%',
        tags: ['Health', 'Diagnostics', 'Wellness']
    },
    {
        id: 'dev-services',
        name: 'Software / Web Development',
        description: 'End-to-end custom software and web application development services spanning all modern tech stacks.',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        price: '₹899',
        rating: 4.8,
        reviews: 92,
        discount: 'Save 8%',
        tags: ['Software', 'Development', 'Analytics']
    }
]

const STAR_COUNT = 5
const ALL_ITEMS = [...PRODUCTS, ...SERVICES]
const TAGS = Array.from(new Set(ALL_ITEMS.flatMap((item) => item.tags || []))).sort()
const parsePriceValue = (price) => Number(String(price).replace(/[^0-9.]/g, '')) || 0
const formatCurrency = (value) => `₹${Number(value).toLocaleString('en-IN')}`
const formatRating = (rating) => Number(rating).toFixed(1)
const getStarStates = (rating) => {
    const safeRating = Math.max(0, Math.min(STAR_COUNT, Number(rating) || 0))

    return Array.from({ length: STAR_COUNT }, (_, index) => {
        const starFill = safeRating - index
        if (starFill >= 1) return 'full'
        if (starFill >= 0.5) return 'half'
        return 'empty'
    })
}

export default function Shop() {
    const location = useLocation()
    const navigate = useNavigate()
    const { user } = useAuth()
    const { addToCart, cartItems, updateQuantity } = useCart()
    const [filtersOpen, setFiltersOpen] = useState(false)
    const [priceOrder, setPriceOrder] = useState('low-high')
    const [itemType, setItemType] = useState('all')
    const [selectedTags, setSelectedTags] = useState([])
    const maxPrice = Math.max(0, ...ALL_ITEMS.map((item) => parsePriceValue(item.price)))
    const [priceRange, setPriceRange] = useState(maxPrice)
    const [searchQuery, setSearchQuery] = useState(() => {
        const params = new URLSearchParams(location.search)
        return params.get('q') || ''
    })

    const getCartQuantity = (itemId) => {
        return cartItems?.find(item => item.id === itemId)?.quantity || 0
    }

    usePageMetadata({
        title: 'Shop - Evionex',
        description: 'Explore Evionex products and services tailored for your lifestyle and business.'
    })

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        setSearchQuery(params.get('q') || '')
    }, [location.search])

    useEffect(() => {
        const handleSearch = (event) => {
            setSearchQuery(event.detail?.query || '')
        }

        window.addEventListener('shop-search', handleSearch)
        return () => window.removeEventListener('shop-search', handleSearch)
    }, [])

    useEffect(() => {
        if (!location.hash) return
        const targetId = location.hash.replace('#', '')
        const target = document.getElementById(targetId)
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }, [location.hash])

    useEffect(() => {
        const handleToggle = () => setFiltersOpen((prev) => !prev)
        const handleClose = () => setFiltersOpen(false)

        window.addEventListener('toggle-shop-filters', handleToggle)
        window.addEventListener('close-shop-filters', handleClose)

        return () => {
            window.removeEventListener('toggle-shop-filters', handleToggle)
            window.removeEventListener('close-shop-filters', handleClose)
        }
    }, [])

    useEffect(() => {
        document.body.style.overflow = filtersOpen ? 'hidden' : ''
        return () => {
            document.body.style.overflow = ''
        }
    }, [filtersOpen])

    useEffect(() => {
        if (priceRange > maxPrice) {
            setPriceRange(maxPrice)
        }
    }, [maxPrice, priceRange])

    const handleClearFilters = () => {
        setPriceOrder('low-high')
        setItemType('all')
        setPriceRange(maxPrice)
        setSelectedTags([])
    }

    const handleAddToCart = (e, item) => {
        e.preventDefault()
        e.stopPropagation()

        if (!user) {
            navigate('/portal/login')
            return
        }

        addToCart(item)
        console.log(`Added ${item.name} to cart`)
    }

    const handleUpdateQuantity = (e, item, delta) => {
        e.preventDefault()
        e.stopPropagation()

        if (!user) {
            navigate('/portal/login')
            return
        }

        const currentQuantity = getCartQuantity(item.id)
        updateQuantity(item.id, currentQuantity + delta)
    }

    const toggleTag = (tag) => {
        setSelectedTags((prev) => (
            prev.includes(tag) ? prev.filter((value) => value !== tag) : [...prev, tag]
        ))
    }

    const normalizedQuery = searchQuery.trim().toLowerCase()
    const matchesQuery = (item) => {
        if (!normalizedQuery) return true
        return [item.name, item.description]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(normalizedQuery))
    }

    const sortByPrice = (items) => {
        const sorted = [...items].sort((a, b) => parsePriceValue(a.price) - parsePriceValue(b.price))
        if (priceOrder === 'high-low') return sorted.reverse()
        return sorted
    }

    const filterItems = (items) => items.filter((item) => {
        if (!matchesQuery(item)) return false
        if (parsePriceValue(item.price) > priceRange) return false
        if (selectedTags.length > 0) {
            const itemTags = item.tags || []
            if (!selectedTags.every((tag) => itemTags.includes(tag))) return false
        }
        return true
    })

    const filteredProducts = sortByPrice(
        itemType === 'service' ? [] : filterItems(PRODUCTS)
    )

    const filteredServices = sortByPrice(
        itemType === 'product' ? [] : filterItems(SERVICES)
    )

    return (
        <main className="shop-page">
            <section className="shop-hero">
                <div className="shop-hero__bg"></div>
                <div className="shop-hero__content">
                    <h1 className="shop-hero__title">Solutions that change lives</h1>
                    <p className="shop-hero__subtitle">Find the perfect products and services to empower your potential.</p>
                </div>
            </section>
            <button
                type="button"
                className={`shop-filters-backdrop ${filtersOpen ? 'shop-filters-backdrop--open' : ''}`}
                aria-label="Close filters"
                onClick={() => setFiltersOpen(false)}
            />

            <aside
                id="shop-filters-drawer"
                className={`shop-filters-drawer ${filtersOpen ? 'shop-filters-drawer--open' : ''}`}
                aria-label="Shop filters"
            >
                <div className="shop-filters__panel">
                    <div className="shop-filters__top">
                        <div className="shop-filters__header">
                            <span className="shop-filters__eyebrow">Filters</span>
                            <h2 className="shop-filters__title">Refine results</h2>
                        </div>
                        <button
                            type="button"
                            className="shop-filters__close"
                            aria-label="Close filters"
                            onClick={() => setFiltersOpen(false)}
                        >
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>

                    <details className="shop-filters__group" open>
                        <summary className="shop-filters__summary">By Price</summary>
                        <div className="shop-filters__content">
                            <label className="shop-filters__option">
                                <input
                                    type="radio"
                                    name="price-order"
                                    value="low-high"
                                    checked={priceOrder === 'low-high'}
                                    onChange={() => setPriceOrder('low-high')}
                                />
                                <span>Low to high</span>
                            </label>
                            <label className="shop-filters__option">
                                <input
                                    type="radio"
                                    name="price-order"
                                    value="high-low"
                                    checked={priceOrder === 'high-low'}
                                    onChange={() => setPriceOrder('high-low')}
                                />
                                <span>High to low</span>
                            </label>
                            <div className="shop-filters__range">
                                <label className="shop-filters__range-label" htmlFor="price-range">Price range</label>
                                <input
                                    id="price-range"
                                    type="range"
                                    min="0"
                                    max={maxPrice}
                                    value={priceRange}
                                    onChange={(event) => setPriceRange(Number(event.target.value))}
                                />
                                <div className="shop-filters__range-meta">
                                    <span>₹0</span>
                                    <span>{formatCurrency(maxPrice)}</span>
                                </div>
                                <span className="shop-filters__range-value">Up to {formatCurrency(priceRange)}</span>
                            </div>
                        </div>
                    </details>

                    <details className="shop-filters__group">
                        <summary className="shop-filters__summary">By Type</summary>
                        <div className="shop-filters__content">
                            <label className="shop-filters__option">
                                <input
                                    type="radio"
                                    name="item-type"
                                    value="all"
                                    checked={itemType === 'all'}
                                    onChange={() => setItemType('all')}
                                />
                                <span>All</span>
                            </label>
                            <label className="shop-filters__option">
                                <input
                                    type="radio"
                                    name="item-type"
                                    value="product"
                                    checked={itemType === 'product'}
                                    onChange={() => setItemType('product')}
                                />
                                <span>Product</span>
                            </label>
                            <label className="shop-filters__option">
                                <input
                                    type="radio"
                                    name="item-type"
                                    value="service"
                                    checked={itemType === 'service'}
                                    onChange={() => setItemType('service')}
                                />
                                <span>Service</span>
                            </label>
                        </div>
                    </details>

                    <details className="shop-filters__group" open>
                        <summary className="shop-filters__summary">By Tags</summary>
                        <div className="shop-filters__tag-list">
                            {TAGS.map((tag) => (
                                <button
                                    key={tag}
                                    type="button"
                                    className={`shop-filters__tag ${selectedTags.includes(tag) ? 'shop-filters__tag--active' : ''}`}
                                    onClick={() => toggleTag(tag)}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </details>

                    <button
                        type="button"
                        className="shop-filters__clear"
                        onClick={handleClearFilters}
                    >
                        Clear filters
                    </button>
                </div>
            </aside>

            <section className="shop-section" id="products">
                <div className="shop-container">
                    <h2 className="shop-section__title">Explore Products</h2>
                    <div className="shop-grid shop-grid--products">
                        {filteredProducts.map(product => {
                            const ratingValue = formatRating(product.rating)
                            const ratingStars = getStarStates(product.rating)
                            const reviewLabel = `${product.reviews} Reviews`

                            return (
                                <div key={product.id} id={`shop-item-${product.id}`} className="amazon-card amazon-card--product">
                                    <div className="amazon-card__image-wrapper">
                                        <img src={product.image} alt={product.name} className="amazon-card__image" />
                                    </div>
                                    <div className="amazon-card__content">
                                        <h3 className="amazon-card__title">{product.name}</h3>
                                        <div className="amazon-card__details">
                                            <p className="amazon-card__desc">{product.description}</p>
                                            <div className="amazon-card__meta">
                                                <div
                                                    className="amazon-card__rating"
                                                    role="img"
                                                    aria-label={`Rated ${ratingValue} out of 5`}
                                                >
                                                    <span className="amazon-card__rating-stars" aria-hidden="true">
                                                        {ratingStars.map((state, index) => (
                                                            <span
                                                                key={`${product.id}-star-${index}`}
                                                                className={`amazon-card__star amazon-card__star--${state}`}
                                                            >
                                                                ★
                                                            </span>
                                                        ))}
                                                    </span>
                                                    <span className="amazon-card__rating-text">{ratingValue}</span>
                                                </div>
                                                <span className="amazon-card__reviews amazon-card__meta-item--right" aria-label={reviewLabel}>
                                                    ({reviewLabel})
                                                </span>
                                                <div className="amazon-card__price">
                                                    <span className="amazon-card__price-label">Starting from</span>
                                                    <span className="amazon-card__price-value">{product.price}</span>
                                                </div>
                                                <div className="amazon-card__discount amazon-card__meta-item--right">
                                                    <span className="amazon-card__discount-label">Discount</span>
                                                    <span className="amazon-card__discount-value">{product.discount}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="amazon-card__action">
                                            <Link to={`/products/${product.id}`} className="amazon-card__button amazon-card__button--learn-more">
                                                Learn More
                                            </Link>
                                            <Link to={product.id === 'genesetu' ? `/subscribe/genesetu` : `/shop/${product.id}`} className="amazon-card__button">
                                                {product.id === 'genesetu' ? 'Subscribe Now' : 'Buy Now'}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        {filteredProducts.length === 0 && (
                            <p className="shop-empty">No products match your filters.</p>
                        )}
                    </div>
                </div>
            </section>

            <div className="shop-divider" />

            <section className="shop-section" id="services">
                <div className="shop-container">
                    <h2 className="shop-section__title">Explore Services</h2>
                    <div className="shop-grid shop-grid--services">
                        {filteredServices.map(service => {
                            const ratingValue = formatRating(service.rating)
                            const ratingStars = getStarStates(service.rating)
                            const reviewLabel = `${service.reviews} Reviews`
                            const cartQuantity = getCartQuantity(service.id)

                            return (
                                <div key={service.id} id={`shop-item-${service.id}`} className="amazon-card amazon-card--service">
                                    <Link
                                        to={`/service/${service.id}`}
                                        className="amazon-card__image-link"
                                        aria-label={`View ${service.name} details`}
                                    >
                                        <div className="amazon-card__image-wrapper">
                                            <img src={service.image} alt={service.name} className="amazon-card__image" />
                                        </div>
                                    </Link>
                                    <div className="amazon-card__content">
                                        <h3 className="amazon-card__title">
                                            <Link
                                                to={`/service/${service.id}`}
                                                className="amazon-card__title-link"
                                            >
                                                {service.name}
                                            </Link>
                                        </h3>
                                        <div className="amazon-card__details">
                                            <p className="amazon-card__desc">{service.description}</p>
                                            <div className="amazon-card__meta">
                                                <div
                                                    className="amazon-card__rating"
                                                    role="img"
                                                    aria-label={`Rated ${ratingValue} out of 5`}
                                                >
                                                    <span className="amazon-card__rating-stars" aria-hidden="true">
                                                        {ratingStars.map((state, index) => (
                                                            <span
                                                                key={`${service.id}-star-${index}`}
                                                                className={`amazon-card__star amazon-card__star--${state}`}
                                                            >
                                                                ★
                                                            </span>
                                                        ))}
                                                    </span>
                                                    <span className="amazon-card__rating-text">{ratingValue}</span>
                                                </div>
                                                <span className="amazon-card__reviews amazon-card__meta-item--right" aria-label={reviewLabel}>
                                                    ({reviewLabel})
                                                </span>
                                                <div className="amazon-card__price">
                                                    <span className="amazon-card__price-label">Starting from</span>
                                                    <span className="amazon-card__price-value">{service.price}</span>
                                                </div>
                                                <div className="amazon-card__discount amazon-card__meta-item--right">
                                                    <span className="amazon-card__discount-label">Discount</span>
                                                    <span className="amazon-card__discount-value">{service.discount}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="amazon-card__action">
                                            {cartQuantity > 0 ? (
                                                <div
                                                    className="amazon-card__quantity"
                                                    role="group"
                                                    aria-label={`${service.name} cart quantity`}
                                                >
                                                    <button
                                                        type="button"
                                                        className="amazon-card__quantity-btn"
                                                        aria-label="Decrease quantity"
                                                        onClick={(e) => handleUpdateQuantity(e, service, -1)}
                                                    >
                                                        −
                                                    </button>
                                                    <span className="amazon-card__quantity-value" aria-live="polite">
                                                        {cartQuantity}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        className="amazon-card__quantity-btn"
                                                        aria-label="Increase quantity"
                                                        onClick={(e) => handleUpdateQuantity(e, service, 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="amazon-card__button amazon-card__button--service"
                                                    onClick={(e) => handleAddToCart(e, service)}
                                                >
                                                    Add to cart
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        {filteredServices.length === 0 && (
                            <p className="shop-empty">No services match your filters.</p>
                        )}
                    </div>
                </div>
            </section>
        </main>
    )
}
