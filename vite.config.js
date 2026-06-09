import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [react(), tailwindcss()],
    base: '/',
    resolve: {
        alias: {
            '@': '/src',
        },
    },
    build: {
        // Never expose source maps to production — prevents code leaks
        sourcemap: false,
        // Split vendor chunks to improve cacheability
        rollupOptions: {
            output: {
                manualChunks: {
                    react: ['react', 'react-dom'],
                    router: ['react-router-dom'],
                    supabase: ['@supabase/supabase-js'],
                    motion: ['framer-motion', 'gsap'],
                },
            },
        },
    },
})
