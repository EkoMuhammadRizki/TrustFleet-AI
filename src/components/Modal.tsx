"use client";
import { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export default function Modal({ open, onClose, children, title }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0b1c30]/40 backdrop-blur-sm modal-backdrop"
        onClick={onClose}
      />
      {/* Content */}
      <div className="relative bg-white rounded-[28px] shadow-2xl max-w-lg w-full mx-4 modal-content overflow-hidden">
        {title && (
          <div className="px-8 pt-8 pb-4 flex items-center justify-between">
            <h3 className="font-[var(--font-jakarta)] text-[20px] font-bold text-[#0b1c30]">{title}</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-[#eff4ff] flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-[#747687]">close</span>
            </button>
          </div>
        )}
        <div className="px-8 pb-8">{children}</div>
      </div>
    </div>
  );
}
