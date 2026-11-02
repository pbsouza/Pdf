import React from 'react';
import {
  Type,
  AlignLeft,
  CheckSquare,
  CircleDot,
  ListFilter,
  Calendar,
  PenLine,
  Eye,
  Settings2,
  Check,
  X,
  Plus,
} from 'lucide-react';
import { FormFieldType } from '../types/pdf';

interface FormBuilderToolbarProps {
  onAddField: (type: FormFieldType) => void;
  isPreviewMode: boolean;
  onTogglePreview: () => void;
  onExitBuilder: () => void;
  fieldsCount: number;
}

export const FormBuilderToolbar: React.FC<FormBuilderToolbarProps> = ({
  onAddField,
  isPreviewMode,
  onTogglePreview,
  onExitBuilder,
  fieldsCount,
}) => {
  return (
    <div className="h-11 bg-neutral-900 border-b border-neutral-700 px-2 sm:px-4 flex items-center justify-between text-xs text-neutral-200 select-none z-20 flex-shrink-0 shadow-md overflow-x-auto scrollbar-none">
      {/* Title & Badge */}
      <div className="flex items-center space-x-1.5 sm:space-x-2 mr-2 flex-shrink-0">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b70228] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#b70228]"></span>
        </span>
        <span className="font-semibold text-white tracking-wide hidden md:inline">
          Criador de Formulários
        </span>
        <span className="font-semibold text-white tracking-wide md:hidden">
          Campos
        </span>
        <span className="text-[10px] bg-neutral-800 text-neutral-400 px-1.5 sm:px-2 py-0.5 rounded-full border border-neutral-700">
          {fieldsCount}
        </span>
      </div>

      {/* Field Palette (Disabled in preview mode) */}
      {!isPreviewMode ? (
        <div className="flex items-center space-x-1 flex-shrink-0 overflow-x-auto">
          <span className="text-neutral-500 mr-1 text-[11px] hidden lg:inline">Adicionar:</span>

          <button
            onClick={() => onAddField('text')}
            className="flex items-center space-x-1 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded transition-colors"
            title="Adicionar Campo de Texto Simples"
          >
            <Type className="w-3.5 h-3.5 text-blue-400" />
            <span>Texto</span>
          </button>

          <button
            onClick={() => onAddField('textarea')}
            className="flex items-center space-x-1 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded transition-colors"
            title="Adicionar Área de Texto / Parágrafo"
          >
            <AlignLeft className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Parágrafo</span>
          </button>

          <button
            onClick={() => onAddField('checkbox')}
            className="flex items-center space-x-1 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded transition-colors"
            title="Adicionar Caixa de Seleção (Checkbox)"
          >
            <CheckSquare className="w-3.5 h-3.5 text-green-400" />
            <span>Checkbox</span>
          </button>

          <button
            onClick={() => onAddField('radio')}
            className="flex items-center space-x-1 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded transition-colors"
            title="Adicionar Botão de Opção (Radio)"
          >
            <CircleDot className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Opção</span>
          </button>

          <button
            onClick={() => onAddField('dropdown')}
            className="flex items-center space-x-1 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded transition-colors"
            title="Adicionar Menu Suspenso (Dropdown)"
          >
            <ListFilter className="w-3.5 h-3.5 text-purple-400" />
            <span>Menu</span>
          </button>

          <button
            onClick={() => onAddField('date')}
            className="flex items-center space-x-1 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded transition-colors"
            title="Adicionar Campo de Data"
          >
            <Calendar className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden md:inline">Data</span>
          </button>

          <button
            onClick={() => onAddField('signature')}
            className="flex items-center space-x-1 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded transition-colors"
            title="Adicionar Campo de Assinatura"
          >
            <PenLine className="w-3.5 h-3.5 text-[#b70228]" />
            <span>Assinatura</span>
          </button>
        </div>
      ) : (
        <div className="text-amber-400 font-medium text-xs flex items-center space-x-1.5">
          <Eye className="w-4 h-4" />
          <span>Modo Teste de Preenchimento Ativo</span>
        </div>
      )}

      {/* Mode Toggle & Done */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onTogglePreview}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded transition-colors font-medium ${
            isPreviewMode
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
          }`}
          title={isPreviewMode ? 'Voltar para modo de edição de campos' : 'Testar preenchimento do formulário'}
        >
          {isPreviewMode ? <Settings2 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{isPreviewMode ? 'Modo Design' : 'Testar'}</span>
        </button>

        <button
          onClick={onExitBuilder}
          className="flex items-center space-x-1 px-3 py-1 bg-[#b70228] hover:bg-[#8a011e] text-white rounded font-medium transition-colors shadow-xs"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Concluir</span>
        </button>
      </div>
    </div>
  );
};
