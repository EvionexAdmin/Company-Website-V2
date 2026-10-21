/**
 * Normalises a `redirect` query parameter into a path that is safe to hand to
 * the router or to Supabase's `redirectTo`.
 *
 * Returns `null` for anything that is not a same-site absolute path. A hash
 * that is not itself a route (for example the `#access_token=...` fragment an
 * implicit OAuth callback leaves behind) is dropped, so an expired token is
 * never copied into a new URL.
 */
export function safeRedirectPath(value) {
    if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) {
        return null
    }

    const hashIndex = value.indexOf('#')
    if (hashIndex === -1) return value

    const hash = value.slice(hashIndex)
    return hash.startsWith('#/') ? value : value.slice(0, hashIndex)
}
