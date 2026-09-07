/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                serif: ['var(--font-playfair)', 'serif'],
                sans: ['var(--font-lato)', 'sans-serif'],
            },
            colors: {
                cabaret: {
                    50: '#fdf2f6',
                    100: '#fce7ef',
                    200: '#fad0e0',
                    300: '#f6a9c3',
                    400: '#f0749e',
                    500: '#e6457a',
                    600: '#d1225b', // Main Cabaret Red
                    700: '#b01545',
                    800: '#92153d', // Burgundy
                    900: '#7a1637',
                    950: '#43061a',
                },
                gold: {
                    50: '#fbf9eb',
                    100: '#f6f1cd',
                    200: '#ede095',
                    300: '#e3ca5d',
                    400: '#d9b430',
                    500: '#d4af37', // Classic Gold
                    600: '#b38b26',
                    700: '#8f6822',
                    800: '#765322',
                    900: '#654522',
                },
                cream: {
                    50: '#fdfbf7', // Background
                    100: '#fcf8f0',
                },
                primary: {
                    50: '#fdf2f6',
                    100: '#fce7ef',
                    200: '#fad0e0',
                    300: '#f6a9c3',
                    400: '#f0749e',
                    500: '#e6457a',
                    600: '#d1225b',
                    700: '#b01545',
                    800: '#92153d',
                    900: '#7a1637',
                },
            },
        },
    },
    plugins: [],
}
