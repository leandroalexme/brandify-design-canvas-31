
import React from 'react';
import { Square, Circle, Triangle, Ellipsis, Minus, Pentagon, Star } from 'lucide-react';
import { ShapeType } from '../utils/konvaShapeFactory';

interface EnhancedShapesMenuProps {
  onShapeSelect: (shape: ShapeType) => void;
  selectedColor: string;
}

export const EnhancedShapesMenu = ({ onShapeSelect, selectedColor }: EnhancedShapesMenuProps) => {
  const shapes = [
    { type: 'rectangle' as ShapeType, icon: Square, label: 'Retângulo' },
    { type: 'circle' as ShapeType, icon: Circle, label: 'Círculo' },
    { type: 'triangle' as ShapeType, icon: Triangle, label: 'Triângulo' },
    { type: 'ellipse' as ShapeType, icon: Ellipsis, label: 'Elipse' },
    { type: 'line' as ShapeType, icon: Minus, label: 'Linha' },
    { type: 'polygon' as ShapeType, icon: Pentagon, label: 'Polígono' },
    { type: 'star' as ShapeType, icon: Star, label: 'Estrela' },
  ];

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-3">
      <div className="grid grid-cols-2 gap-2 min-w-[200px]">
        {shapes.map((shape) => (
          <button
            key={shape.type}
            className="flex items-center gap-3 p-3 rounded-xl text-left hover:bg-slate-700/50 transition-all duration-200 group"
            onClick={() => onShapeSelect(shape.type)}
            title={shape.label}
          >
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: selectedColor + '20', color: selectedColor }}
            >
              <shape.icon className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-200 group-hover:text-white">
              {shape.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
