import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, amount, icpAddress }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-indigo-700">Confirm Bridge Transaction</h2>
        <p className="mb-2">Are you sure you want to bridge:</p>
        <p className="font-semibold mb-2">{amount} ETH</p>
        <p className="mb-2">to ICP address:</p>
        <p className="font-semibold mb-4 break-all">{icpAddress}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-indigo-700 text-white rounded hover:bg-indigo-800"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;