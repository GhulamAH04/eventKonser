"use client";

type ConfirmModalProps = {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4 w-80">
        <h2 className="text-xl font-bold">{title}</h2>
        <p>{message}</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
