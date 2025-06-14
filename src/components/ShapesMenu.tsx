
import React from 'react';
import { Circle, Square, Triangle, Polygon, Star, PieChart, Diamond } from 'lucide-react';

interface ShapesMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onShapeSelect: (shape: string) => void;
  position: { x: number; y: number };
}

export const ShapesMenu = ({ isOpen, onClose, onShapeSelect, position }: ShapesMenuProps) => {
  if (!isOpen) return null;

  const shapes = [
    { id: 'circle', icon: Circle, label: 'Círculo' },
    { id: 'square', icon: Square, label: 'Quadrado' },
    { id: 'triangle', icon: Triangle, label: 'Triângulo' },
    { id: 'polygon', icon: Polygon, label: 'Polígono' },
    { id: 'star', icon: Star, label: 'Estrela' },
    { id: 'pie', icon: PieChart, label: 'Pizza' },
    { id: 'diamond', icon: Diamond, label: 'Diamante' },
  ];

  const handleShapeClick = (shapeId: string) => {
    onShapeSelect(shapeId);
    onClose();
  };

  return (
    <div 
      className="fixed z-[100] floating-module p-2 grid grid-cols-2 gap-1"
      style={{
        left: position.x,
        top: position.y,
        minWidth: '140px'
      }}
    >
      {shapes.map((shape) => (
        <button
          key={shape.id}
          className="w-12 h-12 rounded-lg bg-slate-700/60 hover:bg-slate-600/80 
                     border border-slate-600/40 hover:border-slate-500/60
                     flex items-center justify-center text-slate-300 hover:text-slate-100
                     transition-all duration-200"
          onClick={() => handleShapeClick(shape.id)}
          title={shape.label}
        >
          <shape.icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
};
