
import React from 'react';
import { CloseIcon } from './icons/Icons';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  body: string;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, title, body }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex items-center justify-center" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4">
        <header className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><CloseIcon className="h-6 w-6" /></button>
        </header>
        <main className="p-6">
            <p className="text-gray-600">{body}</p>
        </main>
        <footer className="px-6 py-4 bg-gray-50 flex justify-end">
            <button onClick={onClose} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
                OK
            </button>
        </footer>
      </div>
    </div>
  );
};

export default InfoModal;
