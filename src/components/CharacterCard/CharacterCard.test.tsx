import { render, screen, fireEvent } from '@testing-library/react';
import CharacterCard from './CharacterCard';
import type { Character, FavoriteRecord } from '@/types/character';

const mockCharacter: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth', url: '' },
  location: { name: 'Earth', url: '' },
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  episode: ['ep1', 'ep2'],
  url: '',
  created: '',
};

const noFavorites: FavoriteRecord[] = [];
const withFavorite: FavoriteRecord[] = [
  { id: 1, characterId: 1, name: 'Rick Sanchez', image: '', status: 'Alive' },
];

describe('CharacterCard', () => {
  describe('render', () => {
    it('should_render_character_name_when_given_character', () => {
      render(
        <CharacterCard
          character={mockCharacter}
          isSelected={false}
          favorites={noFavorites}
          onSelect={jest.fn()}
          onToggleFavorite={jest.fn()}
        />
      );
      expect(screen.getByText('RICK SANCHEZ')).toBeInTheDocument();
    });

    it('should_apply_selected_style_when_isSelected_is_true', () => {
      const { container } = render(
        <CharacterCard
          character={mockCharacter}
          isSelected={true}
          favorites={noFavorites}
          onSelect={jest.fn()}
          onToggleFavorite={jest.fn()}
        />
      );
      expect((container.firstChild as HTMLElement).className).toMatch(/selected/);
    });
  });

  describe('interacción', () => {
    it('should_call_onSelect_when_card_is_clicked', () => {
      const onSelect = jest.fn();
      render(
        <CharacterCard
          character={mockCharacter}
          isSelected={false}
          favorites={noFavorites}
          onSelect={onSelect}
          onToggleFavorite={jest.fn()}
        />
      );
      fireEvent.click(screen.getByRole('button', { name: /add to favorites/i }).parentElement!);
      fireEvent.click(screen.getByText('RICK SANCHEZ'));
      expect(onSelect).toHaveBeenCalledWith(mockCharacter);
    });

    it('should_call_onToggleFavorite_when_like_button_is_clicked', () => {
      const onToggleFavorite = jest.fn();
      render(
        <CharacterCard
          character={mockCharacter}
          isSelected={false}
          favorites={noFavorites}
          onSelect={jest.fn()}
          onToggleFavorite={onToggleFavorite}
        />
      );
      fireEvent.click(screen.getByRole('button', { name: /add to favorites/i }));
      expect(onToggleFavorite).toHaveBeenCalledWith(mockCharacter);
    });
  });

  describe('favoritos', () => {
    it('should_show_liked_state_when_character_is_in_favorites', () => {
      render(
        <CharacterCard
          character={mockCharacter}
          isSelected={false}
          favorites={withFavorite}
          onSelect={jest.fn()}
          onToggleFavorite={jest.fn()}
        />
      );
      expect(
        screen.getByRole('button', { name: /remove from favorites/i })
      ).toBeInTheDocument();
    });
  });
});
