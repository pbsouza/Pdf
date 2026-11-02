import React from 'react';
import { Search, ChevronDown, ChevronRight, X, Bookmark } from 'lucide-react';
import { BookmarkItem } from '../../types/pdf';

interface BookmarksPanelProps {
  bookmarks: BookmarkItem[];
  currentPage: number;
  onSelectPage: (page: number) => void;
}

export const BookmarksPanel: React.FC<BookmarksPanelProps> = ({
  bookmarks,
  currentPage,
  onSelectPage,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [expandedIds, setExpandedIds] = React.useState<Record<string, boolean>>({
    b2: true,
    b4: true,
  });

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filterBookmarks = (items: BookmarkItem[], query: string): BookmarkItem[] => {
    if (!query.trim()) return items;
    const lower = query.toLowerCase();

    return items
      .map((item) => {
        const matchesSelf = item.title.toLowerCase().includes(lower);
        const filteredChildren = item.children ? filterBookmarks(item.children, query) : [];
        if (matchesSelf || filteredChildren.length > 0) {
          return {
            ...item,
            children: filteredChildren.length > 0 ? filteredChildren : item.children,
          };
        }
        return null;
      })
      .filter(Boolean) as BookmarkItem[];
  };

  const filteredBookmarks = filterBookmarks(bookmarks, searchQuery);

  const renderBookmarkTree = (items: BookmarkItem[], depth = 0) => {
    return (
      <div className="space-y-0.5">
        {items.map((item) => {
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = searchQuery.trim() ? true : !!expandedIds[item.id];
          const isCurrent = item.page === currentPage;

          return (
            <div key={item.id} className="text-xs">
              <div
                style={{ paddingLeft: `${depth * 14 + 6}px` }}
                onClick={() => onSelectPage(item.page)}
                className={`flex items-center space-x-1.5 py-1.5 px-2 rounded cursor-pointer transition-colors group ${
                  isCurrent
                    ? 'bg-[#b70228]/10 text-[#b70228] font-medium'
                    : 'hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                }`}
              >
                {hasChildren ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(item.id);
                    }}
                    className="p-0.5 hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded text-neutral-400"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </button>
                ) : (
                  <Bookmark className="w-3 h-3 text-neutral-400 ml-1 flex-shrink-0" />
                )}

                <span className="flex-1 truncate">{item.title}</span>
                <span className="text-[10px] text-neutral-400 font-mono px-1">p.{item.page}</span>
              </div>

              {hasChildren && isExpanded && (
                <div>{renderBookmarkTree(item.children!, depth + 1)}</div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-neutral-50 dark:bg-neutral-900 text-xs">
      {/* Search Header */}
      <div className="p-2 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-850">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter bookmarks..."
            className="w-full bg-white dark:bg-neutral-900 pl-7 pr-7 py-1 rounded text-xs border border-neutral-300 dark:border-neutral-700 outline-none focus:border-[#b70228]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 p-0.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              title="Clear search"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Bookmarks Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredBookmarks.length > 0 ? (
          renderBookmarkTree(filteredBookmarks)
        ) : (
          <div className="p-4 text-center text-neutral-400 text-xs">
            {searchQuery ? 'No bookmarks match your search.' : 'No bookmarks in this document.'}
          </div>
        )}
      </div>
    </div>
  );
};
