
import React, { useState, useRef, useCallback } from 'react';
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
import { ToolType, UIState, ToolState } from '../types/tools';
import { isValidTool, isValidDesignElement, isValidPosition, logger } from '../utils/validation';
import { useDebounce } from '../hooks/useDebounce';

export interface DesignElement {
  id: string;
  type: 'text' | 'shape' | 'drawing';
  x: number;
  y: number;
  content?: string;
  color: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  width?: number;
  height?: number;
  rotation?: number;
  selected: boolean;
}

export const BrandifyStudio = () => {
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  
  // Estado unificado de ferramentas
  const [toolState, setToolState] = useState<ToolState>({
    selectedTool: 'select',
    selectedColor: '#4285F4',
    zoom: 100
  });
  
  // Estado unificado de UI
  const [uiState, setUIState] = useState<UIState>({
    showLayersPanel: false,
    showAlignmentPanel: false,
    showArtboardsPanel: false,
    showTextPropertiesPanel: false,
    selectedShape: null,
    textCreated: false
  });

  const canvasRef = useRef<HTMLDivElement>(null);

  // Funções otimizadas com validação
  const addElement = useCallback((element: Omit<DesignElement, 'id' | 'selected'>) => {
    try {
      if (!isValidPosition({ x: element.x, y: element.y })) {
        logger.error('Invalid position for new element', element);
        return;
      }

      const newElement: DesignElement = {
        ...element,
        id: Date.now().toString(),
        selected: false,
      };

      if (!isValidDesignElement(newElement)) {
        logger.error('Invalid design element created', newElement);
        return;
      }

      setElements(prev => [...prev, newElement]);
      logger.debug('Element added successfully', newElement);
    } catch (error) {
      logger.error('Error adding element', error);
    }
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<DesignElement>) => {
    try {
      setElements(prev => 
        prev.map(el => {
          if (el.id === id) {
            const updated = { ...el, ...updates };
            if (!isValidDesignElement(updated)) {
              logger.error('Invalid element update', { id, updates });
              return el;
            }
            return updated;
          }
          return el;
        })
      );
      logger.debug('Element updated successfully', { id, updates });
    } catch (error) {
      logger.error('Error updating element', error);
    }
  }, []);

  const selectElement = useCallback((id: string | null) => {
    try {
      setElements(prev => 
        prev.map(el => ({ ...el, selected: el.id === id }))
      );
      setSelectedElement(id);
      logger.debug('Element selected', id);
    } catch (error) {
      logger.error('Error selecting element', error);
    }
  }, []);

  const deleteElement = useCallback((id: string) => {
    try {
      setElements(prev => prev.filter(el => el.id !== id));
      if (selectedElement === id) {
        setSelectedElement(null);
      }
      logger.debug('Element deleted', id);
    } catch (error) {
      logger.error('Error deleting element', error);
    }
  }, [selectedElement]);

  // Função para atualizar estado de ferramenta com validação
  const updateToolState = useCallback((updates: Partial<ToolState>) => {
    try {
      if (updates.selectedTool && !isValidTool(updates.selectedTool)) {
        logger.error('Invalid tool selected', updates.selectedTool);
        return;
      }
      
      setToolState(prev => ({ ...prev, ...updates }));
      logger.debug('Tool state updated', updates);
    } catch (error) {
      logger.error('Error updating tool state', error);
    }
  }, []);

  // Função para atualizar estado de UI
  const updateUIState = useCallback((updates: Partial<UIState>) => {
    try {
      setUIState(prev => ({ ...prev, ...updates }));
      logger.debug('UI state updated', updates);
    } catch (error) {
      logger.error('Error updating UI state', error);
    }
  }, []);

  // Função para criar texto com validação
  const createTextElement = useCallback((x: number, y: number) => {
    try {
      if (toolState.selectedTool !== 'text') {
        logger.warn('Text creation attempted with wrong tool', toolState.selectedTool);
        return;
      }

      if (!isValidPosition({ x, y })) {
        logger.error('Invalid position for text element', { x, y });
        return;
      }
      
      const newTextElement: Omit<DesignElement, 'id' | 'selected'> = {
        type: 'text',
        x,
        y,
        content: 'Digite seu texto',
        color: toolState.selectedColor,
        fontSize: 24,
        fontFamily: 'Inter',
        fontWeight: 'normal'
      };
      
      addElement(newTextElement);
      updateUIState({ showTextPropertiesPanel: true, textCreated: true });
      logger.info('Text element created', { x, y });
    } catch (error) {
      logger.error('Error creating text element', error);
    }
  }, [toolState.selectedTool, toolState.selectedColor, addElement, updateUIState]);

  // Debounced version para operações frequentes
  const debouncedUpdateElement = useDebounce(updateElement, 100);

  // Detectar mudança de ferramenta
  React.useEffect(() => {
    try {
      if (toolState.selectedTool === 'text') {
        updateUIState({ textCreated: false });
      } else {
        updateUIState({ showTextPropertiesPanel: false, textCreated: false });
      }
    } catch (error) {
      logger.error('Error in tool change effect', error);
    }
  }, [toolState.selectedTool, updateUIState]);

  // Mapear ferramentas para o Canvas
  const getCanvasToolType = useCallback((tool: ToolType): 'select' | 'pen' | 'shapes' | 'text' => {
    switch (tool) {
      case 'node':
      case 'move':
      case 'comment':
        return 'select';
      case 'brush':
      case 'pencil':
        return 'pen';
      case 'shapes':
        return 'shapes';
      case 'text':
        return 'text';
      default:
        logger.warn('Unknown tool type, defaulting to select', tool);
        return 'select';
    }
  }, []);

  return (
    <ErrorBoundary>
      <div className="h-screen bg-slate-900 overflow-hidden relative">
        <ZoomIndicator zoom={toolState.zoom} />
        
        <div ref={canvasRef}>
          <Canvas
            elements={elements}
            selectedTool={getCanvasToolType(toolState.selectedTool)}
            selectedColor={toolState.selectedColor}
            onAddElement={addElement}
            onSelectElement={selectElement}
            onUpdateElement={debouncedUpdateElement}
            onCreateText={createTextElement}
          />
        </div>
        
        <MainToolbar 
          selectedTool={toolState.selectedTool}
          onToolSelect={(tool) => updateToolState({ selectedTool: tool })}
          selectedColor={toolState.selectedColor}
          onColorSelect={(color) => updateToolState({ selectedColor: color })}
          selectedShape={uiState.selectedShape}
          onShapeSelect={(shape) => updateUIState({ selectedShape: shape })}
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
        
        <TextPropertiesPanel
          isOpen={uiState.showTextPropertiesPanel}
          onClose={() => {
            updateUIState({ showTextPropertiesPanel: false });
            updateToolState({ selectedTool: 'select' });
          }}
        />
        
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
