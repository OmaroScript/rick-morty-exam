'use client';

import { useEffect, useRef, useState } from 'react';
import type { FavoriteRecord } from '@/types/character';
import styles from './FavsButton.module.css';

interface FavsButtonProps {
  favorites: FavoriteRecord[];
  onSelectFavorite?: (characterId: number) => void;
}

export default function FavsButton({
  favorites,
  onSelectFavorite,
}: FavsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.container} ref={ref}>
      {isOpen && favorites.length > 0 && (
        <ul className={styles.dropdown}>
          {favorites.map(fav => (
            <li key={fav.id}>
              <button
                className={styles.dropdownItem}
                onClick={() => {
                  onSelectFavorite?.(fav.characterId);
                  setIsOpen(false);
                }}
              >
                {fav.name.toUpperCase()}
              </button>
            </li>
          ))}
        </ul>
      )}
      <button
        className={styles.button}
        onClick={() => setIsOpen(prev => !prev)}
        aria-label="FAVS"
      >
        <span>FAVS</span>
        {favorites.length > 0 && (
          <span key={favorites.length} className={styles.badge}>
            {favorites.length}
          </span>
        )}
      </button>
    </div>
  );
}
