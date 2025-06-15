
import React, { useRef, useEffect } from 'react';
import { Type, AlignCenter, Settings, FileType, Columns2, Palette, Sparkles, X } from 'lucide-react';

interface TextPropertiesSubmenuProps {
  isOpen: boolean;
  onClose: () => void;
  onToolSelect: (toolId: string) => void;
  position?: { x: number; y: number };
}

export const TextPropertiesSubmenu = ({ 
  isOpen, 
  onClose, 
  onToolSelect,
  position = { x: 32, y: 120 }
}: TextPropertiesSubmenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const textTools = [
    { id: 'typography', icon: Type, label: 'Tipografia' },
    { id: 'alignment', icon: AlignCenter, label: 'Alinhamento' },
    { id: 'advanced', icon: Settings, label: 'Modo Avançado' },
    { id: 'glyph', icon: FileType, label: 'Glyph' },
    { id: 'columns', icon: Columns2, label: 'Colunas' },
    { id: 'color', icon: Palette, label: 'Cor' },
    { id: 'effects', icon: Sparkles, label: 'Efeitos' }
  ];

  const handleToolClick = (toolId: string) => {
    console.log('📝 [TEXT SUBMENU] Tool selected:', toolId);
    onToolSelect(toolId);
  };

  // Modificar para não fechar automaticamente quando clica fora
  // O painel deve permanecer aberto enquanto os subpainéis estão sendo usados
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        // Verificar se o clique foi em um subpainel
        const isSubPanelClick = (event.target as Element).closest('[data-alignment-panel], [data-font-panel]');
        
        // Só fechar se não foi clique em subpainel
        if (!isSubPanelClick) {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={menuRef}
      className="fixed z-[450] animate-slide-right"
      style={{
        left: position.x,
        top: position.y
      }}
      data-text-submenu
    >
      <div className="text-panel-container">
        {/* Header */}
        <div className="text-panel-header">
          <div className="text-panel-indicator" />
          <button
            onClick={onClose}
            className="text-panel-close-button"
            title="Fechar"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* Tools */}
        <div className="text-panel-tools">
          {textTools.map((tool, index) => {
            const Icon = tool.icon;
            
            return (
              <button
                key={tool.id}
                className="text-panel-tool-button animate-stagger-fade"
                style={{ 
                  animationDelay: `${index * 0.05}s`,
                  animationFillMode: 'both'
                }}
                onClick={() => handleToolClick(tool.id)}
                title={tool.label}
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
