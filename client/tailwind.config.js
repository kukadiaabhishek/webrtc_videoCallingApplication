// tailwind.config.js
export default {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}',  // Add your project file types and paths
    './public/index.html',               // Include HTML files if needed
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',  // Include all your React component paths
    './public/index.html',         // Include public HTML files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
