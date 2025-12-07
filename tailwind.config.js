/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary-orange': '#FF9A5A',
                'primary-orange-dark': '#FF7F3F',
                'dark-navy': '#1a2e4a',
            },
            boxShadow: {
                'light': '0 1px 3px rgba(0, 0, 0, 0.08)',
                'medium': '0 4px 12px rgba(0, 0, 0, 0.12)',
            },
            spacing: {
                'sidebar': '6.5rem',
                'panel': '360px',
            },
            fontSize: {
                'xs': '12px',
                'sm': '13px',
                'base': '14px',
            }
        },
    },
    plugins: [],
}
