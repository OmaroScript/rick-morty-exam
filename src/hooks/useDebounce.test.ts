import { act, renderHook } from '@testing-library/react';
import { useDebounce } from './useDebounce';

jest.useFakeTimers();

describe('useDebounce', () => {
  describe('valor inicial', () => {
    it('should_return_initial_value_immediately', () => {
      const { result } = renderHook(() => useDebounce('hello', 300));
      expect(result.current).toBe('hello');
    });
  });

  describe('durante el delay', () => {
    it('should_not_update_value_before_delay', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: 'initial' } }
      );
      rerender({ value: 'updated' });
      expect(result.current).toBe('initial');
    });

    it('should_update_value_after_delay', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: 'initial' } }
      );
      rerender({ value: 'updated' });
      act(() => jest.advanceTimersByTime(300));
      expect(result.current).toBe('updated');
    });
  });
});
