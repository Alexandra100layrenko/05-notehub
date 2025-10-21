// src/components/Modal/Modal.tsx
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  // Блокировка прокрутки при открытом модальном окне
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = isOpen ? 'hidden' : original;
    return () => { document.body.style.overflow = original; };
  }, [isOpen]);

  // Закрытие по Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.wrapper}>
      {/* Бекдроп */}
      <button
        type="button"
        className={styles.backdrop}
        onClick={onClose}
        aria-label="Close modal"
      />

      {/* Модалка */}
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')!
  );
}
