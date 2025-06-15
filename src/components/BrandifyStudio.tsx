
import React, { useRef, useCallback } from 'react';
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
import { TextPropertiesPanel } from './TextPropertiesPanel';
import { ErrorBoundary } from './ErrorBoundary';
import { ToolType } from '../types/tools';
import { useDesignElements } from '../hooks/useDesignElements';
import { useAppState } from '../hooks/useAppState';
import { useTextCreation } from '../hooks/useTextCreation';
import { useDebounce } from '../hooks/useDebounce';

export const BrandifyStudio = () => {
  const {
    elements,
    selectedElement,
    addElement,
    updateElement,
    selectElement,
    deleteElement,
    setSelectedElement
  } = useDesignElements();

  const {
    toolState,
    uiState,
    updateToolState,
    updateUIState
  } = useAppState();

  const { createTextElement } = useTextCreation({
    selectedTool: toolState.selectedTool,
    selectedColor: toolState.selectedColor,
    addElement
  });

  const canvasRef = useRef<HTMLDivElement>(null);
  const debouncedUpdateElement = useDebounce(updateElement, 100);

  // Log para debug detalhado
  React.useEffect(() => {
    console.log('📊 [BRANDIFY] Current state:', {
      selectedTool: toolState.selectedTool,
      elementsCount: elements.length,
      showTextPanel: uiState.showTextPropertiesPanel
    });
  }, [toolState.selectedTool, elements.length, uiState.showTextPropertiesPanel]);

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
    console.log('🔧 [BRANDIFY] Tool selected:', tool);
    updateToolState({ selectedTool: tool });
  }, [updateToolState]);

  const handleColorSelect = useCallback((color: string) => {
    console.log('🎨 [BRANDIFY] Color selected:', color);
    updateToolState({ selectedColor: color });
  }, [updateToolState]);

  const handleShapeSelect = useCallback((shape: string | null) => {
    console.log('🔷 [BRANDIFY] Shape selected:', shape);
    updateUIState({ selectedShape: shape });
  }, [updateUIState]);

  const handleCreateText = useCallback((x: number, y: number) => {
    console.log('📝 [BRANDIFY] Creating text at:', { x, y });
    createTextElement(x, y);
  }, [createTextElement]);

  // Nova função específica para abrir o painel de texto
  const handleOpenTextPanel = useCallback(() => {
    console.log('🎛️ [BRANDIFY] Opening text panel manually');
    console.log('🎛️ [BRANDIFY] Current tool before:', toolState.selectedTool);
    
    // Selecionar ferramenta de texto e abrir painel
    updateToolState({ selectedTool: 'text' });
    updateUIState({ showTextPropertiesPanel: true });
    
    console.log('🎛️ [BRANDIFY] Text panel opened, tool set to text');
  }, [updateToolState, updateUIState, toolState.selectedTool]);

  const handleCloseTextPanel = useCallback(() => {
    console.log('🚪 [BRANDIFY] Closing text panel');
    updateUIState({ showTextPropertiesPanel: false });
    // Voltar para ferramenta de seleção ao fechar o painel
    updateToolState({ selectedTool: 'select' });
  }, [updateUIState, updateToolState]);

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
          onOpenTextPanel={handleOpenTextPanel}
        />
        
        <LayersButton onClick={() => updateUIState({ showLayersPanel: !uiState.showLayersPanel })} />
        <GridButton onClick={() => updateUIState({ showAlignmentPanel: !uiState.showAlignmentPanel })} />
        <ArtboardsButton onClick={() => updateUIState({ showArtboardsPanel: !uiState.showArtboardsPanel })} />
        
        <TextPropertiesPanel
          isOpen={uiState.showTextPropertiesPanel}
          onClose={handleCloseTextPanel}
        />
        
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
          <AlignmentPanel onClose={() => updateUIState({ showAlignmentPanel: false })} />
        )}
        
        {uiState.showArtboardsPanel && (
          <ArtboardsPanel onClose={() => updateUIState({ showArtboardsPanel: false })} />
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
