import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const modal = (
    <dialog
      open
      className={styles.backdrop}
      onCancel={(e) => {
        e.preventDefault(); // чтобы <dialog> не закрылся автоматически
        onClose();
      }}
    >
      <button
        className={styles.backdrop}
        type="button"
        aria-label="Close modal"
        onClick={onClose}
      />
      <div className={styles.modal}>{children}</div>
    </dialog>
  );

  const mount = document.getElementById('modal-root') ?? document.body;
  return createPortal(modal, mount);
}
