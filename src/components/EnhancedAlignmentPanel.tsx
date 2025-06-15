
import React from 'react';
import { 
  AlignLeft, AlignCenter, AlignRight, 
  AlignTop, AlignMiddle, AlignBottom,
  DistributeHorizontal, DistributeVertical,
  Grid, Move
} from 'lucide-react';
import { PanelContainer } from './ui/PanelContainer';

interface EnhancedAlignmentPanelProps {
  onClose: () => void;
  selectedElements: string[];
  onAlign: (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  onDistribute: (direction: 'horizontal' | 'vertical') => void;
  onToggleGrid: () => void;
  onToggleSnap: () => void;
  gridEnabled: boolean;
  snapEnabled: boolean;
}

export const EnhancedAlignmentPanel = ({
  onClose,
  selectedElements,
  onAlign,
  onDistribute,
  onToggleGrid,
  onToggleSnap,
  gridEnabled,
  snapEnabled
}: EnhancedAlignmentPanelProps) => {
  const hasMultipleSelected = selectedElements.length >= 2;

  return (
    <PanelContainer
      isOpen={true}
      onClose={onClose}
      title="Alinhamento e Distribuição"
      position={{ x: window.innerWidth - 320 - 24, y: 120 }}
      width={320}
      height={400}
      isDraggable={true}
    >
      <div className="panel-scrollable-unified h-full space-y-6">
        
        {/* Grid and Snap Controls */}
        <div className="panel-section-unified">
          <h3 className="text-sm font-medium text-slate-200 mb-3">Auxiliares</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              className={`button-unified flex items-center gap-2 justify-center ${
                gridEnabled ? 'bg-blue-600 text-white' : ''
              }`}
              onClick={onToggleGrid}
              title="Mostrar/ocultar grade"
            >
              <Grid className="w-4 h-4" />
              Grade
            </button>
            <button
              className={`button-unified flex items-center gap-2 justify-center ${
                snapEnabled ? 'bg-blue-600 text-white' : ''
              }`}
              onClick={onToggleSnap}
              title="Ativar/desativar snap"
            >
              <Move className="w-4 h-4" />
              Snap
            </button>
          </div>
        </div>

        {/* Alignment Controls */}
        <div className="panel-section-unified">
          <h3 className="text-sm font-medium text-slate-200 mb-3">
            Alinhamento {!hasMultipleSelected && '(selecione 2+ elementos)'}
          </h3>
          
          {/* Horizontal Alignment */}
          <div className="mb-4">
            <p className="text-xs text-slate-400 mb-2">Horizontal</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                className="button-unified p-2 flex items-center justify-center"
                onClick={() => onAlign('left')}
                disabled={!hasMultipleSelected}
                title="Alinhar à esquerda"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                className="button-unified p-2 flex items-center justify-center"
                onClick={() => onAlign('center')}
                disabled={!hasMultipleSelected}
                title="Alinhar ao centro"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                className="button-unified p-2 flex items-center justify-center"
                onClick={() => onAlign('right')}
                disabled={!hasMultipleSelected}
                title="Alinhar à direita"
              >
                <AlignRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Vertical Alignment */}
          <div className="mb-4">
            <p className="text-xs text-slate-400 mb-2">Vertical</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                className="button-unified p-2 flex items-center justify-center"
                onClick={() => onAlign('top')}
                disabled={!hasMultipleSelected}
                title="Alinhar ao topo"
              >
                <AlignTop className="w-4 h-4" />
              </button>
              <button
                className="button-unified p-2 flex items-center justify-center"
                onClick={() => onAlign('middle')}
                disabled={!hasMultipleSelected}
                title="Alinhar ao meio"
              >
                <AlignMiddle className="w-4 h-4" />
              </button>
              <button
                className="button-unified p-2 flex items-center justify-center"
                onClick={() => onAlign('bottom')}
                disabled={!hasMultipleSelected}
                title="Alinhar embaixo"
              >
                <AlignBottom className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Distribution Controls */}
        <div className="panel-section-unified">
          <h3 className="text-sm font-medium text-slate-200 mb-3">
            Distribuição {selectedElements.length < 3 && '(selecione 3+ elementos)'}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              className="button-unified p-2 flex items-center gap-2 justify-center"
              onClick={() => onDistribute('horizontal')}
              disabled={selectedElements.length < 3}
              title="Distribuir horizontalmente"
            >
              <DistributeHorizontal className="w-4 h-4" />
              Horizontal
            </button>
            <button
              className="button-unified p-2 flex items-center gap-2 justify-center"
              onClick={() => onDistribute('vertical')}
              disabled={selectedElements.length < 3}
              title="Distribuir verticalmente"
            >
              <DistributeVertical className="w-4 h-4" />
              Vertical
            </button>
          </div>
        </div>

        {/* Selection Info */}
        <div className="panel-section-unified bg-slate-800/50 rounded-lg p-3">
          <p className="text-xs text-slate-400">
            {selectedElements.length === 0 && 'Nenhum elemento selecionado'}
            {selectedElements.length === 1 && '1 elemento selecionado'}
            {selectedElements.length > 1 && `${selectedElements.length} elementos selecionados`}
          </p>
        </div>
      </div>
    </PanelContainer>
  );
};
