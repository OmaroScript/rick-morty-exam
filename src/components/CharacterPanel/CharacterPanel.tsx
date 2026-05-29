'use client';

import Image from 'next/image';
import type { Character } from '@/types/character';
import styles from './CharacterPanel.module.css';

interface CharacterPanelProps {
  character: Character | null;
}

const STATUS_LABEL: Record<string, string> = {
  Alive: 'LIVE',
  Dead: 'DEAD',
  unknown: 'UNKNOWN',
};

export default function CharacterPanel({ character }: CharacterPanelProps) {
  if (!character) {
    return <div className={styles.panel} />;
  }

  const statusClass =
    character.status === 'Alive'
      ? styles.alive
      : character.status === 'Dead'
      ? styles.dead
      : styles.unknown;
  const statusLabel = STATUS_LABEL[character.status] ?? 'DESCONOCIDO';

  return (
    <div className={styles.panel}>
      <div key={character.id} className={styles.imageContainer}>
        <Image
          src={character.image}
          alt={character.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={styles.image}
          priority
        />

        <span className={`${styles.statusBadge} ${statusClass}`}>
          <span className={styles.statusDot} />
          {statusLabel}
        </span>

        <div className={styles.overlay}>
          <h2 className={styles.characterName}>{character.name}</h2>
          <p className={styles.characterInfo}>{character.species}</p>
          <p className={styles.characterInfo}>{character.type || character.location.name}</p>

          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Origin</span>
              <span className={styles.statValue}>{character.origin.name}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Location</span>
              <span className={styles.statValue}>{character.location.name}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Gender</span>
              <span className={styles.statValue}>{character.gender}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Episodes</span>
              <span className={styles.statValue}>{character.episode.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
