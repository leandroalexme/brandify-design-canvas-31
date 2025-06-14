
import React, { useState, useRef } from 'react';
import { Canvas } from './Canvas';
import { SimpleToolbar } from './SimpleToolbar';
import { useToolState } from '../hooks/useToolState';
import { FloatingPropertiesPanel } from './FloatingPropertiesPanel';
import { LayersButton } from './LayersButton';
import { GridButton } from './GridButton';
import { ArtboardsButton } from './ArtboardsButton';
import { ZoomIndicator } from './ZoomIndicator';
import { LayersPanel } from './LayersPanel';
import { AlignmentPanel } from './AlignmentPanel';
import { ArtboardsPanel } from './ArtboardsPanel';

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

export type ToolType = 'select' | 'node' | 'move' | 'comment' | 'pen' | 'vector-brush' | 'pencil' | 'shapes' | 'text';

export const BrandifyStudio = () => {
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [selectedColor, setSelectedColor] = useState('#4285F4');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  
  // Panel states
  const [showLayersPanel, setShowLayersPanel] = useState(false);
  const [showAlignmentPanel, setShowAlignmentPanel] = useState(false);
  const [showArtboardsPanel, setShowArtboardsPanel] = useState(false);

  // Referência do canvas
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Estado unificado das ferramentas
  const { selectedTool, selectTool, returnToMainTool } = useToolState();

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

  // Map expanded ToolType to Canvas compatible tool type
  const getCanvasToolType = (tool: ToolType): 'select' | 'pen' | 'shapes' | 'text' => {
    switch (tool) {
      case 'node':
      case 'move':
      case 'comment':
        return 'select';
      case 'vector-brush':
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
    <div className="h-screen bg-slate-900 overflow-hidden relative grid-background">
      {/* Zoom Indicator */}
      <ZoomIndicator zoom={zoom} />
      
      {/* Canvas */}
      <div ref={canvasRef}>
        <Canvas
          elements={elements}
          selectedTool={getCanvasToolType(selectedTool)}
          selectedColor={selectedColor}
          onAddElement={addElement}
          onSelectElement={selectElement}
          onUpdateElement={updateElement}
        />
      </div>
      
      {/* Toolbar Simplificada */}
      <SimpleToolbar 
        selectedTool={selectedTool}
        onToolSelect={selectTool}
        onClickOutside={returnToMainTool}
      />
      
      {/* Corner Controls */}
      <LayersButton onClick={() => setShowLayersPanel(!showLayersPanel)} />
      <GridButton onClick={() => setShowAlignmentPanel(!showAlignmentPanel)} />
      <ArtboardsButton onClick={() => setShowArtboardsPanel(!showArtboardsPanel)} />
      
      {/* Panels */}
      {showLayersPanel && (
        <LayersPanel
          elements={elements}
          onSelectElement={selectElement}
          onUpdateElement={updateElement}
          onDeleteElement={deleteElement}
          onClose={() => setShowLayersPanel(false)}
        />
      )}
      
      {showAlignmentPanel && (
        <AlignmentPanel onClose={() => setShowAlignmentPanel(false)} />
      )}
      
      {showArtboardsPanel && (
        <ArtboardsPanel onClose={() => setShowArtboardsPanel(false)} />
      )}
      
      {/* Properties Panel */}
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
