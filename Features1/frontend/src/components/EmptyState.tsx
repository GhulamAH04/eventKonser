export default function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center text-gray-500">
      <div className="text-6xl mb-4">🗂️</div>
      <p>{message}</p>
    </div>
  );
}
// Cara pakai EmptyState di Transaction Page dan Events Page
// contoh: {transactions.length === 0 ? (<EmptyState message="No transactions found." />) : (...)}
