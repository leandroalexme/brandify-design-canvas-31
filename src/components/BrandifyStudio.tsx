
import React, { useState } from 'react';
import { Canvas } from './Canvas';
import { FloatingToolbar } from './FloatingToolbar';
import { FloatingPropertiesPanel } from './FloatingPropertiesPanel';

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
  const [selectedTool, setSelectedTool] = useState<'select' | 'text' | 'shapes' | 'draw' | 'eraser'>('select');
  const [selectedColor, setSelectedColor] = useState('#4285F4');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

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

  return (
    <div className="h-screen bg-slate-900 overflow-hidden relative">
      <Canvas
        elements={elements}
        selectedTool={selectedTool}
        selectedColor={selectedColor}
        onAddElement={addElement}
        onSelectElement={selectElement}
        onUpdateElement={updateElement}
      />
      
      <FloatingToolbar 
        selectedTool={selectedTool}
        onToolSelect={setSelectedTool}
        selectedColor={selectedColor}
        onColorSelect={setSelectedColor}
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
