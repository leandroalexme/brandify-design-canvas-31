
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
import { logger } from '../utils/validation';

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
    toolState,
    addElement,
    updateUIState
  });

  const canvasRef = useRef<HTMLDivElement>(null);

  // Debounced version para operações frequentes
  const debouncedUpdateElement = useDebounce(updateElement, 100);

  // Detectar mudança de ferramenta - melhorado para abrir painel automaticamente
  React.useEffect(() => {
    try {
      console.log('Tool changed to:', toolState.selectedTool);
      
      if (toolState.selectedTool === 'text') {
        // Abrir o painel imediatamente quando a ferramenta texto for selecionada
        updateUIState({ 
          showTextPropertiesPanel: true,
          textCreated: false 
        });
        logger.debug('Text tool selected, opening properties panel');
      } else {
        // Fechar painel quando outra ferramenta for selecionada
        updateUIState({ 
          showTextPropertiesPanel: false, 
          textCreated: false 
        });
        logger.debug('Non-text tool selected, closing properties panel');
      }
    } catch (error) {
      logger.error('Error in tool change effect', error);
    }
  }, [toolState.selectedTool, updateUIState]);

  // Mapear ferramentas para o Canvas com melhor tratamento de erros
  const getCanvasToolType = useCallback((tool: ToolType): 'select' | 'pen' | 'shapes' | 'text' => {
    console.log('Mapping tool to canvas type:', tool);
    
    // Mapeamento direto para ferramentas principais
    if (tool === 'select' || tool === 'pen' || tool === 'shapes' || tool === 'text') {
      console.log('Direct mapping for tool:', tool);
      return tool;
    }
    
    // Mapeamento para sub-ferramentas
    switch (tool) {
      case 'node':
      case 'move':
      case 'comment':
        console.log('Sub-tool mapped to select:', tool);
        return 'select';
      case 'brush':
      case 'pencil':
        console.log('Sub-tool mapped to pen:', tool);
        return 'pen';
      default:
        console.warn('Unknown tool type, defaulting to select:', tool);
        return 'select';
    }
  }, []);

  // Otimizar handler de seleção de ferramenta
  const handleToolSelect = useCallback((tool: ToolType) => {
    console.log('Tool selected in BrandifyStudio:', tool);
    updateToolState({ selectedTool: tool });
  }, [updateToolState]);

  // Otimizar handler de seleção de cor
  const handleColorSelect = useCallback((color: string) => {
    logger.debug('Color selected', { color });
    updateToolState({ selectedColor: color });
  }, [updateToolState]);

  // Otimizar handler de seleção de forma
  const handleShapeSelect = useCallback((shape: string | null) => {
    logger.debug('Shape selected', { shape });
    updateUIState({ selectedShape: shape });
  }, [updateUIState]);

  // Handler para criação de texto com logs
  const handleCreateText = useCallback((x: number, y: number) => {
    console.log('handleCreateText called with coordinates:', { x, y });
    console.log('Current tool state:', toolState);
    createTextElement(x, y);
  }, [createTextElement, toolState]);

  const mappedTool = getCanvasToolType(toolState.selectedTool);
  console.log('Canvas will receive tool:', mappedTool, 'from original tool:', toolState.selectedTool);

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
        />
        
        <LayersButton onClick={() => updateUIState({ showLayersPanel: !uiState.showLayersPanel })} />
        <GridButton onClick={() => updateUIState({ showAlignmentPanel: !uiState.showAlignmentPanel })} />
        <ArtboardsButton onClick={() => updateUIState({ showArtboardsPanel: !uiState.showArtboardsPanel })} />
        
        {/* Painel de propriedades de texto - sempre renderizado quando showTextPropertiesPanel for true */}
        <TextPropertiesPanel
          isOpen={uiState.showTextPropertiesPanel}
          onClose={() => {
            updateUIState({ showTextPropertiesPanel: false });
            updateToolState({ selectedTool: 'select' });
          }}
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
