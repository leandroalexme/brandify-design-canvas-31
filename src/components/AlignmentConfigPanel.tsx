
import React, { useRef, useEffect } from 'react';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, X, MoveUp, MoveDown, ArrowUpDown } from 'lucide-react';

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
    // Row 1: Text alignment
    { id: 'align-left', icon: AlignLeft, label: 'Alinhar à Esquerda' },
    { id: 'align-center', icon: AlignCenter, label: 'Centralizar' },
    { id: 'align-right', icon: AlignRight, label: 'Alinhar à Direita' },
    { id: 'align-justify', icon: AlignJustify, label: 'Justificar' },
    
    // Row 2: Text height and spacing controls
    { id: 'text-height', icon: () => <div className="text-sm font-bold text-slate-300">A</div>, label: 'Altura do Texto', custom: true },
    { id: 'line-height-30', icon: () => <div className="text-xs font-bold text-slate-300">30%</div>, label: 'Altura da Linha 30%', custom: true },
    { id: 'text-spacing', icon: () => <div className="text-xs font-bold text-slate-300">|A|</div>, label: 'Espaçamento do Texto', custom: true },
    { id: 'line-height-10', icon: () => <div className="text-xs font-bold text-slate-300">10%</div>, label: 'Altura da Linha 10%', custom: true },
    
    // Row 3: Vertical alignment
    { id: 'align-top', icon: MoveUp, label: 'Alinhar ao Topo' },
    { id: 'align-middle', icon: () => <ArrowUpDown className="w-4 h-4 rotate-90" />, label: 'Alinhar ao Centro', custom: true },
    { id: 'align-bottom', icon: MoveDown, label: 'Alinhar à Base' },
    { id: 'align-stretch', icon: ArrowUpDown, label: 'Esticar' },
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
      <div className="text-panel-container w-80">
        {/* Header com estilo consistente */}
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

        {/* Grid de ferramentas - 4 colunas x 3 linhas */}
        <div className="p-4">
          <div className="grid grid-cols-4 gap-2">
            {alignmentTools.map((tool, index) => {
              const IconComponent = tool.icon;
              
              return (
                <button
                  key={tool.id}
                  className="text-panel-tool-button w-16 h-16 animate-stagger-fade"
                  style={{ 
                    animationDelay: `${index * 0.03}s`,
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
  );
};
