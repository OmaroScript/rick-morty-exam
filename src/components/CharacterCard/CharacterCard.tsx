'use client';

import Image from 'next/image';
import type { Character, FavoriteRecord } from '@/types/character';
import styles from './CharacterCard.module.css';

interface CharacterCardProps {
  character: Character;
  isSelected: boolean;
  favorites: FavoriteRecord[];
  onSelect: (character: Character) => void;
  onToggleFavorite: (character: Character) => void;
}

export default function CharacterCard({
  character,
  isSelected,
  favorites,
  onSelect,
  onToggleFavorite,
}: CharacterCardProps) {
  const isFavorite = favorites.some(f => f.characterId === character.id);

  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      onClick={() => onSelect(character)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onSelect(character)}
      aria-pressed={isSelected}
    >
      <p className={styles.name}>{character.name.toUpperCase()}</p>
      <div className={styles.imageWrapper}>
        <Image
          src={character.image}
          alt={character.name}
          fill
          sizes="(max-width: 768px) 45vw, 150px"
          className={styles.image}
        />
      </div>
      <button
        className={`${styles.likeButton} ${isFavorite ? styles.liked : ''}`}
        onClick={e => {
          e.stopPropagation();
          onToggleFavorite(character);
        }}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <svg
          viewBox="0 0 24 24"
          fill={isFavorite ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <span>Like</span>
      </button>
    </div>
  );
}
