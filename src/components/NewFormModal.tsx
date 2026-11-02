import React from 'react';
import { X, FileText, CheckSquare, Wrench, ShieldCheck, Plus, Sparkles } from 'lucide-react';
import { createNewBlankDocument } from '../services/pdfService';
import { PdfDocument } from '../types/pdf';

interface NewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentCreated: (doc: PdfDocument) => void;
}

export const NewFormModal: React.FC<NewFormModalProps> = ({
  isOpen,
  onClose,
  onDocumentCreated,
}) => {
  const [selectedTemplate, setSelectedTemplate] = React.useState<
    'blank' | 'registration' | 'service_order' | 'consent_agreement'
  >('blank');
  const [title, setTitle] = React.useState('Novo Formulário');
  const [isCreating, setIsCreating] = React.useState(false);

  if (!isOpen) return null;

  const templates = [
    {
      id: 'blank' as const,
      title: 'Em Branco (Página Limpa)',
      desc: 'Página A4 em branco com cabeçalho limpo pronta para desenhar seus próprios campos.',
      icon: Plus,
      badge: 'Básico',
    },
    {
      id: 'registration' as const,
      title: 'Ficha de Cadastro de Cliente',
      desc: 'Campos prontos para Nome, CPF/CNPJ, E-mail, Telefone, Cidade/UF, Gênero e Assinatura.',
      icon: FileText,
      badge: 'Popular',
    },
    {
      id: 'service_order' as const,
      title: 'Ordem de Serviço & Fatura',
      desc: 'Registro técnico com Cliente, Tipo de Serviço, Descrição detalhada, Valor e Assinatura.',
      icon: Wrench,
      badge: 'Comercial',
    },
    {
      id: 'consent_agreement' as const,
      title: 'Termo de Consentimento & Acordo',
      desc: 'Cláusulas de declaração de aceite, checkbox de concordância, data e assinatura digital.',
      icon: ShieldCheck,
      badge: 'Jurídico',
    },
  ];

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const doc = await createNewBlankDocument(title.trim() || 'Formulário', selectedTemplate);
      onDocumentCreated(doc);
      onClose();
    } catch (err: any) {
      alert(`Erro ao criar formulário: ${err.message || err}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-850 rounded-2xl shadow-2xl border border-neutral-300 dark:border-neutral-700 w-full max-w-xl overflow-hidden flex flex-col text-xs">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-[#b70228] text-white">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                Criar Formulário a Partir do Zero
              </h2>
              <p className="text-neutral-500 text-[11px]">
                Inicie com uma página em branco ou use um modelo profissional interativo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg text-neutral-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
              Nome do Documento / Formulário
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Ficha de Cadastro 2026, Contrato de Serviço..."
              className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#b70228]"
            />
          </div>

          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-2">
              Selecione o Modelo Inicial
            </label>
            <div className="space-y-2.5">
              {templates.map((tpl) => {
                const Icon = tpl.icon;
                const isSelected = selectedTemplate === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => setSelectedTemplate(tpl.id)}
                    className={`flex items-start space-x-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#b70228] bg-[#b70228]/5 shadow-xs'
                        : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 bg-white dark:bg-neutral-800'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg mt-0.5 ${
                        isSelected
                          ? 'bg-[#b70228] text-white'
                          : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-500'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-neutral-900 dark:text-white text-xs">
                          {tpl.title}
                        </span>
                        <span className="text-[10px] bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 px-1.5 py-0.5 rounded font-mono">
                          {tpl.badge}
                        </span>
                      </div>
                      <p className="text-neutral-500 dark:text-neutral-400 text-[11px] mt-0.5 leading-relaxed">
                        {tpl.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 flex items-center justify-between">
          <span className="text-[11px] text-neutral-500">
            Página A4 padrão (595 × 842 pt) · Totalmente editável
          </span>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-700 font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleCreate}
              disabled={isCreating}
              className="px-4 py-1.5 rounded-lg bg-[#b70228] hover:bg-[#8a011e] text-white font-medium shadow-xs disabled:opacity-50"
            >
              {isCreating ? 'Criando...' : 'Criar Formulário'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
