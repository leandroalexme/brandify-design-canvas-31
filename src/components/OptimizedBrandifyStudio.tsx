import React, { useRef, useCallback, memo } from 'react';
import { ProfessionalCanvas } from './ProfessionalCanvas';
import { MainToolbar } from './MainToolbar';
import { FloatingPropertiesPanel } from './FloatingPropertiesPanel';
import { LayersButton } from './LayersButton';
import { GridButton } from './GridButton';
import { ArtboardsButton } from './ArtboardsButton';
import { ZoomIndicator } from './ZoomIndicator';
import { LayersPanel } from './LayersPanel';
import { AlignmentPanel } from './AlignmentPanel';
import { ArtboardsPanel } from './ArtboardsPanel';
import { ErrorBoundary } from './ErrorBoundary';
import { LoadingSpinner } from './LoadingSpinner';
import { ToolType } from '../types/tools';
import { useIntegratedStudio } from '../hooks/useIntegratedStudio';
import { useTextCreation } from '../hooks/useTextCreation';

// Memoizar componentes pesados
const MemoizedProfessionalCanvas = memo(ProfessionalCanvas);
const MemoizedMainToolbar = memo(MainToolbar);
const MemoizedFloatingPropertiesPanel = memo(FloatingPropertiesPanel);

export const OptimizedBrandifyStudio = memo(() => {
  const studio = useIntegratedStudio();
  
  const { createTextElement } = useTextCreation({
    selectedTool: studio.toolState.selectedTool,
    selectedColor: studio.toolState.selectedColor,
    addElement: studio.addElement
  });

  const canvasRef = useRef<HTMLDivElement>(null);

  // Log de performance otimizado
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 [PROFESSIONAL STUDIO] State:', {
        selectedTool: studio.toolState.selectedTool,
        elementsCount: studio.elementsCount,
        hasAnyPanelOpen: studio.hasAnyPanelOpen,
        currentToolInfo: studio.currentToolInfo,
        interactionMode: studio.interactionMode,
        shortcutsCount: studio.shortcuts.length,
        fabricEnabled: true,
        timestamp: new Date().toISOString()
      });
    }
  }, [studio.toolState.selectedTool, studio.elementsCount, studio.hasAnyPanelOpen, studio.currentToolInfo, studio.interactionMode, studio.shortcuts.length]);

  // Mapear ferramentas para o Canvas com cache
  const getCanvasToolType = useCallback((tool: ToolType): 'select' | 'pen' | 'shapes' | 'text' => {
    if (tool === 'select' || tool === 'pen' || tool === 'shapes' || tool === 'text') {
      return tool;
    }
    
    switch (tool) {
      case 'node':
      case 'move':
      case 'comment':
        return 'select';
      case 'brush':
      case 'pencil':
        return 'pen';
      default:
        return 'select';
    }
  }, []);

  // Handlers otimizados com useCallback
  const handleColorSelect = useCallback((color: string) => {
    studio.updateToolState({ selectedColor: color });
  }, [studio]);

  const handleShapeSelect = useCallback((shape: string | null) => {
    studio.updateUIState({ selectedShape: shape });
  }, [studio]);

  const handleCreateText = useCallback((x: number, y: number) => {
    createTextElement(x, y);
    studio.saveState('Create text');
  }, [createTextElement, studio]);

  const handleToggleTextPanel = useCallback(() => {
    studio.togglePanel('showTextPropertiesPanel');
  }, [studio]);

  // Handlers para painéis otimizados
  const handleLayersToggle = useCallback(() => {
    studio.togglePanel('showLayersPanel');
  }, [studio]);

  const handleAlignmentToggle = useCallback(() => {
    studio.togglePanel('showAlignmentPanel');
  }, [studio]);

  const handleArtboardsToggle = useCallback(() => {
    studio.togglePanel('showArtboardsPanel');
  }, [studio]);

  const handleCloseFloatingPanel = useCallback(() => {
    studio.setSelectedElement(null);
  }, [studio]);

  // Função para definir elementos (necessária para undo/redo)
  const setElements = useCallback((newElements: typeof studio.elements) => {
    // Esta funcionalidade será implementada quando integrarmos com estado global avançado
    console.log('🔄 [STUDIO] Set elements called:', newElements.length);
  }, [studio.elements]);

  const mappedTool = getCanvasToolType(studio.toolState.selectedTool);

  // Loading state
  if (!studio.elements && studio.elementsCount === 0) {
    return (
      <div className="h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" color="white" className="mx-auto mb-4" />
          <p className="text-slate-300">Carregando Editor Profissional...</p>
          <p className="text-slate-400 text-sm mt-2">Inicializando Fabric.js...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="h-screen bg-slate-900 overflow-hidden relative">
        <ZoomIndicator zoom={studio.toolState.zoom} />
        
        {/* Status bar para debug */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute top-2 right-2 z-50 text-xs text-slate-400 bg-slate-800/80 p-2 rounded">
            🎯 Fabric.js | Modo: {studio.interactionMode} | Selecionados: {studio.selectedCount} | 
            Undo: {studio.canUndo ? '✅' : '❌'} | Redo: {studio.canRedo ? '✅' : '❌'}
          </div>
        )}
        
        <div ref={canvasRef}>
          <MemoizedProfessionalCanvas
            elements={studio.elements}
            selectedTool={mappedTool}
            selectedColor={studio.toolState.selectedColor}
            onAddElement={studio.addElement}
            onSelectElement={studio.selectElement}
            onUpdateElement={studio.updateElement}
            onCreateText={handleCreateText}
          />
        </div>
        
        <MemoizedMainToolbar 
          selectedTool={studio.toolState.selectedTool}
          onToolSelect={studio.handleToolSelect}
          selectedColor={studio.toolState.selectedColor}
          onColorSelect={handleColorSelect}
          selectedShape={studio.uiState.selectedShape}
          onShapeSelect={handleShapeSelect}
          onOpenTextPanel={handleToggleTextPanel}
          showTextPanel={studio.uiState.showTextPropertiesPanel}
        />
        
        <LayersButton onClick={handleLayersToggle} />
        <GridButton onClick={handleAlignmentToggle} />
        <ArtboardsButton onClick={handleArtboardsToggle} />
        
        {studio.uiState.showLayersPanel && (
          <LayersPanel
            elements={studio.elements}
            onSelectElement={studio.selectElement}
            onUpdateElement={studio.updateElement}
            onDeleteElement={studio.deleteElement}
            onClose={() => studio.updateUIState({ showLayersPanel: false })}
          />
        )}
        
        {studio.uiState.showAlignmentPanel && (
          <AlignmentPanel 
            onClose={() => studio.updateUIState({ showAlignmentPanel: false })} 
          />
        )}
        
        {studio.uiState.showArtboardsPanel && (
          <ArtboardsPanel 
            onClose={() => studio.updateUIState({ showArtboardsPanel: false })} 
          />
        )}
        
        {studio.selectedElementData && (
          <MemoizedFloatingPropertiesPanel
            selectedElement={studio.selectedElementData}
            onUpdateElement={studio.updateElement}
            onDeleteElement={studio.deleteElement}
            onClose={handleCloseFloatingPanel}
          />
        )}
      </div>
    </ErrorBoundary>
  );
});

OptimizedBrandifyStudio.displayName = 'OptimizedBrandifyStudio';
