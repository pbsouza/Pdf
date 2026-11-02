import React from 'react';
import {
  FileText,
  Bookmark,
  MessageSquare,
  CheckSquare,
  Layers,
  Info,
  ChevronRight,
  ChevronLeft,
  X,
} from 'lucide-react';
import { SidebarTab, PdfDocument } from '../types/pdf';
import { ThumbnailsPanel } from './panels/ThumbnailsPanel';
import { BookmarksPanel } from './panels/BookmarksPanel';
import { CommentsPanel } from './panels/CommentsPanel';
import { FormFieldsPanel } from './panels/FormFieldsPanel';
import { LayersPanel } from './panels/LayersPanel';

interface SidePanelProps {
  document: PdfDocument;
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  currentPage: number;
  onSelectPage: (page: number) => void;
  selectedPages: number[];
  onTogglePageSelection: (page: number, isMulti: boolean) => void;
  onOpenProperties: () => void;
  onAddComment: (text: string, page: number) => void;
  onAddReply: (commentId: string, text: string) => void;
  onDeleteComment: (commentId: string) => void;
  onStatusChange: (commentId: string, status: 'open' | 'accepted' | 'resolved') => void;
  onFieldChange: (fieldId: string, value: string | boolean) => void;
  onClearForm: () => void;
  onToggleLayer: (layerId: string) => void;
}

export const SidePanel: React.FC<SidePanelProps> = ({
  document,
  activeTab,
  onTabChange,
  currentPage,
  onSelectPage,
  selectedPages,
  onTogglePageSelection,
  onOpenProperties,
  onAddComment,
  onAddReply,
  onDeleteComment,
  onStatusChange,
  onFieldChange,
  onClearForm,
  onToggleLayer,
}) => {
  const [panelWidth, setPanelWidth] = React.useState<number>(300);
  const [isResizing, setIsResizing] = React.useState<boolean>(false);

  // Resize handler
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      // Sidepanel is on the right, so moving left increases width
      const newWidth = window.innerWidth - e.clientX - 44; // 44px is the rail width
      if (newWidth >= 240 && newWidth <= 520) {
        setPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const railTabs = [
    { id: 'pages' as const, label: 'Miniaturas', icon: FileText, badge: document.pageCount },
    { id: 'bookmarks' as const, label: 'Marcadores', icon: Bookmark, badge: document.bookmarks.length },
    { id: 'comments' as const, label: 'Comentários', icon: MessageSquare, badge: document.comments.length },
    { id: 'forms' as const, label: 'Campos', icon: CheckSquare, badge: document.formFields.length },
    { id: 'layers' as const, label: 'Camadas', icon: Layers, badge: document.layers.length },
  ];

  const tabTitles: Record<string, string> = {
    pages: 'Páginas & Miniaturas',
    bookmarks: 'Marcadores do Documento',
    comments: 'Comentários & Revisão',
    forms: 'Campos Interativos',
    layers: 'Camadas do Documento',
  };

  return (
    <>
      {/* Mobile Backdrop when side panel is expanded */}
      {activeTab && (
        <div
          onClick={() => onTabChange(null)}
          className="md:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-2xs"
        />
      )}

      <div className="flex h-full select-none z-10 flex-shrink-0 no-print">
        {/* Expanded Side Panel Body */}
        {activeTab && (
          <div
            style={{ width: `${panelWidth}px` }}
            className="h-full border-l border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex flex-col relative max-md:fixed max-md:right-11 max-md:top-11 max-md:bottom-0 max-md:z-40 max-md:w-[85vw] max-md:max-w-[320px] max-md:shadow-2xl animate-fade-in md:animate-none"
          >
            {/* Resize handle bar on left edge (desktop only) */}
            <div
              onMouseDown={handleMouseDown}
              className="hidden md:block absolute top-0 bottom-0 left-0 w-1 cursor-col-resize hover:bg-[#b70228]/60 transition-colors z-20"
              title="Arraste para redimensionar (240–520 pt)"
            />

          {/* Panel Header */}
          <div className="h-9 px-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-100 dark:bg-neutral-850">
            <span className="font-semibold text-xs text-neutral-800 dark:text-neutral-200">
              {tabTitles[activeTab] || activeTab}
            </span>
            <button
              onClick={() => onTabChange(null)}
              className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              title="Fechar painel lateral (F4)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Panel Body */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'pages' && (
              <ThumbnailsPanel
                document={document}
                currentPage={currentPage}
                onPageSelect={onSelectPage}
                selectedPages={selectedPages}
                onTogglePageSelection={onTogglePageSelection}
              />
            )}
            {activeTab === 'bookmarks' && (
              <BookmarksPanel
                bookmarks={document.bookmarks}
                currentPage={currentPage}
                onSelectPage={onSelectPage}
              />
            )}
            {activeTab === 'comments' && (
              <CommentsPanel
                comments={document.comments}
                currentPage={currentPage}
                onSelectPage={onSelectPage}
                onAddComment={onAddComment}
                onAddReply={onAddReply}
                onDeleteComment={onDeleteComment}
                onStatusChange={onStatusChange}
              />
            )}
            {activeTab === 'forms' && (
              <FormFieldsPanel
                fields={document.formFields}
                onFieldChange={onFieldChange}
                onClearForm={onClearForm}
                onSelectPage={onSelectPage}
              />
            )}
            {activeTab === 'layers' && (
              <LayersPanel layers={document.layers} onToggleLayer={onToggleLayer} />
            )}
          </div>
        </div>
      )}

      {/* Dock Rail */}
      <div className="w-11 h-full bg-neutral-200/80 dark:bg-neutral-900 border-l border-neutral-300 dark:border-neutral-800 flex flex-col justify-between py-2 items-center flex-shrink-0">
        <div className="space-y-1.5 flex flex-col items-center">
          {railTabs.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(isActive ? null : item.id)}
                className={`relative p-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-[#b70228] text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
                }`}
                title={`${item.label} (Click to toggle)`}
              >
                <Icon className="w-4 h-4" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`absolute -top-0.5 -right-0.5 text-[9px] font-mono rounded-full px-1 min-w-[14px] text-center leading-tight ${
                      isActive ? 'bg-white text-[#b70228] font-bold' : 'bg-neutral-400 dark:bg-neutral-700 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Rail action: Document Properties */}
        <div className="flex flex-col items-center space-y-1">
          <button
            onClick={onOpenProperties}
            className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors"
            title="Document Properties (Metadata, Security, Fonts)"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
    </>
  );
};
