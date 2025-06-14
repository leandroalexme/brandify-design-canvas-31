
import React from 'react';
import { X, Type, AlignLeft, Settings, Circle, Columns, Palette, Sparkles } from 'lucide-react';

interface TextPropertiesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TextPropertiesPanel = ({ isOpen, onClose }: TextPropertiesPanelProps) => {
  if (!isOpen) {
    return null;
  }

  const tools = [
    { id: 'typography', icon: Type, label: 'Tipografia' },
    { id: 'alignment', icon: AlignLeft, label: 'Alinhamento' },
    { id: 'advanced', icon: Settings, label: 'Modo Avançado' },
    { id: 'glyph', icon: Circle, label: 'Glyph' },
    { id: 'columns', icon: Columns, label: 'Colunas' },
    { id: 'color', icon: Palette, label: 'Cor' },
    { id: 'effects', icon: Sparkles, label: 'Efeitos' }
  ];

  const handleToolClick = (toolId: string) => {
    console.log(`Text tool clicked: ${toolId}`);
  };

  return (
    <div className="fixed left-6 top-1/2 transform -translate-y-1/2 z-[1000] animate-fade-in">
      <div className="floating-module flex flex-col w-16 p-3 gap-2">
        <div className="flex items-center justify-between mb-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-lg bg-slate-700/60 hover:bg-slate-600/80 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => handleToolClick(tool.id)}
                className="action-button w-10 h-10"
                title={tool.label}
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
