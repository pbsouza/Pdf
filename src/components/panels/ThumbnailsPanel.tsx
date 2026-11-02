import React from 'react';
import { ZoomIn, ZoomOut, RotateCw, Trash2, Copy } from 'lucide-react';
import { PdfDocument } from '../../types/pdf';

interface ThumbnailsPanelProps {
  document: PdfDocument;
  currentPage: number;
  onPageSelect: (page: number) => void;
  selectedPages: number[];
  onTogglePageSelection: (page: number, isMulti: boolean) => void;
  onRotatePages?: (pages: number[], delta: number) => void;
  onDeletePages?: (pages: number[]) => void;
}

export const ThumbnailsPanel: React.FC<ThumbnailsPanelProps> = ({
  document,
  currentPage,
  onPageSelect,
  selectedPages,
  onTogglePageSelection,
  onRotatePages,
  onDeletePages,
}) => {
  // Thumbnail zoom (50% to 150%) from README
  const [thumbZoom, setThumbZoom] = React.useState<number>(100);

  const baseWidth = 140;
  const cardWidth = Math.round((baseWidth * thumbZoom) / 100);

  return (
    <div className="flex flex-col h-full bg-neutral-50 dark:bg-neutral-900 text-xs">
      {/* Thumbnail zoom toolbar */}
      <div className="p-2 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-100 dark:bg-neutral-850">
        <span className="font-semibold text-neutral-600 dark:text-neutral-400">Pages ({document.pageCount})</span>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setThumbZoom((z) => Math.max(50, z - 25))}
            className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700"
            title="Smaller thumbnails"
          >
            <ZoomOut className="w-3.5 h-3.5 text-neutral-500" />
          </button>
          <span className="text-[11px] font-mono text-neutral-500 w-8 text-center">{thumbZoom}%</span>
          <button
            onClick={() => setThumbZoom((z) => Math.min(150, z + 25))}
            className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700"
            title="Larger thumbnails"
          >
            <ZoomIn className="w-3.5 h-3.5 text-neutral-500" />
          </button>
        </div>
      </div>

      {/* Pages thumbnail list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 flex flex-col items-center">
        {Array.from({ length: document.pageCount }, (_, i) => i + 1).map((pageNum) => {
          const isCurrent = pageNum === currentPage;
          const isSelected = selectedPages.includes(pageNum);
          const pageRotation = document.pageRotations[pageNum] || document.rotation || 0;

          return (
            <div
              key={pageNum}
              onClick={(e) => {
                if (e.shiftKey || e.metaKey || e.ctrlKey) {
                  onTogglePageSelection(pageNum, true);
                } else {
                  onPageSelect(pageNum);
                  onTogglePageSelection(pageNum, false);
                }
              }}
              className={`group flex flex-col items-center cursor-pointer transition-all p-1.5 rounded-lg border-2 ${
                isCurrent
                  ? 'border-[#b70228] bg-[#b70228]/5 shadow-sm'
                  : isSelected
                  ? 'border-neutral-400 dark:border-neutral-500 bg-neutral-200/50 dark:bg-neutral-800/50'
                  : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800/30'
              }`}
            >
              {/* Thumbnail mini canvas / representation */}
              <div
                style={{
                  width: `${cardWidth}px`,
                  height: `${Math.round(cardWidth * 1.414)}px`,
                  transform: `rotate(${pageRotation}deg)`,
                }}
                className="bg-white dark:bg-neutral-800 shadow-md rounded border border-neutral-200 dark:border-neutral-700 relative overflow-hidden flex flex-col justify-between p-2 select-none"
              >
                {/* Mini page content placeholder representation */}
                <div className="space-y-1">
                  <div className="h-1.5 w-3/4 bg-neutral-300 dark:bg-neutral-600 rounded" />
                  <div className="h-1 w-full bg-neutral-200 dark:bg-neutral-700 rounded" />
                  <div className="h-1 w-5/6 bg-neutral-200 dark:bg-neutral-700 rounded" />
                  <div className="h-1 w-2/3 bg-neutral-200 dark:bg-neutral-700 rounded" />
                </div>

                <div className="space-y-1 opacity-60">
                  <div className="h-1 w-full bg-neutral-200 dark:bg-neutral-700 rounded" />
                  <div className="h-1 w-4/5 bg-neutral-200 dark:bg-neutral-700 rounded" />
                  <div className="h-1 w-1/2 bg-neutral-200 dark:bg-neutral-700 rounded" />
                </div>

                {/* Page number badge inside preview */}
                <div className="self-center text-[10px] text-neutral-400 font-mono">
                  {pageNum}
                </div>
              </div>

              {/* Label underneath */}
              <div className="mt-1 flex items-center space-x-1.5 text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                <span>Page {pageNum}</span>
                {isCurrent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b70228]" title="Current View" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
