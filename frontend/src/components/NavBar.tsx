export default function Navbar() {
  return (
    <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
      <div className="text-2xl font-bold text-sky-500">eventKonser</div>
      <div className="flex gap-6 text-slate-700">
        <a href="#" className="hover:text-sky-500">
          Home
        </a>
        <a href="#" className="hover:text-sky-500">
          Events
        </a>
        <a href="#" className="hover:text-sky-500">
          Organizer
        </a>
      </div>
    </nav>
  );
}
