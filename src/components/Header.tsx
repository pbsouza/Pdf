import React from 'react';
import {
  FileText,
  X,
  Plus,
  Moon,
  Sun,
  Search,
  BookOpen,
} from 'lucide-react';
import { PdfDocument } from '../types/pdf';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  documents: PdfDocument[];
  activeDocId: string;
  onSelectDoc: (id: string) => void;
  onCloseDoc: (id: string) => void;
  onNewDoc: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  readMode: boolean;
  onToggleReadMode: () => void;
  onOpenCommandPalette: () => void;
  onOpenAllTools: () => void;
  activeDoc: PdfDocument | null;
  onRenameDoc: (id: string, newName: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  documents,
  activeDocId,
  onSelectDoc,
  onCloseDoc,
  onNewDoc,
  darkMode,
  onToggleDarkMode,
  readMode,
  onToggleReadMode,
  onOpenCommandPalette,
  onOpenAllTools,
  activeDoc,
  onRenameDoc,
}) => {
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [titleInput, setTitleInput] = React.useState('');

  const handleStartRename = () => {
    if (activeDoc) {
      setTitleInput(activeDoc.name.replace(/\.pdf$/i, ''));
      setIsEditingTitle(true);
    }
  };

  const handleFinishRename = () => {
    setIsEditingTitle(false);
    if (activeDoc && titleInput.trim()) {
      onRenameDoc(activeDoc.id, `${titleInput.trim()}.pdf`);
    }
  };

  return (
    <header className="h-11 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between px-2 sm:px-3 text-neutral-200 select-none z-30 flex-shrink-0">
      {/* Brand + Tab bar */}
      <div className="flex items-center space-x-2 overflow-x-auto h-full flex-1 mr-1 sm:mr-2 scrollbar-none">
        {/* PDFpb Brand Logo */}
        <div
          onClick={onOpenAllTools}
          className="flex items-center space-x-1.5 px-2 py-1 rounded bg-[#b70228] hover:bg-[#8a011e] text-white cursor-pointer transition-colors shadow-sm flex-shrink-0"
          title="PDFpb - Clique para abrir o Catálogo de Ferramentas"
        >
          <img
            src="./favicon.png"
            alt="PDFpb"
            className="w-4 h-4 rounded-xs shadow-xs object-contain"
            onError={(e) => {
              // fallback if relative path lookup fails in iframe
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <span className="font-bold text-xs tracking-wider">PDFpb</span>
        </div>

        {/* Document Tabs */}
        <div className="flex items-center space-x-1 h-full overflow-x-auto">
          {documents.map((doc) => {
            const isActive = doc.id === activeDocId;
            return (
              <div
                key={doc.id}
                onClick={() => onSelectDoc(doc.id)}
                className={`group relative flex items-center space-x-1.5 px-2.5 py-1.5 h-8 rounded-t text-xs font-medium cursor-pointer transition-all border-t-2 ${
                  isActive
                    ? 'bg-neutral-800 text-white border-[#b70228]'
                    : 'bg-neutral-950/60 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60 border-transparent'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                <span className="max-w-[90px] sm:max-w-[140px] truncate">{doc.name}</span>
                {doc.isDirty && (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[#b70228] flex-shrink-0"
                    title="Alterações não salvas"
                  />
                )}
                {documents.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseDoc(doc.id);
                    }}
                    className="p-0.5 rounded-full hover:bg-neutral-700 text-neutral-400 hover:text-white"
                    title="Fechar documento"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}

          {/* New Tab Button */}
          <button
            onClick={onNewDoc}
            className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            title="Abrir outro documento PDF"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editable Document Title in Middle (Desktop) */}
      {activeDoc && (
        <div className="hidden xl:flex items-center text-xs text-neutral-400 px-2 truncate">
          {isEditingTitle ? (
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleFinishRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleFinishRename();
                if (e.key === 'Escape') setIsEditingTitle(false);
              }}
              autoFocus
              className="bg-neutral-800 text-white px-2 py-0.5 rounded text-xs border border-[#b70228] outline-none"
            />
          ) : (
            <span
              onClick={handleStartRename}
              className="cursor-pointer hover:text-neutral-200 hover:underline flex items-center space-x-1"
              title="Clique para renomear o arquivo"
            >
              <span className="font-medium text-neutral-300">{activeDoc.name}</span>
              <span className="text-[10px] text-neutral-500">
                ({activeDoc.pageCount} {activeDoc.pageCount === 1 ? 'pág' : 'págs'})
              </span>
            </span>
          )}
        </div>
      )}

      {/* Right Action Controls */}
      <div className="flex items-center space-x-1 flex-shrink-0">
        {/* In-App PWA Install Button */}
        <PWAInstallButton />

        {/* Command Palette Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center space-x-1 px-2 py-1 text-xs text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded transition-colors"
          title="Buscar comandos e ferramentas (⌘K / Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-neutral-400" />
          <span className="hidden md:inline">Comandos</span>
          <kbd className="hidden lg:inline text-[9px] bg-neutral-900 px-1 py-0.5 rounded text-neutral-400 font-mono">⌘K</kbd>
        </button>

        {/* Read Mode Toggle */}
        <button
          onClick={onToggleReadMode}
          className={`p-1.5 rounded transition-colors text-xs flex items-center space-x-1 ${
            readMode
              ? 'bg-[#b70228] text-white'
              : 'hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200'
          }`}
          title="Modo Leitura sem distrações"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Leitura</span>
        </button>

        {/* Dark/Light Theme Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors"
          title={darkMode ? 'Alternar para Tema Claro' : 'Alternar para Tema Escuro'}
        >
          {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>
      </div>
    </header>
  );
};
