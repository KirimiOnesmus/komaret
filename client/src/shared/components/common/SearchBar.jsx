import { useEffect, useRef, useState } from 'react';

/**
 * Debounced search input. Debouncing here only reduces request volume
 * from the client; the server must still rate-limit and bound search
 * query length/complexity independently.
 */
function SearchBar({ onSearch, placeholder = 'Search...', delayMs = 400 }) {
  const [value, setValue] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onSearch?.(value.trim());
    }, delayMs);
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, delayMs]);

  return (
    <input
      type="search"
      value={value}
      maxLength={200}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}

export default SearchBar;
