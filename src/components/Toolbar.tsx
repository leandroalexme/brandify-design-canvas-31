
import React, { useState } from 'react';
import { MousePointer, Type, Circle, Pen, Eraser } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ColorPicker } from './ColorPicker';

interface ToolbarProps {
  selectedTool: 'select' | 'text' | 'shapes' | 'draw' | 'eraser';
  onToolSelect: (tool: 'select' | 'text' | 'shapes' | 'draw' | 'eraser') => void;
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export const Toolbar = ({ selectedTool, onToolSelect, selectedColor, onColorSelect }: ToolbarProps) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const tools = [
    { id: 'select', icon: MousePointer, label: 'Select' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'shapes', icon: Circle, label: 'Shapes' },
    { id: 'draw', icon: Pen, label: 'Draw' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
  ];

  return (
    <div className="w-20 bg-white/90 backdrop-blur-md border-r border-slate-200/50 flex flex-col items-center py-6 space-y-4 shadow-sm">
      {tools.map((tool) => (
        <Button
          key={tool.id}
          variant={selectedTool === tool.id ? "default" : "ghost"}
          size="lg"
          className={`w-12 h-12 rounded-2xl ${
            selectedTool === tool.id 
              ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg' 
              : 'hover:bg-slate-100'
          }`}
          onClick={() => onToolSelect(tool.id as any)}
        >
          <tool.icon className="w-5 h-5" />
        </Button>
      ))}
      
      <div className="w-full h-px bg-slate-200 my-4" />
      
      <div className="relative">
        <button
          className="w-12 h-12 rounded-2xl border-4 border-white shadow-lg"
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
