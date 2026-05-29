'use client';

import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { Character } from '@/types/character';
import {
  fetchCharacterById,
  fetchCharacters,
} from '@/services/characterService';
import type { AppDispatch, RootState } from '@/store';
import {
  addFavorite,
  loadFavorites,
  removeFavorite,
} from '@/store/favoritesSlice';
import { useDebounce } from '@/hooks/useDebounce';
import CharacterPanel from '@/components/CharacterPanel/CharacterPanel';
import CharacterGrid from '@/components/CharacterGrid/CharacterGrid';
import SearchInput from '@/components/SearchInput/SearchInput';
import ArrowButton from '@/components/ArrowButton/ArrowButton';
import FavsButton from '@/components/FavsButton/FavsButton';
import SkeletonGrid from '@/components/SkeletonGrid/SkeletonGrid';
import styles from './page.module.css';

const GRID_SIZE = 4;

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const favorites = useSelector((state: RootState) => state.favorites.items);

  const [characters, setCharacters] = useState<Character[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [gridIndex, setGridIndex] = useState(0);
  const [apiPage, setApiPage] = useState(1);
  const [totalApiPages, setTotalApiPages] = useState(1);
  const [selectedCharacter, setSelectedCharacter] =
    useState<Character | null>(null);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 400);

  useEffect(() => {
    dispatch(loadFavorites());
  }, [dispatch]);

  const loadCharacters = useCallback(async (query: string, page: number) => {
    setLoading(true);
    try {
      const data = await fetchCharacters(page, query || undefined);
      setCharacters(data.results);
      setTotalApiPages(data.info.pages || 1);
      setGridIndex(0);
      if (data.results.length > 0) {
        setSelectedCharacter(data.results[0]);
      } else {
        setSelectedCharacter(null);
      }
    } catch {
      setCharacters([]);
      setSelectedCharacter(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCharacters(debouncedSearch, apiPage);
  }, [loadCharacters, debouncedSearch, apiPage]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setApiPage(1);
    setGridIndex(0);
  };

  const gridCharacters = characters.slice(gridIndex, gridIndex + GRID_SIZE);
  const hasNextLocal = gridIndex + GRID_SIZE < characters.length;
  const hasPrevLocal = gridIndex > 0;
  const canGoNext = hasNextLocal || apiPage < totalApiPages;
  const canGoPrev = hasPrevLocal || apiPage > 1;

  const handleNext = () => {
    if (hasNextLocal) {
      setGridIndex(prev => prev + GRID_SIZE);
    } else if (apiPage < totalApiPages) {
      setApiPage(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (hasPrevLocal) {
      setGridIndex(prev => prev - GRID_SIZE);
    } else if (apiPage > 1) {
      setApiPage(prev => prev - 1);
    }
  };

  const handleToggleFavorite = (character: Character) => {
    const existing = favorites.find(f => f.characterId === character.id);
    if (existing) {
      dispatch(
        removeFavorite({ recordId: existing.id, characterId: character.id })
      );
    } else {
      dispatch(addFavorite(character));
    }
  };

  const handleSelectFavorite = async (characterId: number) => {
    try {
      const character = await fetchCharacterById(characterId);
      setSelectedCharacter(character);
    } catch {
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.logo} aria-label="Rick and Morty">
        <span>Rick</span>
        <span className={styles.logoAnd}>&amp;</span>
        <span>Morty</span>
      </div>

      <div className={styles.appCard}>
        <CharacterPanel character={selectedCharacter} />

        <div className={styles.rightPanel}>
          <SearchInput value={searchQuery} onChange={handleSearch} />

          <div className={styles.arrowTop}>
            <ArrowButton
              direction="up"
              onClick={handlePrev}
              disabled={!canGoPrev || loading}
            />
          </div>

          <div className={styles.gridWrapper}>
            {loading ? (
              <SkeletonGrid count={GRID_SIZE} />
            ) : (
              <CharacterGrid
                characters={gridCharacters}
                selectedId={selectedCharacter?.id ?? null}
                favorites={favorites}
                onSelect={setSelectedCharacter}
                onToggleFavorite={handleToggleFavorite}
              />
            )}
          </div>

          <div className={styles.arrowBottom}>
            <ArrowButton
              direction="down"
              onClick={handleNext}
              disabled={!canGoNext || loading}
            />
          </div>

          <FavsButton
            favorites={favorites}
            onSelectFavorite={handleSelectFavorite}
          />
        </div>
      </div>

      <div className={styles.grass} aria-hidden="true" />

      <img
        src="/rick_morty.png"
        alt=""
        aria-hidden="true"
        className={styles.rickMortyArt}
      />
    </main>
  );
}
