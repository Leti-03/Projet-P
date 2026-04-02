import React from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="at-card" style={{ width: '500px', padding: '25px', position: 'relative' }}>
        <X size={20} style={{ position: 'absolute', right: '20px', top: '20px', cursor: 'pointer' }} onClick={onClose} />
        <h2 style={{ marginTop: 0 }}>{title}</h2>
        {children}
      </div>
    </div>
  );
}