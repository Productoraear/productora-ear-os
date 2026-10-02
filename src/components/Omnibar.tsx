import { useState } from 'react';
import { debounce } from 'lodash';

interface SearchResult {
  filepath: string;
  filename: string;
}

const Omnibar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(`/api/omni-drive/search?query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const debouncedSearch = debounce(handleSearch, 300);

  return (
    <div className="relative w-full max-w-md overflow-x-hidden">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          debouncedSearch(e.target.value);
        }}
        placeholder="Buscar..."
        className="w-full min-h-[48px] touch-manipulation px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
      />
      {results.length > 0 && (
        <ul className="absolute z-10 w-full bg-white shadow-md">
          {results.map((result, index) => (
            <li key={index} className="hover:bg-gray-100 cursor-pointer">
              <a href={result.filepath} className="block min-h-[48px] touch-manipulation px-4 py-3">
                {result.filename}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Omnibar;
