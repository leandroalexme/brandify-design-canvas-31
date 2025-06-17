
import { useRef, useCallback, useEffect, useState } from 'react';
import { SVG, Svg, Element as SvgElement } from '@svgdotjs/svg.js';

interface UseSvgEditorProps {
  containerRef: React.RefObject<HTMLDivElement>;
  enabled: boolean;
}

export const useSvgEditor = ({ containerRef, enabled }: UseSvgEditorProps) => {
  const svgRef = useRef<Svg | null>(null);
  const [selectedElement, setSelectedElement] = useState<SvgElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<SvgElement | null>(null);

  const initializeSvg = useCallback(() => {
    if (!containerRef.current || svgRef.current) return;

    const svg = SVG().addTo(containerRef.current).size(800, 600);
    svg.attr('style', 'border: 1px solid #ccc; background: white;');
    svgRef.current = svg;

    return svg;
  }, [containerRef]);

  const addRectangle = useCallback((x: number = 100, y: number = 100) => {
    if (!svgRef.current) return;
    
    const rect = svgRef.current.rect(100, 80)
      .move(x, y)
      .fill('#ff6b6b')
      .stroke({ color: '#333', width: 2 })
      .draggable();

    rect.on('click', () => setSelectedElement(rect));
    return rect;
  }, []);

  const addCircle = useCallback((x: number = 150, y: number = 150) => {
    if (!svgRef.current) return;
    
    const circle = svgRef.current.circle(80)
      .move(x, y)
      .fill('#4ecdc4')
      .stroke({ color: '#333', width: 2 })
      .draggable();

    circle.on('click', () => setSelectedElement(circle));
    return circle;
  }, []);

  const addText = useCallback((text: string = 'Texto', x: number = 200, y: number = 100) => {
    if (!svgRef.current) return;
    
    const textElement = svgRef.current.text(text)
      .move(x, y)
      .font({ family: 'Arial', size: 24, fill: '#333' })
      .draggable();

    textElement.on('click', () => setSelectedElement(textElement));
    return textElement;
  }, []);

  const startFreeDrawing = useCallback((x: number, y: number) => {
    if (!svgRef.current || !enabled) return;
    
    setIsDrawing(true);
    const path = svgRef.current.path(`M${x},${y}`)
      .fill('none')
      .stroke({ color: '#333', width: 2, linecap: 'round', linejoin: 'round' });
    
    setCurrentPath(path);
  }, [enabled]);

  const continueFreeDrawing = useCallback((x: number, y: number) => {
    if (!currentPath || !isDrawing) return;
    
    const pathData = currentPath.attr('d') + ` L${x},${y}`;
    currentPath.attr('d', pathData);
  }, [currentPath, isDrawing]);

  const endFreeDrawing = useCallback(() => {
    setIsDrawing(false);
    setCurrentPath(null);
  }, []);

  const deleteSelected = useCallback(() => {
    if (selectedElement) {
      selectedElement.remove();
      setSelectedElement(null);
    }
  }, [selectedElement]);

  const clearCanvas = useCallback(() => {
    if (svgRef.current) {
      svgRef.current.clear();
    }
    setSelectedElement(null);
  }, []);

  const changeElementColor = useCallback((color: string) => {
    if (selectedElement) {
      selectedElement.fill(color);
    }
  }, [selectedElement]);

  const exportSvg = useCallback(() => {
    if (svgRef.current) {
      return svgRef.current.svg();
    }
    return null;
  }, []);

  useEffect(() => {
    if (enabled && containerRef.current && !svgRef.current) {
      initializeSvg();
    }
  }, [enabled, containerRef, initializeSvg]);

  return {
    svgRef,
    selectedElement,
    isDrawing,
    addRectangle,
    addCircle,
    addText,
    startFreeDrawing,
    continueFreeDrawing,
    endFreeDrawing,
    deleteSelected,
    clearCanvas,
    changeElementColor,
    exportSvg,
    initializeSvg
  };
};
