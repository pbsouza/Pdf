import React from 'react';
import {
  FolderOpen,
  Save,
  RotateCw,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Search,
  Undo2,
  Redo2,
  Printer,
  Grid,
  FileSpreadsheet,
  FilePlus,
  Scissors,
  Highlighter,
  MessageSquarePlus,
  PenTool,
  Type,
  Square,
  Stamp,
  EyeOff,
  CheckSquare,
  PenLine,
  LayoutTemplate,
  Maximize2,
  FileBox,
} from 'lucide-react';
import { ActiveTool, ViewMode, PdfDocument } from '../types/pdf';

interface ToolbarProps {
  activeDoc: PdfDocument | null;
  onOpenFile: () => void;
  onSaveFile: () => void;
  onPrint: () => void;
  onCombine: () => void;
  onSplit: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  undoDesc?: string;
  redoDesc?: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onRotateDoc: (delta: number) => void;
  activeTool: ActiveTool;
  onToolSelect: (tool: ActiveTool) => void;
  onToggleFind: () => void;
  isFindOpen: boolean;
  onOpenAllTools: () => void;
  onOpenNewFormModal: () => void;
  isFormBuilderMode: boolean;
  onToggleFormBuilder: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  activeDoc,
  onOpenFile,
  onSaveFile,
  onPrint,
  onCombine,
  onSplit,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  undoDesc,
  redoDesc,
  currentPage,
  totalPages,
  onPageChange,
  zoom,
  onZoomChange,
  viewMode,
  onViewModeChange,
  onRotateDoc,
  activeTool,
  onToolSelect,
  onToggleFind,
  isFindOpen,
  onOpenAllTools,
  onOpenNewFormModal,
  isFormBuilderMode,
  onToggleFormBuilder,
}) => {
  const [pageInput, setPageInput] = React.useState(String(currentPage));

  React.useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(pageInput, 10);
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      onPageChange(p);
    } else {
      setPageInput(String(currentPage));
    }
  };

  const roundedZoomPct = Math.round(zoom * 100);
  const baseZoomPercentages = [30, 50, 75, 100, 125, 150, 200, 300];
  const zoomPercentages = baseZoomPercentages.includes(roundedZoomPct)
    ? baseZoomPercentages
    : [...baseZoomPercentages, roundedZoomPct].sort((a, b) => a - b);

  return (
    <div className="h-12 bg-neutral-100 dark:bg-neutral-850 border-b border-neutral-300 dark:border-neutral-800 flex items-center justify-between px-3 text-neutral-700 dark:text-neutral-200 text-xs select-none z-20 flex-shrink-0 overflow-x-auto shadow-sm no-print">
      {/* Group 1: File & History */}
      <div className="flex items-center space-x-1 flex-shrink-0">
        <button
          onClick={onOpenFile}
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 font-medium transition-colors"
          title="Abrir documento PDF existente"
        >
          <FolderOpen className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
          <span className="hidden sm:inline">Abrir</span>
        </button>

        {/* Create from Scratch Button */}
        <button
          onClick={onOpenNewFormModal}
          className="flex items-center space-x-1 px-2 sm:px-2.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors shadow-xs"
          title="Criar novo formulário a partir do zero ou de modelos"
        >
          <FilePlus className="w-4 h-4 flex-shrink-0" />
          <span className="hidden sm:inline">Novo </span>
          <span>Form</span>
        </button>

        {/* Toggle Form Builder Mode for Existing File */}
        <button
          onClick={onToggleFormBuilder}
          className={`flex items-center space-x-1 px-2 sm:px-2.5 py-1.5 rounded font-medium transition-all ${
            isFormBuilderMode
              ? 'bg-[#b70228] text-white shadow-xs'
              : 'hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700'
          }`}
          title="Ativar/desativar ferramentas de criação de campos de formulário neste PDF"
        >
          <CheckSquare className="w-4 h-4 text-[#b70228] group-hover:text-white flex-shrink-0" />
          <span className="hidden sm:inline">{isFormBuilderMode ? 'Editor Ativo' : 'Criar Campos'}</span>
          <span className="sm:hidden">{isFormBuilderMode ? 'Editor' : 'Campos'}</span>
        </button>

        <button
          onClick={onSaveFile}
          className="flex items-center space-x-1 px-2 sm:px-2.5 py-1.5 rounded bg-neutral-200/80 dark:bg-neutral-750 hover:bg-neutral-300 dark:hover:bg-neutral-700 font-medium transition-colors"
          title="Salvar e Baixar documento com campos interativos"
        >
          <Save className="w-4 h-4 text-[#b70228] flex-shrink-0" />
          <span className="hidden sm:inline">Salvar</span>
        </button>

        <div className="h-5 w-px bg-neutral-300 dark:bg-neutral-700 mx-1" />

        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`p-1.5 rounded transition-colors ${
            canUndo
              ? 'hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200'
              : 'text-neutral-300 dark:text-neutral-600 cursor-not-allowed'
          }`}
          title={canUndo ? `Desfazer: ${undoDesc || 'ação anterior'} (⌘Z)` : 'Desfazer'}
        >
          <Undo2 className="w-4 h-4" />
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`p-1.5 rounded transition-colors ${
            canRedo
              ? 'hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200'
              : 'text-neutral-300 dark:text-neutral-600 cursor-not-allowed'
          }`}
          title={canRedo ? `Refazer: ${redoDesc || 'ação'} (⌘⇧Z)` : 'Refazer'}
        >
          <Redo2 className="w-4 h-4" />
        </button>
      </div>

      {/* Group 2: Navigation & Zoom */}
      <div className="flex items-center space-x-1 flex-shrink-0 mx-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`p-1.5 rounded transition-colors ${
            currentPage <= 1
              ? 'text-neutral-300 dark:text-neutral-600 cursor-not-allowed'
              : 'hover:bg-neutral-200 dark:hover:bg-neutral-700'
          }`}
          title="Página anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <form onSubmit={handlePageSubmit} className="flex items-center space-x-1">
          <input
            type="text"
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            onBlur={handlePageSubmit}
            className="w-10 text-center py-0.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono text-xs focus:ring-1 focus:ring-[#b70228] outline-none"
          />
          <span className="text-neutral-500">/ {totalPages || 1}</span>
        </form>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`p-1.5 rounded transition-colors ${
            currentPage >= totalPages
              ? 'text-neutral-300 dark:text-neutral-600 cursor-not-allowed'
              : 'hover:bg-neutral-200 dark:hover:bg-neutral-700'
          }`}
          title="Próxima página"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div className="h-5 w-px bg-neutral-300 dark:bg-neutral-700 mx-1" />

        <button
          onClick={() => onZoomChange(Math.max(0.3, Math.round((zoom - 0.25) * 100) / 100))}
          className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700"
          title="Diminuir zoom"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <select
          value={Math.round(zoom * 100)}
          onChange={(e) => onZoomChange(parseInt(e.target.value, 10) / 100)}
          className="bg-transparent border border-neutral-300 dark:border-neutral-700 rounded px-1.5 py-0.5 text-xs font-mono outline-none cursor-pointer"
        >
          {zoomPercentages.map((pct) => (
            <option key={pct} value={pct} className="dark:bg-neutral-900">
              {pct}%
            </option>
          ))}
        </select>

        <button
          onClick={() => onZoomChange(Math.min(3.5, Math.round((zoom + 0.25) * 100) / 100))}
          className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700"
          title="Aumentar zoom"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={() => onRotateDoc(90)}
          className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 ml-1"
          title="Girar visualização 90° no sentido horário"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* Group 3: View Modes & Workbench */}
      <div className="flex items-center space-x-1 flex-shrink-0">
        <div className="flex items-center bg-neutral-200 dark:bg-neutral-800 rounded p-0.5">
          <button
            onClick={() => onViewModeChange('continuous')}
            className={`px-2 py-1 rounded transition-colors ${
              viewMode === 'continuous'
                ? 'bg-white dark:bg-neutral-700 shadow-xs font-medium text-neutral-900 dark:text-white'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
            title="Visualização em rolagem contínua"
          >
            Contínuo
          </button>
          <button
            onClick={() => onViewModeChange('single')}
            className={`px-2 py-1 rounded transition-colors ${
              viewMode === 'single'
                ? 'bg-white dark:bg-neutral-700 shadow-xs font-medium text-neutral-900 dark:text-white'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
            title="Visualização de página única"
          >
            Única
          </button>
          <button
            onClick={() => onViewModeChange('twoup')}
            className={`px-2 py-1 rounded transition-colors ${
              viewMode === 'twoup'
                ? 'bg-white dark:bg-neutral-700 shadow-xs font-medium text-neutral-900 dark:text-white'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
            title="Páginas duplas (modo livro)"
          >
            Dupla
          </button>
        </div>

        {/* Organize Pages Workbench Button */}
        <button
          onClick={() => onViewModeChange(viewMode === 'organize' ? 'continuous' : 'organize')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded transition-all font-medium ${
            viewMode === 'organize'
              ? 'bg-[#b70228] text-white shadow-sm'
              : 'bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200'
          }`}
          title="Organizar páginas em grade"
        >
          <Grid className="w-4 h-4" />
          <span>Organizar</span>
        </button>

        <div className="h-5 w-px bg-neutral-300 dark:bg-neutral-700 mx-1" />

        {/* Search */}
        <button
          onClick={onToggleFind}
          className={`p-1.5 rounded transition-colors ${
            isFindOpen
              ? 'bg-[#b70228] text-white'
              : 'hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
          }`}
          title="Localizar texto no documento (⌘F)"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Markup Tools */}
        <div className="flex items-center space-x-0.5">
          <button
            onClick={() => onToolSelect('highlight')}
            className={`p-1.5 rounded transition-colors ${
              activeTool === 'highlight'
                ? 'bg-yellow-400 text-neutral-900 shadow-xs'
                : 'hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
            }`}
            title="Destacar texto"
          >
            <Highlighter className="w-4 h-4" />
          </button>

          <button
            onClick={() => onToolSelect('note')}
            className={`p-1.5 rounded transition-colors ${
              activeTool === 'note'
                ? 'bg-[#b70228] text-white'
                : 'hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
            }`}
            title="Nota adesiva / Comentário"
          >
            <MessageSquarePlus className="w-4 h-4" />
          </button>

          <button
            onClick={() => onToolSelect('draw')}
            className={`p-1.5 rounded transition-colors ${
              activeTool === 'draw'
                ? 'bg-[#b70228] text-white'
                : 'hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
            }`}
            title="Desenho livre com caneta"
          >
            <PenTool className="w-4 h-4" />
          </button>

          <button
            onClick={() => onToolSelect('text')}
            className={`p-1.5 rounded transition-colors ${
              activeTool === 'text'
                ? 'bg-[#b70228] text-white'
                : 'hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
            }`}
            title="Inserir caixa de texto"
          >
            <Type className="w-4 h-4" />
          </button>

          <button
            onClick={() => onToolSelect('stamp')}
            className={`p-1.5 rounded transition-colors ${
              activeTool === 'stamp'
                ? 'bg-[#b70228] text-white'
                : 'hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
            }`}
            title="Carimbo (Aprovado, Rascunho, Confidencial)"
          >
            <Stamp className="w-4 h-4" />
          </button>

          <button
            onClick={() => onToolSelect('redact')}
            className={`p-1.5 rounded transition-colors ${
              activeTool === 'redact'
                ? 'bg-neutral-900 text-white'
                : 'hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
            }`}
            title="Ferramenta de Censura / Redação"
          >
            <EyeOff className="w-4 h-4" />
          </button>

          <button
            onClick={() => onToolSelect('sign')}
            className={`p-1.5 rounded transition-colors ${
              activeTool === 'sign'
                ? 'bg-[#b70228] text-white'
                : 'hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
            }`}
            title="Assinatura Digital"
          >
            <PenLine className="w-4 h-4" />
          </button>
        </div>

        <div className="h-5 w-px bg-neutral-300 dark:bg-neutral-700 mx-1" />

        {/* All Tools Catalogue Button */}
        <button
          onClick={onOpenAllTools}
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded bg-neutral-200/80 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors font-medium"
          title="Abrir Catálogo de Ferramentas"
        >
          <FileBox className="w-4 h-4 text-[#b70228]" />
          <span>Ferramentas</span>
        </button>

        {/* Print */}
        <button
          onClick={onPrint}
          className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
          title="Imprimir documento"
        >
          <Printer className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
