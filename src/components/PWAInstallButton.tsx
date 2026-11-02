import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share2, PlusSquare, X, Smartphone } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed standalone PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm transition-all animate-pulse"
        title="Instalar PDFpb no seu dispositivo para acesso rápido e offline"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Instalar App</span>
        <span className="sm:hidden">Instalar</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center space-x-1.5 px-2 py-1 rounded-md border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs font-medium hover:bg-neutral-200 dark:hover:bg-neutral-800 transition"
          title="Como instalar no iPhone ou iPad"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#b70228]" />
          <span className="hidden sm:inline">Instalar no iOS</span>
          <span className="sm:hidden">Instalar</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-neutral-850 p-5 shadow-2xl border border-neutral-200 dark:border-neutral-700 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-700 mb-3">
                <div className="flex items-center space-x-2">
                  <span className="p-1.5 rounded-lg bg-[#b70228] text-white">
                    <Smartphone className="w-4 h-4" />
                  </span>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                    Instalar PDFpb no iOS
                  </h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-neutral-600 dark:text-neutral-300">
                <div className="flex items-start space-x-2.5">
                  <span className="font-bold text-[#b70228] bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">1</span>
                  <p>
                    No Safari, toque no botão <strong>Compartilhar</strong> (<Share2 className="inline w-3.5 h-3.5 mx-0.5 text-blue-500" />) na barra inferior.
                  </p>
                </div>
                <div className="flex items-start space-x-2.5">
                  <span className="font-bold text-[#b70228] bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">2</span>
                  <p>
                    Role para baixo e selecione <strong>Adicionar à Tela de Início</strong> (<PlusSquare className="inline w-3.5 h-3.5 mx-0.5 text-neutral-500" />).
                  </p>
                </div>
                <div className="flex items-start space-x-2.5">
                  <span className="font-bold text-[#b70228] bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">3</span>
                  <p>
                    Toque em <strong>Adicionar</strong> no canto superior direito para concluir.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-xl bg-[#b70228] py-2 text-xs font-semibold text-white hover:bg-[#8a011e] transition"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Also offer a subtle general desktop/Android install button if not installed
  return (
    <button
      onClick={() => {
        alert('Para instalar o PDFpb: abra o menu do navegador (três pontinhos) e clique em "Instalar aplicativo" ou "Adicionar à tela inicial".');
      }}
      className="hidden md:flex items-center space-x-1 px-2.5 py-1 rounded bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-medium transition"
      title="Instalar PDFpb como aplicativo"
    >
      <Download className="w-3.5 h-3.5 text-[#b70228]" />
      <span>Instalar</span>
    </button>
  );
};
