import React from 'react';
import { CheckSquare, Type, ListFilter, PenLine, RotateCcw } from 'lucide-react';
import { FormFieldItem } from '../../types/pdf';

interface FormFieldsPanelProps {
  fields: FormFieldItem[];
  onFieldChange: (fieldId: string, value: string | boolean) => void;
  onClearForm: () => void;
  onSelectPage: (page: number) => void;
}

export const FormFieldsPanel: React.FC<FormFieldsPanelProps> = ({
  fields,
  onFieldChange,
  onClearForm,
  onSelectPage,
}) => {
  return (
    <div className="flex flex-col h-full bg-neutral-50 dark:bg-neutral-900 text-xs">
      <div className="p-2 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-850 flex items-center justify-between">
        <span className="font-semibold text-neutral-600 dark:text-neutral-400">Interactive Fields ({fields.length})</span>
        <button
          onClick={onClearForm}
          className="flex items-center space-x-1 px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 text-[11px]"
          title="Reset all form field values"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Clear form</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {fields.length === 0 ? (
          <div className="text-center py-6 text-neutral-400">No interactive form fields detected.</div>
        ) : (
          fields.map((field) => (
            <div
              key={field.id}
              onClick={() => onSelectPage(field.page)}
              className="bg-white dark:bg-neutral-800 p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 space-y-1.5 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 font-medium text-neutral-800 dark:text-neutral-200">
                  {field.type === 'text' && <Type className="w-3.5 h-3.5 text-blue-500" />}
                  {field.type === 'checkbox' && <CheckSquare className="w-3.5 h-3.5 text-green-500" />}
                  {field.type === 'dropdown' && <ListFilter className="w-3.5 h-3.5 text-purple-500" />}
                  {field.type === 'signature' && <PenLine className="w-3.5 h-3.5 text-[#b70228]" />}
                  <span className="truncate max-w-[150px]">{field.label || field.name}</span>
                </div>
                <span className="text-[10px] text-neutral-400">p.{field.page}</span>
              </div>

              {/* Input rendering based on type */}
              {field.type === 'text' && (
                <input
                  type="text"
                  value={String(field.value || '')}
                  onChange={(e) => onFieldChange(field.id, e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded px-2 py-1 text-xs outline-none focus:border-[#b70228]"
                />
              )}

              {field.type === 'checkbox' && (
                <label className="flex items-center space-x-2 cursor-pointer mt-1">
                  <input
                    type="checkbox"
                    checked={Boolean(field.value)}
                    onChange={(e) => onFieldChange(field.id, e.target.checked)}
                    className="rounded border-neutral-300 text-[#b70228] focus:ring-[#b70228]"
                  />
                  <span className="text-neutral-600 dark:text-neutral-400">Checked</span>
                </label>
              )}

              {field.type === 'dropdown' && (
                <select
                  value={String(field.value || '')}
                  onChange={(e) => onFieldChange(field.id, e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded px-2 py-1 text-xs outline-none"
                >
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}

              {field.type === 'signature' && (
                <div className="p-2 border border-dashed border-[#b70228]/60 bg-[#b70228]/5 rounded flex items-center justify-between">
                  <span className="text-[#b70228] font-serif italic text-xs">{String(field.value || 'Unsigned')}</span>
                  <span className="text-[9px] bg-[#b70228] text-white px-1.5 py-0.5 rounded font-mono">Verified</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
