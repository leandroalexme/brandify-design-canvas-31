
import React, { useState } from 'react';
import { MousePointer, Type, Circle, Pen, Eraser, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    { id: 'select', icon: MousePointer, label: 'Select' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'shapes', icon: Circle, label: 'Shapes' },
    { id: 'draw', icon: Pen, label: 'Draw' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
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
      className="fixed z-50 floating-module p-4 flex flex-col items-center space-y-3"
      style={{ left: position.x, top: position.y }}
      onMouseDown={handleMouseDown}
    >
      {/* Drag Handle */}
      <div className="w-8 h-1 bg-slate-600 rounded-full cursor-move mb-2" />
      
      {tools.map((tool) => (
        <Button
          key={tool.id}
          variant={selectedTool === tool.id ? "default" : "ghost"}
          size="lg"
          className={`w-12 h-12 rounded-2xl transition-all duration-200 ${
            selectedTool === tool.id 
              ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25' 
              : 'hover:bg-slate-700 text-slate-300'
          }`}
          onClick={() => onToolSelect(tool.id as any)}
        >
          <tool.icon className="w-5 h-5" />
        </Button>
      ))}
      
      <div className="w-full h-px bg-slate-700 my-2" />
      
      <div className="relative">
        <button
          className="w-12 h-12 rounded-2xl border-4 border-slate-600 shadow-lg transition-transform hover:scale-105"
          style={{ backgroundColor: selectedColor }}
          onClick={() => setShowColorPicker(!showColorPicker)}
        />
        
        {showColorPicker && (
          <div className="absolute left-full ml-4 top-0 z-50">
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
