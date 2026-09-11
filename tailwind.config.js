/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        rachma: {
          primary: '#8BC3E6',   // Warna biru utama (Request Anda)
          secondary: '#6BAAD3', // Biru sedikit lebih gelap (untuk efek hover/klik tombol)
          soft: '#E6F2F9',      // Biru pastel sangat muda (untuk border, aksen background)
          bg: '#F8FBFC',        // Putih dengan sentuhan biru es (background halaman)
          text: '#2C4C63',      // Biru dongker/Navy gelap (teks utama, lebih elegan dari hitam)
          muted: '#7A98AB',     // Biru keabu-abuan (teks sekunder/deskripsi tambahan)
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Pastikan font yang digunakan sesuai
      },
    },
  },
  plugins: [],
};