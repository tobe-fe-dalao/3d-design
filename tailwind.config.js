module.exports = {
  purge: [],
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width: {
        "100px": "100px",
      },
      height: {
        "100px": "100px",
      },
    },
    backgroundColor: (theme) => ({
      ...theme("colors"),
      primary: "#f1f4fb",
    }),
  },
  plugins: [],
};
