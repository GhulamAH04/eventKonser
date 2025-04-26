"use client";

type Props = {
  id: string;
  onConfirm: (id: string, action: "accept" | "reject") => void;
};

export default function ConfirmButton({ id, onConfirm }: Props) {
  return (
    <div className="mt-2 space-x-2">
      <button
        onClick={() => onConfirm(id, "accept")}
        className="bg-green-600 text-white px-3 py-1 rounded"
      >
        Accept
      </button>
      <button
        onClick={() => onConfirm(id, "reject")}
        className="bg-red-600 text-white px-3 py-1 rounded"
      >
        Reject
      </button>
    </div>
  );
}
