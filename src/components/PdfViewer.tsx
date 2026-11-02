import React from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import {
  ActiveTool,
  ViewMode,
  PdfDocument,
  AnnotationItem,
  FormFieldItem,
  FormFieldType,
} from '../types/pdf';
import { Move, GripVertical, CheckSquare, CircleDot, Type, AlignLeft, Calendar, PenLine, ListFilter } from 'lucide-react';

interface PdfViewerProps {
  document: PdfDocument;
  currentPage: number;
  onPageChange: (page: number) => void;
  zoom: number;
  onZoomChange?: (zoom: number) => void;
  viewMode: ViewMode;
  activeTool: ActiveTool;
  onAddAnnotation: (annotation: AnnotationItem) => void;
  onAddComment: (text: string, page: number, position?: { x: number; y: number }) => void;
  onFieldChange: (fieldId: string, value: string | boolean) => void;
  searchQuery?: string;
  searchMatchIndex?: number;
  // Form Builder Mode Props
  isFormBuilderMode?: boolean;
  selectedFieldId?: string | null;
  onSelectField?: (fieldId: string | null) => void;
  onUpdateFieldRect?: (fieldId: string, rect: { x: number; y: number; width: number; height: number }) => void;
  pendingFieldType?: FormFieldType | null;
  onPlaceField?: (type: FormFieldType, pageNum: number, x: number, y: number) => void;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  document,
  currentPage,
  onPageChange,
  zoom,
  onZoomChange,
  viewMode,
  activeTool,
  onAddAnnotation,
  onAddComment,
  onFieldChange,
  searchQuery,
  searchMatchIndex,
  isFormBuilderMode = false,
  selectedFieldId = null,
  onSelectField,
  onUpdateFieldRect,
  pendingFieldType = null,
  onPlaceField,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [pdfProxy, setPdfProxy] = React.useState<any>(null);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [drawPoints, setDrawPoints] = React.useState<Array<{ x: number; y: number }>>([]);
  const [dragStart, setDragStart] = React.useState<{ x: number; y: number } | null>(null);
  const [dragCurrent, setDragCurrent] = React.useState<{ x: number; y: number } | null>(null);

  // Multi-touch Pinch to Zoom & Trackpad gesture state
  const [isPinching, setIsPinching] = React.useState(false);
  const [showZoomIndicator, setShowZoomIndicator] = React.useState(false);
  const initialPinchDistRef = React.useRef<number | null>(null);
  const initialZoomRef = React.useRef<number>(zoom);
  const currentZoomRef = React.useRef<number>(zoom);
  const hideIndicatorTimerRef = React.useRef<any>(null);

  React.useEffect(() => {
    currentZoomRef.current = zoom;
  }, [zoom]);

  // Attach non-passive touch listeners on container for reliable pinch-to-zoom
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        // Prevent native viewport zoom so only the PDF pages scale
        e.preventDefault();
        const t0 = e.touches[0];
        const t1 = e.touches[1];
        const dist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
        initialPinchDistRef.current = dist;
        initialZoomRef.current = currentZoomRef.current;
        setIsPinching(true);
        setShowZoomIndicator(true);
        if (hideIndicatorTimerRef.current) {
          clearTimeout(hideIndicatorTimerRef.current);
        }
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && initialPinchDistRef.current && initialPinchDistRef.current > 10) {
        e.preventDefault();
        const t0 = e.touches[0];
        const t1 = e.touches[1];
        const dist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
        const scale = dist / initialPinchDistRef.current;
        const targetZoom = Math.min(3.5, Math.max(0.3, Math.round(initialZoomRef.current * scale * 100) / 100));

        if (Math.abs(targetZoom - currentZoomRef.current) >= 0.02) {
          const oldZoom = currentZoomRef.current;
          onZoomChange?.(targetZoom);

          if (oldZoom > 0) {
            const containerRect = container.getBoundingClientRect();
            const focalX = (t0.clientX + t1.clientX) / 2 - containerRect.left;
            const focalY = (t0.clientY + t1.clientY) / 2 - containerRect.top;
            const ratio = targetZoom / oldZoom;

            container.scrollLeft = (container.scrollLeft + focalX) * ratio - focalX;
            container.scrollTop = (container.scrollTop + focalY) * ratio - focalY;
          }
        }
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        initialPinchDistRef.current = null;
        setIsPinching(false);
        if (hideIndicatorTimerRef.current) {
          clearTimeout(hideIndicatorTimerRef.current);
        }
        hideIndicatorTimerRef.current = setTimeout(() => {
          setShowZoomIndicator(false);
        }, 1200);
      }
    };

    // Trackpad pinch-to-zoom (wheel with ctrlKey/metaKey)
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setShowZoomIndicator(true);
        if (hideIndicatorTimerRef.current) {
          clearTimeout(hideIndicatorTimerRef.current);
        }
        hideIndicatorTimerRef.current = setTimeout(() => {
          setShowZoomIndicator(false);
        }, 1200);

        const zoomStep = -e.deltaY * 0.005;
        const targetZoom = Math.min(3.5, Math.max(0.3, Math.round((currentZoomRef.current + zoomStep) * 100) / 100));

        if (Math.abs(targetZoom - currentZoomRef.current) >= 0.01) {
          const oldZoom = currentZoomRef.current;
          onZoomChange?.(targetZoom);

          if (oldZoom > 0) {
            const containerRect = container.getBoundingClientRect();
            const focalX = e.clientX - containerRect.left;
            const focalY = e.clientY - containerRect.top;
            const ratio = targetZoom / oldZoom;

            container.scrollLeft = (container.scrollLeft + focalX) * ratio - focalX;
            container.scrollTop = (container.scrollTop + focalY) * ratio - focalY;
          }
        }
      }
    };

    container.addEventListener('touchstart', onTouchStart, { passive: false });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd, { passive: false });
    container.addEventListener('touchcancel', onTouchEnd, { passive: false });
    container.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('touchcancel', onTouchEnd);
      container.removeEventListener('wheel', onWheel);
      if (hideIndicatorTimerRef.current) {
        clearTimeout(hideIndicatorTimerRef.current);
      }
    };
  }, [onZoomChange]);

  // Load PDF with pdfjsLib
  React.useEffect(() => {
    let isCancelled = false;

    async function loadPdf() {
      try {
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(document.data) as any });
        const proxy = await loadingTask.promise;
        if (!isCancelled) {
          setPdfProxy(proxy);
        }
      } catch (err) {
        console.warn('PDF.js parse notice, falling back to structured representation:', err);
      }
    }

    loadPdf();

    return () => {
      isCancelled = true;
    };
  }, [document.data]);

  // Handle page visibility observation for continuous scroll
  const handleScroll = () => {
    if (viewMode !== 'continuous' || !containerRef.current) return;
    const pageEls = containerRef.current.querySelectorAll('[data-page-num]');
    const containerTop = containerRef.current.scrollTop;
    const containerHeight = containerRef.current.clientHeight;

    for (let i = 0; i < pageEls.length; i++) {
      const el = pageEls[i] as HTMLElement;
      const top = el.offsetTop - containerRef.current.offsetTop;
      const height = el.clientHeight;
      if (top + height / 2 >= containerTop && top < containerTop + containerHeight) {
        const pNum = parseInt(el.getAttribute('data-page-num') || '1', 10);
        if (pNum !== currentPage) {
          onPageChange(pNum);
        }
        break;
      }
    }
  };

  // Determine pages to display based on viewMode
  let pagesToRender: number[] = [];
  if (viewMode === 'continuous') {
    pagesToRender = Array.from({ length: document.pageCount }, (_, i) => i + 1);
  } else if (viewMode === 'twoup') {
    const p1 = currentPage % 2 === 0 ? currentPage - 1 : currentPage;
    pagesToRender = [p1];
    if (p1 + 1 <= document.pageCount) {
      pagesToRender.push(p1 + 1);
    }
  } else {
    pagesToRender = [currentPage];
  }

  // Mouse events for markup tools & placing fields
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, pageNum: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;

    // Check if placing a new form field in builder mode
    if (isFormBuilderMode && pendingFieldType && onPlaceField) {
      onPlaceField(pendingFieldType, pageNum, Math.max(2, xPct - 5), Math.max(2, yPct - 2));
      return;
    }

    if (activeTool === 'draw') {
      setIsDrawing(true);
      setDrawPoints([{ x: xPct, y: yPct }]);
    } else if (activeTool === 'highlight' || activeTool === 'redact') {
      setDragStart({ x: xPct, y: yPct });
      setDragCurrent({ x: xPct, y: yPct });
    } else if (activeTool === 'note') {
      const text = prompt('Digite o comentário para a nota:');
      if (text && text.trim()) {
        onAddComment(text.trim(), pageNum, { x: xPct, y: yPct });
      }
    } else if (activeTool === 'stamp') {
      onAddAnnotation({
        id: `ann-${Date.now()}`,
        page: pageNum,
        type: 'stamp',
        stampType: 'APPROVED',
        color: '#b70228',
        rect: { x: Math.max(0, xPct - 10), y: Math.max(0, yPct - 4), width: 22, height: 7 },
      });
    } else if (activeTool === 'sign') {
      onAddAnnotation({
        id: `ann-${Date.now()}`,
        page: pageNum,
        type: 'text',
        text: 'Arthur Pendelton (Verified SHA-256)',
        color: '#b70228',
        rect: { x: Math.max(0, xPct - 15), y: Math.max(0, yPct - 3), width: 35, height: 6 },
      });
    } else if (activeTool === 'text') {
      const text = prompt('Digite o texto para o balão:');
      if (text && text.trim()) {
        onAddAnnotation({
          id: `ann-${Date.now()}`,
          page: pageNum,
          type: 'text',
          text: text.trim(),
          color: '#1e293b',
          rect: { x: xPct, y: yPct, width: 25, height: 5 },
        });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;

    if (isDrawing && activeTool === 'draw') {
      setDrawPoints((prev) => [...prev, { x: xPct, y: yPct }]);
    } else if (dragStart && (activeTool === 'highlight' || activeTool === 'redact')) {
      setDragCurrent({ x: xPct, y: yPct });
    }
  };

  const handleMouseUp = (pageNum: number) => {
    if (isDrawing && activeTool === 'draw' && drawPoints.length > 1) {
      onAddAnnotation({
        id: `draw-${Date.now()}`,
        page: pageNum,
        type: 'draw',
        color: '#b70228',
        strokeWidth: 3,
        points: drawPoints,
      });
      setIsDrawing(false);
      setDrawPoints([]);
    } else if (dragStart && dragCurrent && (activeTool === 'highlight' || activeTool === 'redact')) {
      const x = Math.min(dragStart.x, dragCurrent.x);
      const y = Math.min(dragStart.y, dragCurrent.y);
      const width = Math.abs(dragCurrent.x - dragStart.x);
      const height = Math.abs(dragCurrent.y - dragStart.y);

      if (width > 1 && height > 0.5) {
        onAddAnnotation({
          id: `${activeTool}-${Date.now()}`,
          page: pageNum,
          type: activeTool,
          color: activeTool === 'highlight' ? '#fde047' : '#000000',
          opacity: activeTool === 'highlight' ? 0.45 : 1,
          rect: { x, y, width, height },
        });
      }
      setDragStart(null);
      setDragCurrent(null);
    }
  };

  // Check if draft watermark layer is active
  const isDraftWatermarkVisible = document.layers.some(
    (l) => l.name.toLowerCase().includes('draft') && l.visible
  );

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="pdf-viewer-container flex-1 overflow-auto bg-neutral-200/90 dark:bg-neutral-950 p-2 sm:p-4 md:p-6 flex flex-col items-center justify-start select-none relative"
      style={{
        touchAction: 'pan-x pan-y',
        cursor:
          pendingFieldType
            ? 'crosshair'
            : activeTool === 'draw'
            ? 'crosshair'
            : activeTool === 'highlight' || activeTool === 'redact'
            ? 'text'
            : activeTool === 'note' || activeTool === 'stamp' || activeTool === 'sign'
            ? 'copy'
            : 'default',
      }}
    >
      {/* Floating Zoom Feedback Badge for Pinch / Trackpad Gestures */}
      {showZoomIndicator && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-200 animate-in fade-in zoom-in-95 no-print">
          <div className="px-4 py-1.5 rounded-full bg-neutral-900/90 dark:bg-neutral-800/95 text-white text-xs font-mono font-medium shadow-2xl backdrop-blur-md border border-neutral-700/60 dark:border-neutral-600/60 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-neutral-300">Gesto de Pinça:</span>
            <span className="font-semibold text-white">{Math.round(zoom * 100)}%</span>
          </div>
        </div>
      )}
      <div
        className={`pdf-pages-wrapper flex ${
          viewMode === 'twoup' ? 'flex-row space-x-6' : 'flex-col space-y-8'
        } items-center justify-center`}
      >
        {pagesToRender.map((pageNum) => (
          <PageRenderItem
            key={pageNum}
            pageNum={pageNum}
            pdfProxy={pdfProxy}
            zoom={zoom}
            rotation={document.pageRotations[pageNum] || document.rotation || 0}
            document={document}
            onMouseDown={(e) => handleMouseDown(e, pageNum)}
            onMouseMove={handleMouseMove}
            onMouseUp={() => handleMouseUp(pageNum)}
            isDraftWatermarkVisible={isDraftWatermarkVisible}
            onFieldChange={onFieldChange}
            searchQuery={searchQuery}
            isFormBuilderMode={isFormBuilderMode}
            selectedFieldId={selectedFieldId}
            onSelectField={onSelectField}
            onUpdateFieldRect={onUpdateFieldRect}
          />
        ))}
      </div>
    </div>
  );
};

interface PageRenderItemProps {
  pageNum: number;
  pdfProxy: any;
  zoom: number;
  rotation: number;
  document: PdfDocument;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseUp: () => void;
  isDraftWatermarkVisible: boolean;
  onFieldChange: (fieldId: string, value: string | boolean) => void;
  searchQuery?: string;
  isFormBuilderMode?: boolean;
  selectedFieldId?: string | null;
  onSelectField?: (fieldId: string | null) => void;
  onUpdateFieldRect?: (fieldId: string, rect: { x: number; y: number; width: number; height: number }) => void;
}

const PageRenderItem: React.FC<PageRenderItemProps> = ({
  pageNum,
  pdfProxy,
  zoom,
  rotation,
  document,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  isDraftWatermarkVisible,
  onFieldChange,
  searchQuery,
  isFormBuilderMode = false,
  selectedFieldId = null,
  onSelectField,
  onUpdateFieldRect,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const pageContainerRef = React.useRef<HTMLDivElement>(null);
  const [renderSuccess, setRenderSuccess] = React.useState(false);
  const [pageSize, setPageSize] = React.useState<{ width: number; height: number }>({ width: 595, height: 842 });

  // Dragging / Resizing state for Form Builder Mode
  const [draggingFieldId, setDraggingFieldId] = React.useState<string | null>(null);
  const [dragOffset, setDragOffset] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [resizingFieldId, setResizingFieldId] = React.useState<string | null>(null);

  // Dynamic dimensions based on exact PDF page bounding box
  const displayWidth = Math.round(pageSize.width * zoom);
  const displayHeight = Math.round(pageSize.height * zoom);

  // Render using pdfjs with high-DPI (Retina/mobile) super-sampling
  React.useEffect(() => {
    let isCancelled = false;
    let renderTask: any = null;

    async function renderPage() {
      if (!pdfProxy || !canvasRef.current) return;
      try {
        const page = await pdfProxy.getPage(pageNum);
        if (isCancelled) return;

        // Query real natural page size and aspect ratio
        const unscaledViewport = page.getViewport({ scale: 1, rotation });
        if (
          Math.abs(unscaledViewport.width - pageSize.width) > 0.5 ||
          Math.abs(unscaledViewport.height - pageSize.height) > 0.5
        ) {
          setPageSize({ width: unscaledViewport.width, height: unscaledViewport.height });
        }

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d', { alpha: false });
        if (!context) return;

        // Calculate high-resolution scale based on device pixel ratio
        const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
        const effectiveDpr = Math.max(dpr, 1.75);
        // Clamp scale: high enough for crisp fonts/images on mobile & retina, capped to prevent memory exhaustion
        const renderScale = Math.min(Math.max(zoom * effectiveDpr, 2.0), 4.5);

        const viewport = page.getViewport({ scale: renderScale, rotation });
        canvas.width = Math.round(viewport.width);
        canvas.height = Math.round(viewport.height);

        // Maximize anti-aliasing and image smoothing quality
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';

        const renderContext = {
          canvasContext: context,
          viewport,
        };

        renderTask = page.render(renderContext);
        await renderTask.promise;
        if (!isCancelled) {
          setRenderSuccess(true);
        }
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.warn('Canvas render fallback used for page', pageNum);
        }
      }
    }

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTask) {
        try {
          renderTask.cancel();
        } catch (_) {}
      }
    };
  }, [pdfProxy, pageNum, zoom, rotation, pageSize.width, pageSize.height]);

  const pageAnnotations = document.annotations.filter((a) => a.page === pageNum);
  const pageFormFields = document.formFields.filter((f) => f.page === pageNum);
  const pageComments = document.comments.filter((c) => c.page === pageNum);

  // Handle Drag Move in Form Builder Mode
  const handleFieldDragStart = (e: React.MouseEvent, field: FormFieldItem) => {
    e.stopPropagation();
    if (!isFormBuilderMode) return;
    onSelectField?.(field.id);
    setDraggingFieldId(field.id);
    const rect = pageContainerRef.current?.getBoundingClientRect();
    if (rect) {
      const clickXPct = ((e.clientX - rect.left) / rect.width) * 100;
      const clickYPct = ((e.clientY - rect.top) / rect.height) * 100;
      setDragOffset({
        x: clickXPct - field.rect.x,
        y: clickYPct - field.rect.y,
      });
    }
  };

  const handleResizeStart = (e: React.MouseEvent, field: FormFieldItem) => {
    e.stopPropagation();
    if (!isFormBuilderMode) return;
    onSelectField?.(field.id);
    setResizingFieldId(field.id);
  };

  const handlePageContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    onMouseMove(e);
    if (!isFormBuilderMode || (!draggingFieldId && !resizingFieldId)) return;
    const rect = pageContainerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const curXPct = ((e.clientX - rect.left) / rect.width) * 100;
    const curYPct = ((e.clientY - rect.top) / rect.height) * 100;

    if (draggingFieldId) {
      const field = pageFormFields.find((f) => f.id === draggingFieldId);
      if (field && onUpdateFieldRect) {
        const newX = Math.max(0, Math.min(curXPct - dragOffset.x, 100 - field.rect.width));
        const newY = Math.max(0, Math.min(curYPct - dragOffset.y, 100 - field.rect.height));
        onUpdateFieldRect(draggingFieldId, {
          ...field.rect,
          x: Math.round(newX * 10) / 10,
          y: Math.round(newY * 10) / 10,
        });
      }
    } else if (resizingFieldId) {
      const field = pageFormFields.find((f) => f.id === resizingFieldId);
      if (field && onUpdateFieldRect) {
        const newW = Math.max(4, Math.min(curXPct - field.rect.x, 100 - field.rect.x));
        const newH = Math.max(2, Math.min(curYPct - field.rect.y, 100 - field.rect.y));
        onUpdateFieldRect(resizingFieldId, {
          ...field.rect,
          width: Math.round(newW * 10) / 10,
          height: Math.round(newH * 10) / 10,
        });
      }
    }
  };

  const handlePageContainerMouseUp = () => {
    onMouseUp();
    setDraggingFieldId(null);
    setResizingFieldId(null);
  };

  const fieldIcons: Record<string, React.ElementType> = {
    text: Type,
    textarea: AlignLeft,
    checkbox: CheckSquare,
    radio: CircleDot,
    dropdown: ListFilter,
    date: Calendar,
    signature: PenLine,
  };

  return (
    <div
      ref={pageContainerRef}
      data-page-num={pageNum}
      style={{
        width: `${displayWidth}px`,
        height: `${displayHeight}px`,
      }}
      onMouseDown={onMouseDown}
      onMouseMove={handlePageContainerMouseMove}
      onMouseUp={handlePageContainerMouseUp}
      className="pdf-page-container relative bg-white shadow-2xl rounded-sm border border-neutral-300 dark:border-neutral-800 flex-shrink-0 transition-transform overflow-hidden select-text"
    >
      {/* Real Canvas from PDF.js */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full pointer-events-none" />

      {/* Fallback structured content if canvas is initializing */}
      {!renderSuccess && (
        <div className="absolute inset-0 p-8 flex flex-col justify-between bg-white text-neutral-800 no-print">
          <div>
            <div className="text-[#b70228] font-bold text-xl mb-1">
              {document.name} — Página {pageNum}
            </div>
            <div className="h-0.5 w-16 bg-[#b70228] mb-6" />
            <div className="space-y-3 text-neutral-600 text-xs">
              <p>Ambiente nativo de leitura e edição PDFpb.</p>
              <p>Renderização de alta fidelidade ativa a {(zoom * 100).toFixed(0)}% de zoom.</p>
            </div>
          </div>
          <div className="text-right text-xs font-mono text-neutral-400">Página {pageNum} de {document.pageCount}</div>
        </div>
      )}

      {/* Optional Draft Watermark Layer */}
      {isDraftWatermarkVisible && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10">
          <span className="text-red-500/20 text-7xl font-black tracking-widest -rotate-45 font-mono uppercase border-8 border-dashed border-red-500/20 px-8 py-4 rounded">
            RASCUNHO
          </span>
        </div>
      )}

      {/* Annotation Overlays */}
      {pageAnnotations.map((ann) => {
        if (ann.type === 'highlight' && ann.rect) {
          return (
            <div
              key={ann.id}
              style={{
                left: `${ann.rect.x}%`,
                top: `${ann.rect.y}%`,
                width: `${ann.rect.width}%`,
                height: `${ann.rect.height}%`,
                backgroundColor: ann.color || '#fef08a',
                opacity: ann.opacity ?? 0.45,
              }}
              className="absolute pointer-events-none mix-blend-multiply rounded-xs"
            />
          );
        }

        if (ann.type === 'redact' && ann.rect) {
          return (
            <div
              key={ann.id}
              style={{
                left: `${ann.rect.x}%`,
                top: `${ann.rect.y}%`,
                width: `${ann.rect.width}%`,
                height: `${ann.rect.height}%`,
              }}
              className="absolute bg-black pointer-events-none shadow-xs flex items-center justify-center"
            >
              <span className="text-[9px] text-neutral-500 font-mono tracking-widest">CENSURADO</span>
            </div>
          );
        }

        if (ann.type === 'stamp' && ann.rect) {
          return (
            <div
              key={ann.id}
              style={{
                left: `${ann.rect.x}%`,
                top: `${ann.rect.y}%`,
                width: `${ann.rect.width}%`,
                height: `${ann.rect.height}%`,
                borderColor: ann.color || '#b70228',
                color: ann.color || '#b70228',
              }}
              className="absolute border-2 border-double rounded px-2 py-1 flex items-center justify-center font-bold tracking-wider font-mono text-xs uppercase -rotate-6 bg-white/80 backdrop-blur-2xs shadow-sm"
            >
              {ann.stampType || 'APROVADO'}
            </div>
          );
        }

        if (ann.type === 'text' && ann.rect) {
          return (
            <div
              key={ann.id}
              style={{
                left: `${ann.rect.x}%`,
                top: `${ann.rect.y}%`,
                color: ann.color || '#1e293b',
              }}
              className="absolute bg-white/95 border border-neutral-300 shadow-sm rounded px-2 py-1 text-xs font-serif font-medium pointer-events-none"
            >
              {ann.text}
            </div>
          );
        }

        if (ann.type === 'draw' && ann.points && ann.points.length > 1) {
          const pathData = ann.points
            .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x}% ${pt.y}%`)
            .join(' ');
          return (
            <svg
              key={ann.id}
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                d={pathData}
                fill="none"
                stroke={ann.color || '#b70228'}
                strokeWidth={ann.strokeWidth || 3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          );
        }

        return null;
      })}

      {/* Interactive Form Fields Overlay */}
      {pageFormFields.map((field) => {
        const isSelected = isFormBuilderMode && selectedFieldId === field.id;
        const Icon = fieldIcons[field.type] || Type;

        return (
          <div
            key={field.id}
            style={{
              left: `${field.rect.x}%`,
              top: `${field.rect.y}%`,
              width: `${field.rect.width}%`,
              height: `${field.rect.height}%`,
            }}
            onClick={(e) => {
              if (isFormBuilderMode) {
                e.stopPropagation();
                onSelectField?.(field.id);
              }
            }}
            className={`absolute z-20 flex flex-col justify-center transition-all ${
              isFormBuilderMode
                ? `cursor-move border-2 ${
                    isSelected
                      ? 'border-[#b70228] ring-4 ring-[#b70228]/25 bg-blue-50/70 shadow-md'
                      : 'border-blue-400/80 bg-blue-50/40 hover:border-blue-600 hover:bg-blue-50/60'
                  }`
                : ''
            }`}
          >
            {/* Form Builder Title Badge */}
            {isFormBuilderMode && (
              <div
                onMouseDown={(e) => handleFieldDragStart(e, field)}
                className={`absolute -top-5 left-0 px-1.5 py-0.5 rounded-t text-[9px] font-mono font-medium flex items-center space-x-1 whitespace-nowrap shadow-xs pointer-events-auto ${
                  isSelected ? 'bg-[#b70228] text-white' : 'bg-blue-600 text-white'
                }`}
              >
                <Icon className="w-2.5 h-2.5" />
                <span>{field.label || field.name}</span>
                {field.required && <span className="text-amber-300 font-bold">*</span>}
              </div>
            )}

            {/* Field Input Widget */}
            {field.type === 'text' && (
              <input
                type="text"
                disabled={isFormBuilderMode}
                value={String(field.value || '')}
                placeholder={field.placeholder || field.label || ''}
                onChange={(e) => onFieldChange(field.id, e.target.value)}
                className="w-full h-full bg-blue-50/40 hover:bg-blue-50/80 focus:bg-white border border-blue-400/40 focus:border-blue-600 rounded-xs px-2 text-xs text-neutral-900 font-sans outline-none shadow-xs transition-colors"
              />
            )}

            {field.type === 'textarea' && (
              <textarea
                disabled={isFormBuilderMode}
                value={String(field.value || '')}
                placeholder={field.placeholder || field.label || ''}
                onChange={(e) => onFieldChange(field.id, e.target.value)}
                className="w-full h-full bg-blue-50/40 hover:bg-blue-50/80 focus:bg-white border border-blue-400/40 focus:border-blue-600 rounded-xs p-1.5 text-xs text-neutral-900 font-sans outline-none shadow-xs resize-none"
              />
            )}

            {field.type === 'date' && (
              <input
                type="date"
                disabled={isFormBuilderMode}
                value={String(field.value || '')}
                onChange={(e) => onFieldChange(field.id, e.target.value)}
                className="w-full h-full bg-blue-50/40 hover:bg-blue-50/80 focus:bg-white border border-blue-400/40 focus:border-blue-600 rounded-xs px-2 text-xs text-neutral-900 font-mono outline-none shadow-xs"
              />
            )}

            {field.type === 'checkbox' && (
              <div className="flex items-center space-x-2 px-1">
                <input
                  type="checkbox"
                  disabled={isFormBuilderMode}
                  checked={Boolean(field.value)}
                  onChange={(e) => onFieldChange(field.id, e.target.checked)}
                  className="w-4 h-4 rounded text-[#b70228] focus:ring-[#b70228] cursor-pointer"
                />
                {!isFormBuilderMode && field.label && (
                  <span className="text-xs text-neutral-700 truncate">{field.label}</span>
                )}
              </div>
            )}

            {field.type === 'radio' && (
              <div className="flex items-center space-x-2 px-1">
                <input
                  type="radio"
                  name={field.groupName || 'radio-group'}
                  disabled={isFormBuilderMode}
                  checked={Boolean(field.value)}
                  onChange={(e) => onFieldChange(field.id, e.target.checked)}
                  className="w-4 h-4 text-[#b70228] focus:ring-[#b70228] cursor-pointer"
                />
                {!isFormBuilderMode && field.label && (
                  <span className="text-xs text-neutral-700 truncate">{field.label}</span>
                )}
              </div>
            )}

            {field.type === 'dropdown' && (
              <select
                disabled={isFormBuilderMode}
                value={String(field.value || '')}
                onChange={(e) => onFieldChange(field.id, e.target.value)}
                className="w-full h-full bg-blue-50/40 hover:bg-blue-50/80 focus:bg-white border border-blue-400/40 focus:border-blue-600 rounded-xs px-2 text-xs text-neutral-900 outline-none"
              >
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}

            {field.type === 'signature' && (
              <div className="w-full h-full border-2 border-dashed border-[#b70228]/60 bg-[#b70228]/5 rounded flex items-center justify-between px-3 cursor-pointer hover:bg-[#b70228]/10 transition-colors">
                <span className="text-[#b70228] font-serif italic text-xs font-semibold">
                  {String(field.value || 'Clique para assinar')}
                </span>
                <span className="text-[9px] bg-[#b70228] text-white px-1.5 py-0.5 rounded font-mono">
                  SHA-256
                </span>
              </div>
            )}

            {/* Resize Handle at Bottom-Right in Form Builder Mode */}
            {isFormBuilderMode && isSelected && (
              <div
                onMouseDown={(e) => handleResizeStart(e, field)}
                className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#b70228] cursor-se-resize rounded-tl-xs flex items-center justify-center shadow-xs"
                title="Arraste para redimensionar"
              >
                <div className="w-1.5 h-1.5 bg-white rounded-full pointer-events-none" />
              </div>
            )}
          </div>
        );
      })}

      {/* Sticky Note Badges */}
      {pageComments.map((comment) => (
        <div
          key={comment.id}
          style={{
            left: `${comment.position?.x ?? 50}%`,
            top: `${comment.position?.y ?? 10}%`,
          }}
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2 group/pin cursor-pointer"
          title={`${comment.author}: ${comment.text}`}
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg ring-2 ring-white transform group-hover/pin:scale-110 transition-transform"
            style={{ backgroundColor: comment.color || '#b70228' }}
          >
            💬
          </div>
        </div>
      ))}
    </div>
  );
};
