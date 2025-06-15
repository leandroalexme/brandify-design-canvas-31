
import { useState, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, FabricObject } from 'fabric';

interface UseFabricCanvasProps {
  selectedTool: 'select' | 'pen' | 'shapes' | 'text';
  selectedColor: string;
  artboardColor: string;
}

export const useFabricCanvas = ({ selectedTool, selectedColor, artboardColor }: UseFabricCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const elementMapRef = useRef<Map<string, FabricObject>>(new Map());

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: artboardColor,
      selection: selectedTool === 'select',
      preserveObjectStacking: true,
    });

    // Configure drawing mode
    canvas.isDrawingMode = selectedTool === 'pen';
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = selectedColor;
      canvas.freeDrawingBrush.width = 2;
    }

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  // Update canvas settings when tool changes
  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = selectedTool === 'pen';
    fabricCanvas.selection = selectedTool === 'select';

    if (selectedTool === 'pen' && fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = selectedColor;
      fabricCanvas.freeDrawingBrush.width = 2;
    }

    fabricCanvas.renderAll();
  }, [selectedTool, selectedColor, fabricCanvas]);

  // Update artboard color
  useEffect(() => {
    if (!fabricCanvas) return;
    fabricCanvas.set('backgroundColor', artboardColor);
    fabricCanvas.renderAll();
  }, [artboardColor, fabricCanvas]);

  return {
    canvasRef,
    fabricCanvas,
    elementMapRef,
  };
};
