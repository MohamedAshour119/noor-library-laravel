/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/**/*.blade.php',
        './resources/**/*.js',
        './resources/**/*.vue',
        './resources/frontend/src/**/*.{js,jsx,ts,tsx}',
        './resources/views/**/*.blade.php',
    ],
    theme: {
        extend: {
            colors: {
                main_color: "#45B09E",
                second_main_color: "#5ec5dd",
                main_color_placeholder: "rgba(69,176,158,0.38)",
                main_color_darker: "#00786D",
                text_color: "#444444",
                border_color: "#E8E8E8",
                main_bg: "#F1F1F1",
                input_bg: "#FAFAFA",
                disable_color: "#D2CFCF",
                table_border: "#cfcfcf",

                // Dark mode
                dark_main_color: "#222831",
                dark_second_color: "#31363F",
                dark_border_color: "#464d5b",
                dark_icon_color: "#6b758a",
                dark_text_color: "#e0e0e0",
            },
        },
        screens: {
            'max-502': { max: '502px' },
            'min-503': { min: '503px' },
            'min-513': { min: '513px' },
            'max-527': { max: '527px' },
            'xxxs': '360px',
            'xxs': '445px',
            'xs': '500px',
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1536px',
            '3xl': '1700px',
        },
    },
    plugins: [],
};
