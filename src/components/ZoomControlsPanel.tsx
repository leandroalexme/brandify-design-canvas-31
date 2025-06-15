
import React from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  RotateCcw,
  Square,
  MousePointer,
  Crosshair
} from 'lucide-react';

interface ZoomControlsPanelProps {
  zoomLevel: number;
  canZoomIn: boolean;
  canZoomOut: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomToFit: () => void;
  onZoomToSelection: () => void;
  onResetZoom: () => void;
  selectedElementsCount: number;
}

export const ZoomControlsPanel = ({
  zoomLevel,
  canZoomIn,
  canZoomOut,
  onZoomIn,
  onZoomOut,
  onZoomToFit,
  onZoomToSelection,
  onResetZoom,
  selectedElementsCount
}: ZoomControlsPanelProps) => {
  const zoomPercentage = Math.round(zoomLevel * 100);

  return (
    <div className="absolute bottom-6 left-6 z-40">
      <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl p-2">
        <div className="flex items-center gap-1">
          
          {/* Zoom Out */}
          <button
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
              canZoomOut 
                ? 'hover:bg-slate-700 text-slate-300 hover:text-white' 
                : 'text-slate-600 cursor-not-allowed'
            }`}
            onClick={onZoomOut}
            disabled={!canZoomOut}
            title="Diminuir zoom (Ctrl + -)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Indicador de zoom */}
          <div className="px-3 py-1 text-sm font-medium text-slate-200 min-w-[60px] text-center">
            {zoomPercentage}%
          </div>

          {/* Zoom In */}
          <button
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
              canZoomIn 
                ? 'hover:bg-slate-700 text-slate-300 hover:text-white' 
                : 'text-slate-600 cursor-not-allowed'
            }`}
            onClick={onZoomIn}
            disabled={!canZoomIn}
            title="Aumentar zoom (Ctrl + +)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Separador */}
          <div className="w-px h-6 bg-slate-600 mx-1" />

          {/* Zoom para ajustar */}
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            onClick={onZoomToFit}
            title="Ajustar à tela (Ctrl + 0)"
          >
            <Maximize className="w-4 h-4" />
          </button>

          {/* Zoom para seleção */}
          <button
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
              selectedElementsCount > 0
                ? 'hover:bg-slate-700 text-slate-300 hover:text-white'
                : 'text-slate-600 cursor-not-allowed'
            }`}
            onClick={onZoomToSelection}
            disabled={selectedElementsCount === 0}
            title={`Zoom na seleção (${selectedElementsCount} elementos)`}
          >
            <Square className="w-4 h-4" />
          </button>

          {/* Reset zoom */}
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            onClick={onResetZoom}
            title="Zoom 100% (Ctrl + 1)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Informações adicionais */}
        {zoomLevel < 0.5 && (
          <div className="text-xs text-amber-400 text-center mt-1 px-2">
            Zoom muito baixo
          </div>
        )}
        
        {zoomLevel > 5 && (
          <div className="text-xs text-amber-400 text-center mt-1 px-2">
            Zoom muito alto
          </div>
        )}
      </div>

      {/* Controles extras em zoom baixo */}
      {zoomLevel < 0.25 && (
        <div className="mt-2 bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl p-2">
          <div className="text-xs text-slate-400 text-center">
            <div className="flex items-center gap-1 justify-center mb-1">
              <MousePointer className="w-3 h-3" />
              Navegação otimizada
            </div>
            <div>Use o scroll para zoom rápido</div>
          </div>
        </div>
      )}

      {/* Crosshair em zoom alto */}
      {zoomLevel > 3 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50">
          <Crosshair className="w-6 h-6 text-blue-400 opacity-50" />
        </div>
      )}
    </div>
  );
};
