type Props = {
  value: string;
  onChange: (val: string) => void;
};

export default function SearchBar({ value, onChange }: Props) {
  return (
    
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search events..."
      className="w-full p-2 border rounded-md"
    />
  );
}
