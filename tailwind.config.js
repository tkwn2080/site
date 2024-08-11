module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'custom-green': {
          900: '#002D00',
          700: '#004D00', // This is a lighter shade, adjust as needed
        },
      },
    },
  },
  plugins: [],
}