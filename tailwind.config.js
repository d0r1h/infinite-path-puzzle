/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'path-blue': '#1E90FF',
                'path-dark': '#0066CC',
                'path-light': '#4DA6FF',
            },
            fontFamily: {
                'sans': ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
