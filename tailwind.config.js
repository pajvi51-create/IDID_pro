import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/**/*.blade.php',
        './resources/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["'LINE Seed Sans TH'", 'sans-serif', ...defaultTheme.fontFamily.sans],
                'line-seed': ["'LINE Seed Sans TH'", 'sans-serif'],
                prompt: ["'LINE Seed Sans TH'", 'sans-serif'],
                sarabun: ["'LINE Seed Sans TH'", 'sans-serif'],
            },
            colors: {
                brand: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    500: '#2563eb',
                    600: '#1d4ed8',
                    700: '#1e40af',
                    800: '#1e3a8a',
                    900: '#172554',
                }
            }
        },
    },
    plugins: [],
};
