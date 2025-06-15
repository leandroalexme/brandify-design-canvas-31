
import { useRef, useState, useEffect, useCallback } from 'react';
import Konva from 'konva';
import { createKonvaShape, ShapeType } from '../utils/konvaShapeFactory';

interface UseKonvaShapeCreationParams {
  stage: Konva.Stage | null;
  layer: Konva.Layer | null;
  selectedShape: ShapeType | null;
  color: string;
  onAddElement: (element: any) => void;
}

export const useKonvaShapeCreation = ({
  stage,
  layer,
  selectedShape,
  color,
  onAddElement,
}: UseKonvaShapeCreationParams) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const startPoint = useRef<{ x: number; y: number } | null>(null);
  const previewShapeRef = useRef<Konva.Shape | null>(null);

  // MouseDown: inicia criação da forma
  const handleMouseDown = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!stage || !layer || !selectedShape) return;

    const pos = stage.getPointerPosition();
    if (!pos) return;

    startPoint.current = { x: pos.x, y: pos.y };
    setIsDrawing(true);

    // Cria preview shape com tamanho mínimo
    const preview = createKonvaShape(selectedShape, pos.x, pos.y, color, 1);
    if (preview) {
      preview.opacity(0.5);
      preview.listening(false);
      layer.add(preview);
      previewShapeRef.current = preview;
      layer.draw();
    }
  }, [stage, layer, selectedShape, color]);

  // MouseMove: redimensiona preview durante arraste
  const handleMouseMove = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!stage || !layer || !isDrawing || !startPoint.current || !selectedShape || !previewShapeRef.current) return;
    
    const pos = stage.getPointerPosition();
    if (!pos) return;

    const width = Math.abs(pos.x - startPoint.current.x);
    const height = Math.abs(pos.y - startPoint.current.y);
    const left = Math.min(pos.x, startPoint.current.x);
    const top = Math.min(pos.y, startPoint.current.y);

    // Ajustar props do preview shape baseado no tipo
    if (selectedShape === 'rectangle') {
      previewShapeRef.current.x(left);
      previewShapeRef.current.y(top);
      previewShapeRef.current.width(width);
      previewShapeRef.current.height(height);
    } else if (selectedShape === 'circle') {
      const radius = Math.max(width, height) / 2;
      previewShapeRef.current.x(left + width / 2);
      previewShapeRef.current.y(top + height / 2);
      (previewShapeRef.current as Konva.Circle).radius(radius);
    } else if (selectedShape === 'ellipse') {
      previewShapeRef.current.x(left + width / 2);
      previewShapeRef.current.y(top + height / 2);
      (previewShapeRef.current as Konva.Ellipse).radiusX(width / 2);
      (previewShapeRef.current as Konva.Ellipse).radiusY(height / 2);
    } else if (selectedShape === 'line') {
      (previewShapeRef.current as Konva.Line).points([
        startPoint.current.x, startPoint.current.y, pos.x, pos.y
      ]);
    }

    layer.draw();
  }, [stage, layer, isDrawing, selectedShape]);

  // MouseUp: fixa a forma e limpa preview
  const handleMouseUp = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!stage || !layer || !isDrawing || !startPoint.current || !selectedShape || !previewShapeRef.current) return;

    // Remover preview visual
    previewShapeRef.current.destroy();
    
    const pos = stage.getPointerPosition();
    if (!pos) return;

    const width = Math.abs(pos.x - startPoint.current.x);
    const height = Math.abs(pos.y - startPoint.current.y);
    const left = Math.min(pos.x, startPoint.current.x);
    const top = Math.min(pos.y, startPoint.current.y);

    // Só cria se for maior que um min size
    if (width > 8 && height > 8) {
      const newShape = createKonvaShape(selectedShape, left + width/2, top + height/2, color, Math.max(width, height));
      if (newShape) {
        layer.add(newShape);
        layer.draw();
        
        // Converter para DesignElement
        onAddElement({
          type: 'shape' as const,
          x: newShape.x(),
          y: newShape.y(),
          width: newShape.width() || Math.max(width, height),
          height: newShape.height() || Math.max(width, height),
          color: color,
        });
      }
    }

    setIsDrawing(false);
    startPoint.current = null;
    previewShapeRef.current = null;
  }, [stage, layer, isDrawing, selectedShape, onAddElement, color]);

  // Habilita/desabilita eventos em tempo real
  useEffect(() => {
    if (!stage || !selectedShape) return;

    stage.on('mousedown', handleMouseDown);
    stage.on('mousemove', handleMouseMove);
    stage.on('mouseup', handleMouseUp);

    return () => {
      stage.off('mousedown', handleMouseDown);
      stage.off('mousemove', handleMouseMove);
      stage.off('mouseup', handleMouseUp);
    };
  }, [stage, selectedShape, handleMouseDown, handleMouseMove, handleMouseUp]);

  return { isDrawing };
};
