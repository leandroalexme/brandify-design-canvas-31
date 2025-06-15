
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
  position = { x: 0, y: 0 }
}: TextPropertiesSubmenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Calculate optimal position centered on the toolbar
  const optimalPosition = {
    x: position.x - 140, // Center the 280px wide panel
    y: position.y - 80   // Position above toolbar with spacing
  };

  return (
    <div 
      ref={menuRef}
      className="text-panel-container animate-scale-in-60fps"
      style={{
        left: Math.max(16, Math.min(optimalPosition.x, window.innerWidth - 296)),
        top: Math.max(16, optimalPosition.y)
      }}
      data-text-submenu
    >
      <div className="text-panel-header">
        <div className="text-panel-indicator" />
        <Type className="w-5 h-5 text-blue-400" />
        <span className="panel-title-text">Texto</span>
      </div>

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
              <Icon className="w-6 h-6" />
            </button>
          );
        })}
      </div>

      <button
        onClick={onClose}
        className="text-panel-close-button"
        title="Fechar"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};
