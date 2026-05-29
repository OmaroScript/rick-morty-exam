import { render, screen, fireEvent } from '@testing-library/react';
import FavsButton from './FavsButton';
import type { FavoriteRecord } from '@/types/character';

const favorites: FavoriteRecord[] = [
  { id: 1, characterId: 1, name: 'Rick Sanchez', image: '', status: 'Alive' },
  { id: 2, characterId: 2, name: 'Morty Smith', image: '', status: 'Alive' },
];

describe('FavsButton', () => {
  describe('render', () => {
    it('should_render_favs_button', () => {
      render(<FavsButton favorites={[]} />);
      expect(screen.getByRole('button', { name: /favs/i })).toBeInTheDocument();
    });
  });

  describe('dropdown', () => {
    it('should_open_dropdown_when_clicked_with_favorites', () => {
      render(<FavsButton favorites={favorites} />);
      fireEvent.click(screen.getByRole('button', { name: /favs/i }));
      expect(screen.getByText('RICK SANCHEZ')).toBeInTheDocument();
      expect(screen.getByText('MORTY SMITH')).toBeInTheDocument();
    });

    it('should_close_dropdown_when_clicked_again', () => {
      render(<FavsButton favorites={favorites} />);
      const btn = screen.getByRole('button', { name: /favs/i });
      fireEvent.click(btn);
      fireEvent.click(btn);
      expect(screen.queryByText('RICK SANCHEZ')).not.toBeInTheDocument();
    });
  });

  describe('selección', () => {
    it('should_call_onSelectFavorite_when_dropdown_item_clicked', () => {
      const onSelectFavorite = jest.fn();
      render(<FavsButton favorites={favorites} onSelectFavorite={onSelectFavorite} />);
      fireEvent.click(screen.getByRole('button', { name: /favs/i }));
      fireEvent.click(screen.getByText('RICK SANCHEZ'));
      expect(onSelectFavorite).toHaveBeenCalledWith(1);
    });
  });
});
