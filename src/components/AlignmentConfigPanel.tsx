
import React, { useRef, useEffect } from 'react';
import { AlignLeft, AlignCenter, AlignRight, MoveUp, MoveDown, ArrowUpDown, X } from 'lucide-react';

interface AlignmentConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
  position?: { x: number; y: number };
}

export const AlignmentConfigPanel = ({ 
  isOpen, 
  onClose, 
  position = { x: 120, y: 200 }
}: AlignmentConfigPanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);

  const alignmentTools = [
    // Linha 1: Alinhamento horizontal
    { id: 'align-left', icon: AlignLeft, label: 'Alinhar à Esquerda' },
    { id: 'align-center', icon: AlignCenter, label: 'Centralizar' },
    { id: 'align-right', icon: AlignRight, label: 'Alinhar à Direita' },
    
    // Linha 2: Alinhamento vertical
    { id: 'align-top', icon: MoveUp, label: 'Alinhar ao Topo' },
    { id: 'align-middle', icon: () => <ArrowUpDown className="w-5 h-5 rotate-90" />, label: 'Centralizar Verticalmente', custom: true },
    { id: 'align-bottom', icon: MoveDown, label: 'Alinhar à Base' },
  ];

  const handleToolClick = (toolId: string) => {
    console.log('📐 [ALIGNMENT PANEL] Tool selected:', toolId);
    // Implementar lógica específica para cada ferramenta de alinhamento
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
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
      ref={panelRef}
      className="fixed z-[500] animate-scale-in-60fps"
      style={{
        left: position.x,
        top: position.y
      }}
      data-alignment-panel
    >
      <div className="floating-module w-72 overflow-hidden">
        {/* Header redesenhado */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/40">
          <div className="flex items-center gap-3">
            <div className="w-1 h-4 bg-green-500 rounded-full" />
            <span className="text-sm font-medium text-slate-200">Alinhamento</span>
          </div>
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

        <div className="p-4 space-y-4">
          {/* Seção de Alinhamento Horizontal */}
          <div className="space-y-3">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
              Alinhamento Horizontal
            </label>
            <div className="grid grid-cols-3 gap-2">
              {alignmentTools.slice(0, 3).map((tool, index) => {
                const IconComponent = tool.icon;
                
                return (
                  <button
                    key={tool.id}
                    className="w-full h-12 rounded-xl bg-slate-700/40 hover:bg-slate-600/60 
                             border border-slate-600/40 hover:border-green-500/60
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
                    {tool.custom ? (
                      <IconComponent />
                    ) : (
                      <IconComponent className="w-5 h-5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Seção de Alinhamento Vertical */}
          <div className="space-y-3">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
              Alinhamento Vertical
            </label>
            <div className="grid grid-cols-3 gap-2">
              {alignmentTools.slice(3, 6).map((tool, index) => {
                const IconComponent = tool.icon;
                
                return (
                  <button
                    key={tool.id}
                    className="w-full h-12 rounded-xl bg-slate-700/40 hover:bg-slate-600/60 
                             border border-slate-600/40 hover:border-green-500/60
                             flex items-center justify-center text-slate-300 hover:text-white 
                             transition-all duration-100 hover:scale-105 active:scale-95
                             animate-stagger-fade"
                    style={{ 
                      animationDelay: `${(index + 3) * 0.05}s`,
                      animationFillMode: 'both'
                    }}
                    onClick={() => handleToolClick(tool.id)}
                    title={tool.label}
                  >
                    {tool.custom ? (
                      <IconComponent />
                    ) : (
                      <IconComponent className="w-5 h-5" />
                    )}
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
