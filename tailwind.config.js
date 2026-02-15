/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                ceramic: '#F8FAFC',
                emerald: {
                    DEFAULT: '#10B981',
                },
                azure: {
                    DEFAULT: '#0EA5E9',
                },
                scarlet: {
                    DEFAULT: '#DC2626',
                },
                ink: '#0F172A',
            },
            fontFamily: {
                serif: ['"Instrument Serif"', 'serif'],
                sans: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                'ceramic-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                'ceramic-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            }
        },
    },
    plugins: [],
}
