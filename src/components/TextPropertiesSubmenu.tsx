
import React, { useRef, useEffect } from 'react';
import { Type, AlignCenter, FileType, Palette, X } from 'lucide-react';

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
  position = { x: 50, y: 120 }
}: TextPropertiesSubmenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Ferramentas funcionais do submenu de texto
  const textTools = [
    { id: 'typography', icon: Type, label: 'Tipografia' },
    { id: 'alignment', icon: AlignCenter, label: 'Alinhamento' },
    { id: 'color', icon: Palette, label: 'Cor' },
    { id: 'glyph', icon: FileType, label: 'Glyph' }
  ];

  const handleToolClick = (toolId: string) => {
    console.log('📝 [TEXT SUBMENU] Tool selected:', toolId);
    onToolSelect(toolId);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        const isSubPanelClick = (event.target as Element).closest('[data-alignment-panel], [data-font-panel], [data-color-panel], [data-glyph-panel]');
        
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
      className="fixed z-[450] animate-scale-in-60fps"
      style={{
        left: position.x,
        top: position.y
      }}
      data-text-submenu
    >
      <div className="panel-container-unified w-72">
        {/* Header unificado */}
        <div className="panel-header-unified">
          <div className="panel-title-unified">Texto</div>
          <button
            onClick={onClose}
            className="panel-close-button-unified"
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tools em layout grid */}
        <div className="panel-content-unified">
          <div className="panel-section-unified">
            <div className="grid-unified-4">
              {textTools.map((tool, index) => {
                const Icon = tool.icon;
                
                return (
                  <button
                    key={tool.id}
                    className="button-icon-unified animate-stagger-fade"
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
      </div>
    </div>
  );
};
