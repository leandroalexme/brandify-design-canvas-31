
import React, { useEffect, useRef, useState } from 'react';
import { DesignElement } from '../types/design';
import { useKonvaCanvas } from '../hooks/useKonvaCanvas';
import { useKonvaCanvasEvents } from '../hooks/useKonvaCanvasEvents';
import { useKonvaShapeCreation } from '../hooks/useKonvaShapeCreation';
import { useKonvaTransformations } from '../hooks/useKonvaTransformations';
import { useKonvaKeyboardShortcuts } from '../hooks/useKonvaKeyboardShortcuts';
import { createKonvaObject } from '../utils/konvaObjectFactory';
import { ShapeType } from '../utils/konvaShapeFactory';

interface KonvaCanvasProps {
  elements: DesignElement[];
  selectedTool: 'select' | 'pen' | 'shapes' | 'text';
  selectedColor: string;
  onAddElement: (element: Omit<DesignElement, 'id' | 'selected'>) => void;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<DesignElement>) => void;
  onDeleteElement: (id: string) => void;
  onCopyElement: (id: string) => void;
  onPasteElement: () => void;
  onCreateText: (x: number, y: number) => void;
  artboardColor?: string;
  selectedShape?: ShapeType | null;
}

export const KonvaCanvasComponent = ({
  elements,
  selectedTool,
  selectedColor,
  onAddElement,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  onCopyElement,
  onPasteElement,
  onCreateText,
  artboardColor = '#ffffff',
  selectedShape = null,
}: KonvaCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementMapRef = useRef<Map<string, any>>(new Map());

  const { stageRef, layerRef, initializeCanvas, isReady } = useKonvaCanvas({
    selectedTool,
    selectedColor,
    artboardColor,
  });

  // Inicializar canvas
  useEffect(() => {
    if (containerRef.current && !stageRef.current) {
      initializeCanvas(containerRef.current);
    }
  }, [initializeCanvas]);

  // Hook de criação de formas com arraste
  const { isDrawing, shiftPressed } = useKonvaShapeCreation({
    stage: stageRef.current,
    layer: layerRef.current,
    selectedShape: selectedTool === 'shapes' ? selectedShape : null,
    color: selectedColor,
    onAddElement: onAddElement,
  });

  // Hook de transformações (seleção, escala, rotação)
  const { selectShape, selectedShape: transformSelectedShape } = useKonvaTransformations({
    stage: stageRef.current,
    layer: layerRef.current,
    selectedTool,
    onUpdateElement
  });

  // Hook de atalhos de teclado
  useKonvaKeyboardShortcuts({
    stage: stageRef.current,
    layer: layerRef.current,
    selectedShape: transformSelectedShape,
    onDeleteElement,
    onCopyElement,
    onPasteElement
  });

  // Eventos do canvas (texto, desenho com caneta)
  useKonvaCanvasEvents({
    stage: stageRef.current,
    layer: layerRef.current,
    selectedTool,
    selectedColor,
    elements,
    onSelectElement,
    onUpdateElement,
    onCreateText,
    onAddElement,
  });

  // Sincronizar elementos do estado para o canvas
  useEffect(() => {
    if (!stageRef.current || !layerRef.current || !isReady) return;

    // Limpar objetos existentes (exceto transformer)
    const children = layerRef.current.children.filter(child => child.className !== 'Transformer');
    children.forEach(child => child.destroy());
    elementMapRef.current.clear();

    // Adicionar elementos ao canvas
    elements.forEach(element => {
      const konvaObj = createKonvaObject(element);
      if (konvaObj) {
        // Armazenar ID do elemento no objeto Konva
        konvaObj.setAttr('elementId', element.id);
        konvaObj.draggable(selectedTool === 'select');
        
        layerRef.current!.add(konvaObj);
        elementMapRef.current.set(element.id, konvaObj);

        // Configurar seleção visual
        if (element.selected && selectedTool === 'select') {
          selectShape(konvaObj);
        }

        // Eventos de drag
        konvaObj.on('dragend', () => {
          onUpdateElement(element.id, {
            x: konvaObj.x(),
            y: konvaObj.y(),
          });
        });
      }
    });

    layerRef.current.draw();
  }, [elements, isReady, selectedTool, selectShape, onUpdateElement]);

  return (
    <div className="flex items-center justify-center relative">
      <div 
        ref={containerRef}
        className="border border-slate-300 rounded-lg shadow-lg cursor-crosshair"
        style={{ backgroundColor: artboardColor }}
      />
      
      {/* Indicadores visuais */}
      {isDrawing && (
        <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-lg text-sm">
          {shiftPressed ? 'Arraste (Shift: Proporção)' : 'Arraste para criar forma'}
        </div>
      )}
      
      {selectedTool === 'shapes' && selectedShape && (
        <div className="absolute top-4 right-4 bg-slate-800 text-white px-3 py-1 rounded-lg text-sm">
          Forma: {selectedShape}
        </div>
      )}
    </div>
  );
};
