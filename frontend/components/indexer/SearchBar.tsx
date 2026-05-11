// src/components/indexer/SearchBar.tsx
import React from 'react';
import { Search, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isSearching, value = '', onChange }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSearching && value?.trim()) {
      onSearch(value);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="relative flex-1 max-w-2xl"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {isSearching ? (
            <Loader2 className="h-5 w-5 text-base-blue-500 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-base-blue-500 transition-colors" />
          )}
        </div>
        <input
          type="text"
          value={value || ''}
          onChange={onChange}
          placeholder="Search address, tx, or block..."
          className="block w-full pl-11 pr-24 py-4 rounded-2xl glass border border-white/10 focus:ring-2 focus:ring-base-blue-500/50 shadow-lg group-hover:shadow-xl transition-all duration-300 dark:text-white"
          disabled={isSearching}
        />
        <div className="absolute inset-y-2 right-2 flex items-center">
          <button
            type="submit"
            disabled={isSearching || !(value && value.trim())}
            className="h-full px-6 rounded-xl bg-base-blue-600 text-white text-sm font-bold shadow-md hover:bg-base-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            Search
          </button>
        </div>
      </div>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {['Transfers', 'Blocks', 'Governance', 'Staking'].map((filter) => (
          <button 
            key={filter} 
            type="button"
            className="px-3 py-1 rounded-full glass border border-white/5 text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-base-blue-500 transition-colors whitespace-nowrap"
          >
            {filter}
          </button>
        ))}
      </div>
    </motion.form>
  );
};

export default SearchBar;