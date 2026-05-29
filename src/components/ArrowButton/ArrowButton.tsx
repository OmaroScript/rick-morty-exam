'use client';

import styles from './ArrowButton.module.css';

interface ArrowButtonProps {
  direction: 'up' | 'down';
  onClick: () => void;
  disabled?: boolean;
}

export default function ArrowButton({
  direction,
  onClick,
  disabled = false,
}: ArrowButtonProps) {
  return (
    <button
      className={styles.button}
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'up' ? 'Previous characters' : 'Next characters'}
    >
      {direction === 'up' ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18,15 12,9 6,15" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6,9 12,15 18,9" />
        </svg>
      )}
    </button>
  );
}
