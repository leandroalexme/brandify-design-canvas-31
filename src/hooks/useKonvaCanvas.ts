
import { useState, useEffect, useRef } from 'react';
import Konva from 'konva';

interface UseKonvaCanvasProps {
  selectedTool: 'select' | 'pen' | 'shapes' | 'text';
  selectedColor: string;
  artboardColor: string;
}

export const useKonvaCanvas = ({ selectedTool, selectedColor, artboardColor }: UseKonvaCanvasProps) => {
  const stageRef = useRef<Konva.Stage | null>(null);
  const layerRef = useRef<Konva.Layer | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Initialize Konva stage and layer
  const initializeCanvas = (container: HTMLDivElement) => {
    if (stageRef.current) return;

    const stage = new Konva.Stage({
      container: container,
      width: 800,
      height: 600,
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    stageRef.current = stage;
    layerRef.current = layer;
    setIsReady(true);

    return () => {
      stage.destroy();
    };
  };

  // Update canvas settings when tool changes
  useEffect(() => {
    if (!stageRef.current || !layerRef.current) return;

    // Configure interaction based on selected tool
    if (selectedTool === 'select') {
      stageRef.current.listening(true);
    } else {
      stageRef.current.listening(true);
    }

    layerRef.current.draw();
  }, [selectedTool, selectedColor]);

  return {
    stageRef,
    layerRef,
    initializeCanvas,
    isReady,
  };
};
