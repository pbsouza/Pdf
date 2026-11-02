import React from 'react';
import {
  X,
  Trash2,
  Copy,
  Plus,
  Minus,
  CheckSquare,
  Settings,
  Sliders,
  Type,
} from 'lucide-react';
import { FormFieldItem } from '../types/pdf';

interface FormFieldInspectorProps {
  field: FormFieldItem;
  onUpdateField: (updated: Partial<FormFieldItem>) => void;
  onDuplicateField: (field: FormFieldItem) => void;
  onDeleteField: (fieldId: string) => void;
  onClose: () => void;
}

export const FormFieldInspector: React.FC<FormFieldInspectorProps> = ({
  field,
  onUpdateField,
  onDuplicateField,
  onDeleteField,
  onClose,
}) => {
  const [newOption, setNewOption] = React.useState('');

  const handleAddOption = () => {
    if (!newOption.trim()) return;
    const currentOptions = field.options || [];
    onUpdateField({ options: [...currentOptions, newOption.trim()] });
    setNewOption('');
  };

  const handleRemoveOption = (index: number) => {
    const currentOptions = field.options || [];
    onUpdateField({ options: currentOptions.filter((_, i) => i !== index) });
  };

  const typeLabels: Record<string, string> = {
    text: 'Texto Simples',
    textarea: 'Parágrafo / Multilinha',
    checkbox: 'Caixa de Seleção (Checkbox)',
    radio: 'Botão de Opção (Radio)',
    dropdown: 'Menu Suspenso (Dropdown)',
    date: 'Campo de Data',
    signature: 'Assinatura Digital',
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div onClick={onClose} className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-xs" />

      <div className="max-md:fixed max-md:inset-x-0 max-md:bottom-0 max-md:w-full max-md:max-h-[75vh] max-md:border-t max-md:border-l-0 max-md:rounded-t-2xl max-md:shadow-2xl max-md:z-50 md:w-72 md:h-full md:border-l bg-white dark:bg-neutral-850 border-neutral-300 dark:border-neutral-700 flex flex-col text-xs flex-shrink-0 shadow-lg select-none animate-slide-up md:animate-none">
        {/* Mobile handle indicator */}
        <div className="md:hidden w-12 h-1.5 bg-neutral-300 dark:bg-neutral-600 rounded-full mx-auto my-1.5" />
      {/* Header */}
      <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          <Settings className="w-3.5 h-3.5 text-[#b70228]" />
          <span className="font-semibold text-neutral-800 dark:text-neutral-100">
            Propriedades do Campo
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded text-neutral-400"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        {/* Type Badge */}
        <div>
          <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
            Tipo de Campo
          </span>
          <div className="px-2.5 py-1.5 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 font-medium text-neutral-800 dark:text-neutral-200">
            {typeLabels[field.type] || field.type}
          </div>
        </div>

        {/* Technical Name */}
        <div>
          <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Nome Técnico (ID no PDF)
          </label>
          <input
            type="text"
            value={field.name}
            onChange={(e) => onUpdateField({ name: e.target.value.replace(/\s+/g, '_') })}
            className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded px-2.5 py-1.5 font-mono text-xs outline-none focus:border-[#b70228]"
          />
          <span className="text-[10px] text-neutral-400 mt-0.5 block">
            Identificador para preenchimento e exportação
          </span>
        </div>

        {/* Label */}
        <div>
          <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Rótulo / Descrição
          </label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => onUpdateField({ label: e.target.value })}
            className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded px-2.5 py-1.5 text-xs outline-none focus:border-[#b70228]"
          />
        </div>

        {/* Placeholder (if text/textarea/date) */}
        {(field.type === 'text' || field.type === 'textarea') && (
          <div>
            <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Texto de Exemplo (Placeholder)
            </label>
            <input
              type="text"
              value={field.placeholder || ''}
              onChange={(e) => onUpdateField({ placeholder: e.target.value })}
              className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded px-2.5 py-1.5 text-xs outline-none focus:border-[#b70228]"
            />
          </div>
        )}

        {/* Dropdown / Radio Options */}
        {(field.type === 'dropdown' || field.type === 'radio') && (
          <div className="space-y-2">
            <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
              Opções do Seletor
            </label>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {(field.options || []).map((opt, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-1.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded"
                >
                  <span className="truncate">{opt}</span>
                  <button
                    onClick={() => handleRemoveOption(i)}
                    className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded text-red-500"
                    title="Remover opção"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex space-x-1 pt-1">
              <input
                type="text"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddOption()}
                placeholder="Nova opção..."
                className="flex-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded px-2 py-1 text-xs outline-none"
              />
              <button
                onClick={handleAddOption}
                className="px-2.5 py-1 bg-[#b70228] text-white rounded font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Dimensions */}
        <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 space-y-2">
          <span className="text-[10px] uppercase font-bold text-neutral-400 block">
            Dimensões na Página
          </span>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-neutral-500 block mb-0.5">Largura (%)</label>
              <input
                type="number"
                min="2"
                max="95"
                value={Math.round(field.rect.width)}
                onChange={(e) =>
                  onUpdateField({
                    rect: { ...field.rect, width: Math.max(2, parseFloat(e.target.value) || 10) },
                  })
                }
                className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded px-2 py-1 font-mono text-xs outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-neutral-500 block mb-0.5">Altura (%)</label>
              <input
                type="number"
                min="1.5"
                max="50"
                step="0.5"
                value={Math.round(field.rect.height * 10) / 10}
                onChange={(e) =>
                  onUpdateField({
                    rect: { ...field.rect, height: Math.max(1.5, parseFloat(e.target.value) || 3) },
                  })
                }
                className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded px-2 py-1 font-mono text-xs outline-none"
              />
            </div>
          </div>
        </div>

        {/* Validation Checkboxes */}
        <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(field.required)}
              onChange={(e) => onUpdateField({ required: e.target.checked })}
              className="rounded text-[#b70228] focus:ring-[#b70228]"
            />
            <span className="text-neutral-700 dark:text-neutral-300 font-medium">
              Campo Obrigatório
            </span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(field.readOnly)}
              onChange={(e) => onUpdateField({ readOnly: e.target.checked })}
              className="rounded text-[#b70228] focus:ring-[#b70228]"
            />
            <span className="text-neutral-700 dark:text-neutral-300 font-medium">
              Somente Leitura (Bloqueado)
            </span>
          </label>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-between">
        <button
          onClick={() => onDuplicateField(field)}
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 font-medium text-neutral-700 dark:text-neutral-200 transition-colors"
          title="Duplicar este campo"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Duplicar</span>
        </button>

        <button
          onClick={() => onDeleteField(field.id)}
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded bg-red-100 dark:bg-red-950/60 hover:bg-red-200 dark:hover:bg-red-900/60 font-medium text-red-600 dark:text-red-400 transition-colors"
          title="Excluir campo"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Excluir</span>
        </button>
      </div>
    </div>
    </>
  );
};
