
import { useEffect, useCallback, useState } from 'react';
import Konva from 'konva';

interface UseKonvaTransformationsParams {
  stage: Konva.Stage | null;
  layer: Konva.Layer | null;
  selectedTool: string;
  onUpdateElement: (id: string, updates: any) => void;
}

export const useKonvaTransformations = ({
  stage,
  layer,
  selectedTool,
  onUpdateElement
}: UseKonvaTransformationsParams) => {
  const [transformer, setTransformer] = useState<Konva.Transformer | null>(null);
  const [selectedShape, setSelectedShape] = useState<Konva.Shape | null>(null);

  // Criar transformer
  useEffect(() => {
    if (!layer) return;

    const tr = new Konva.Transformer({
      keepRatio: false,
      enabledAnchors: [
        'top-left', 'top-center', 'top-right',
        'middle-right', 'middle-left',
        'bottom-left', 'bottom-center', 'bottom-right'
      ],
      boundBoxFunc: (oldBox, newBox) => {
        // Limitar tamanho mínimo
        if (newBox.width < 10 || newBox.height < 10) {
          return oldBox;
        }
        return newBox;
      }
    });

    layer.add(tr);
    setTransformer(tr);

    return () => {
      tr.destroy();
    };
  }, [layer]);

  // Selecionar objeto para transformação
  const selectShape = useCallback((shape: Konva.Shape | null) => {
    if (!transformer) return;

    if (shape && selectedTool === 'select') {
      setSelectedShape(shape);
      transformer.nodes([shape]);
      transformer.show();
      transformer.getLayer()?.draw();
    } else {
      setSelectedShape(null);
      transformer.nodes([]);
      transformer.hide();
      transformer.getLayer()?.draw();
    }
  }, [transformer, selectedTool]);

  // Gerenciar eventos de transformação
  useEffect(() => {
    if (!transformer || !stage) return;

    const handleTransformEnd = () => {
      if (!selectedShape) return;
      
      const elementId = selectedShape.getAttr('elementId');
      if (elementId) {
        onUpdateElement(elementId, {
          x: selectedShape.x(),
          y: selectedShape.y(),
          width: selectedShape.width() * selectedShape.scaleX(),
          height: selectedShape.height() * selectedShape.scaleY(),
          rotation: selectedShape.rotation()
        });

        // Reset scale para evitar problemas
        selectedShape.scaleX(1);
        selectedShape.scaleY(1);
      }
    };

    const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
      // Se clicou no stage vazio, deselecionar
      if (e.target === stage) {
        selectShape(null);
        return;
      }

      // Se clicou em uma forma e está no modo select
      if (selectedTool === 'select' && e.target !== stage) {
        selectShape(e.target as Konva.Shape);
      }
    };

    transformer.on('transformend', handleTransformEnd);
    stage.on('click', handleStageClick);

    return () => {
      transformer.off('transformend', handleTransformEnd);
      stage.off('click', handleStageClick);
    };
  }, [transformer, stage, selectedShape, selectedTool, selectShape, onUpdateElement]);

  // Limpar seleção quando mudar de ferramenta
  useEffect(() => {
    if (selectedTool !== 'select') {
      selectShape(null);
    }
  }, [selectedTool, selectShape]);

  return {
    selectShape,
    selectedShape,
    transformer
  };
};
