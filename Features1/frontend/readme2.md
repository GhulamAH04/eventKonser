🎵 EventKonser — Concert Ticketing Platform

📋 Project Overview

EventKonser adalah platform penjualan tiket konser berbasis web.
Pengguna dapat menemukan event, membeli tiket, mengunggah bukti pembayaran, memberi ulasan event, serta melihat profil organizer.

🎯 Fitur Sesuai Requirements

Feature 1 — Event Discovery, Details, Creation, and Promotion (4 points)
✅ Landing Page menampilkan daftar event
✅ Event Browsing: filter berdasarkan kategori dan lokasi
✅ Search Bar dengan debounce 300ms
✅ Responsive Design (mobile, tablet, desktop)
✅ Event Creation: Organizer dapat membuat event dengan field nama, harga, tanggal mulai, tanggal selesai, jumlah kursi, deskripsi
✅ Event dapat berupa Free atau Paid
✅ Event Organizer dapat membuat voucher promo untuk event tertentu
Feature 2 — Event Transaction (4 points)
✅ Pelanggan dapat membeli tiket event
✅ Status transaksi: waiting_payment, waiting_confirm, done, rejected, expired, canceled
✅ Upload bukti pembayaran dengan countdown 2 jam
✅ Auto-cancel transaksi 3 hari jika tidak dikonfirmasi organizer
✅ Rollback voucher/point/seat saat transaksi dibatalkan atau expired
✅ Penggunaan point untuk mengurangi harga pembelian
✅ Semua harga hanya menggunakan IDR
Feature 3 — Event Reviews and Ratings (2 points)
✅ Pelanggan hanya bisa meninggalkan review setelah mengikuti event
✅ Organizer profile menampilkan rating dan ulasan dari peserta
🏗 Tech Stack


Layer	Stack
Frontend	Next.js (App Router), React 19, TailwindCSS, Axios, React-hot-toast
Backend	Express.js, Prisma ORM, PostgreSQL (Supabase), Multer, Node-cron
Development Tools	Prettier, ESLint, Husky (optional setup)
📂 Struktur Project

eventKonser/
├── frontend/
│   └── src/
│       ├── app/           # Halaman Next.js
│       ├── components/    # Komponen UI modular
│       ├── features/      # Event, transaction, organizer, review services
│       ├── interfaces/    # Interface TypeScript terpisah
│       └── lib/           # Axios instance
├── backend/
│   ├── prisma/            # Prisma schema dan migrations
│   └── src/
│       ├── controllers/   # Event, transaction, organizer, review controllers
│       ├── routes/        # Routing API Express
│       ├── services/      # Business logic service layer
│       └── jobs/          # Node-cron job untuk auto-cancel
📝 Notes

Menggunakan mata uang IDR untuk semua transaksi.
Search bar mengimplementasikan debounce untuk UX yang lebih halus.
Implementasi Promo Section di Landing Page.
Integrasi Review system untuk Event Organizer.
Animasi smooth fade-in diterapkan di halaman.
Struktur code clean dan maintainable.
Semua pages sudah responsive.
🚀 Repository Link

https://github.com/GhulamAH04/eventKonser
📢 Closing Statement

Project ini dikembangkan untuk memenuhi seluruh requirements mini project bootcamp.
Semua fitur utama dan tambahan telah diterapkan sesuai spesifikasi tugas.

Terima kasih atas kesempatan dan bimbingannya! 🙏✨

