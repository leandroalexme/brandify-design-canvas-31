
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { X, Type, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, MoreHorizontal } from 'lucide-react';

interface FloatingTextPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Position {
  x: number;
  y: number;
}

interface RepulsionZone {
  x: number;
  y: number;
  width: number;
  height: number;
  buffer: number;
}

export const FloatingTextPanel = ({ isOpen, onClose }: FloatingTextPanelProps) => {
  const [position, setPosition] = useState<Position>({ x: 400, y: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  // Definir zonas de repulsão (áreas onde o painel não pode se aproximar)
  const getRepulsionZones = useCallback((): RepulsionZone[] => {
    return [
      // Toolbar principal (bottom center)
      { x: window.innerWidth / 2 - 200, y: window.innerHeight - 120, width: 400, height: 80, buffer: 60 },
      // Layers button (bottom left)
      { x: 0, y: window.innerHeight - 120, width: 120, height: 80, buffer: 40 },
      // Grid/Alignment button (bottom left, second)
      { x: 0, y: window.innerHeight - 200, width: 120, height: 80, buffer: 40 },
      // Artboards button (bottom left, third)
      { x: 0, y: window.innerHeight - 280, width: 120, height: 80, buffer: 40 },
      // Zoom indicator (top center)
      { x: window.innerWidth / 2 - 100, y: 0, width: 200, height: 80, buffer: 40 },
    ];
  }, []);

  // Função para verificar repulsão e ajustar posição
  const checkRepulsion = useCallback((newPos: Position): Position => {
    const zones = getRepulsionZones();
    let adjustedPos = { ...newPos };
    
    for (const zone of zones) {
      const panelWidth = 520; // Largura estimada do painel
      const panelHeight = 60; // Altura estimada do painel
      
      // Verificar se o painel está muito próximo da zona
      const isNearX = adjustedPos.x < zone.x + zone.width + zone.buffer && 
                     adjustedPos.x + panelWidth > zone.x - zone.buffer;
      const isNearY = adjustedPos.y < zone.y + zone.height + zone.buffer && 
                     adjustedPos.y + panelHeight > zone.y - zone.buffer;
      
      if (isNearX && isNearY) {
        // Calcular direção de repulsão
        const centerX = adjustedPos.x + panelWidth / 2;
        const centerY = adjustedPos.y + panelHeight / 2;
        const zoneCenterX = zone.x + zone.width / 2;
        const zoneCenterY = zone.y + zone.height / 2;
        
        const deltaX = centerX - zoneCenterX;
        const deltaY = centerY - zoneCenterY;
        
        // Empurrar para longe da zona
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // Repulsão horizontal
          if (deltaX > 0) {
            adjustedPos.x = zone.x + zone.width + zone.buffer;
          } else {
            adjustedPos.x = zone.x - panelWidth - zone.buffer;
          }
        } else {
          // Repulsão vertical
          if (deltaY > 0) {
            adjustedPos.y = zone.y + zone.height + zone.buffer;
          } else {
            adjustedPos.y = zone.y - panelHeight - zone.buffer;
          }
        }
        
        // Trigger repulsion animation
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);
      }
    }
    
    // Manter dentro dos limites da tela
    adjustedPos.x = Math.max(20, Math.min(window.innerWidth - 540, adjustedPos.x));
    adjustedPos.y = Math.max(20, Math.min(window.innerHeight - 80, adjustedPos.y));
    
    return adjustedPos;
  }, [getRepulsionZones]);

  // Handlers de drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!dragRef.current?.contains(e.target as Node)) return;
    
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const newPos = {
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    };
    
    const adjustedPos = checkRepulsion(newPos);
    setPosition(adjustedPos);
  }, [isDragging, dragOffset, checkRepulsion]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Event listeners para drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
    } else {
      document.body.style.cursor = '';
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Tools configuration
  const fontTools = [
    { id: 'font-family', label: 'Roboto Sans', type: 'dropdown' },
    { id: 'font-size', label: '14px Header', type: 'dropdown' }
  ];

  const formatTools = [
    { id: 'bold', icon: Bold, label: 'Negrito' },
    { id: 'italic', icon: Italic, label: 'Itálico' },
    { id: 'underline', icon: Underline, label: 'Sublinhado' }
  ];

  const alignTools = [
    { id: 'align-left', icon: AlignLeft, label: 'Alinhar à esquerda' },
    { id: 'align-center', icon: AlignCenter, label: 'Centralizar' },
    { id: 'align-right', icon: AlignRight, label: 'Alinhar à direita' }
  ];

  const handleToolClick = (toolId: string) => {
    console.log(`📝 [FLOATING TEXT PANEL] Tool clicked: ${toolId}`);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={panelRef}
      className={`fixed z-[1000] floating-text-panel ${isDragging ? 'dragging' : ''} ${isAnimating ? 'repulsion' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: isDragging ? 'scale(1.02)' : 'scale(1)',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Drag Handle */}
      <div ref={dragRef} className="floating-text-panel-drag-handle">
        <div className="drag-indicator"></div>
      </div>

      {/* Panel Content */}
      <div className="floating-text-panel-content">
        {/* Font Controls */}
        <div className="text-controls-section">
          {fontTools.map((tool) => (
            <button
              key={tool.id}
              className="text-dropdown-button"
              onClick={() => handleToolClick(tool.id)}
            >
              <span className="text-dropdown-label">{tool.label}</span>
              <svg className="text-dropdown-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ))}
        </div>

        {/* Separator */}
        <div className="text-panel-separator"></div>

        {/* Format Controls */}
        <div className="text-controls-section">
          {formatTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                className="text-action-button"
                onClick={() => handleToolClick(tool.id)}
                title={tool.label}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>

        {/* Color Picker */}
        <div className="text-controls-section">
          <button
            className="text-color-button"
            onClick={() => handleToolClick('color')}
            title="Cor do texto"
          >
            <div className="color-indicator"></div>
          </button>
        </div>

        {/* Separator */}
        <div className="text-panel-separator"></div>

        {/* Alignment Controls */}
        <div className="text-controls-section">
          {alignTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                className="text-action-button"
                onClick={() => handleToolClick(tool.id)}
                title={tool.label}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>

        {/* More Options */}
        <div className="text-controls-section">
          <button
            className="text-action-button"
            onClick={() => handleToolClick('more')}
            title="Mais opções"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="floating-text-panel-close"
          title="Fechar painel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
