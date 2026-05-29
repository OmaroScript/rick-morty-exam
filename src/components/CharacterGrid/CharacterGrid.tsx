'use client';

import type { Character, FavoriteRecord } from '@/types/character';
import CharacterCard from '../CharacterCard/CharacterCard';
import styles from './CharacterGrid.module.css';

interface CharacterGridProps {
  characters: Character[];
  selectedId: number | null;
  favorites: FavoriteRecord[];
  onSelect: (character: Character) => void;
  onToggleFavorite: (character: Character) => void;
}

export default function CharacterGrid({
  characters,
  selectedId,
  favorites,
  onSelect,
  onToggleFavorite,
}: CharacterGridProps) {
  if (characters.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No characters found</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {characters.map(character => (
        <CharacterCard
          key={character.id}
          character={character}
          isSelected={character.id === selectedId}
          favorites={favorites}
          onSelect={onSelect}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
