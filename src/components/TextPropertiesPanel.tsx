
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
    console.log(`📝 [TEXT PANEL] Tool clicked: ${toolId}`);
  };

  return (
    <div className="fixed left-6 top-1/2 transform -translate-y-1/2 z-[1000] animate-slide-in-left-60fps">
      <div className="text-panel-container">
        {/* Header com indicador e botão de fechar */}
        <div className="text-panel-header">
          <div className="text-panel-indicator"></div>
          <button
            onClick={onClose}
            className="text-panel-close-button"
            aria-label="Fechar painel de texto"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* Tools com animação escalonada */}
        <div className="text-panel-tools">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => handleToolClick(tool.id)}
                className="text-panel-tool-button animate-stagger-60fps"
                title={tool.label}
                style={{
                  animationDelay: `${index * 33.33}ms` // 60fps timing
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
