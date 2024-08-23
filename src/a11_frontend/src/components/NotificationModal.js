import React from 'react';
import { IoMdClose } from 'react-icons/io';

const NotificationModal = ({ isOpen, onClose, status, txHash, explorerUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full relative">
        {/* Close icon */}
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <IoMdClose size={24} />
        </button>

        <h2 className={`text-2xl font-bold mb-4 text-indigo-700`}>
          {status === 'success' ? 'Transaction Successful' : 'Transaction Failed'}
        </h2>
        <p className="mb-4">
          {status === 'success' 
            ? 'Your bridge transaction was successful.' 
            : 'There was an error processing your bridge transaction.'}
        </p>
        {status === 'success' && txHash && (
          <a 
            href={`${explorerUrl}/tx/${txHash}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition duration-200 block text-center"
          >
            Go to Blockchain Explorer
          </a>
        )}
        {status === 'error' && (
          <button
            onClick={onClose}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition duration-200"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationModal;