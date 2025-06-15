
import React, { useRef, useCallback, memo } from 'react';
import { Canvas } from './Canvas';
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
import { ToolType } from '../types/tools';
import { useDesignElements } from '../hooks/useDesignElements';
import { useOptimizedAppState } from '../hooks/useOptimizedAppState';
import { useTextCreation } from '../hooks/useTextCreation';
import { useOptimizedDebounce } from '../hooks/useOptimizedDebounce';

// Memoizar componentes pesados
const MemoizedCanvas = memo(Canvas);
const MemoizedMainToolbar = memo(MainToolbar);
const MemoizedFloatingPropertiesPanel = memo(FloatingPropertiesPanel);

export const OptimizedBrandifyStudio = memo(() => {
  const {
    elements,
    selectedElement,
    selectedElementData,
    elementsCount,
    addElement,
    updateElement,
    selectElement,
    deleteElement,
    setSelectedElement
  } = useDesignElements();

  const {
    toolState,
    uiState,
    hasAnyPanelOpen,
    currentToolInfo,
    updateToolState,
    updateUIState,
    closeAllPanels,
    togglePanel
  } = useOptimizedAppState();

  const { createTextElement } = useTextCreation({
    selectedTool: toolState.selectedTool,
    selectedColor: toolState.selectedColor,
    addElement
  });

  const canvasRef = useRef<HTMLDivElement>(null);

  // Debounce otimizado para updates de elementos
  const debouncedUpdateElement = useOptimizedDebounce(
    updateElement, 
    100, 
    { trailing: true, maxWait: 300 }
  );

  // Log de performance otimizado
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 [PERFORMANCE] Studio state:', {
        selectedTool: toolState.selectedTool,
        elementsCount,
        hasAnyPanelOpen,
        currentToolInfo,
        timestamp: new Date().toISOString()
      });
    }
  }, [toolState.selectedTool, elementsCount, hasAnyPanelOpen, currentToolInfo]);

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
  const handleToolSelect = useCallback((tool: ToolType) => {
    updateToolState({ selectedTool: tool });
  }, [updateToolState]);

  const handleColorSelect = useCallback((color: string) => {
    updateToolState({ selectedColor: color });
  }, [updateToolState]);

  const handleShapeSelect = useCallback((shape: string | null) => {
    updateUIState({ selectedShape: shape });
  }, [updateUIState]);

  const handleCreateText = useCallback((x: number, y: number) => {
    createTextElement(x, y);
  }, [createTextElement]);

  const handleToggleTextPanel = useCallback(() => {
    togglePanel('showTextPropertiesPanel');
  }, [togglePanel]);

  // Handlers para painéis otimizados
  const handleLayersToggle = useCallback(() => {
    togglePanel('showLayersPanel');
  }, [togglePanel]);

  const handleAlignmentToggle = useCallback(() => {
    togglePanel('showAlignmentPanel');
  }, [togglePanel]);

  const handleArtboardsToggle = useCallback(() => {
    togglePanel('showArtboardsPanel');
  }, [togglePanel]);

  const handleCloseFloatingPanel = useCallback(() => {
    setSelectedElement(null);
  }, [setSelectedElement]);

  // Função para definir elementos (necessária para undo/redo)
  const setElements = useCallback((newElements: typeof elements) => {
    // Esta função será implementada quando integrarmos com o estado global
    console.log('🔄 [STUDIO] Set elements called:', newElements.length);
  }, []);

  const mappedTool = getCanvasToolType(toolState.selectedTool);

  return (
    <ErrorBoundary>
      <div className="h-screen bg-slate-900 overflow-hidden relative">
        <ZoomIndicator zoom={toolState.zoom} />
        
        <div ref={canvasRef}>
          <MemoizedCanvas
            elements={elements}
            selectedTool={mappedTool}
            selectedColor={toolState.selectedColor}
            onAddElement={addElement}
            onSelectElement={selectElement}
            onUpdateElement={debouncedUpdateElement}
            onCreateText={handleCreateText}
            setElements={setElements}
          />
        </div>
        
        <MemoizedMainToolbar 
          selectedTool={toolState.selectedTool}
          onToolSelect={handleToolSelect}
          selectedColor={toolState.selectedColor}
          onColorSelect={handleColorSelect}
          selectedShape={uiState.selectedShape}
          onShapeSelect={handleShapeSelect}
          onOpenTextPanel={handleToggleTextPanel}
          showTextPanel={uiState.showTextPropertiesPanel}
        />
        
        <LayersButton onClick={handleLayersToggle} />
        <GridButton onClick={handleAlignmentToggle} />
        <ArtboardsButton onClick={handleArtboardsToggle} />
        
        {uiState.showLayersPanel && (
          <LayersPanel
            elements={elements}
            onSelectElement={selectElement}
            onUpdateElement={updateElement}
            onDeleteElement={deleteElement}
            onClose={() => updateUIState({ showLayersPanel: false })}
          />
        )}
        
        {uiState.showAlignmentPanel && (
          <AlignmentPanel 
            onClose={() => updateUIState({ showAlignmentPanel: false })} 
          />
        )}
        
        {uiState.showArtboardsPanel && (
          <ArtboardsPanel 
            onClose={() => updateUIState({ showArtboardsPanel: false })} 
          />
        )}
        
        {selectedElementData && (
          <MemoizedFloatingPropertiesPanel
            selectedElement={selectedElementData}
            onUpdateElement={updateElement}
            onDeleteElement={deleteElement}
            onClose={handleCloseFloatingPanel}
          />
        )}
      </div>
    </ErrorBoundary>
  );
});

OptimizedBrandifyStudio.displayName = 'OptimizedBrandifyStudio';
