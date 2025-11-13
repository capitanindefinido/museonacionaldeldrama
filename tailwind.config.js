/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        drama: {
          'primary': '#FF00A0',
          'secondary': '#00BFFF',
          'accent': '#F9D57E',
          'neutral': '#1a1a2e',
          'base-100': '#0A0A1A',
          'base-200': '#1a1a2e',
          'base-300': '#2a2a3e',
          'info': '#00BFFF',
          'success': '#00ff88',
          'warning': '#ffaa00',
          'error': '#ff0044',
        },
      },
    ],
  },
};

