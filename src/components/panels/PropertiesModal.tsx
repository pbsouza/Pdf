import React from 'react';
import { X, ShieldCheck, FileText, Lock, Type, Paperclip } from 'lucide-react';
import { DocumentMetadata, AttachmentItem } from '../../types/pdf';

interface PropertiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  metadata: DocumentMetadata;
  attachments: AttachmentItem[];
  onSaveMetadata: (newMeta: Partial<DocumentMetadata>) => void;
}

export const PropertiesModal: React.FC<PropertiesModalProps> = ({
  isOpen,
  onClose,
  metadata,
  attachments,
  onSaveMetadata,
}) => {
  const [activeTab, setActiveTab] = React.useState<'description' | 'security' | 'fonts' | 'attachments'>('description');
  const [title, setTitle] = React.useState(metadata.title);
  const [author, setAuthor] = React.useState(metadata.author);
  const [subject, setSubject] = React.useState(metadata.subject);
  const [keywords, setKeywords] = React.useState(metadata.keywords);

  React.useEffect(() => {
    setTitle(metadata.title);
    setAuthor(metadata.author);
    setSubject(metadata.subject);
    setKeywords(metadata.keywords);
  }, [metadata]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveMetadata({ title, author, subject, keywords });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-850 rounded-xl shadow-2xl border border-neutral-300 dark:border-neutral-700 w-full max-w-xl overflow-hidden flex flex-col max-h-[85vh] text-xs">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-[#b70228]" />
            <span className="font-semibold text-sm text-neutral-800 dark:text-neutral-100">Document Properties</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded text-neutral-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-700 px-5 pt-2 bg-neutral-50 dark:bg-neutral-850">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-2 px-3 font-medium border-b-2 transition-colors ${
              activeTab === 'description'
                ? 'border-[#b70228] text-[#b70228]'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            Descrição
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`pb-2 px-3 font-medium border-b-2 transition-colors ${
              activeTab === 'security'
                ? 'border-[#b70228] text-[#b70228]'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            Segurança & Permissões
          </button>
          <button
            onClick={() => setActiveTab('fonts')}
            className={`pb-2 px-3 font-medium border-b-2 transition-colors ${
              activeTab === 'fonts'
                ? 'border-[#b70228] text-[#b70228]'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            Fontes
          </button>
          <button
            onClick={() => setActiveTab('attachments')}
            className={`pb-2 px-3 font-medium border-b-2 transition-colors ${
              activeTab === 'attachments'
                ? 'border-[#b70228] text-[#b70228]'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            Anexos ({attachments.length})
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {activeTab === 'description' && (
            <div className="space-y-3">
              <div>
                <label className="block text-neutral-500 font-medium mb-1">Título</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded px-2.5 py-1.5 outline-none focus:border-[#b70228]"
                />
              </div>

              <div>
                <label className="block text-neutral-500 font-medium mb-1">Autor</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded px-2.5 py-1.5 outline-none focus:border-[#b70228]"
                />
              </div>

              <div>
                <label className="block text-neutral-500 font-medium mb-1">Assunto</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded px-2.5 py-1.5 outline-none focus:border-[#b70228]"
                />
              </div>

              <div>
                <label className="block text-neutral-500 font-medium mb-1">Palavras-chave</label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded px-2.5 py-1.5 outline-none focus:border-[#b70228]"
                />
              </div>

              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 grid grid-cols-2 gap-3 text-neutral-600 dark:text-neutral-400">
                <div>
                  <span className="font-medium text-neutral-500">Versão do PDF:</span> {metadata.pdfVersion}
                </div>
                <div>
                  <span className="font-medium text-neutral-500">Tamanho da Página:</span> {metadata.pageSize}
                </div>
                <div>
                  <span className="font-medium text-neutral-500">Criador:</span> {metadata.creator}
                </div>
                <div>
                  <span className="font-medium text-neutral-500">Criado em:</span> {metadata.creationDate}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <div>
                  <div className="font-semibold text-neutral-800 dark:text-neutral-100">
                    {metadata.isEncrypted ? 'Document is Encrypted' : 'Standard Unencrypted Security Handler'}
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    {metadata.isEncrypted
                      ? `Protected by ${metadata.encryptionMethod || 'AES-256'}`
                      : 'No password required to open'}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="font-medium text-neutral-700 dark:text-neutral-300">Document Permissions:</div>
                <div className="grid grid-cols-1 gap-1 bg-neutral-50 dark:bg-neutral-900 p-2.5 rounded border border-neutral-200 dark:border-neutral-700">
                  {metadata.permissions?.map((p, i) => (
                    <div key={i} className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fonts' && (
            <div className="space-y-2">
              <div className="font-medium text-neutral-700 dark:text-neutral-300">Fonts in this document:</div>
              <div className="divide-y divide-neutral-200 dark:divide-neutral-700 border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
                {metadata.fonts?.map((f, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 bg-white dark:bg-neutral-800">
                    <div className="flex items-center space-x-2">
                      <Type className="w-3.5 h-3.5 text-neutral-400" />
                      <span className="font-mono text-neutral-800 dark:text-neutral-200">{f}</span>
                    </div>
                    <span className="text-[10px] bg-neutral-100 dark:bg-neutral-700 px-2 py-0.5 rounded text-neutral-500">
                      Embedded Subset
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'attachments' && (
            <div className="space-y-2">
              {attachments.length === 0 ? (
                <div className="text-center py-6 text-neutral-400">No embedded file attachments in this document.</div>
              ) : (
                attachments.map((att) => (
                  <div key={att.id} className="flex items-center justify-between p-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Paperclip className="w-4 h-4 text-[#b70228]" />
                      <div>
                        <div className="font-medium text-neutral-800 dark:text-neutral-200">{att.name}</div>
                        <div className="text-[10px] text-neutral-400">{(att.size / 1024).toFixed(1)} KB · {att.type}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Exported attachment: ${att.name}`)}
                      className="px-2 py-1 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded text-[11px]"
                    >
                      Export
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
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
            onClick={handleSave}
            className="px-3.5 py-1.5 rounded bg-[#b70228] hover:bg-[#8a011e] text-white font-medium"
          >
            Salvar Propriedades
          </button>
        </div>
      </div>
    </div>
  );
};
