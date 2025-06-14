
import React, { useRef, useEffect, useState } from 'react';
import { Circle, Square, Triangle, Hexagon, Star, PieChart, Diamond } from 'lucide-react';

interface ShapesMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onShapeSelect: (shape: string) => void;
  position: { x: number; y: number };
  selectedShape?: string;
}

export const ShapesMenu = ({ isOpen, onClose, onShapeSelect, position, selectedShape }: ShapesMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [finalPosition, setFinalPosition] = useState(position);
  const [animationDirection, setAnimationDirection] = useState<'up' | 'down' | 'left' | 'right'>('up');

  const shapes = [
    { id: 'circle', icon: Circle, label: 'Círculo' },
    { id: 'square', icon: Square, label: 'Quadrado' },
    { id: 'triangle', icon: Triangle, label: 'Triângulo' },
    { id: 'hexagon', icon: Hexagon, label: 'Hexágono' },
    { id: 'star', icon: Star, label: 'Estrela' },
    { id: 'pie', icon: PieChart, label: 'Pizza' },
    { id: 'diamond', icon: Diamond, label: 'Diamante' },
  ];

  // Intelligent positioning system
  const calculateOptimalPosition = (): { position: { x: number; y: number }; direction: 'up' | 'down' | 'left' | 'right' } => {
    const menuWidth = 72;
    const menuHeight = shapes.length * 52 + 16;
    const margin = 16;
    const toolbarHeight = 80;
    
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let optimalPosition = { ...position };
    let direction: 'up' | 'down' | 'left' | 'right' = 'up';

    // Calculate space above the toolbar (where the button is positioned)
    const spaceAbove = position.y - menuHeight - margin;
    
    // Try to position above the button (preferred)
    if (spaceAbove >= margin) {
      optimalPosition.x = position.x - menuWidth / 2; // Center on button
      optimalPosition.y = position.y - menuHeight - margin;
      direction = 'up';
    }
    // Try left of the button
    else if (position.x - menuWidth - margin >= 0) {
      optimalPosition.x = position.x - menuWidth - margin;
      optimalPosition.y = Math.max(margin, Math.min(position.y - menuHeight/2, viewport.height - menuHeight - toolbarHeight - margin));
      direction = 'left';
    }
    // Try right of the button
    else if (position.x + menuWidth + margin <= viewport.width) {
      optimalPosition.x = position.x + margin;
      optimalPosition.y = Math.max(margin, Math.min(position.y - menuHeight/2, viewport.height - menuHeight - toolbarHeight - margin));
      direction = 'right';
    }
    // Fallback: position above with horizontal centering
    else {
      optimalPosition.x = Math.max(margin, Math.min(position.x - menuWidth/2, viewport.width - menuWidth - margin));
      optimalPosition.y = Math.max(margin, position.y - menuHeight - 10);
      direction = 'up';
    }

    // Ensure the menu stays within horizontal bounds
    optimalPosition.x = Math.max(margin, Math.min(optimalPosition.x, viewport.width - menuWidth - margin));
    
    return { position: optimalPosition, direction };
  };

  useEffect(() => {
    if (isOpen) {
      const result = calculateOptimalPosition();
      setFinalPosition(result.position);
      setAnimationDirection(result.direction);
    }
  }, [isOpen, position]);

  const handleShapeClick = (shapeId: string) => {
    onShapeSelect(shapeId);
    onClose();
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

  const getAnimationClass = () => {
    switch (animationDirection) {
      case 'up': return 'animate-slide-up';
      case 'down': return 'animate-slide-down';
      case 'left': return 'animate-slide-left';
      case 'right': return 'animate-slide-right';
      default: return 'animate-slide-up';
    }
  };

  return (
    <div 
      ref={menuRef}
      className={`fixed z-[400] floating-menu p-3 flex flex-col gap-2 ${getAnimationClass()}`}
      style={{
        left: finalPosition.x,
        top: finalPosition.y,
        width: '72px'
      }}
    >
      {shapes.map((shape, index) => {
        const Icon = shape.icon;
        const isSelected = selectedShape === shape.id;
        
        return (
          <button
            key={shape.id}
            className={`action-button animate-stagger-fade ${isSelected ? 'selected animate-pulse-select' : ''}`}
            style={{ 
              animationDelay: `${index * 0.05}s`,
              animationFillMode: 'both'
            }}
            onClick={() => handleShapeClick(shape.id)}
            title={shape.label}
          >
            <Icon className="w-5 h-5" />
          </button>
        );
      })}
    </div>
  );
};
