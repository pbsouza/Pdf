import React from 'react';
import {
  RotateCw,
  RotateCcw,
  Trash2,
  Copy,
  PlusCircle,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Scissors,
  CheckSquare,
  Square,
  FileText,
  Upload,
} from 'lucide-react';
import { PdfDocument } from '../types/pdf';

interface OrganizeGridProps {
  document: PdfDocument;
  selectedPages: number[];
  onTogglePageSelection: (page: number, isMulti: boolean) => void;
  onSelectAllPages: () => void;
  onClearSelection: () => void;
  onRotatePages: (pages: number[], delta: number) => void;
  onDeletePages: (pages: number[]) => void;
  onDuplicatePage: (page: number) => void;
  onInsertBlankPage: (afterPage: number) => void;
  onMovePage: (fromIndex: number, toIndex: number) => void;
  onExtractPages: (pages: number[]) => void;
  onOpenSplitModal: () => void;
  onExitOrganize: () => void;
  onPageClick: (page: number) => void;
}

export const OrganizeGrid: React.FC<OrganizeGridProps> = ({
  document,
  selectedPages,
  onTogglePageSelection,
  onSelectAllPages,
  onClearSelection,
  onRotatePages,
  onDeletePages,
  onDuplicatePage,
  onInsertBlankPage,
  onMovePage,
  onExtractPages,
  onOpenSplitModal,
  onExitOrganize,
  onPageClick,
}) => {
  const [draggedPageIndex, setDraggedPageIndex] = React.useState<number | null>(null);

  const hasSelection = selectedPages.length > 0;
  const isAllSelected = selectedPages.length === document.pageCount;

  const handleDragStart = (e: React.DragEvent, pageNum: number) => {
    setDraggedPageIndex(pageNum);
    e.dataTransfer.setData('text/plain', String(pageNum));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetPageNum: number) => {
    e.preventDefault();
    if (draggedPageIndex !== null && draggedPageIndex !== targetPageNum) {
      onMovePage(draggedPageIndex, targetPageNum);
    }
    setDraggedPageIndex(null);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-200 dark:bg-neutral-950 overflow-hidden select-none">
      {/* Organize Context Toolbar */}
      <div className="h-12 bg-white dark:bg-neutral-900 border-b border-neutral-300 dark:border-neutral-800 px-2 sm:px-4 flex items-center justify-between text-xs flex-shrink-0 shadow-xs overflow-x-auto scrollbar-none">
        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0 mr-2">
          {/* Select all toggle */}
          <button
            onClick={isAllSelected ? onClearSelection : onSelectAllPages}
            className="flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-2.5 py-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
          >
            {isAllSelected ? <CheckSquare className="w-4 h-4 text-[#b70228]" /> : <Square className="w-4 h-4" />}
            <span className="hidden sm:inline">{isAllSelected ? 'Desmarcar Tudo' : 'Selecionar Tudo'}</span>
            <span className="sm:hidden">{isAllSelected ? 'Desmarcar' : 'Todos'}</span>
          </button>

          <span className="text-neutral-400">|</span>

          <span className="text-neutral-500 font-medium text-[11px] sm:text-xs">
            {selectedPages.length} de {document.pageCount}
          </span>
        </div>

        {/* Selected Page Operations */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => onRotatePages(selectedPages, -90)}
            disabled={!hasSelection}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 font-medium transition-colors"
            title="Girar páginas selecionadas 90° para a esquerda"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Girar Esquerda</span>
          </button>

          <button
            onClick={() => onRotatePages(selectedPages, 90)}
            disabled={!hasSelection}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 font-medium transition-colors"
            title="Girar páginas selecionadas 90° para a direita"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Girar Direita</span>
          </button>

          <div className="h-4 w-px bg-neutral-300 dark:bg-neutral-700 mx-1" />

          <button
            onClick={() => onInsertBlankPage(selectedPages[0] || document.pageCount)}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium transition-colors text-neutral-700 dark:text-neutral-300"
            title="Inserir página A4 em branco"
          >
            <PlusCircle className="w-3.5 h-3.5 text-green-600" />
            <span className="hidden sm:inline">Página em Branco</span>
          </button>

          <button
            onClick={() => {
              if (selectedPages[0]) onDuplicatePage(selectedPages[0]);
            }}
            disabled={!hasSelection || selectedPages.length > 1}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 font-medium transition-colors"
            title="Duplicar página selecionada"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Duplicar</span>
          </button>

          <button
            onClick={() => onExtractPages(selectedPages)}
            disabled={!hasSelection}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 font-medium transition-colors"
            title="Extrair páginas selecionadas para um novo PDF"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden md:inline">Extrair</span>
          </button>

          <button
            onClick={onOpenSplitModal}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium transition-colors"
            title="Dividir documento em múltiplos arquivos"
          >
            <Scissors className="w-3.5 h-3.5 text-purple-500" />
            <span>Dividir</span>
          </button>

          <div className="h-4 w-px bg-neutral-300 dark:bg-neutral-700 mx-1" />

          <button
            onClick={() => onDeletePages(selectedPages)}
            disabled={!hasSelection || document.pageCount <= 1}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 disabled:opacity-40 font-medium transition-colors"
            title="Excluir páginas selecionadas"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Excluir</span>
          </button>

          <button
            onClick={onExitOrganize}
            className="ml-3 px-3 py-1.5 rounded bg-[#b70228] hover:bg-[#8a011e] text-white font-medium transition-colors shadow-xs"
          >
            Concluído
          </button>
        </div>
      </div>

      {/* Pages Card Table */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6 max-w-7xl mx-auto">
          {Array.from({ length: document.pageCount }, (_, i) => i + 1).map((pageNum) => {
            const isSelected = selectedPages.includes(pageNum);
            const pageRotation = document.pageRotations[pageNum] || document.rotation || 0;

            return (
              <div
                key={pageNum}
                draggable
                onDragStart={(e) => handleDragStart(e, pageNum)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, pageNum)}
                onClick={(e) => {
                  if (e.shiftKey || e.metaKey || e.ctrlKey) {
                    onTogglePageSelection(pageNum, true);
                  } else {
                    onTogglePageSelection(pageNum, false);
                  }
                }}
                onDoubleClick={() => {
                  onPageClick(pageNum);
                  onExitOrganize();
                }}
                className={`group relative flex flex-col items-center bg-white dark:bg-neutral-900 rounded-xl p-3 border-2 transition-all cursor-pointer shadow-md hover:shadow-xl ${
                  isSelected
                    ? 'border-[#b70228] ring-4 ring-[#b70228]/20 bg-neutral-50 dark:bg-neutral-850'
                    : 'border-transparent hover:border-neutral-400 dark:hover:border-neutral-700'
                }`}
              >
                {/* Top badge with checkbox */}
                <div className="w-full flex items-center justify-between mb-2">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePageSelection(pageNum, true);
                    }}
                    className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-[#b70228] text-white' : 'border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800'
                    }`}
                  >
                    {isSelected && <CheckSquare className="w-3.5 h-3.5" />}
                  </div>

                  <span className="text-xs font-mono font-semibold text-neutral-600 dark:text-neutral-400">
                    Page {pageNum}
                  </span>
                </div>

                {/* Page Card Canvas Preview */}
                <div
                  style={{
                    transform: `rotate(${pageRotation}deg)`,
                  }}
                  className="w-full aspect-[1/1.414] bg-white dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700 shadow-inner p-3 flex flex-col justify-between overflow-hidden relative"
                >
                  {/* Decorative preview content */}
                  <div className="space-y-1.5 opacity-80">
                    <div className="h-2 w-3/4 bg-neutral-300 dark:bg-neutral-600 rounded" />
                    <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-700 rounded" />
                    <div className="h-1.5 w-5/6 bg-neutral-200 dark:bg-neutral-700 rounded" />
                    <div className="h-1.5 w-4/6 bg-neutral-200 dark:bg-neutral-700 rounded" />
                  </div>

                  <div className="space-y-1.5 opacity-60">
                    <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-700 rounded" />
                    <div className="h-1.5 w-4/5 bg-neutral-200 dark:bg-neutral-700 rounded" />
                    <div className="h-1.5 w-3/5 bg-neutral-200 dark:bg-neutral-700 rounded" />
                  </div>

                  {/* Watermark page indicator */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-3xl font-bold font-mono text-neutral-200 dark:text-neutral-700 select-none">
                      {pageNum}
                    </span>
                  </div>
                </div>

                {/* Bottom Quick Action Controls on Hover */}
                <div className="flex items-center space-x-1 mt-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRotatePages([pageNum], 90);
                    }}
                    className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded text-neutral-600 dark:text-neutral-400"
                    title="Rotate 90° CW"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (pageNum > 1) onMovePage(pageNum, pageNum - 1);
                    }}
                    disabled={pageNum === 1}
                    className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded text-neutral-600 dark:text-neutral-400 disabled:opacity-30"
                    title="Move earlier"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (pageNum < document.pageCount) onMovePage(pageNum, pageNum + 1);
                    }}
                    disabled={pageNum === document.pageCount}
                    className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded text-neutral-600 dark:text-neutral-400 disabled:opacity-30"
                    title="Move later"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePages([pageNum]);
                    }}
                    disabled={document.pageCount <= 1}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-950/60 rounded text-red-500 disabled:opacity-30"
                    title="Delete page"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
