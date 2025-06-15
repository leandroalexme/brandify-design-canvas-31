
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

  // Log para debug detalhado com melhor rastreamento
  React.useEffect(() => {
    console.log('📊 [BRANDIFY] State sync check:', {
      selectedTool: toolState.selectedTool,
      elementsCount: elements.length,
      showTextPanel: uiState.showTextPropertiesPanel,
      timestamp: new Date().toISOString()
    });
  }, [toolState.selectedTool, elements.length, uiState.showTextPropertiesPanel]);

  // Mapear ferramentas para o Canvas com validação
  const getCanvasToolType = useCallback((tool: ToolType): 'select' | 'pen' | 'shapes' | 'text' => {
    console.log('🔄 [BRANDIFY] Mapping tool for canvas:', tool);
    
    if (tool === 'select' || tool === 'pen' || tool === 'shapes' || tool === 'text') {
      return tool;
    }
    
    switch (tool) {
      case 'node':
      case 'move':
      case 'comment':
        console.log('🔄 [BRANDIFY] Mapping to select:', tool);
        return 'select';
      case 'brush':
      case 'pencil':
        console.log('🔄 [BRANDIFY] Mapping to pen:', tool);
        return 'pen';
      default:
        console.warn('🔄 [BRANDIFY] Unknown tool, defaulting to select:', tool);
        return 'select';
    }
  }, []);

  const handleToolSelect = useCallback((tool: ToolType) => {
    console.log('🔧 [BRANDIFY] Tool selection request:', { 
      newTool: tool, 
      currentTool: toolState.selectedTool,
      showTextPanel: uiState.showTextPropertiesPanel,
      timestamp: new Date().toISOString()
    });
    
    // Sincronização forçada para evitar descompasso
    updateToolState({ selectedTool: tool });
    
    // NÃO fechar painel de texto automaticamente - deixar o MainToolbar gerenciar isso
    console.log('🔧 [BRANDIFY] Tool updated, panel state preserved');
  }, [updateToolState, toolState.selectedTool, uiState.showTextPropertiesPanel]);

  const handleColorSelect = useCallback((color: string) => {
    console.log('🎨 [BRANDIFY] Color selection:', { color, timestamp: new Date().toISOString() });
    updateToolState({ selectedColor: color });
  }, [updateToolState]);

  const handleShapeSelect = useCallback((shape: string | null) => {
    console.log('🔷 [BRANDIFY] Shape selection:', { shape, timestamp: new Date().toISOString() });
    updateUIState({ selectedShape: shape });
  }, [updateUIState]);

  const handleCreateText = useCallback((x: number, y: number) => {
    console.log('📝 [BRANDIFY] Text creation at:', { x, y, timestamp: new Date().toISOString() });
    createTextElement(x, y);
  }, [createTextElement]);

  // Função de toggle para o painel de texto SIMPLIFICADA - apenas gerencia o estado do painel
  const handleToggleTextPanel = useCallback(() => {
    const currentPanelState = uiState.showTextPropertiesPanel;
    console.log('🎛️ [BRANDIFY] Text panel toggle request:', {
      currentPanelState,
      currentTool: toolState.selectedTool,
      timestamp: new Date().toISOString()
    });
    
    // Simplesmente alternar o estado do painel - NÃO mexer na ferramenta
    const newPanelState = !currentPanelState;
    updateUIState({ showTextPropertiesPanel: newPanelState });
    
    console.log('🎛️ [BRANDIFY] Panel state updated to:', newPanelState);
  }, [uiState.showTextPropertiesPanel, updateUIState]);

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
          onOpenTextPanel={handleToggleTextPanel}
          showTextPanel={uiState.showTextPropertiesPanel}
        />
        
        <LayersButton onClick={() => updateUIState({ showLayersPanel: !uiState.showLayersPanel })} />
        <GridButton onClick={() => updateUIState({ showAlignmentPanel: !uiState.showAlignmentPanel })} />
        <ArtboardsButton onClick={() => updateUIState({ showArtboardsPanel: !uiState.showArtboardsPanel })} />
        
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
