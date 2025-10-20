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
    return () => {
      document.body.style.overflow = original;
    };
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
    <>
      {/* Бекдроп как button — полностью интерактивный */}
      <button
        type="button"
        className={styles.backdrop}
        onClick={onClose}
        aria-label="Close modal"
      />

      <div className={styles.modal}>
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
    </>,
    document.getElementById('modal-root')!
  );
}
