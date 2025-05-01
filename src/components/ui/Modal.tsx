'use client';

import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/0"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-putih-100 p-6 rounded-lg shadow-lg w-11/12 max-w-md "
      >
        {children}
      </div>
    </div>
  );
}
