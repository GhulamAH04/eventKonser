export default function SearchBar() {
  return (
    <div className="w-full max-w-2xl">
      <input
        type="text"
        placeholder="Search events..."
        className="w-full p-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-400 outline-none"
      />
    </div>
  );
}
