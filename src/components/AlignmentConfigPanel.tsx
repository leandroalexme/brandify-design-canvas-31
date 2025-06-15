
import React from 'react';
import { AlignLeft, AlignCenter, AlignRight, MoveUp, MoveDown, ArrowUpDown } from 'lucide-react';
import { PanelContainer } from './ui/PanelContainer';

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

  return (
    <PanelContainer
      isOpen={isOpen}
      onClose={onClose}
      title="Alinhamento"
      position={position}
      width={384}
      dataAttribute="data-alignment-panel"
      isDraggable={true}
    >
      <div className="panel-scrollable-unified">
        <div className="panel-section-unified space-y-6">
          {/* Seção de Alinhamento Horizontal */}
          <div className="space-y-4">
            <h4 className="panel-section-title-unified">Alinhamento Horizontal</h4>
            <div className="grid-unified-3">
              {alignmentTools.slice(0, 3).map((tool, index) => {
                const IconComponent = tool.icon;
                
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
          <div className="space-y-4">
            <h4 className="panel-section-title-unified">Alinhamento Vertical</h4>
            <div className="grid-unified-3">
              {alignmentTools.slice(3, 6).map((tool, index) => {
                const IconComponent = tool.icon;
                
                return (
                  <button
                    key={tool.id}
                    className="button-icon-unified animate-stagger-fade"
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
    </PanelContainer>
  );
};
