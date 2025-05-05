🎤 TEMPLATE DEMO PRESENTASI: EventKonser 🎶

1. Opening

"Selamat [pagi/siang/sore], nama saya [Nama Kamu].
Hari ini saya akan mendemokan hasil mini project saya yang berjudul EventKonser,
sebuah platform sederhana untuk event management dan penjualan tiket konser."

2. Problem Statement

"Banyak penyelenggara konser membutuhkan platform yang memudahkan:

Membuat event
Menjual tiket
Mengelola pembayaran
Menerima review peserta
Demikian juga peserta konser membutuhkan:
Tempat untuk mencari event
Membeli tiket dengan mudah
Memberikan ulasan setelah event."
3. Tech Stack Overview

Frontend: Next.js (React 19) + TailwindCSS
Backend: Express.js + Prisma ORM + Supabase PostgreSQL
Tools: Axios, React-hot-toast, Prettier, ESLint
4. Demo Live (Flow Project)

🎯 A. Landing Page

Menampilkan daftar event upcoming
Search Bar + Filter Category/Location
Promo of the Week Section
🎯 B. Event Browsing

Klik salah satu event ➔ masuk ke detail event
Tampilkan:
Nama Event
Deskripsi
Lokasi
Harga (Gratis / Berbayar)
Link ke Organizer Profile
🎯 C. Event Creation

Login sebagai Event Organizer
Membuat event baru: input nama, harga, tanggal mulai, tanggal akhir, seats, deskripsi
Bisa menambahkan promo voucher
🎯 D. Transaksi Tiket

Beli tiket event
Muncul pembayaran, upload bukti pembayaran
Countdown 2 jam jika tidak upload, otomatis expired
Organizer dapat mengkonfirmasi / menolak pembayaran
Rollback seat/voucher kalau transaksi expired atau dibatalkan
🎯 E. Review Event

Setelah event selesai, pelanggan dapat memberikan rating dan review event
Organizer Profile menampilkan review dan rating dari customer
5. Feature Mapping ke Requirements

✅ Landing page + Event list
✅ Search + Filter
✅ Event Detail
✅ Event Creation
✅ Payment Proof upload
✅ Auto cancel 2 jam + 3 hari
✅ Point discount system
✅ Review system
✅ Organizer Profile
✅ Semua transaksi harga IDR
✅ Mobile Responsive + Animasi smooth
6. Closing

"Demikian demo dari project EventKonser.
Semua core requirements sudah berhasil diimplementasikan sesuai instruksi tugas.
Project ini dibuat modular, responsive, dan maintainable."

"Terima kasih atas perhatiannya.
Saya siap menerima pertanyaan atau masukan." 🙏

📋 Tips saat Live Demo


Tips	Keterangan
Siapkan browser 2 tab	1 tab user view, 1 tab admin/organizer view
Siapkan akun organizer untuk testing buat event	✅
Siapkan event dummy untuk transaksi testing	✅
Saat upload bukti pembayaran, tunjukkan countdown	✅
Ulasan reviewer: highlight fitur Review di organizer profile	✅
Bicara santai, tapi terstruktur	✅
