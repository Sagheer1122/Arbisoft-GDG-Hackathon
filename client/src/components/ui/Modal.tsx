import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-card shadow-nurse-lg max-w-lg w-full overflow-hidden border border-[#E7E7F0]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7E7F0] bg-[#F7F7FB]">
          <h3 className="text-lg font-bold text-[#16162A]">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#707080] hover:text-[#16162A] hover:bg-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
