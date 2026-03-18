#!/usr/bin/env node
/**
 * generate-sitemap.js
 *
 * Generates public/sitemap.xml at build time.
 * Each <lastmod> is derived from the actual filesystem mtime of the
 * corresponding source file, so the sitemap always reflects real
 * last-modified dates rather than hardcoded strings.
 *
 * Run manually:  node scripts/generate-sitemap.js
 * Run at build:  automatically via the "prebuild" npm hook
 */

import { statSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

/** Returns an ISO-8601 date string (YYYY-MM-DD) for a given file path.
 *  Falls back to today's date if the file cannot be stat'd. */
function lastmod(relPath) {
  try {
    const mtime = statSync(resolve(ROOT, relPath)).mtime
    return mtime.toISOString().split('T')[0]
  } catch {
    return new Date().toISOString().split('T')[0]
  }
}

const BASE_URL = 'https://www.evionex.com'

/**
 * Public routes only.
 * Each entry maps a URL path -> the source file whose mtime drives <lastmod>.
 * Portal / auth routes are intentionally excluded — they must not be indexed.
 */
const routes = [
  { path: '/',                      src: 'src/pages/Home.jsx',           changefreq: 'weekly',  priority: '1.0' },
  { path: '/who-we-are',            src: 'src/pages/WhoWeAre.jsx',       changefreq: 'monthly', priority: '0.8' },
  { path: '/products',              src: 'src/pages/Products.jsx',       changefreq: 'weekly',  priority: '0.9' },
  { path: '/products/genesetu',     src: 'src/pages/GeneSetuDetail.jsx', changefreq: 'monthly', priority: '0.8' },
  { path: '/products/evinote',      src: 'src/pages/EviNoteDetail.jsx',  changefreq: 'monthly', priority: '0.8' },
  { path: '/products/luminary',     src: 'src/pages/LuminaryDetail.jsx', changefreq: 'monthly', priority: '0.8' },
  { path: '/team',                  src: 'src/pages/Team.jsx',           changefreq: 'monthly', priority: '0.7' },
  { path: '/careers',               src: 'src/pages/Careers.jsx',       changefreq: 'weekly',  priority: '0.7' },
  { path: '/contact',               src: 'src/pages/Contact.jsx',        changefreq: 'monthly', priority: '0.7' },
  { path: '/pricing',               src: 'src/pages/Pricing.jsx',        changefreq: 'weekly',  priority: '0.8' },
  { path: '/privacy-policy',        src: 'src/pages/PrivacyPolicy.jsx',  changefreq: 'yearly',  priority: '0.4' },
]

const urlEntries = routes
  .map(({ path, src, changefreq, priority }) => {
    const mod = lastmod(src)
    return `
  <url>
    <loc>${BASE_URL}${path}</loc>
    <lastmod>${mod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  })
  .join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<!--
  This file is auto-generated at build time by scripts/generate-sitemap.js.
  DO NOT edit it manually — your changes will be overwritten on the next build.
  Each <lastmod> reflects the filesystem mtime of the corresponding source file.
-->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}

  <!--
    The following routes are intentionally excluded because they are
    private / authenticated pages that must not be indexed:
      /portal/login
      /portal/signup
      /portal/verify-email
      /portal/dashboard
  -->
</urlset>
`

const outPath = resolve(ROOT, 'public', 'sitemap.xml')
writeFileSync(outPath, sitemap, 'utf-8')
console.log(`✅  sitemap.xml generated → ${outPath}`)
routes.forEach(({ path, src }) =>
  console.log(`   ${path.padEnd(30)} ← ${lastmod(src)}  (${src})`)
)
