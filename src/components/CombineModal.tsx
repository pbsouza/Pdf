import React from 'react';
import { X, FilePlus, Trash2, ArrowUp, ArrowDown, Upload } from 'lucide-react';
import { combinePdfFiles, downloadPdfBytes, bakeAllChangesIntoPdf } from '../services/pdfService';
import { PdfDocument } from '../types/pdf';

interface CombineModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDoc: PdfDocument | null;
  onMergedDocCreated: (newDocBytes: Uint8Array, name: string) => void;
}

interface FileItem {
  id: string;
  name: string;
  bytes: Uint8Array;
}

export const CombineModal: React.FC<CombineModalProps> = ({
  isOpen,
  onClose,
  currentDoc,
  onMergedDocCreated,
}) => {
  const [files, setFiles] = React.useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = React.useState(false);

  React.useEffect(() => {
    async function initCurrentDoc() {
      if (isOpen && currentDoc) {
        let currentBytes = currentDoc.data;
        if (currentDoc.annotations.length > 0 || currentDoc.formFields.length > 0) {
          try {
            currentBytes = await bakeAllChangesIntoPdf(
              currentDoc.data,
              currentDoc.annotations,
              currentDoc.formFields,
              currentDoc.comments
            );
          } catch (e) {
            console.warn('Notice baking annotations for combine:', e);
          }
        }
        setFiles([
          {
            id: 'current-doc',
            name: currentDoc.name,
            bytes: currentBytes,
          },
        ]);
      }
    }
    initCurrentDoc();
  }, [isOpen, currentDoc]);

  if (!isOpen) return null;

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const addedFiles = Array.from(e.target.files);

    addedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const bytes = new Uint8Array(reader.result as ArrayBuffer);
        setFiles((prev) => [
          ...prev,
          {
            id: `file-${Date.now()}-${Math.random()}`,
            name: file.name,
            bytes,
          },
        ]);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleMove = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= files.length) return;
    const newFiles = [...files];
    const temp = newFiles[index];
    newFiles[index] = newFiles[target];
    newFiles[target] = temp;
    setFiles(newFiles);
  };

  const handleRemove = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      alert('Please select at least 2 PDF documents to combine.');
      return;
    }

    setIsProcessing(true);
    try {
      const mergedBytes = await combinePdfFiles(files);
      onMergedDocCreated(mergedBytes, 'Combined Document.pdf');
      onClose();
    } catch (err: any) {
      alert(`Error combining PDFs: ${err.message || err}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-850 rounded-xl shadow-2xl border border-neutral-300 dark:border-neutral-700 w-full max-w-lg overflow-hidden flex flex-col text-xs">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800">
          <div className="flex items-center space-x-2">
            <FilePlus className="w-4 h-4 text-[#b70228]" />
            <span className="font-semibold text-sm text-neutral-800 dark:text-neutral-100">
              Combine PDF Files
            </span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded text-neutral-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* File Queue list */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          <p className="text-neutral-500">
            Combine multiple PDF files into one. Drag or reorder documents into your preferred order:
          </p>

          <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg divide-y divide-neutral-200 dark:divide-neutral-700 max-h-56 overflow-y-auto">
            {files.map((file, idx) => (
              <div key={file.id} className="flex items-center justify-between p-2.5 bg-neutral-50 dark:bg-neutral-900">
                <div className="flex items-center space-x-2 truncate">
                  <span className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-[10px] font-mono font-bold text-neutral-600 dark:text-neutral-300">
                    {idx + 1}
                  </span>
                  <span className="font-medium text-neutral-800 dark:text-neutral-200 truncate">{file.name}</span>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleMove(idx, -1)}
                    disabled={idx === 0}
                    className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded disabled:opacity-30"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(idx, 1)}
                    disabled={idx === files.length - 1}
                    className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded disabled:opacity-30"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleRemove(file.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-950/60 rounded text-red-500"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add file button */}
          <label className="flex items-center justify-center space-x-2 border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-[#b70228] p-4 rounded-xl cursor-pointer text-neutral-600 dark:text-neutral-300 hover:text-[#b70228] transition-colors">
            <Upload className="w-4 h-4" />
            <span className="font-medium">Adicionar mais arquivos PDF...</span>
            <input type="file" accept=".pdf" multiple onChange={handleAddFiles} className="hidden" />
          </label>
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
            onClick={handleMerge}
            disabled={files.length < 2 || isProcessing}
            className="px-4 py-1.5 rounded bg-[#b70228] hover:bg-[#8a011e] disabled:opacity-40 text-white font-medium"
          >
            {isProcessing ? 'Combinando...' : `Combinar ${files.length} Arquivos`}
          </button>
        </div>
      </div>
    </div>
  );
};
