import React from 'react';
import { X } from 'lucide-react';
import { Sidebar } from './Sidebar';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative flex flex-col w-72 max-w-[85vw] h-full bg-white shadow-2xl z-10 animate-slide-right">
        <div className="absolute top-3.5 right-3.5 z-20">
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="h-full">
          <Sidebar onNavClick={onClose} />
        </div>
      </div>
    </div>
  );
};
