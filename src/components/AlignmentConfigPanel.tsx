
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
  const [selectedHorizontal, setSelectedHorizontal] = React.useState<string | null>(null);
  const [selectedVertical, setSelectedVertical] = React.useState<string | null>(null);

  const alignmentTools = [
    // Linha 1: Alinhamento horizontal
    { id: 'align-left', icon: AlignLeft, label: 'Alinhar à Esquerda', type: 'horizontal' },
    { id: 'align-center', icon: AlignCenter, label: 'Centralizar', type: 'horizontal' },
    { id: 'align-right', icon: AlignRight, label: 'Alinhar à Direita', type: 'horizontal' },
    
    // Linha 2: Alinhamento vertical
    { id: 'align-top', icon: MoveUp, label: 'Alinhar ao Topo', type: 'vertical' },
    { id: 'align-middle', icon: () => <ArrowUpDown className="w-5 h-5 rotate-90" />, label: 'Centralizar Verticalmente', type: 'vertical', custom: true },
    { id: 'align-bottom', icon: MoveDown, label: 'Alinhar à Base', type: 'vertical' },
  ];

  const handleToolClick = (toolId: string, type: 'horizontal' | 'vertical') => {
    console.log('📐 [ALIGNMENT PANEL] Tool selected:', { toolId, type });
    
    if (type === 'horizontal') {
      setSelectedHorizontal(selectedHorizontal === toolId ? null : toolId);
    } else {
      setSelectedVertical(selectedVertical === toolId ? null : toolId);
    }
  };

  const horizontalTools = alignmentTools.filter(tool => tool.type === 'horizontal');
  const verticalTools = alignmentTools.filter(tool => tool.type === 'vertical');

  return (
    <PanelContainer
      isOpen={isOpen}
      onClose={onClose}
      title="Alinhamento"
      position={position}
      width={320}
      height={450}
      dataAttribute="data-alignment-panel"
      isDraggable={true}
    >
      <div className="panel-scrollable-unified h-full">
        <div className="panel-section-unified space-y-6">
          {/* Seção de Alinhamento Horizontal */}
          <div className="space-y-4">
            <h4 className="panel-section-title-unified">Alinhamento Horizontal</h4>
            <div className="grid-unified-3">
              {horizontalTools.map((tool, index) => {
                const IconComponent = tool.icon;
                const isSelected = selectedHorizontal === tool.id;
                
                return (
                  <button
                    key={tool.id}
                    className={`button-icon-unified animate-stagger-fade ${
                      isSelected ? 'selected' : ''
                    }`}
                    style={{ 
                      animationDelay: `${index * 0.05}s`,
                      animationFillMode: 'both'
                    }}
                    onClick={() => handleToolClick(tool.id, 'horizontal')}
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
              {verticalTools.map((tool, index) => {
                const IconComponent = tool.icon;
                const isSelected = selectedVertical === tool.id;
                
                return (
                  <button
                    key={tool.id}
                    className={`button-icon-unified animate-stagger-fade ${
                      isSelected ? 'selected' : ''
                    }`}
                    style={{ 
                      animationDelay: `${(index + 3) * 0.05}s`,
                      animationFillMode: 'both'
                    }}
                    onClick={() => handleToolClick(tool.id, 'vertical')}
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

          {/* Status de Alinhamento */}
          <div className="space-y-3">
            <h4 className="panel-section-title-unified">Status Atual</h4>
            <div className="p-3 bg-slate-700/30 rounded-xl border border-slate-600/40">
              <div className="text-sm text-slate-300 space-y-1">
                <p>
                  <span className="text-slate-500">Horizontal:</span> {
                    selectedHorizontal ? 
                    horizontalTools.find(t => t.id === selectedHorizontal)?.label : 
                    'Nenhum'
                  }
                </p>
                <p>
                  <span className="text-slate-500">Vertical:</span> {
                    selectedVertical ? 
                    verticalTools.find(t => t.id === selectedVertical)?.label : 
                    'Nenhum'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <div className="flex space-x-2">
              <button 
                className="button-secondary-unified flex-1"
                onClick={() => {
                  setSelectedHorizontal(null);
                  setSelectedVertical(null);
                }}
              >
                Limpar
              </button>
              <button 
                className="button-primary-unified flex-1"
                onClick={() => {
                  console.log('📐 [ALIGNMENT PANEL] Apply alignment:', {
                    horizontal: selectedHorizontal,
                    vertical: selectedVertical
                  });
                }}
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      </div>
    </PanelContainer>
  );
};
