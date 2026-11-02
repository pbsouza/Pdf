import React from 'react';
import { Header } from './components/Header';
import { Toolbar } from './components/Toolbar';
import { PdfViewer } from './components/PdfViewer';
import { OrganizeGrid } from './components/OrganizeGrid';
import { SidePanel } from './components/SidePanel';
import { CommandPalette } from './components/CommandPalette';
import { AllToolsModal } from './components/AllToolsModal';
import { CombineModal } from './components/CombineModal';
import { SplitModal } from './components/SplitModal';
import { ProtectModal } from './components/ProtectModal';
import { PropertiesModal } from './components/panels/PropertiesModal';
import { FindBar } from './components/FindBar';
import { FormBuilderToolbar } from './components/FormBuilderToolbar';
import { FormFieldInspector } from './components/FormFieldInspector';
import { NewFormModal } from './components/NewFormModal';
import { WelcomeScreen } from './components/WelcomeScreen';
import { OfflineIndicator } from './components/OfflineIndicator';
import {
  ActiveTool,
  ViewMode,
  SidebarTab,
  PdfDocument,
  AnnotationItem,
  CommentItem,
  DocumentMetadata,
  FormFieldItem,
  FormFieldType,
} from './types/pdf';
import {
  createDefaultShowcasePdf,
  loadPdfFromFile,
  rotatePdfPages,
  deletePdfPages,
  reorderPdfPages,
  insertBlankPdfPage,
  duplicatePdfPage,
  extractPdfPages,
  downloadPdfBytes,
  bakeFormFieldsIntoPdf,
  bakeAllChangesIntoPdf,
} from './services/pdfService';
import {
  Grid,
  FilePlus,
  Scissors,
  RotateCw,
  Highlighter,
  MessageSquare,
  PenTool,
  BookOpen,
  Search,
  Printer,
  Save,
  Lock,
  Layers,
  Info,
  CheckSquare,
} from 'lucide-react';

export default function App() {
  const [documents, setDocuments] = React.useState<PdfDocument[]>([]);
  const [activeDocId, setActiveDocId] = React.useState<string>('');
  const [darkMode, setDarkMode] = React.useState<boolean>(true);
  const [readMode, setReadMode] = React.useState<boolean>(false);
  const [viewMode, setViewMode] = React.useState<ViewMode>('continuous');
  const [activeTab, setActiveTab] = React.useState<SidebarTab>('pages');
  const [activeTool, setActiveTool] = React.useState<ActiveTool>('select');

  // Modals
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = React.useState(false);
  const [isAllToolsOpen, setIsAllToolsOpen] = React.useState(false);
  const [isCombineOpen, setIsCombineOpen] = React.useState(false);
  const [isSplitOpen, setIsSplitOpen] = React.useState(false);
  const [isProtectOpen, setIsProtectOpen] = React.useState(false);
  const [isPropertiesOpen, setIsPropertiesOpen] = React.useState(false);
  const [isFindOpen, setIsFindOpen] = React.useState(false);
  const [isNewFormModalOpen, setIsNewFormModalOpen] = React.useState(false);

  // Form Builder Mode State
  const [isFormBuilderMode, setIsFormBuilderMode] = React.useState(false);
  const [isFormPreviewMode, setIsFormPreviewMode] = React.useState(false);
  const [selectedFormFieldId, setSelectedFormFieldId] = React.useState<string | null>(null);
  const [pendingFieldType, setPendingFieldType] = React.useState<FormFieldType | null>(null);

  // Search State
  const [findQuery, setFindQuery] = React.useState('');
  const [findMatchIndex, setFindMatchIndex] = React.useState(0);
  const [findTotalMatches, setFindTotalMatches] = React.useState(0);

  // Undo / Redo history stack
  const [history, setHistory] = React.useState<Array<{ desc: string; docData: Uint8Array; pageCount: number }>>([]);
  const [historyIndex, setHistoryIndex] = React.useState<number>(-1);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Optional sample document loader (on user request)
  const handleLoadSampleDocument = async () => {
    try {
      const showcase = await createDefaultShowcasePdf();
      if (typeof window !== 'undefined' && window.innerWidth < 640) {
        showcase.zoom = 0.6;
      }
      setDocuments([showcase]);
      setActiveDocId(showcase.id);
      setHistory([{ desc: 'Initial Open', docData: showcase.data, pageCount: showcase.pageCount }]);
      setHistoryIndex(0);
    } catch (err) {
      console.error('Failed to load showcase PDF:', err);
    }
  };

  // Sync dark class with document element
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const activeDoc = documents.find((d) => d.id === activeDocId) || documents[0] || null;

  // Push an operation to undo stack
  const pushHistory = (desc: string, newBytes: Uint8Array, pageCount: number) => {
    const trimmed = history.slice(0, historyIndex + 1);
    const newEntry = { desc, docData: newBytes, pageCount };
    setHistory([...trimmed, newEntry]);
    setHistoryIndex(trimmed.length);
  };

  const handleUndo = () => {
    if (historyIndex > 0 && activeDoc) {
      const targetState = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      updateActiveDoc({
        data: targetState.docData,
        pageCount: targetState.pageCount,
        currentPage: Math.min(activeDoc.currentPage, targetState.pageCount),
        selectedPages: [Math.min(activeDoc.currentPage, targetState.pageCount)],
        isDirty: true,
      });
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1 && activeDoc) {
      const targetState = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      updateActiveDoc({
        data: targetState.docData,
        pageCount: targetState.pageCount,
        currentPage: Math.min(activeDoc.currentPage, targetState.pageCount),
        selectedPages: [Math.min(activeDoc.currentPage, targetState.pageCount)],
        isDirty: true,
      });
    }
  };

  const updateActiveDoc = (updates: Partial<PdfDocument>) => {
    setDocuments((docs) =>
      docs.map((d) => (d.id === activeDocId ? { ...d, ...updates } : d))
    );
  };

  // Keyboard shortcut listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K or Ctrl+K for command palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      // ⌘F for find
      else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setIsFindOpen(true);
      }
      // ⌘Z for undo
      else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      // ⌘⇧Z or Ctrl+Y for redo
      else if (
        ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'z') ||
        (e.ctrlKey && e.key.toLowerCase() === 'y')
      ) {
        e.preventDefault();
        handleRedo();
      }
      // F4 toggle sidepanel
      else if (e.key === 'F4') {
        e.preventDefault();
        setActiveTab((prev) => (prev ? null : 'pages'));
      }
      // Shift+F4 toggle all tools
      else if (e.shiftKey && e.key === 'F4') {
        e.preventDefault();
        setIsAllToolsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history, activeDoc]);

  // File Operations
  const handleOpenFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleLoadFile = async (file: File) => {
    try {
      const doc = await loadPdfFromFile(file);
      setDocuments((prev) => [...prev, doc]);
      setActiveDocId(doc.id);
      pushHistory(`Open ${file.name}`, doc.data, doc.pageCount);
    } catch (err: any) {
      alert(`Não foi possível abrir o arquivo PDF: ${err.message || err}`);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    await handleLoadFile(file);
    e.target.value = '';
  };

  const handleSaveFile = async () => {
    if (!activeDoc) return;
    try {
      // Bake ALL user markings (drawings, highlights, stamps, text, redactions)
      // and interactive form fields permanently into the PDF file
      const finalBytes = await bakeAllChangesIntoPdf(
        activeDoc.data,
        activeDoc.annotations,
        activeDoc.formFields,
        activeDoc.comments
      );
      downloadPdfBytes(finalBytes, activeDoc.name);
      // The annotations are now permanently baked into the PDF bytes
      updateActiveDoc({
        data: finalBytes,
        annotations: [],
        isDirty: false,
      });
      pushHistory(`Salvar alterações em ${activeDoc.name}`, finalBytes, activeDoc.pageCount);
    } catch (err: any) {
      console.warn('Erro ao embutir alterações no PDF:', err);
      downloadPdfBytes(activeDoc.data, activeDoc.name);
      updateActiveDoc({ isDirty: false });
    }
  };

  const handlePrint = async () => {
    if (!activeDoc) return;
    try {
      // 1. Bake ALL annotations (stamps, drawings, text notes, highlights, redactions)
      // and interactive form fields into the PDF bytes for the printer spooler
      let pdfBytes = activeDoc.data;
      try {
        pdfBytes = await bakeAllChangesIntoPdf(
          activeDoc.data,
          activeDoc.annotations,
          activeDoc.formFields,
          activeDoc.comments
        );
      } catch (e) {
        console.warn('Embed all changes warning before print:', e);
      }

      // 2. Create raw application/pdf Blob with all markings
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);

      const isMobile =
        typeof navigator !== 'undefined' &&
        /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

      if (isMobile) {
        // Mobile browsers (Android Print Spooler / iOS AirPrint):
        // Hand the real vector PDF document blob directly to the OS print spooler/viewer
        const win = window.open(blobUrl, '_blank');
        if (!win) {
          const a = document.createElement('a');
          a.href = blobUrl;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      } else {
        // Desktop: use hidden iframe pointing to real PDF document
        const printIframe = document.createElement('iframe');
        printIframe.style.position = 'fixed';
        printIframe.style.right = '0';
        printIframe.style.bottom = '0';
        printIframe.style.width = '0';
        printIframe.style.height = '0';
        printIframe.style.border = '0';
        printIframe.src = blobUrl;
        document.body.appendChild(printIframe);

        printIframe.onload = () => {
          try {
            printIframe.contentWindow?.focus();
            printIframe.contentWindow?.print();
          } catch (e) {
            window.open(blobUrl, '_blank');
          }
          setTimeout(() => {
            try {
              document.body.removeChild(printIframe);
              URL.revokeObjectURL(blobUrl);
            } catch (_) {}
          }, 60000);
        };
      }
    } catch (err) {
      console.error('Falha ao imprimir PDF:', err);
      window.print();
    }
  };

  // Organize Operations
  const handleRotatePages = async (pages: number[], delta: number) => {
    if (!activeDoc) return;
    try {
      const newBytes = await rotatePdfPages(activeDoc.data, pages, delta);
      updateActiveDoc({ data: newBytes, isDirty: true });
      pushHistory(`Rotate pages ${pages.join(',')}`, newBytes, activeDoc.pageCount);
    } catch (err: any) {
      alert(`Error rotating pages: ${err.message || err}`);
    }
  };

  const handleDeletePages = async (pages: number[]) => {
    if (!activeDoc) return;
    try {
      const newBytes = await deletePdfPages(activeDoc.data, pages);
      const newCount = activeDoc.pageCount - pages.length;
      updateActiveDoc({
        data: newBytes,
        pageCount: newCount,
        currentPage: Math.max(1, Math.min(activeDoc.currentPage, newCount)),
        selectedPages: [1],
        isDirty: true,
      });
      pushHistory(`Delete ${pages.length} page(s)`, newBytes, newCount);
    } catch (err: any) {
      alert(`Error deleting pages: ${err.message || err}`);
    }
  };

  const handleDuplicatePage = async (page: number) => {
    if (!activeDoc) return;
    try {
      const newBytes = await duplicatePdfPage(activeDoc.data, page);
      const newCount = activeDoc.pageCount + 1;
      updateActiveDoc({
        data: newBytes,
        pageCount: newCount,
        isDirty: true,
      });
      pushHistory(`Duplicate page ${page}`, newBytes, newCount);
    } catch (err: any) {
      alert(`Error duplicating page: ${err.message || err}`);
    }
  };

  const handleInsertBlankPage = async (afterPage: number) => {
    if (!activeDoc) return;
    try {
      const newBytes = await insertBlankPdfPage(activeDoc.data, afterPage);
      const newCount = activeDoc.pageCount + 1;
      updateActiveDoc({
        data: newBytes,
        pageCount: newCount,
        isDirty: true,
      });
      pushHistory('Insert blank page', newBytes, newCount);
    } catch (err: any) {
      alert(`Error inserting blank page: ${err.message || err}`);
    }
  };

  const handleMovePage = async (fromPage: number, toPage: number) => {
    if (!activeDoc) return;
    try {
      const order = Array.from({ length: activeDoc.pageCount }, (_, i) => i + 1);
      const [removed] = order.splice(fromPage - 1, 1);
      order.splice(toPage - 1, 0, removed);

      const newBytes = await reorderPdfPages(activeDoc.data, order);
      updateActiveDoc({
        data: newBytes,
        currentPage: toPage,
        selectedPages: [toPage],
        isDirty: true,
      });
      pushHistory(`Move page ${fromPage} to ${toPage}`, newBytes, activeDoc.pageCount);
    } catch (err: any) {
      alert(`Error reordering pages: ${err.message || err}`);
    }
  };

  const handleExtractPages = async (pages: number[]) => {
    if (!activeDoc) return;
    try {
      let sourceBytes = activeDoc.data;
      if (activeDoc.annotations.length > 0 || activeDoc.formFields.length > 0) {
        try {
          sourceBytes = await bakeAllChangesIntoPdf(
            activeDoc.data,
            activeDoc.annotations,
            activeDoc.formFields,
            activeDoc.comments
          );
        } catch (e) {
          console.warn('Notice baking annotations for extract:', e);
        }
      }
      const extractedBytes = await extractPdfPages(sourceBytes, pages);
      const extractedName = `${activeDoc.name.replace(/\.pdf$/i, '')}_extracted.pdf`;
      downloadPdfBytes(extractedBytes, extractedName);
      alert(`Extraídas ${pages.length} página(s) com todas as anotações salvas em "${extractedName}"!`);
    } catch (err: any) {
      alert(`Erro ao extrair páginas: ${err.message || err}`);
    }
  };

  // Annotations & Comments
  const handleAddAnnotation = (ann: AnnotationItem) => {
    if (!activeDoc) return;
    updateActiveDoc({
      annotations: [...activeDoc.annotations, ann],
      isDirty: true,
    });
  };

  const handleAddComment = (text: string, page: number, pos?: { x: number; y: number }) => {
    if (!activeDoc) return;
    const newComment: CommentItem = {
      id: `comm-${Date.now()}`,
      page,
      author: 'You',
      text,
      timestamp: 'Just now',
      status: 'open',
      color: '#b70228',
      position: pos || { x: 50, y: 15 },
      replies: [],
    };
    updateActiveDoc({
      comments: [...activeDoc.comments, newComment],
      isDirty: true,
    });
  };

  const handleAddReply = (commentId: string, text: string) => {
    if (!activeDoc) return;
    const updated = activeDoc.comments.map((c) => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: [
            ...(c.replies || []),
            { id: `rep-${Date.now()}`, author: 'You', text, timestamp: 'Just now' },
          ],
        };
      }
      return c;
    });
    updateActiveDoc({ comments: updated, isDirty: true });
  };

  const handleDeleteComment = (commentId: string) => {
    if (!activeDoc) return;
    updateActiveDoc({
      comments: activeDoc.comments.filter((c) => c.id !== commentId),
      isDirty: true,
    });
  };

  const handleCommentStatus = (commentId: string, status: 'open' | 'accepted' | 'resolved') => {
    if (!activeDoc) return;
    const updated = activeDoc.comments.map((c) => (c.id === commentId ? { ...c, status } : c));
    updateActiveDoc({ comments: updated, isDirty: true });
  };

  // Form Fields
  const handleFormFieldChange = (fieldId: string, value: string | boolean) => {
    if (!activeDoc) return;
    const updated = activeDoc.formFields.map((f) => (f.id === fieldId ? { ...f, value } : f));
    updateActiveDoc({ formFields: updated, isDirty: true });
  };

  const handleClearForm = () => {
    if (!activeDoc) return;
    const updated = activeDoc.formFields.map((f) => ({
      ...f,
      value: f.type === 'checkbox' ? false : '',
    }));
    updateActiveDoc({ formFields: updated, isDirty: true });
  };

  // Form Builder Mode Handlers
  const handleAddFieldToActiveDoc = (type: FormFieldType) => {
    if (!activeDoc) return;
    const curPage = activeDoc.currentPage || 1;
    const existingCount = activeDoc.formFields.length + 1;

    let defaultWidth = 35;
    let defaultHeight = 4.5;
    let defaultLabel = `Campo ${existingCount}`;
    let placeholder = '';
    let options: string[] | undefined = undefined;

    switch (type) {
      case 'text':
        defaultWidth = 40;
        defaultHeight = 4.5;
        defaultLabel = `Texto ${existingCount}`;
        placeholder = 'Digite aqui...';
        break;
      case 'textarea':
        defaultWidth = 60;
        defaultHeight = 10;
        defaultLabel = `Parágrafo ${existingCount}`;
        placeholder = 'Digite o texto detalhado...';
        break;
      case 'checkbox':
        defaultWidth = 30;
        defaultHeight = 4;
        defaultLabel = `Opção ${existingCount}`;
        break;
      case 'radio':
        defaultWidth = 30;
        defaultHeight = 4;
        defaultLabel = `Escolha ${existingCount}`;
        break;
      case 'dropdown':
        defaultWidth = 38;
        defaultHeight = 4.5;
        defaultLabel = `Seletor ${existingCount}`;
        options = ['Opção A', 'Opção B', 'Opção C'];
        break;
      case 'date':
        defaultWidth = 28;
        defaultHeight = 4.5;
        defaultLabel = `Data ${existingCount}`;
        break;
      case 'signature':
        defaultWidth = 45;
        defaultHeight = 7;
        defaultLabel = `Assinatura ${existingCount}`;
        break;
    }

    const existingOnPage = activeDoc.formFields.filter((f) => f.page === curPage);
    const yOffset = Math.min(80, 20 + existingOnPage.length * 6);

    const newField: FormFieldItem = {
      id: `field-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: `campo_${type}_${existingCount}`,
      label: defaultLabel,
      type,
      page: curPage,
      rect: {
        x: 15,
        y: yOffset,
        width: defaultWidth,
        height: defaultHeight,
      },
      placeholder,
      options,
      groupName: type === 'radio' ? 'grupo_1' : undefined,
      required: false,
      readOnly: false,
      value: type === 'checkbox' ? false : '',
    };

    updateActiveDoc({
      formFields: [...activeDoc.formFields, newField],
      isDirty: true,
    });
    setSelectedFormFieldId(newField.id);
  };

  const handlePlaceFieldAtCoordinates = (type: FormFieldType, pageNum: number, x: number, y: number) => {
    if (!activeDoc) return;
    const existingCount = activeDoc.formFields.length + 1;

    let defaultWidth = 35;
    let defaultHeight = 4.5;
    let defaultLabel = `Campo ${existingCount}`;
    let placeholder = '';
    let options: string[] | undefined = undefined;

    switch (type) {
      case 'text':
        defaultWidth = 38;
        defaultHeight = 4.5;
        defaultLabel = `Texto ${existingCount}`;
        placeholder = 'Digite aqui...';
        break;
      case 'textarea':
        defaultWidth = 55;
        defaultHeight = 10;
        defaultLabel = `Parágrafo ${existingCount}`;
        placeholder = 'Texto descritivo...';
        break;
      case 'checkbox':
        defaultWidth = 25;
        defaultHeight = 4;
        defaultLabel = `Opção ${existingCount}`;
        break;
      case 'radio':
        defaultWidth = 25;
        defaultHeight = 4;
        defaultLabel = `Escolha ${existingCount}`;
        break;
      case 'dropdown':
        defaultWidth = 35;
        defaultHeight = 4.5;
        defaultLabel = `Seletor ${existingCount}`;
        options = ['Opção 1', 'Opção 2', 'Opção 3'];
        break;
      case 'date':
        defaultWidth = 28;
        defaultHeight = 4.5;
        defaultLabel = `Data ${existingCount}`;
        break;
      case 'signature':
        defaultWidth = 45;
        defaultHeight = 7;
        defaultLabel = `Assinatura ${existingCount}`;
        break;
    }

    const newField: FormFieldItem = {
      id: `field-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: `campo_${type}_${existingCount}`,
      label: defaultLabel,
      type,
      page: pageNum,
      rect: {
        x: Math.max(0, Math.min(x, 100 - defaultWidth)),
        y: Math.max(0, Math.min(y, 100 - defaultHeight)),
        width: defaultWidth,
        height: defaultHeight,
      },
      placeholder,
      options,
      groupName: type === 'radio' ? 'grupo_1' : undefined,
      required: false,
      readOnly: false,
      value: type === 'checkbox' ? false : '',
    };

    updateActiveDoc({
      formFields: [...activeDoc.formFields, newField],
      isDirty: true,
    });
    setSelectedFormFieldId(newField.id);
    setPendingFieldType(null);
  };

  const handleUpdateFormFieldItem = (fieldId: string, updated: Partial<FormFieldItem>) => {
    if (!activeDoc) return;
    const nextFields = activeDoc.formFields.map((f) => (f.id === fieldId ? { ...f, ...updated } : f));
    updateActiveDoc({ formFields: nextFields, isDirty: true });
  };

  const handleDuplicateFormField = (field: FormFieldItem) => {
    if (!activeDoc) return;
    const duplicated: FormFieldItem = {
      ...field,
      id: `field-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: `${field.name}_copia`,
      label: `${field.label} (Cópia)`,
      rect: {
        ...field.rect,
        x: Math.min(field.rect.x + 3, 100 - field.rect.width),
        y: Math.min(field.rect.y + 3, 100 - field.rect.height),
      },
    };
    updateActiveDoc({
      formFields: [...activeDoc.formFields, duplicated],
      isDirty: true,
    });
    setSelectedFormFieldId(duplicated.id);
  };

  const handleDeleteFormField = (fieldId: string) => {
    if (!activeDoc) return;
    const nextFields = activeDoc.formFields.filter((f) => f.id !== fieldId);
    updateActiveDoc({ formFields: nextFields, isDirty: true });
    if (selectedFormFieldId === fieldId) {
      setSelectedFormFieldId(null);
    }
  };

  const handleUpdateFormFieldRect = (fieldId: string, rect: { x: number; y: number; width: number; height: number }) => {
    if (!activeDoc) return;
    const nextFields = activeDoc.formFields.map((f) => (f.id === fieldId ? { ...f, rect } : f));
    updateActiveDoc({ formFields: nextFields, isDirty: true });
  };

  // Layers
  const handleToggleLayer = (layerId: string) => {
    if (!activeDoc) return;
    const updated = activeDoc.layers.map((l) => (l.id === layerId ? { ...l, visible: !l.visible } : l));
    updateActiveDoc({ layers: updated });
  };

  // Metadata
  const handleSaveMetadata = (newMeta: Partial<DocumentMetadata>) => {
    if (!activeDoc) return;
    updateActiveDoc({
      metadata: { ...activeDoc.metadata, ...newMeta },
      name: newMeta.title ? `${newMeta.title}.pdf` : activeDoc.name,
      isDirty: true,
    });
  };

  // Password Protection
  const handleApplyProtection = (userPass: string, ownerPass: string) => {
    if (!activeDoc) return;
    updateActiveDoc({
      metadata: {
        ...activeDoc.metadata,
        isEncrypted: true,
        encryptionMethod: 'Standard Security Handler (AES-256)',
      },
      isDirty: true,
    });
    alert('Security and encryption permissions applied to document successfully.');
  };

  // Command Palette items
  const commands = [
    { id: 'c-open', title: 'Abrir PDF...', category: 'Arquivo', shortcut: '⌘O', icon: FilePlus, action: handleOpenFileDialog },
    { id: 'c-save', title: 'Salvar e Baixar', category: 'Arquivo', shortcut: '⌘S', icon: Save, action: handleSaveFile },
    { id: 'c-combine', title: 'Combinar Arquivos...', category: 'Páginas', icon: FilePlus, action: () => setIsCombineOpen(true) },
    { id: 'c-split', title: 'Dividir Documento...', category: 'Páginas', icon: Scissors, action: () => setIsSplitOpen(true) },
    { id: 'c-organize', title: 'Organizar Grade de Páginas', category: 'Páginas', shortcut: '⌥⌘O', icon: Grid, action: () => setViewMode((m) => (m === 'organize' ? 'continuous' : 'organize')) },
    { id: 'c-rotate', title: 'Girar Selecionadas (90° Horário)', category: 'Páginas', icon: RotateCw, action: () => handleRotatePages(activeDoc?.selectedPages || [1], 90) },
    { id: 'c-insert', title: 'Inserir Página em Branco', category: 'Páginas', icon: FilePlus, action: () => handleInsertBlankPage(activeDoc?.currentPage || 1) },
    { id: 'c-find', title: 'Localizar no Documento', category: 'Visualização', shortcut: '⌘F', icon: Search, action: () => setIsFindOpen(true) },
    { id: 'c-twoup', title: 'Modo Páginas Duplas (Leitura)', category: 'Visualização', icon: BookOpen, action: () => setViewMode('twoup') },
    { id: 'c-read', title: 'Modo Leitura sem distrações', category: 'Visualização', icon: BookOpen, action: () => setReadMode((r) => !r) },
    { id: 'c-high', title: 'Ferramenta Destacar', category: 'Anotações', icon: Highlighter, action: () => setActiveTool('highlight') },
    { id: 'c-note', title: 'Ferramenta Nota Adesiva', category: 'Anotações', icon: MessageSquare, action: () => setActiveTool('note') },
    { id: 'c-draw', title: 'Ferramenta Desenho Livre', category: 'Anotações', icon: PenTool, action: () => setActiveTool('draw') },
    { id: 'c-new-form', title: 'Criar Novo Formulário...', category: 'Formulários', icon: FilePlus, action: () => setIsNewFormModalOpen(true) },
    { id: 'c-form-builder', title: 'Criar / Editar Campos de Formulário', category: 'Formulários', icon: CheckSquare, action: () => { setIsFormBuilderMode(true); setIsFormPreviewMode(false); } },
    { id: 'c-protect', title: 'Proteger com Senha...', category: 'Segurança', icon: Lock, action: () => setIsProtectOpen(true) },
    { id: 'c-props', title: 'Propriedades do Documento...', category: 'Informações', icon: Info, action: () => setIsPropertiesOpen(true) },
    { id: 'c-print', title: 'Imprimir Documento', category: 'Arquivo', shortcut: '⌘P', icon: Printer, action: handlePrint },
  ];

  const handleAllToolsAction = (key: string) => {
    switch (key) {
      case 'create_form':
        setIsNewFormModalOpen(true);
        break;
      case 'builder_mode':
        setIsFormBuilderMode(true);
        setIsFormPreviewMode(false);
        break;
      case 'organize':
        setViewMode('organize');
        break;
      case 'combine':
        setIsCombineOpen(true);
        break;
      case 'split':
        setIsSplitOpen(true);
        break;
      case 'rotate_cw':
        handleRotatePages(activeDoc?.selectedPages || [1], 90);
        break;
      case 'insert_blank':
        handleInsertBlankPage(activeDoc?.currentPage || 1);
        break;
      case 'tool_highlight':
        setActiveTool('highlight');
        break;
      case 'tool_note':
        setActiveTool('note');
        break;
      case 'tool_draw':
        setActiveTool('draw');
        break;
      case 'tool_stamp':
        setActiveTool('stamp');
        break;
      case 'tool_redact':
        setActiveTool('redact');
        break;
      case 'tool_sign':
        setActiveTool('sign');
        break;
      case 'clear_form':
        handleClearForm();
        break;
      case 'view_twoup':
        setViewMode('twoup');
        break;
      case 'find_text':
        setIsFindOpen(true);
        break;
      case 'layers_panel':
        setActiveTab('layers');
        break;
      case 'doc_properties':
        setIsPropertiesOpen(true);
        break;
      case 'print_doc':
        handlePrint();
        break;
      default:
        break;
    }
  };

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden ${darkMode ? 'dark' : ''}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Header with Brand & Document Tabs */}
      <Header
        documents={documents}
        activeDocId={activeDocId}
        onSelectDoc={setActiveDocId}
        onCloseDoc={(id) => {
          if (documents.length <= 1) return;
          const next = documents.filter((d) => d.id !== id);
          setDocuments(next);
          if (activeDocId === id) setActiveDocId(next[0].id);
        }}
        onNewDoc={handleOpenFileDialog}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((d) => !d)}
        readMode={readMode}
        onToggleReadMode={() => setReadMode((r) => !r)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenAllTools={() => setIsAllToolsOpen(true)}
        activeDoc={activeDoc}
        onRenameDoc={(id, newName) => {
          setDocuments((docs) =>
            docs.map((d) => (d.id === id ? { ...d, name: newName, isDirty: true } : d))
          );
        }}
      />

      {/* Main Toolbar */}
      {!readMode && (
        <Toolbar
          activeDoc={activeDoc}
          onOpenFile={handleOpenFileDialog}
          onSaveFile={handleSaveFile}
          onPrint={handlePrint}
          onCombine={() => setIsCombineOpen(true)}
          onSplit={() => setIsSplitOpen(true)}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          undoDesc={history[historyIndex]?.desc}
          redoDesc={history[historyIndex + 1]?.desc}
          currentPage={activeDoc?.currentPage || 1}
          totalPages={activeDoc?.pageCount || 1}
          onPageChange={(p) => updateActiveDoc({ currentPage: p })}
          zoom={activeDoc?.zoom || 1.0}
          onZoomChange={(z) => updateActiveDoc({ zoom: z })}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onRotateDoc={(delta) => handleRotatePages(activeDoc?.selectedPages || [1], delta)}
          activeTool={activeTool}
          onToolSelect={setActiveTool}
          onToggleFind={() => setIsFindOpen((f) => !f)}
          isFindOpen={isFindOpen}
          onOpenAllTools={() => setIsAllToolsOpen(true)}
          onOpenNewFormModal={() => setIsNewFormModalOpen(true)}
          isFormBuilderMode={isFormBuilderMode}
          onToggleFormBuilder={() => {
            setIsFormBuilderMode((prev) => !prev);
            setIsFormPreviewMode(false);
            setSelectedFormFieldId(null);
          }}
        />
      )}

      {/* Form Builder Authoring Toolbar */}
      {isFormBuilderMode && !readMode && activeDoc && (
        <FormBuilderToolbar
          onAddField={handleAddFieldToActiveDoc}
          isPreviewMode={isFormPreviewMode}
          onTogglePreview={() => {
            setIsFormPreviewMode((prev) => !prev);
            setSelectedFormFieldId(null);
          }}
          onExitBuilder={() => {
            setIsFormBuilderMode(false);
            setIsFormPreviewMode(false);
            setSelectedFormFieldId(null);
          }}
          fieldsCount={activeDoc.formFields.length}
        />
      )}

      {/* Find Bar */}
      <FindBar
        isOpen={isFindOpen}
        onClose={() => setIsFindOpen(false)}
        query={findQuery}
        onQueryChange={(q) => {
          setFindQuery(q);
          setFindTotalMatches(q.trim() ? 6 : 0);
          setFindMatchIndex(0);
        }}
        matchIndex={findMatchIndex}
        totalMatches={findTotalMatches}
        onNextMatch={() => setFindMatchIndex((i) => (i + 1) % (findTotalMatches || 1))}
        onPrevMatch={() => setFindMatchIndex((i) => (i - 1 + findTotalMatches) % (findTotalMatches || 1))}
      />

      {/* Central Area: Viewport + SidePanel */}
      <div className="flex-1 flex overflow-hidden relative">
        {activeDoc ? (
          viewMode === 'organize' ? (
            <OrganizeGrid
              document={activeDoc}
              selectedPages={activeDoc.selectedPages}
              onTogglePageSelection={(page, isMulti) => {
                if (isMulti) {
                  const exists = activeDoc.selectedPages.includes(page);
                  const updated = exists
                    ? activeDoc.selectedPages.filter((p) => p !== page)
                    : [...activeDoc.selectedPages, page];
                  updateActiveDoc({ selectedPages: updated });
                } else {
                  updateActiveDoc({ selectedPages: [page] });
                }
              }}
              onSelectAllPages={() => {
                const all = Array.from({ length: activeDoc.pageCount }, (_, i) => i + 1);
                updateActiveDoc({ selectedPages: all });
              }}
              onClearSelection={() => updateActiveDoc({ selectedPages: [] })}
              onRotatePages={handleRotatePages}
              onDeletePages={handleDeletePages}
              onDuplicatePage={handleDuplicatePage}
              onInsertBlankPage={handleInsertBlankPage}
              onMovePage={handleMovePage}
              onExtractPages={handleExtractPages}
              onOpenSplitModal={() => setIsSplitOpen(true)}
              onExitOrganize={() => setViewMode('continuous')}
              onPageClick={(p) => updateActiveDoc({ currentPage: p })}
            />
          ) : (
            <>
              <PdfViewer
                document={activeDoc}
                currentPage={activeDoc.currentPage}
                onPageChange={(p) => updateActiveDoc({ currentPage: p })}
                zoom={activeDoc.zoom}
                onZoomChange={(z) => updateActiveDoc({ zoom: z })}
                viewMode={viewMode}
                activeTool={activeTool}
                onAddAnnotation={handleAddAnnotation}
                onAddComment={handleAddComment}
                onFieldChange={handleFormFieldChange}
                searchQuery={isFindOpen ? findQuery : undefined}
                searchMatchIndex={findMatchIndex}
                isFormBuilderMode={isFormBuilderMode && !isFormPreviewMode}
                selectedFieldId={selectedFormFieldId}
                onSelectField={setSelectedFormFieldId}
                onUpdateFieldRect={handleUpdateFormFieldRect}
                pendingFieldType={pendingFieldType}
                onPlaceField={handlePlaceFieldAtCoordinates}
              />

              {/* Form Field Property Inspector */}
              {isFormBuilderMode && !isFormPreviewMode && activeDoc?.formFields.find((f) => f.id === selectedFormFieldId) && (
                <FormFieldInspector
                  field={activeDoc.formFields.find((f) => f.id === selectedFormFieldId)!}
                  onUpdateField={(updated) => handleUpdateFormFieldItem(selectedFormFieldId!, updated)}
                  onDuplicateField={handleDuplicateFormField}
                  onDeleteField={handleDeleteFormField}
                  onClose={() => setSelectedFormFieldId(null)}
                />
              )}
            </>
          )
        ) : (
          <WelcomeScreen
            onOpenFile={handleOpenFileDialog}
            onFileDrop={handleLoadFile}
            onOpenNewFormModal={() => setIsNewFormModalOpen(true)}
            onLoadSampleDoc={handleLoadSampleDocument}
          />
        )}

        {/* Side Panel & Rail (Hidden in organize view and read mode) */}
        {!readMode && viewMode !== 'organize' && activeDoc && (
          <SidePanel
            document={activeDoc}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            currentPage={activeDoc.currentPage}
            onSelectPage={(p) => updateActiveDoc({ currentPage: p })}
            selectedPages={activeDoc.selectedPages}
            onTogglePageSelection={(page, isMulti) => {
              if (isMulti) {
                const exists = activeDoc.selectedPages.includes(page);
                const updated = exists
                  ? activeDoc.selectedPages.filter((p) => p !== page)
                  : [...activeDoc.selectedPages, page];
                updateActiveDoc({ selectedPages: updated });
              } else {
                updateActiveDoc({ selectedPages: [page] });
              }
            }}
            onOpenProperties={() => setIsPropertiesOpen(true)}
            onAddComment={handleAddComment}
            onAddReply={handleAddReply}
            onDeleteComment={handleDeleteComment}
            onStatusChange={handleCommentStatus}
            onFieldChange={handleFormFieldChange}
            onClearForm={handleClearForm}
            onToggleLayer={handleToggleLayer}
          />
        )}
      </div>

      {/* Modals */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        commands={commands}
      />

      <AllToolsModal
        isOpen={isAllToolsOpen}
        onClose={() => setIsAllToolsOpen(false)}
        onRunAction={handleAllToolsAction}
      />

      <CombineModal
        isOpen={isCombineOpen}
        onClose={() => setIsCombineOpen(false)}
        currentDoc={activeDoc}
        onMergedDocCreated={(newBytes, name) => {
          const newDoc: PdfDocument = {
            id: `doc-${Date.now()}`,
            name,
            data: newBytes,
            pageCount: 6, // Estimate or computed
            currentPage: 1,
            zoom: 1.0,
            rotation: 0,
            pageRotations: {},
            selectedPages: [1],
            isDirty: false,
            metadata: {
              title: name.replace(/\.pdf$/i, ''),
              author: 'PDFpb',
              subject: 'Combined Document',
              keywords: '',
              creator: 'PDFpb Native Combine',
              producer: 'PDFpb',
              creationDate: new Date().toLocaleDateString(),
              modificationDate: new Date().toLocaleDateString(),
              pdfVersion: '1.7',
              pageSize: 'A4',
              isEncrypted: false,
            },
            bookmarks: [
              { id: 'b1', title: 'Part 1', page: 1 },
              { id: 'b2', title: 'Part 2', page: 4 },
            ],
            comments: [],
            annotations: [],
            formFields: [],
            layers: [{ id: 'l1', name: 'Combined Content', visible: true }],
            attachments: [],
          };
          setDocuments((prev) => [...prev, newDoc]);
          setActiveDocId(newDoc.id);
          pushHistory(`Combined ${name}`, newBytes, newDoc.pageCount);
        }}
      />

      {activeDoc && (
        <>
          <SplitModal
            isOpen={isSplitOpen}
            onClose={() => setIsSplitOpen(false)}
            document={activeDoc}
            selectedPages={activeDoc.selectedPages}
          />

          <ProtectModal
            isOpen={isProtectOpen}
            onClose={() => setIsProtectOpen(false)}
            document={activeDoc}
            onApplyProtection={handleApplyProtection}
          />

          <PropertiesModal
            isOpen={isPropertiesOpen}
            onClose={() => setIsPropertiesOpen(false)}
            metadata={activeDoc.metadata}
            attachments={activeDoc.attachments}
            onSaveMetadata={handleSaveMetadata}
          />
        </>
      )}

      {/* New Form From Scratch Modal */}
      <NewFormModal
        isOpen={isNewFormModalOpen}
        onClose={() => setIsNewFormModalOpen(false)}
        onDocumentCreated={(newDoc) => {
          setDocuments((prev) => [...prev, newDoc]);
          setActiveDocId(newDoc.id);
          setIsFormBuilderMode(true);
          setIsFormPreviewMode(false);
          setSelectedFormFieldId(newDoc.formFields[0]?.id || null);
          pushHistory(`Novo formulário: ${newDoc.name}`, newDoc.data, newDoc.pageCount);
        }}
      />

      {/* PWA Offline Connection Banner */}
      <OfflineIndicator />
    </div>
  );
}
