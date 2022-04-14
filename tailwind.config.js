module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  content: [],
  theme: {
    extend: {
      width: {
        '100px': '100px'
      },
      height: {
        '100px': '100px'
      }
    },
    backgroundColor: theme => ({
      ...theme('colors'),
      'primary': '#f1f4fb'
    })
  },
  plugins: [],
}
