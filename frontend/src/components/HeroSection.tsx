'use client';

export default function HeroSection() {
  return (
    <section className="w-full flex flex-col items-center text-center bg-gradient-to-b from-sky-100 to-sky-200 py-20 px-4 rounded-b-3xl shadow-inner animate-fade-in">
      <h1 className="text-4xl md:text-5xl font-extrabold text-sky-700 mb-4 leading-tight">
        Temukan Tiket Konser Impianmu 🎶
      </h1>
      <p className="text-lg text-sky-600 max-w-2xl">
        Cari event seru di kotamu dan nikmati pengalaman konser tak terlupakan dengan eventKonser!
      </p>
    </section>
  );
}