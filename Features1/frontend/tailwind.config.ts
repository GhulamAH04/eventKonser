import { type Config } from "tailwindcss";
import forms from '@tailwindcss/forms'; // Plugin untuk form input agar langsung style dengan Tailwind
import typography from '@tailwindcss/typography'; // Plugin untuk konten teks panjang (misalnya artikel atau deskripsi event)

// Konfigurasi utama TailwindCSS
const config: Config = {
  content: [
    // Path ke semua file yang menggunakan class Tailwind. Ini penting untuk purging CSS yang tidak dipakai.
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Menambahkan font custom untuk kebutuhan desain eventKonser
        // 'sans' untuk teks umum (body)
        sans: ['Open Sans', 'sans-serif'],
        // 'display' untuk heading, judul event, dan branding utama
        display: ['Montserrat', 'sans-serif'],
      },
      keyframes: {
        // Keyframe animasi: efek fade-in sederhana
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        // Keyframe animasi: elemen masuk dari atas dengan transisi halus
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        // Mendaftarkan animasi ke dalam Tailwind agar bisa dipakai sebagai class utilitas
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'fade-in-down': 'fade-in-down 0.7s ease-out forwards',
      },
    },
  },
  plugins: [
    forms,      // Plugin Tailwind untuk form, mempermudah styling input, select, dsb.
    typography, // Plugin untuk membuat konten teks panjang
  ],
};

export default config;
