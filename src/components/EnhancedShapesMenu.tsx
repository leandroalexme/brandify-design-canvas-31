
import React from 'react';
import { Square, Circle, Triangle, Ellipsis, Minus, Pentagon, Star } from 'lucide-react';
import { ShapeType } from '../utils/konvaShapeFactory';
import { useHoldAndSelect } from '../hooks/useHoldAndSelect';

interface EnhancedShapesMenuProps {
  onShapeSelect: (shape: ShapeType) => void;
  onShapeHover?: (shape: ShapeType) => void;
  selectedColor: string;
  isHoldMode?: boolean;
}

export const EnhancedShapesMenu = ({ 
  onShapeSelect, 
  onShapeHover, 
  selectedColor,
  isHoldMode = false 
}: EnhancedShapesMenuProps) => {
  const { handleShapeHover } = useHoldAndSelect({
    onShapeSelect: onShapeSelect as (shape: string) => void,
  });

  const shapes = [
    { type: 'rectangle' as ShapeType, icon: Square, label: 'Retângulo' },
    { type: 'circle' as ShapeType, icon: Circle, label: 'Círculo' },
    { type: 'triangle' as ShapeType, icon: Triangle, label: 'Triângulo' },
    { type: 'ellipse' as ShapeType, icon: Ellipsis, label: 'Elipse' },
    { type: 'line' as ShapeType, icon: Minus, label: 'Linha' },
    { type: 'polygon' as ShapeType, icon: Pentagon, label: 'Polígono' },
    { type: 'star' as ShapeType, icon: Star, label: 'Estrela' },
  ];

  const handleShapeInteraction = (shape: ShapeType) => {
    if (isHoldMode) {
      handleShapeHover(shape);
    } else {
      onShapeSelect(shape);
    }
  };

  return (
    <div className={`bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-3 ${isHoldMode ? 'ring-2 ring-blue-500' : ''}`}>
      {isHoldMode && (
        <div className="text-xs text-blue-400 text-center mb-2 font-medium">
          Modo Hold: Passe o mouse sobre uma forma
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-2 min-w-[200px]">
        {shapes.map((shape) => (
          <button
            key={shape.type}
            className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 group ${
              isHoldMode 
                ? 'hover:bg-blue-600/50 hover:scale-105' 
                : 'hover:bg-slate-700/50'
            }`}
            onClick={() => handleShapeInteraction(shape.type)}
            onMouseEnter={() => {
              if (isHoldMode) {
                handleShapeHover(shape.type);
              }
              onShapeHover?.(shape.type);
            }}
            title={shape.label}
          >
            <div 
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                isHoldMode ? 'bg-blue-500/20' : ''
              }`}
              style={{ 
                backgroundColor: isHoldMode ? 'rgba(59, 130, 246, 0.2)' : selectedColor + '20', 
                color: isHoldMode ? '#3b82f6' : selectedColor 
              }}
            >
              <shape.icon className="w-5 h-5" />
            </div>
            <span className={`text-sm font-medium transition-colors ${
              isHoldMode 
                ? 'text-blue-300 group-hover:text-blue-100' 
                : 'text-slate-200 group-hover:text-white'
            }`}>
              {shape.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
