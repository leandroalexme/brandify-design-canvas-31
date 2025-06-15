
import { useRef, useState, useEffect, useCallback } from 'react';
import { FabricObject } from 'fabric';
import { createEnhancedShape, ShapeType } from '../utils/enhancedShapeFactory';

interface UseShapeCreationModeParams {
  fabricCanvas: fabric.Canvas | null;
  selectedShape: ShapeType | null;
  color: string;
  onAddElement: (fabricObj: FabricObject) => void;
}

export const useShapeCreationMode = ({
  fabricCanvas,
  selectedShape,
  color,
  onAddElement,
}: UseShapeCreationModeParams) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const startPoint = useRef<{ x: number; y: number } | null>(null);
  const previewShapeRef = useRef<FabricObject|null>(null);

  // MouseDown: inicia criação da forma
  const handleMouseDown = useCallback((opt: fabric.IEvent<MouseEvent>) => {
    if (!fabricCanvas || !selectedShape) return;

    const pointer = fabricCanvas.getPointer(opt.e);
    startPoint.current = { x: pointer.x, y: pointer.y };
    setIsDrawing(true);

    // Cria preview shape com tamanho mínimo
    const preview = createEnhancedShape(selectedShape, pointer.x, pointer.y, color, 1);
    if (preview) {
      preview.set({ selectable: false, evented: false, opacity: 0.5 });
      fabricCanvas.add(preview);
      previewShapeRef.current = preview;
    }
  }, [fabricCanvas, selectedShape, color]);

  // MouseMove: redimensiona preview durante arraste
  const handleMouseMove = useCallback((opt: fabric.IEvent<MouseEvent>) => {
    if (!fabricCanvas || !isDrawing || !startPoint.current || !selectedShape || !previewShapeRef.current) return;
    const pointer = fabricCanvas.getPointer(opt.e);

    const width = Math.abs(pointer.x - startPoint.current.x);
    const height = Math.abs(pointer.y - startPoint.current.y);
    const left = Math.min(pointer.x, startPoint.current.x);
    const top = Math.min(pointer.y, startPoint.current.y);

    // Ajustar props do preview shape
    if (selectedShape === 'rectangle' || selectedShape === 'polygon' || selectedShape === 'star' || selectedShape === 'triangle' || selectedShape === 'ellipse') {
      previewShapeRef.current.set({ left, top, width, height, rx: undefined, ry: undefined });
    }
    if (selectedShape === 'ellipse') {
      // Ellipse especificamente usa rx/ry em vez de width/height
      (previewShapeRef.current as any).set({ rx: width/2, ry: height/2, left, top });
    }
    if (selectedShape === 'circle') {
      const r = Math.max(width, height) / 2;
      previewShapeRef.current.set({ left: left, top: top, radius: r });
    }
    if (selectedShape === 'line') {
      (previewShapeRef.current as any).set({
        x1: startPoint.current.x - left, y1: startPoint.current.y - top,
        x2: pointer.x - left, y2: pointer.y - top,
        left, top, width, height
      });
    }

    previewShapeRef.current.setCoords && previewShapeRef.current.setCoords();
    fabricCanvas.requestRenderAll();
  }, [fabricCanvas, isDrawing, selectedShape]);

  // MouseUp: fixa a forma e limpa preview
  const handleMouseUp = useCallback((opt: fabric.IEvent<MouseEvent>) => {
    if (!fabricCanvas || !isDrawing || !startPoint.current || !selectedShape || !previewShapeRef.current) return;

    // Remover preview visual
    const preview = previewShapeRef.current;
    preview && fabricCanvas.remove(preview);
    fabricCanvas.requestRenderAll();

    const pointer = fabricCanvas.getPointer(opt.e);
    const width = Math.abs(pointer.x - startPoint.current.x);
    const height = Math.abs(pointer.y - startPoint.current.y);
    const left = Math.min(pointer.x, startPoint.current.x);
    const top = Math.min(pointer.y, startPoint.current.y);

    // Só cria se for maior que um min size
    if (width > 8 && height > 8) {
      // Cria a shape com tamanho final
      const newShape = createEnhancedShape(selectedShape, left + width/2, top + height/2, color, Math.max(width, height));
      if (newShape) {
        onAddElement(newShape);
      }
    }

    setIsDrawing(false);
    startPoint.current = null;
    previewShapeRef.current = null;
  }, [fabricCanvas, isDrawing, selectedShape, onAddElement, color]);

  // Habilita/desabilita eventos em tempo real
  useEffect(() => {
    if (!fabricCanvas || !selectedShape) return;

    fabricCanvas.on('mouse:down', handleMouseDown);
    fabricCanvas.on('mouse:move', handleMouseMove);
    fabricCanvas.on('mouse:up', handleMouseUp);

    return () => {
      fabricCanvas.off('mouse:down', handleMouseDown);
      fabricCanvas.off('mouse:move', handleMouseMove);
      fabricCanvas.off('mouse:up', handleMouseUp);
    };
  }, [fabricCanvas, selectedShape, handleMouseDown, handleMouseMove, handleMouseUp]);

  return { isDrawing };
};
