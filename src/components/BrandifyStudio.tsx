
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

export const BrandifyStudio = () => {
  console.log('🏢 [BRANDIFY STUDIO] Rendering component');
  
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

  console.log('🏢 [BRANDIFY STUDIO] Current state:', {
    selectedTool: toolState.selectedTool,
    showLayersPanel: uiState.showLayersPanel,
    showAlignmentPanel: uiState.showAlignmentPanel,
    showArtboardsPanel: uiState.showArtboardsPanel,
    showTextPropertiesPanel: uiState.showTextPropertiesPanel
  });

  const { createTextElement } = useTextCreation({
    selectedTool: toolState.selectedTool,
    selectedColor: toolState.selectedColor,
    addElement
  });

  const canvasRef = useRef<HTMLDivElement>(null);

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
    console.log('🏢 [BRANDIFY STUDIO] Tool selected:', tool);
    updateToolState({ selectedTool: tool });
  }, [updateToolState]);

  const handleColorSelect = useCallback((color: string) => {
    console.log('🏢 [BRANDIFY STUDIO] Color selected:', color);
    updateToolState({ selectedColor: color });
  }, [updateToolState]);

  const handleShapeSelect = useCallback((shape: string | null) => {
    console.log('🏢 [BRANDIFY STUDIO] Shape selected:', shape);
    updateUIState({ selectedShape: shape });
  }, [updateUIState]);

  const handleCreateText = useCallback((x: number, y: number) => {
    console.log('🏢 [BRANDIFY STUDIO] Creating text element:', { x, y });
    createTextElement(x, y);
  }, [createTextElement]);

  // Handlers para botões laterais - CONECTADOS AO CONTEXTO
  const handleLayersToggle = useCallback(() => {
    console.log('🏢 [BRANDIFY STUDIO] Toggling layers panel, current:', uiState.showLayersPanel);
    updateUIState({ showLayersPanel: !uiState.showLayersPanel });
  }, [uiState.showLayersPanel, updateUIState]);

  const handleGridToggle = useCallback(() => {
    console.log('🏢 [BRANDIFY STUDIO] Toggling alignment panel, current:', uiState.showAlignmentPanel);
    updateUIState({ showAlignmentPanel: !uiState.showAlignmentPanel });
  }, [uiState.showAlignmentPanel, updateUIState]);

  const handleArtboardsToggle = useCallback(() => {
    console.log('🏢 [BRANDIFY STUDIO] Toggling artboards panel, current:', uiState.showArtboardsPanel);
    updateUIState({ showArtboardsPanel: !uiState.showArtboardsPanel });
  }, [uiState.showArtboardsPanel, updateUIState]);

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
            onUpdateElement={updateElement}
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
          showTextPanel={uiState.showTextPropertiesPanel}
        />
        
        <LayersButton onClick={handleLayersToggle} />
        <GridButton onClick={handleGridToggle} />
        <ArtboardsButton onClick={handleArtboardsToggle} />
        
        {/* Painéis lazy loaded - CONECTADOS AO CONTEXTO */}
        {uiState.showLayersPanel && (
          <LazyPanelWrapper>
            <LazyLayersPanel
              elements={elements}
              onSelectElement={selectElement}
              onUpdateElement={updateElement}
              onDeleteElement={deleteElement}
              onClose={() => {
                console.log('🏢 [BRANDIFY STUDIO] Closing layers panel');
                updateUIState({ showLayersPanel: false });
              }}
            />
          </LazyPanelWrapper>
        )}
        
        {uiState.showAlignmentPanel && (
          <LazyPanelWrapper>
            <LazyAlignmentPanel onClose={() => {
              console.log('🏢 [BRANDIFY STUDIO] Closing alignment panel');
              updateUIState({ showAlignmentPanel: false });
            }} />
          </LazyPanelWrapper>
        )}
        
        {uiState.showArtboardsPanel && (
          <LazyPanelWrapper>
            <LazyArtboardsPanel onClose={() => {
              console.log('🏢 [BRANDIFY STUDIO] Closing artboards panel');
              updateUIState({ showArtboardsPanel: false });
            }} />
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
