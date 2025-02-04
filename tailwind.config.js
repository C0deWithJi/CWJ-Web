module.exports = {
    theme: {
      extend: {
        colors: {
          brand: '#2563eb',
          accent: '#059669',
        }
      }
    },
    // Add custom utilities via plugins (optional)
  plugins: [
    tailwindcss: {},
    autoprefixer: {},
    function({ addUtilities }) {
      addUtilities({
        '.carousel::-webkit-scrollbar': {
          'height': '8px',
        },
        '.carousel::-webkit-scrollbar-thumb': {
          'background': '#d1d5db',
          'border-radius': '4px',
        },
      });
    }
  ]
}

