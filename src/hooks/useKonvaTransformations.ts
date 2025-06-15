
import { useRef, useCallback } from 'react';
import Konva from 'konva';

interface UseKonvaTransformationsParams {
  stage: Konva.Stage | null;
  layer: Konva.Layer | null;
  selectedTool: 'select' | 'pen' | 'shapes' | 'text';
  onUpdateElement: (id: string, updates: Partial<any>) => void;
  enabled: boolean; // Nova prop para controlar quando está ativo
}

export const useKonvaTransformations = ({
  stage,
  layer,
  selectedTool,
  onUpdateElement,
  enabled,
}: UseKonvaTransformationsParams) => {
  const transformerRef = useRef<Konva.Transformer | null>(null);
  const selectedShapeRef = useRef<Konva.Shape | null>(null);

  const selectShape = useCallback((shape: Konva.Shape | null) => {
    if (!layer || !enabled) return;

    // Remover transformer existente
    if (transformerRef.current) {
      transformerRef.current.destroy();
      transformerRef.current = null;
    }

    selectedShapeRef.current = shape;

    if (shape && selectedTool === 'select') {
      console.log('🎯 [TRANSFORMATIONS] Selecting shape for transformation');
      
      // Criar novo transformer
      const transformer = new Konva.Transformer({
        rotateEnabled: true,
        enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
        boundBoxFunc: (oldBox, newBox) => {
          // Limitar tamanho mínimo
          if (newBox.width < 10 || newBox.height < 10) {
            return oldBox;
          }
          return newBox;
        },
      });

      layer.add(transformer);
      transformer.nodes([shape]);
      
      transformerRef.current = transformer;

      // Eventos de transformação
      transformer.on('transformend', () => {
        const elementId = shape.getAttr('elementId');
        if (elementId) {
          console.log('🎯 [TRANSFORMATIONS] Shape transformed:', elementId);
          onUpdateElement(elementId, {
            x: shape.x(),
            y: shape.y(),
            width: shape.width() * shape.scaleX(),
            height: shape.height() * shape.scaleY(),
            rotation: shape.rotation(),
          });
          
          // Reset scale após aplicar ao width/height
          shape.scaleX(1);
          shape.scaleY(1);
        }
      });

      layer.draw();
    }
  }, [layer, selectedTool, onUpdateElement, enabled]);

  return {
    selectShape,
    selectedShape: selectedShapeRef.current,
  };
};
