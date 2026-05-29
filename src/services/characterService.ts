import type { Character as RMCharacter, Info } from 'rickmortyapi';
import type { ApiResponse, Character } from '@/types/character';

const BASE = 'https://rickandmortyapi.com/api';

export async function fetchCharacters(
  page = 1,
  name?: string
): Promise<ApiResponse> {
  const params = new URLSearchParams({ page: String(page) });
  if (name) params.set('name', name);

  const res = await fetch(`${BASE}/character/?${params}`);

  if (res.status === 404) {
    return { info: { count: 0, pages: 0, next: null, prev: null }, results: [] };
  }

  if (!res.ok) throw new Error(`Failed to fetch characters: ${res.statusText}`);

  const body: Info<RMCharacter[]> = await res.json();

  return {
    info: {
      count: body.info?.count ?? 0,
      pages: body.info?.pages ?? 1,
      next: body.info?.next ?? null,
      prev: body.info?.prev ?? null,
    },
    results: (body.results ?? []) as Character[],
  };
}

export async function fetchCharacterById(id: number): Promise<Character> {
  const res = await fetch(`${BASE}/character/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch character: ${res.statusText}`);
  return (await res.json()) as Character;
}
