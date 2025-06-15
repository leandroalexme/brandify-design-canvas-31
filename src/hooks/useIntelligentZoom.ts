import React from 'react';
import { useState, useCallback, useMemo, useRef } from 'react';
import { DesignElement } from '../types/design';
import { logger } from '../utils/validation';

interface ZoomState {
  level: number;
  centerX: number;
  centerY: number;
  isAnimating: boolean;
}

interface ViewportBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const useIntelligentZoom = (
  elements: DesignElement[],
  canvasSize: { width: number; height: number } = { width: 1000, height: 800 }
) => {
  const [zoomState, setZoomState] = useState<ZoomState>({
    level: 1,
    centerX: canvasSize.width / 2,
    centerY: canvasSize.height / 2,
    isAnimating: false
  });

  const animationRef = useRef<number | null>(null);

  // Constantes de zoom
  const MIN_ZOOM = 0.1;
  const MAX_ZOOM = 10;
  const ZOOM_STEP = 0.1;
  const ANIMATION_DURATION = 300; // ms

  // Calcular bounds dos elementos
  const elementsBounds = useMemo(() => {
    if (elements.length === 0) {
      return {
        minX: 0,
        minY: 0,
        maxX: canvasSize.width,
        maxY: canvasSize.height
      };
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    elements.forEach(element => {
      const width = element.width || 100;
      const height = element.height || 100;
      
      minX = Math.min(minX, element.x);
      minY = Math.min(minY, element.y);
      maxX = Math.max(maxX, element.x + width);
      maxY = Math.max(maxY, element.y + height);
    });

    // Adicionar margem
    const margin = 50;
    return {
      minX: minX - margin,
      minY: minY - margin,
      maxX: maxX + margin,
      maxY: maxY + margin
    };
  }, [elements, canvasSize]);

  // Animar zoom suavemente
  const animateZoom = useCallback((
    targetZoom: number,
    targetCenterX: number,
    targetCenterY: number,
    duration: number = ANIMATION_DURATION
  ) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const startTime = Date.now();
    const startZoom = zoomState.level;
    const startCenterX = zoomState.centerX;
    const startCenterY = zoomState.centerY;

    setZoomState(prev => ({ ...prev, isAnimating: true }));

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3);

      const currentZoom = startZoom + (targetZoom - startZoom) * eased;
      const currentCenterX = startCenterX + (targetCenterX - startCenterX) * eased;
      const currentCenterY = startCenterY + (targetCenterY - startCenterY) * eased;

      setZoomState({
        level: currentZoom,
        centerX: currentCenterX,
        centerY: currentCenterY,
        isAnimating: progress < 1
      });

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        logger.debug('Zoom animation completed', { 
          targetZoom, 
          targetCenterX, 
          targetCenterY 
        });
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [zoomState]);

  // Zoom para ajustar todos os elementos
  const zoomToFit = useCallback(() => {
    const { minX, minY, maxX, maxY } = elementsBounds;
    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;

    if (contentWidth === 0 || contentHeight === 0) return;

    // Calcular zoom para caber na viewport com margem
    const zoomX = (canvasSize.width * 0.8) / contentWidth;
    const zoomY = (canvasSize.height * 0.8) / contentHeight;
    const targetZoom = Math.min(zoomX, zoomY, MAX_ZOOM);

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    animateZoom(targetZoom, centerX, centerY);
    logger.debug('Zoom to fit', { targetZoom, centerX, centerY });
  }, [elementsBounds, canvasSize, animateZoom]);

  // Zoom para elementos selecionados
  const zoomToSelection = useCallback((selectedElements: DesignElement[]) => {
    if (selectedElements.length === 0) {
      zoomToFit();
      return;
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    selectedElements.forEach(element => {
      const width = element.width || 100;
      const height = element.height || 100;
      
      minX = Math.min(minX, element.x);
      minY = Math.min(minY, element.y);
      maxX = Math.max(maxX, element.x + width);
      maxY = Math.max(maxY, element.y + height);
    });

    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;

    if (contentWidth === 0 || contentHeight === 0) return;

    // Zoom para seleção com margem maior
    const zoomX = (canvasSize.width * 0.6) / contentWidth;
    const zoomY = (canvasSize.height * 0.6) / contentHeight;
    const targetZoom = Math.min(zoomX, zoomY, MAX_ZOOM);

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    animateZoom(targetZoom, centerX, centerY);
    logger.debug('Zoom to selection', { 
      selectedCount: selectedElements.length,
      targetZoom, 
      centerX, 
      centerY 
    });
  }, [canvasSize, animateZoom, zoomToFit]);

  // Zoom manual
  const zoomTo = useCallback((level: number, centerX?: number, centerY?: number) => {
    const clampedLevel = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, level));
    const targetCenterX = centerX ?? zoomState.centerX;
    const targetCenterY = centerY ?? zoomState.centerY;

    animateZoom(clampedLevel, targetCenterX, targetCenterY);
  }, [zoomState, animateZoom]);

  // Zoom in/out
  const zoomIn = useCallback(() => {
    const newLevel = Math.min(zoomState.level + ZOOM_STEP, MAX_ZOOM);
    zoomTo(newLevel);
  }, [zoomState.level, zoomTo]);

  const zoomOut = useCallback(() => {
    const newLevel = Math.max(zoomState.level - ZOOM_STEP, MIN_ZOOM);
    zoomTo(newLevel);
  }, [zoomState.level, zoomTo]);

  // Reset zoom
  const resetZoom = useCallback(() => {
    animateZoom(1, canvasSize.width / 2, canvasSize.height / 2);
  }, [canvasSize, animateZoom]);

  // Zoom com wheel
  const handleWheel = useCallback((event: WheelEvent, containerElement: HTMLElement) => {
    if (!event.ctrlKey && !event.metaKey) return false;

    event.preventDefault();

    const rect = containerElement.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Converter coordenadas do mouse para coordenadas do canvas
    const canvasX = (mouseX - canvasSize.width / 2) / zoomState.level + zoomState.centerX;
    const canvasY = (mouseY - canvasSize.height / 2) / zoomState.level + zoomState.centerY;

    const deltaY = event.deltaY;
    const zoomFactor = deltaY > 0 ? 0.9 : 1.1;
    const newLevel = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoomState.level * zoomFactor));

    // Zoom centrado no mouse
    zoomTo(newLevel, canvasX, canvasY);
    return true;
  }, [zoomState, canvasSize, zoomTo]);

  // Calcular viewport atual
  const viewport = useMemo((): ViewportBounds => {
    const halfWidth = canvasSize.width / (2 * zoomState.level);
    const halfHeight = canvasSize.height / (2 * zoomState.level);

    return {
      x: zoomState.centerX - halfWidth,
      y: zoomState.centerY - halfHeight,
      width: halfWidth * 2,
      height: halfHeight * 2
    };
  }, [zoomState, canvasSize]);

  // Verificar se elemento está visível no viewport
  const isElementVisible = useCallback((element: DesignElement): boolean => {
    const elementRight = element.x + (element.width || 100);
    const elementBottom = element.y + (element.height || 100);
    const viewportRight = viewport.x + viewport.width;
    const viewportBottom = viewport.y + viewport.height;

    return !(
      element.x > viewportRight ||
      elementRight < viewport.x ||
      element.y > viewportBottom ||
      elementBottom < viewport.y
    );
  }, [viewport]);

  // Elementos visíveis (otimização de performance)
  const visibleElements = useMemo(() => {
    return elements.filter(isElementVisible);
  }, [elements, isElementVisible]);

  // Informações do zoom
  const zoomInfo = useMemo(() => ({
    level: zoomState.level,
    percentage: Math.round(zoomState.level * 100),
    centerX: zoomState.centerX,
    centerY: zoomState.centerY,
    isAnimating: zoomState.isAnimating,
    canZoomIn: zoomState.level < MAX_ZOOM,
    canZoomOut: zoomState.level > MIN_ZOOM,
    viewport,
    visibleElementsCount: visibleElements.length,
    totalElementsCount: elements.length
  }), [zoomState, viewport, visibleElements.length, elements.length]);

  // Cleanup
  React.useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return {
    // State
    zoomState,
    viewport,
    visibleElements,
    
    // Actions
    zoomTo,
    zoomIn,
    zoomOut,
    zoomToFit,
    zoomToSelection,
    resetZoom,
    handleWheel,
    
    // Utils
    isElementVisible,
    
    // Info
    zoomInfo
  };
};
