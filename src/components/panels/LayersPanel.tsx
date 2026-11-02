import React from 'react';
import { Eye, EyeOff, Layers } from 'lucide-react';
import { LayerItem } from '../../types/pdf';

interface LayersPanelProps {
  layers: LayerItem[];
  onToggleLayer: (layerId: string) => void;
}

export const LayersPanel: React.FC<LayersPanelProps> = ({ layers, onToggleLayer }) => {
  return (
    <div className="flex flex-col h-full bg-neutral-50 dark:bg-neutral-900 text-xs">
      <div className="p-2 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-850">
        <span className="font-semibold text-neutral-600 dark:text-neutral-400">
          Optional Content Groups ({layers.length})
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {layers.map((layer) => (
          <div
            key={layer.id}
            onClick={() => onToggleLayer(layer.id)}
            className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors shadow-xs"
          >
            <div className="flex items-center space-x-2">
              <button
                className={`p-1 rounded ${
                  layer.visible
                    ? 'text-neutral-800 dark:text-neutral-100'
                    : 'text-neutral-400 dark:text-neutral-600'
                }`}
              >
                {layer.visible ? <Eye className="w-4 h-4 text-[#b70228]" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <div>
                <div className="font-medium text-neutral-800 dark:text-neutral-200">{layer.name}</div>
                {layer.description && (
                  <div className="text-[10px] text-neutral-400">{layer.description}</div>
                )}
              </div>
            </div>

            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                layer.visible
                  ? 'bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400'
                  : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500'
              }`}
            >
              {layer.visible ? 'Visible' : 'Hidden'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
