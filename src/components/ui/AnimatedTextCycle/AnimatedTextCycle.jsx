import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import './AnimatedTextCycle.css'

export default function AnimatedTextCycle({
    words,
    interval = 3000,
    className = '',
}) {
    const safeWords = useMemo(() => (Array.isArray(words) ? words.filter(Boolean) : []), [words])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [viewportWidth, setViewportWidth] = useState('auto')
    const measureRef = useRef(null)

    useEffect(() => {
        if (safeWords.length === 0) return
        setCurrentIndex((prev) => (prev >= safeWords.length ? 0 : prev))
    }, [safeWords.length])

    useEffect(() => {
        if (!measureRef.current || safeWords.length === 0) return

        const measureMaxWidth = () => {
            if (!measureRef.current) return

            const elements = Array.from(measureRef.current.children)
            if (elements.length === 0) return

            const maxWidth = elements.reduce((largest, element) => {
                const width = element.getBoundingClientRect().width
                return Math.max(largest, width)
            }, 0)

            setViewportWidth(`${Math.ceil(maxWidth)}px`)
        }

        measureMaxWidth()

        window.addEventListener('resize', measureMaxWidth)
        return () => {
            window.removeEventListener('resize', measureMaxWidth)
        }
    }, [safeWords.length])

    useEffect(() => {
        if (safeWords.length <= 1) return

        const timer = window.setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % safeWords.length)
        }, interval)

        return () => window.clearTimeout(timer)
    }, [currentIndex, interval, safeWords.length])

    if (safeWords.length === 0) return null

    const variants = {
        hidden: {
            y: -20,
            opacity: 0,
            filter: 'blur(8px)',
        },
        visible: {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            transition: {
                duration: 0.42,
                ease: 'easeOut',
            },
        },
        exit: {
            y: 20,
            opacity: 0,
            filter: 'blur(8px)',
            transition: {
                duration: 0.3,
                ease: 'easeIn',
            },
        },
    }

    return (
        <span className="hero-text-cycle" aria-label={safeWords.join(' ')}>
            <span ref={measureRef} aria-hidden="true" className="hero-text-cycle__measure">
                {safeWords.map((word) => (
                    <span key={word} className={`hero-text-cycle__measure-word ${className}`}>{word}</span>
                ))}
            </span>

            <motion.span
                className="hero-text-cycle__viewport"
                animate={{
                    width: viewportWidth,
                    transition: {
                        duration: 0.2,
                        ease: 'easeOut',
                    },
                }}
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                        key={`${currentIndex}-${safeWords[currentIndex]}`}
                        className={`hero-text-cycle__word ${className}`}
                        variants={variants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        style={{ whiteSpace: 'nowrap' }}
                    >
                        {safeWords[currentIndex]}
                    </motion.span>
                </AnimatePresence>
            </motion.span>
        </span>
    )
}
