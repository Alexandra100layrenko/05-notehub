import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ onClose, children }: ModalProps) {

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if(e.target === e.currentTarget){
      onClose();
    }
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    }
  }, [onClose]);


  return createPortal(
    <div
      className={styles.backdrop}
      onClick={handleClick}
      role="dialog"
      aria-label="Close modal">
      <div className={styles.modal}>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')!
  );
}
