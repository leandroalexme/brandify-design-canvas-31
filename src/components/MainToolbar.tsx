
import React from 'react';
import { MousePointer, Edit3, Square, Type } from 'lucide-react';

interface MainToolbarProps {
  selectedTool: 'select' | 'pen' | 'shapes' | 'text';
  onToolSelect: (tool: 'select' | 'pen' | 'shapes' | 'text') => void;
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export const MainToolbar = ({ selectedTool, onToolSelect }: MainToolbarProps) => {
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
      </div>
    </div>
  );
};
