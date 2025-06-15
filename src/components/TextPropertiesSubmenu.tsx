
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
  position = { x: 32, y: 120 }
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
      <div className="floating-module rounded-2xl p-2">
        {/* Header minimalista */}
        <div className="flex items-center justify-between mb-3 px-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full" />
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-lg bg-slate-700/60 hover:bg-red-500/80 
                     flex items-center justify-center text-slate-400 hover:text-white 
                     transition-all duration-100 hover:scale-105 active:scale-95"
            title="Fechar"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* Tools em layout horizontal */}
        <div className="flex items-center gap-2">
          {textTools.map((tool, index) => {
            const Icon = tool.icon;
            
            return (
              <button
                key={tool.id}
                className="w-12 h-12 rounded-xl bg-slate-700/40 hover:bg-slate-600/60 
                         border border-slate-600/40 hover:border-blue-500/60
                         flex items-center justify-center text-slate-300 hover:text-white 
                         transition-all duration-100 hover:scale-105 active:scale-95
                         animate-stagger-fade"
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
      </div>
    </div>
  );
};
