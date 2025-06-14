
import React, { useState, useRef } from 'react';
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
import { ToolType, UIState, ToolState } from '../types/tools';

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

  const addElement = (element: Omit<DesignElement, 'id' | 'selected'>) => {
    const newElement: DesignElement = {
      ...element,
      id: Date.now().toString(),
      selected: false,
    };
    setElements(prev => [...prev, newElement]);
  };

  const updateElement = (id: string, updates: Partial<DesignElement>) => {
    setElements(prev => 
      prev.map(el => el.id === id ? { ...el, ...updates } : el)
    );
  };

  const selectElement = (id: string | null) => {
    setElements(prev => 
      prev.map(el => ({ ...el, selected: el.id === id }))
    );
    setSelectedElement(id);
  };

  const deleteElement = (id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
    if (selectedElement === id) {
      setSelectedElement(null);
    }
  };

  // Função para atualizar estado de ferramenta
  const updateToolState = (updates: Partial<ToolState>) => {
    setToolState(prev => ({ ...prev, ...updates }));
  };

  // Função para atualizar estado de UI
  const updateUIState = (updates: Partial<UIState>) => {
    setUIState(prev => ({ ...prev, ...updates }));
  };

  // Função corrigida para criar texto (SEM criação automática)
  const createTextElement = (x: number, y: number) => {
    if (toolState.selectedTool !== 'text') return;
    
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
  };

  // Detectar mudança de ferramenta (SEM criação automática)
  React.useEffect(() => {
    if (toolState.selectedTool === 'text') {
      updateUIState({ textCreated: false });
    } else {
      updateUIState({ showTextPropertiesPanel: false, textCreated: false });
    }
  }, [toolState.selectedTool]);

  // Mapear ferramentas para o Canvas
  const getCanvasToolType = (tool: ToolType): 'select' | 'pen' | 'shapes' | 'text' => {
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
        return 'select';
    }
  };

  return (
    <div className="h-screen bg-slate-900 overflow-hidden relative">
      <ZoomIndicator zoom={toolState.zoom} />
      
      <div ref={canvasRef}>
        <Canvas
          elements={elements}
          selectedTool={getCanvasToolType(toolState.selectedTool)}
          selectedColor={toolState.selectedColor}
          onAddElement={addElement}
          onSelectElement={selectElement}
          onUpdateElement={updateElement}
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
  );
};
