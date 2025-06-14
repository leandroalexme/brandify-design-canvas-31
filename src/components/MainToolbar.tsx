
import React, { useState } from 'react';
import { MousePointer, Edit3, Square, Type } from 'lucide-react';
import { ColorPicker } from './ColorPicker';

interface MainToolbarProps {
  selectedTool: 'select' | 'pen' | 'shapes' | 'text';
  onToolSelect: (tool: 'select' | 'pen' | 'shapes' | 'text') => void;
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export const MainToolbar = ({ selectedTool, onToolSelect, selectedColor, onColorSelect }: MainToolbarProps) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const tools = [
    { id: 'select', icon: MousePointer, label: 'Selecionar' },
    { id: 'pen', icon: Edit3, label: 'Caneta' },
    { id: 'shapes', icon: Square, label: 'Formas' },
    { id: 'text', icon: Type, label: 'Texto' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="floating-module p-3 flex items-center space-x-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            className={`tool-button ${selectedTool === tool.id ? 'active' : ''}`}
            onClick={() => onToolSelect(tool.id as any)}
            title={tool.label}
          >
            <tool.icon className="w-5 h-5" />
          </button>
        ))}
        
        <div className="w-px h-8 bg-slate-700/60 mx-2" />
        
        <div className="relative">
          <button
            className="w-8 h-8 rounded-xl border-2 border-slate-600/60 shadow-sm transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: selectedColor }}
            onClick={() => setShowColorPicker(!showColorPicker)}
            title="Cor"
          />
          
          {showColorPicker && (
            <div className="absolute bottom-full mb-3 left-1/2 transform -translate-x-1/2 z-50">
              <ColorPicker
                selectedColor={selectedColor}
                onColorSelect={onColorSelect}
                onClose={() => setShowColorPicker(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
