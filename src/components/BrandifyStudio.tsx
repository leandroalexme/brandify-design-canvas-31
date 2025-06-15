
import React, { useRef, useCallback } from 'react';
import { Canvas } from './Canvas';
import { MainToolbar } from './MainToolbar';
import { FloatingPropertiesPanel } from './FloatingPropertiesPanel';
import { LayersButton } from './LayersButton';
import { GridButton } from './GridButton';
import { ArtboardsButton } from './ArtboardsButton';
import { ZoomIndicator } from './ZoomIndicator';
import { ErrorBoundary } from './ErrorBoundary';
import { LazyPanelWrapper, LazyLayersPanel, LazyAlignmentPanel, LazyArtboardsPanel } from './LazyPanels';
import { ToolType } from '../types/tools';
import { useEditor } from '../contexts/EditorContext';
import { useTextCreation } from '../hooks/useTextCreation';
import { useDebounceCallback } from '../hooks/useDebounceCallback';
import { useOptimizedEventListener } from '../hooks/useOptimizedEventListener';
import { debug } from '../utils/debug';

export const BrandifyStudio = () => {
  const {
    toolState,
    uiState,
    elements,
    selectedElement,
    updateToolState,
    updateUIState,
    addElement,
    updateElement,
    selectElement,
    deleteElement,
    setSelectedElement,
    toggleTextPanel
  } = useEditor();

  const { createTextElement } = useTextCreation({
    selectedTool: toolState.selectedTool,
    selectedColor: toolState.selectedColor,
    addElement
  });

  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Otimização com debounce para updates de elementos
  const debouncedUpdateElement = useDebounceCallback(updateElement, 16); // 60fps

  // Event listener otimizado para keyboard shortcuts
  useOptimizedEventListener('keydown', useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSelectedElement(null);
      if (uiState.showTextPropertiesPanel) {
        toggleTextPanel();
      }
    }
  }, [setSelectedElement, uiState.showTextPropertiesPanel, toggleTextPanel]), { passive: true });

  // Mapear ferramentas para o Canvas
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

  const handleToolSelect = useCallback((tool: ToolType) => {
    debug.log('Tool selected', { tool }, 'toolbar');
    updateToolState({ selectedTool: tool });
  }, [updateToolState]);

  const handleColorSelect = useCallback((color: string) => {
    debug.log('Color selected', { color }, 'toolbar');
    updateToolState({ selectedColor: color });
  }, [updateToolState]);

  const handleShapeSelect = useCallback((shape: string | null) => {
    debug.log('Shape selected', { shape }, 'toolbar');
    updateUIState({ selectedShape: shape });
  }, [updateUIState]);

  const handleCreateText = useCallback((x: number, y: number) => {
    debug.log('Creating text element', { x, y }, 'canvas');
    createTextElement(x, y);
  }, [createTextElement]);

  const mappedTool = getCanvasToolType(toolState.selectedTool);

  return (
    <ErrorBoundary>
      <div className="h-screen bg-slate-900 overflow-hidden relative">
        <ZoomIndicator zoom={toolState.zoom} />
        
        <div ref={canvasRef}>
          <Canvas
            elements={elements}
            selectedTool={mappedTool}
            selectedColor={toolState.selectedColor}
            onAddElement={addElement}
            onSelectElement={selectElement}
            onUpdateElement={debouncedUpdateElement}
            onCreateText={handleCreateText}
          />
        </div>
        
        <MainToolbar 
          selectedTool={toolState.selectedTool}
          onToolSelect={handleToolSelect}
          selectedColor={toolState.selectedColor}
          onColorSelect={handleColorSelect}
          selectedShape={uiState.selectedShape}
          onShapeSelect={handleShapeSelect}
          onOpenTextPanel={toggleTextPanel}
          showTextPanel={uiState.showTextPropertiesPanel}
        />
        
        <LayersButton onClick={() => updateUIState({ showLayersPanel: !uiState.showLayersPanel })} />
        <GridButton onClick={() => updateUIState({ showAlignmentPanel: !uiState.showAlignmentPanel })} />
        <ArtboardsButton onClick={() => updateUIState({ showArtboardsPanel: !uiState.showArtboardsPanel })} />
        
        {/* Lazy loaded panels */}
        {uiState.showLayersPanel && (
          <LazyPanelWrapper>
            <LazyLayersPanel
              elements={elements}
              onSelectElement={selectElement}
              onUpdateElement={updateElement}
              onDeleteElement={deleteElement}
              onClose={() => updateUIState({ showLayersPanel: false })}
            />
          </LazyPanelWrapper>
        )}
        
        {uiState.showAlignmentPanel && (
          <LazyPanelWrapper>
            <LazyAlignmentPanel onClose={() => updateUIState({ showAlignmentPanel: false })} />
          </LazyPanelWrapper>
        )}
        
        {uiState.showArtboardsPanel && (
          <LazyPanelWrapper>
            <LazyArtboardsPanel onClose={() => updateUIState({ showArtboardsPanel: false })} />
          </LazyPanelWrapper>
        )}
        
        {selectedElement && (
          <FloatingPropertiesPanel
            selectedElement={elements.find(el => el.id === selectedElement) || null}
            onUpdateElement={updateElement}
            onDeleteElement={deleteElement}
            onClose={() => setSelectedElement(null)}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};
