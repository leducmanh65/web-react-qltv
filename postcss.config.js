// postcss.config.js
export default {
  plugins: {
    // THAY THẾ: tailwindcss: {},
    // BẰNG:
    '@tailwindcss/postcss': {}, 
    
    // Giữ nguyên autoprefixer
    autoprefixer: {},
  },
}