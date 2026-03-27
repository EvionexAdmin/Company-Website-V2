import { useEffect, useMemo } from 'react'

const BASE_URL = 'https://www.evionex.com'
const HASH_BASE = `${BASE_URL}/#/`

const upsertMeta = ({ key, attr, value }) => {
    if (!value) return
    const selector = attr === 'property'
        ? `meta[property="${key}"]`
        : `meta[name="${key}"]`
    let tag = document.head.querySelector(selector)
    if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute(attr, key)
        document.head.appendChild(tag)
    }
    tag.setAttribute('content', value)
}

const upsertLink = (rel, href) => {
    if (!href) return
    let link = document.head.querySelector(`link[rel="${rel}"]`)
    if (!link) {
        link = document.createElement('link')
        link.setAttribute('rel', rel)
        document.head.appendChild(link)
    }
    link.setAttribute('href', href)
}

/**
 * Lightweight head manager for SPA routes.
 * Adds titles, meta tags, canonicals, social tags, and JSON-LD.
 */
export default function usePageMetadata({
    title,
    description,
    robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    canonicalPath = '/',
    image,
    ogType = 'website',
    additionalMeta = [],
    jsonLd = [],
}) {
    const canonicalUrl = useMemo(() => {
        const normalized = canonicalPath === '/' ? '' : canonicalPath.replace(/^\//, '')
        return `${HASH_BASE}${normalized}`
    }, [canonicalPath])

    useEffect(() => {
        if (title) document.title = title

        upsertMeta({ key: 'description', attr: 'name', value: description })
        upsertMeta({ key: 'robots', attr: 'name', value: robots })
        upsertMeta({ key: 'googlebot', attr: 'name', value: robots })

        upsertLink('canonical', canonicalUrl)

        upsertMeta({ key: 'og:type', attr: 'property', value: ogType })
        upsertMeta({ key: 'og:title', attr: 'property', value: title })
        upsertMeta({ key: 'og:description', attr: 'property', value: description })
        upsertMeta({ key: 'og:url', attr: 'property', value: canonicalUrl })
        upsertMeta({ key: 'og:image', attr: 'property', value: image })
        upsertMeta({ key: 'og:site_name', attr: 'property', value: 'Evionex' })

        upsertMeta({ key: 'twitter:card', attr: 'name', value: 'summary_large_image' })
        upsertMeta({ key: 'twitter:title', attr: 'name', value: title })
        upsertMeta({ key: 'twitter:description', attr: 'name', value: description })
        upsertMeta({ key: 'twitter:image', attr: 'name', value: image })

        additionalMeta.forEach((meta) => {
            if (!meta?.name || !meta?.content) return
            upsertMeta({ key: meta.name, attr: meta.property ? 'property' : 'name', value: meta.content })
        })

        // Remove previously injected JSON-LD and add fresh ones for this view
        document.head.querySelectorAll('[data-dynamic-jsonld="true"]').forEach((node) => node.remove())
        jsonLd.forEach((entry, idx) => {
            const script = document.createElement('script')
            script.type = 'application/ld+json'
            script.dataset.dynamicJsonld = 'true'
            script.textContent = JSON.stringify(entry)
            script.id = `jsonld-${idx}`
            document.head.appendChild(script)
        })

        return () => {
            // Clean up JSON-LD on unmount; meta tags are overwritten by next route
            document.head.querySelectorAll('[data-dynamic-jsonld="true"]').forEach((node) => node.remove())
        }
    }, [title, description, robots, canonicalUrl, image, ogType, additionalMeta, jsonLd])
}
