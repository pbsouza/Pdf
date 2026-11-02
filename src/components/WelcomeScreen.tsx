import React from 'react';
import {
  FolderOpen,
  FilePlus2,
  FileText,
  Sparkles,
  Layers,
  Printer,
  CheckCircle2,
  UploadCloud,
  FileCode,
} from 'lucide-react';

interface WelcomeScreenProps {
  onOpenFile: () => void;
  onFileDrop: (file: File) => void;
  onOpenNewFormModal: () => void;
  onLoadSampleDoc: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onOpenFile,
  onFileDrop,
  onOpenNewFormModal,
  onLoadSampleDoc,
}) => {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        onFileDrop(file);
      } else {
        alert('Por favor, selecione um arquivo no formato PDF.');
      }
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="flex-1 overflow-auto bg-neutral-100 dark:bg-neutral-950 flex flex-col items-center justify-center p-4 sm:p-8 select-none transition-colors"
    >
      <div className="max-w-3xl w-full flex flex-col items-center text-center space-y-8 animate-in fade-in duration-300">
        {/* Brand Header */}
        <div className="flex flex-col items-center space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-[#b70228] flex items-center justify-center shadow-lg shadow-red-950/20 text-white font-bold text-2xl tracking-tight">
              PDF
            </div>
            <div className="text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
                PDFpb <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-[#b70228] dark:bg-red-950/50 dark:text-red-300 border border-red-200 dark:border-red-900/50">Pro Workbench</span>
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                Bancada de Edição, Leitura de Alta Fidelidade e Criação de Formulários
              </p>
            </div>
          </div>
        </div>

        {/* Drag & Drop Hero Box */}
        <div
          onClick={onOpenFile}
          className={`w-full p-8 sm:p-10 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center space-y-4 shadow-sm ${
            isDragging
              ? 'border-[#b70228] bg-red-50/50 dark:bg-red-950/20 scale-[1.01]'
              : 'border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-[#b70228]/60 dark:hover:border-[#b70228]/60 hover:shadow-md'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/40 text-[#b70228] flex items-center justify-center shadow-inner">
            <UploadCloud className="w-8 h-8" />
          </div>
          <div>
            <p className="text-base sm:text-lg font-semibold text-neutral-800 dark:text-neutral-200">
              Arraste e solte seu arquivo PDF aqui
            </p>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              ou clique para explorar seus arquivos locais
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenFile();
              }}
              className="px-5 py-2.5 rounded-lg bg-[#b70228] hover:bg-[#960221] text-white font-medium text-sm transition-all shadow-sm flex items-center space-x-2"
            >
              <FolderOpen className="w-4 h-4" />
              <span>Abrir Documento PDF</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenNewFormModal();
              }}
              className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-all shadow-sm flex items-center space-x-2"
            >
              <FilePlus2 className="w-4 h-4" />
              <span>Criar Novo Formulário</span>
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-left">
          <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center mb-2.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
              Nitidez de Alta Resolução
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
              Renderização vetorial nítida adaptada para telas Retina e dispositivos móveis de alta densidade (sem texto pixelado).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mb-2.5">
              <FileCode className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
              Formulários Interativos
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
              Crie campos de texto, opções, seleções e assinaturas a partir do zero ou edite formulários existentes.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center mb-2.5">
              <Printer className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
              Impressão Direta do Arquivo
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
              Imprima as páginas reais do documento com paginação perfeita, sem capturar a interface ou barras da tela.
            </p>
          </div>
        </div>

        {/* Optional Showcase Load Button */}
        <div className="pt-2">
          <button
            onClick={onLoadSampleDoc}
            className="text-xs text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 underline decoration-dotted transition-colors"
          >
            Deseja testar as ferramentas? Clique aqui para abrir um documento de exemplo.
          </button>
        </div>
      </div>
    </div>
  );
};
