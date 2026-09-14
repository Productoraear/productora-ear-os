import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'ear-blue': '#030305',
        'ear-red': '#FF2B44',
        'ear-white': '#FFFFFF',
      },
    },
  },
  plugins: [],
};

export default config;