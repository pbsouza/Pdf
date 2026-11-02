import React from 'react';
import { X, Scissors, Download, FileText } from 'lucide-react';
import { splitPdf, downloadPdfBytes } from '../services/pdfService';
import { PdfDocument } from '../types/pdf';

interface SplitModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: PdfDocument;
  selectedPages: number[];
}

export const SplitModal: React.FC<SplitModalProps> = ({
  isOpen,
  onClose,
  document,
  selectedPages,
}) => {
  const [splitMode, setSplitMode] = React.useState<'every' | 'selected'>('every');
  const [everyN, setEveryN] = React.useState<number>(1);
  const [isProcessing, setIsProcessing] = React.useState(false);

  if (!isOpen) return null;

  const totalPages = document.pageCount;
  const calculatedFilesCount =
    splitMode === 'every'
      ? Math.ceil(totalPages / (everyN || 1))
      : 2;

  const handleSplit = async () => {
    setIsProcessing(true);
    try {
      const parts = await splitPdf(
        document.data,
        splitMode,
        splitMode === 'every' ? everyN : selectedPages
      );

      // Download each part
      parts.forEach((part, idx) => {
        setTimeout(() => {
          downloadPdfBytes(part.bytes, `${document.name.replace(/\.pdf$/i, '')}_${part.name}`);
        }, idx * 200);
      });

      alert(`Created and downloaded ${parts.length} files successfully!`);
      onClose();
    } catch (err: any) {
      alert(`Split error: ${err.message || err}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-850 rounded-xl shadow-2xl border border-neutral-300 dark:border-neutral-700 w-full max-w-md overflow-hidden flex flex-col text-xs">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800">
          <div className="flex items-center space-x-2">
            <Scissors className="w-4 h-4 text-[#b70228]" />
            <span className="font-semibold text-sm text-neutral-800 dark:text-neutral-100">
              Split Document
            </span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded text-neutral-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4">
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer font-medium text-neutral-800 dark:text-neutral-200">
              <input
                type="radio"
                name="splitMode"
                checked={splitMode === 'every'}
                onChange={() => setSplitMode('every')}
                className="text-[#b70228] focus:ring-[#b70228]"
              />
              <span>Dividir a cada N páginas</span>
            </label>

            {splitMode === 'every' && (
              <div className="pl-6 flex items-center space-x-2">
                <span className="text-neutral-500">Dividir a cada</span>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={everyN}
                  onChange={(e) => setEveryN(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-16 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded px-2 py-1 text-center font-mono outline-none"
                />
                <span className="text-neutral-500">páginas</span>
              </div>
            )}

            <label className="flex items-center space-x-2 cursor-pointer font-medium text-neutral-800 dark:text-neutral-200 pt-2">
              <input
                type="radio"
                name="splitMode"
                checked={splitMode === 'selected'}
                onChange={() => setSplitMode('selected')}
                className="text-[#b70228] focus:ring-[#b70228]"
              />
              <span>Dividir nas páginas atualmente selecionadas</span>
            </label>

            {splitMode === 'selected' && (
              <div className="pl-6 text-neutral-500 text-[11px]">
                {selectedPages.length > 0 ? (
                  <span>Páginas selecionadas: {selectedPages.join(', ')}</span>
                ) : (
                  <span className="text-amber-500">Nenhuma página selecionada na visualização de grade.</span>
                )}
              </div>
            )}
          </div>

          {/* Result summary banner */}
          <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 flex items-center space-x-2.5">
            <FileText className="w-4 h-4 text-[#b70228]" />
            <div className="text-neutral-700 dark:text-neutral-300">
              Gera <span className="font-bold text-[#b70228]">{calculatedFilesCount} arquivos</span> a partir de{' '}
              {totalPages} páginas.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-700 font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSplit}
            disabled={isProcessing || (splitMode === 'selected' && selectedPages.length === 0)}
            className="px-4 py-1.5 rounded bg-[#b70228] hover:bg-[#8a011e] text-white font-medium disabled:opacity-40"
          >
            {isProcessing ? 'Dividindo...' : 'Dividir e Baixar'}
          </button>
        </div>
      </div>
    </div>
  );
};
