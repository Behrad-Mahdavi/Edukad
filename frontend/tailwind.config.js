/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Rokad Brand Tokens
        primary: {
          DEFAULT: '#21295a', // Navy (Engineers)
          dark: '#161c3d',
          light: '#2d3775',
        },
        secondary: {
          DEFAULT: '#58bdaf', // Teal CTA
          dark: '#347e75',
          light: '#72c8bc',
        },
        accent: {
          DEFAULT: '#e0195b', // Magenta (Artists)
          dark: '#be144d',
          light: '#e7477c',
        },
        tertiary: {
          DEFAULT: '#f4971f', // Amber/Orange (Operations / Ops)
          dark: '#d17d12',
          light: '#f7ac4c',
        },
        ink: {
          DEFAULT: '#292827',
          light: '#5a5856',
        },
        bg: {
          mint: '#f2faf9',
          blush: '#fefafb',
          lavender: '#f4f5fb',
          neutral: '#f6f6f6',
        },
        // Node Status Semantic Colors (independent from departments)
        node: {
          locked: '#64748b',
          unlocked: '#0284c7',
          progress: '#0d9488',
          submitted: '#ea580c',
          revision: '#e11d48',
          completed: '#059669',
        },
      },
      fontFamily: {
        sans: ['IRANSansX', 'Montserrat', 'Vazirmatn', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        sticker: '6px 8px 0 0 currentColor',
        'sticker-primary': '6px 8px 0 0 #21295a',
        'sticker-secondary': '6px 8px 0 0 #58bdaf',
        'sticker-accent': '6px 8px 0 0 #e0195b',
        'sticker-tertiary': '6px 8px 0 0 #f4971f',
        'sticker-sm': '3px 4px 0 0 currentColor',
        'sticker-lg': '8px 12px 0 0 currentColor',
      },
      borderRadius: {
        asymm: '1.5rem 0.5rem 1.5rem 0.5rem',
        'asymm-lg': '2.5rem 0.75rem 2.5rem 0.75rem',
      },
    },
  },
  plugins: [],
};
