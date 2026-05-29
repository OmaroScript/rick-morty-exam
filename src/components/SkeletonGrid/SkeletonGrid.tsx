'use client';

import styles from './SkeletonGrid.module.css';

interface SkeletonGridProps {
  count?: number;
}

export default function SkeletonGrid({ count = 4 }: SkeletonGridProps) {
  const skeletons = Array.from({ length: count });

  return (
    <div className={styles.grid}>
      {skeletons.map((_, index) => (
        <div key={index} className={styles.skeletonCard} data-testid="skeleton-card">
          <div className={styles.shimmer} />
          <div className={styles.nameBar} />
          <div className={styles.imagePlaceholder} />
          <div className={styles.footerPlaceholder} />
        </div>
      ))}
    </div>
  );
}
