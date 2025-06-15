
import React, { useRef, useEffect, useState, ReactNode } from 'react';
import { X } from 'lucide-react';

interface PanelContainerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  position?: { x: number; y: number };
  width?: number;
  height?: number;
  className?: string;
  dataAttribute?: string;
  isDraggable?: boolean;
}

export const PanelContainer = ({
  isOpen,
  onClose,
  title,
  children,
  position = { x: 200, y: 120 },
  width = 384, // w-96 equivalent
  height,
  className = '',
  dataAttribute,
  isDraggable = false
}: PanelContainerProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [finalPosition, setFinalPosition] = useState(position);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Sistema de posicionamento inteligente
  const calculateSafePosition = (requestedPosition: { x: number; y: number }) => {
    const VIEWPORT_MARGIN = 16;
    const TOOLBAR_HEIGHT = 80; // Altura aproximada da toolbar
    const TOOLBAR_MARGIN = 24; // Margem da toolbar
    
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    const panelHeight = height || 400; // altura padrão estimada
    
    let safePosition = { ...requestedPosition };

    // Garantir que não saia horizontalmente
    safePosition.x = Math.max(
      VIEWPORT_MARGIN, 
      Math.min(safePosition.x, viewport.width - width - VIEWPORT_MARGIN)
    );

    // Garantir que não saia verticalmente (considerando toolbar no bottom)
    const maxY = viewport.height - panelHeight - TOOLBAR_HEIGHT - TOOLBAR_MARGIN - VIEWPORT_MARGIN;
    safePosition.y = Math.max(VIEWPORT_MARGIN, Math.min(safePosition.y, maxY));

    return safePosition;
  };

  // Drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isDraggable) return;
    
    const target = e.target as Element;
    if (target.closest('.panel-drag-handle')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - finalPosition.x,
        y: e.clientY - finalPosition.y,
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newPosition = {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      };
      setFinalPosition(calculateSafePosition(newPosition));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Recalcular posição quando o painel abre
  useEffect(() => {
    if (isOpen) {
      setFinalPosition(calculateSafePosition(position));
    }
  }, [isOpen, position, width, height]);

  // Drag event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={panelRef}
      className={`fixed z-[500] animate-scale-in-60fps ${className}`}
      style={{
        left: finalPosition.x,
        top: finalPosition.y,
        width: `${width}px`,
        ...(height ? { height: `${height}px` } : {})
      }}
      {...(dataAttribute ? { [dataAttribute]: true } : {})}
      onMouseDown={handleMouseDown}
    >
      <div className="panel-container-unified">
        {/* Header padronizado */}
        <div className={`panel-header-unified ${isDraggable ? 'panel-drag-handle cursor-move' : ''}`}>
          <div className="panel-title-unified">{title}</div>
          <button
            onClick={onClose}
            className="panel-close-button-unified"
            aria-label="Fechar painel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content area */}
        <div className="panel-content-unified">
          {children}
        </div>
      </div>
    </div>
  );
};
