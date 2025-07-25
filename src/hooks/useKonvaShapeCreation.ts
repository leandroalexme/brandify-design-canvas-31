
import { useRef, useState, useEffect, useCallback } from 'react';
import Konva from 'konva';
import { createKonvaShape, createDesignElementFromKonvaShape, ShapeType } from '../utils/konvaShapeFactory';

interface UseKonvaShapeCreationParams {
  stage: Konva.Stage | null;
  layer: Konva.Layer | null;
  selectedShape: ShapeType | null;
  color: string;
  onAddElement: (element: any) => void;
  enabled: boolean; // Nova prop para controlar quando está ativo
}

export const useKonvaShapeCreation = ({
  stage,
  layer,
  selectedShape,
  color,
  onAddElement,
  enabled,
}: UseKonvaShapeCreationParams) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [shiftPressed, setShiftPressed] = useState(false);
  const startPoint = useRef<{ x: number; y: number } | null>(null);
  const previewShapeRef = useRef<Konva.Shape | null>(null);

  // Detectar tecla Shift para alinhamento
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setShiftPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setShiftPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // MouseDown: inicia criação da forma
  const handleMouseDown = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!stage || !layer || !selectedShape || !enabled) return;

    // Só criar forma se clicou no stage (fundo) e não em um objeto existente
    const clickedOnEmpty = e.target === stage;
    if (!clickedOnEmpty) return;

    const pos = stage.getPointerPosition();
    if (!pos) return;

    console.log('🎯 [SHAPE CREATION] Starting shape creation:', { selectedShape, pos, color });

    startPoint.current = { x: pos.x, y: pos.y };
    setIsDrawing(true);

    // Criar forma preview inicial pequena
    const preview = createKonvaShape(selectedShape, pos.x, pos.y, color, 1);
    if (preview) {
      preview.opacity(0.5);
      preview.listening(false);
      layer.add(preview);
      previewShapeRef.current = preview;
      layer.draw();
    }
  }, [stage, layer, selectedShape, color, enabled]);

  // MouseMove: redimensiona preview durante arraste
  const handleMouseMove = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!stage || !layer || !isDrawing || !startPoint.current || !selectedShape || !previewShapeRef.current || !enabled) return;
    
    const pos = stage.getPointerPosition();
    if (!pos) return;

    let width = Math.abs(pos.x - startPoint.current.x);
    let height = Math.abs(pos.y - startPoint.current.y);

    // Se Shift estiver pressionado, manter proporção quadrada
    if (shiftPressed) {
      const maxDimension = Math.max(width, height);
      width = maxDimension;
      height = maxDimension;
    }

    const left = Math.min(pos.x, startPoint.current.x);
    const top = Math.min(pos.y, startPoint.current.y);

    // Ajustar as propriedades baseado no tipo de forma
    try {
      switch (selectedShape) {
        case 'rectangle':
          previewShapeRef.current.x(left);
          previewShapeRef.current.y(top);
          previewShapeRef.current.width(width);
          previewShapeRef.current.height(height);
          break;

        case 'circle':
          const radius = Math.max(width, height) / 2;
          previewShapeRef.current.x(startPoint.current.x);
          previewShapeRef.current.y(startPoint.current.y);
          (previewShapeRef.current as Konva.Circle).radius(radius);
          break;

        case 'ellipse':
          previewShapeRef.current.x(startPoint.current.x);
          previewShapeRef.current.y(startPoint.current.y);
          (previewShapeRef.current as Konva.Ellipse).radiusX(width / 2);
          (previewShapeRef.current as Konva.Ellipse).radiusY(height / 2);
          break;

        case 'triangle':
        case 'polygon':
          const polygonSize = Math.max(width, height);
          previewShapeRef.current.x(startPoint.current.x);
          previewShapeRef.current.y(startPoint.current.y);
          (previewShapeRef.current as Konva.RegularPolygon).radius(polygonSize / 2);
          break;

        case 'star':
          const starSize = Math.max(width, height);
          previewShapeRef.current.x(startPoint.current.x);
          previewShapeRef.current.y(startPoint.current.y);
          (previewShapeRef.current as Konva.Star).outerRadius(starSize / 2);
          (previewShapeRef.current as Konva.Star).innerRadius(starSize / 4);
          break;

        case 'line':
          (previewShapeRef.current as Konva.Line).points([
            startPoint.current.x, 
            startPoint.current.y, 
            shiftPressed ? 
              (Math.abs(pos.x - startPoint.current.x) > Math.abs(pos.y - startPoint.current.y) ? pos.x : startPoint.current.x) : 
              pos.x,
            shiftPressed ? 
              (Math.abs(pos.y - startPoint.current.y) > Math.abs(pos.x - startPoint.current.x) ? pos.y : startPoint.current.y) : 
              pos.y
          ]);
          break;
      }

      layer.draw();
    } catch (error) {
      console.warn('Error updating preview shape:', error);
    }
  }, [stage, layer, isDrawing, selectedShape, shiftPressed, enabled]);

  // MouseUp: finaliza criação da forma
  const handleMouseUp = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!stage || !layer || !isDrawing || !startPoint.current || !selectedShape || !previewShapeRef.current || !enabled) return;

    // Remover preview
    previewShapeRef.current.destroy();
    
    const pos = stage.getPointerPosition();
    if (!pos) return;

    let width = Math.abs(pos.x - startPoint.current.x);
    let height = Math.abs(pos.y - startPoint.current.y);

    // Aplicar alinhamento com Shift
    if (shiftPressed) {
      const maxDimension = Math.max(width, height);
      width = maxDimension;
      height = maxDimension;
    }

    // Só criar se for maior que tamanho mínimo
    if (width > 5 && height > 5) {
      const centerX = startPoint.current.x + (pos.x - startPoint.current.x) / 2;
      const centerY = startPoint.current.y + (pos.y - startPoint.current.y) / 2;
      
      const size = Math.max(width, height);
      const newShape = createKonvaShape(selectedShape, centerX, centerY, color, size);
      
      if (newShape) {
        // Configurar para ser interativo
        newShape.draggable(true);
        newShape.opacity(1);
        
        // Adicionar ID único
        const elementId = `shape_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        newShape.setAttr('elementId', elementId);

        layer.add(newShape);
        layer.draw();
        
        // Converter para DesignElement e adicionar ao estado
        const element = createDesignElementFromKonvaShape(newShape, selectedShape, color);
        console.log('🎯 [SHAPE CREATION] Shape created:', element);
        onAddElement(element);
      }
    }

    // Reset
    setIsDrawing(false);
    startPoint.current = null;
    previewShapeRef.current = null;
  }, [stage, layer, isDrawing, selectedShape, onAddElement, color, shiftPressed, enabled]);

  // Configurar eventos do mouse apenas quando ativo
  useEffect(() => {
    if (!stage || !enabled || !selectedShape) return;

    console.log('🎯 [SHAPE CREATION] Registering events for:', selectedShape);

    stage.on('mousedown', handleMouseDown);
    stage.on('mousemove', handleMouseMove);
    stage.on('mouseup', handleMouseUp);

    return () => {
      console.log('🎯 [SHAPE CREATION] Removing events');
      stage.off('mousedown', handleMouseDown);
      stage.off('mousemove', handleMouseMove);
      stage.off('mouseup', handleMouseUp);
    };
  }, [stage, selectedShape, enabled, handleMouseDown, handleMouseMove, handleMouseUp]);

  return { 
    isDrawing,
    shiftPressed 
  };
};
