
import React, { useState } from 'react';
import { MousePointer, Type, Circle, Pen, Eraser } from 'lucide-react';
import { ColorPicker } from './ColorPicker';

interface FloatingToolbarProps {
  selectedTool: 'select' | 'text' | 'shapes' | 'draw' | 'eraser';
  onToolSelect: (tool: 'select' | 'text' | 'shapes' | 'draw' | 'eraser') => void;
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export const FloatingToolbar = ({ selectedTool, onToolSelect, selectedColor, onColorSelect }: FloatingToolbarProps) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [position, setPosition] = useState({ x: 32, y: 120 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const tools = [
    { id: 'select', icon: MousePointer, label: 'Selecionar' },
    { id: 'text', icon: Type, label: 'Texto' },
    { id: 'shapes', icon: Circle, label: 'Formas' },
    { id: 'draw', icon: Pen, label: 'Desenhar' },
    { id: 'eraser', icon: Eraser, label: 'Apagar' },
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  return (
    <div
      className="fixed z-[400] panel-container-unified p-4 flex flex-col items-center space-y-3 animate-scale-in-60fps"
      style={{ left: position.x, top: position.y }}
      onMouseDown={handleMouseDown}
    >
      {/* Drag Handle */}
      <div className="w-8 h-1 bg-slate-600/60 rounded-full cursor-move mb-2 hover:bg-slate-500/80 transition-colors duration-150" />
      
      {tools.map((tool, index) => (
        <button
          key={tool.id}
          className={`button-icon-unified animate-stagger-fade ${selectedTool === tool.id ? 'selected' : ''}`}
          onClick={() => onToolSelect(tool.id as any)}
          title={tool.label}
          style={{ 
            animationDelay: `${index * 0.05}s`,
            animationFillMode: 'both'
          }}
        >
          <tool.icon className="w-5 h-5" />
        </button>
      ))}
      
      <div className="w-full h-px bg-slate-700/60 my-2" />
      
      <div className="relative">
        <button
          className="w-12 h-12 rounded-xl border-4 border-slate-600/60 hover:border-slate-500/80 shadow-lg transition-all duration-150 hover:scale-105 animate-stagger-fade"
          style={{ 
            backgroundColor: selectedColor,
            animationDelay: `${tools.length * 0.05}s`,
            animationFillMode: 'both'
          }}
          onClick={() => setShowColorPicker(!showColorPicker)}
          title="Selecionar cor"
        />
        
        {showColorPicker && (
          <div className="absolute left-full ml-4 top-0 z-50 animate-scale-in-60fps">
            <ColorPicker
              selectedColor={selectedColor}
              onColorSelect={onColorSelect}
              onClose={() => setShowColorPicker(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
