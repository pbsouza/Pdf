import React from 'react';
import { Search, ChevronUp, ChevronDown, X } from 'lucide-react';

interface FindBarProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (q: string) => void;
  matchIndex: number;
  totalMatches: number;
  onNextMatch: () => void;
  onPrevMatch: () => void;
}

export const FindBar: React.FC<FindBarProps> = ({
  isOpen,
  onClose,
  query,
  onQueryChange,
  matchIndex,
  totalMatches,
  onNextMatch,
  onPrevMatch,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        onPrevMatch();
      } else {
        onNextMatch();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="absolute top-24 right-6 z-30 bg-white dark:bg-neutral-850 shadow-xl border border-neutral-300 dark:border-neutral-700 rounded-lg p-1.5 flex items-center space-x-2 text-xs">
      <div className="relative flex items-center">
        <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Localizar no documento..."
          className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded pl-7 pr-2 py-1 text-xs outline-none focus:border-[#b70228] w-48 text-neutral-900 dark:text-white"
        />
      </div>

      {query && (
        <span className="text-[11px] text-neutral-500 font-mono">
          {totalMatches > 0 ? `${matchIndex + 1} de ${totalMatches}` : '0 de 0'}
        </span>
      )}

      <div className="flex items-center space-x-0.5">
        <button
          onClick={onPrevMatch}
          disabled={totalMatches === 0}
          className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded text-neutral-600 dark:text-neutral-300 disabled:opacity-30"
          title="Ocorrência anterior (⇧⌘G / Shift+Enter)"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onNextMatch}
          disabled={totalMatches === 0}
          className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded text-neutral-600 dark:text-neutral-300 disabled:opacity-30"
          title="Próxima ocorrência (⌘G / Enter)"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      <button
        onClick={onClose}
        className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
        title="Fechar busca (Esc)"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
