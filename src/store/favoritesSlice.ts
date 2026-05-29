import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Character, FavoriteRecord } from '@/types/character';

const JSON_SERVER =
  process.env.NEXT_PUBLIC_JSON_SERVER_URL ?? 'http://localhost:3001';

export const loadFavorites = createAsyncThunk(
  'favorites/load',
  async (): Promise<FavoriteRecord[]> => {
    const res = await fetch(`${JSON_SERVER}/favorites`);
    return res.json();
  }
);

export const addFavorite = createAsyncThunk(
  'favorites/add',
  async (character: Character): Promise<FavoriteRecord> => {
    const res = await fetch(`${JSON_SERVER}/favorites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        characterId: character.id,
        name: character.name,
        image: character.image,
        status: character.status,
      }),
    });
    return res.json();
  }
);

export const removeFavorite = createAsyncThunk(
  'favorites/remove',
  async ({
    recordId,
    characterId,
  }: {
    recordId: number;
    characterId: number;
  }): Promise<number> => {
    await fetch(`${JSON_SERVER}/favorites/${recordId}`, { method: 'DELETE' });
    return characterId;
  }
);

interface FavoritesState {
  items: FavoriteRecord[];
  loading: boolean;
}

const initialState: FavoritesState = { items: [], loading: false };

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loadFavorites.pending, state => {
        state.loading = true;
      })
      .addCase(loadFavorites.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.items = state.items.filter(
          item => item.characterId !== action.payload
        );
      });
  },
});

export default favoritesSlice.reducer;
