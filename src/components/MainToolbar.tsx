
import React, { useState, useRef, useEffect } from 'react';
import { MousePointer, Edit3, Square, Type } from 'lucide-react';
import { ShapesMenu } from './ShapesMenu';

interface MainToolbarProps {
  selectedTool: 'select' | 'pen' | 'shapes' | 'text';
  onToolSelect: (tool: 'select' | 'pen' | 'shapes' | 'text') => void;
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export const MainToolbar = ({ selectedTool, onToolSelect }: MainToolbarProps) => {
  const [showShapesMenu, setShowShapesMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const shapesButtonRef = useRef<HTMLButtonElement>(null);
  const pressTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const tools = [
    { id: 'select', icon: MousePointer, label: 'Selecionar' },
    { id: 'pen', icon: Edit3, label: 'Caneta' },
    { id: 'shapes', icon: Square, label: 'Formas' },
    { id: 'text', icon: Type, label: 'Texto' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shapesButtonRef.current && !shapesButtonRef.current.contains(event.target as Node)) {
        setShowShapesMenu(false);
      }
    };

    if (showShapesMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShapesMenu]);

  const handleShapesMouseDown = (e: React.MouseEvent) => {
    if (e.button === 2) { // Right click
      e.preventDefault();
      showShapesMenuAtPosition(e);
      return;
    }

    // Left click and hold
    pressTimeoutRef.current = setTimeout(() => {
      showShapesMenuAtPosition(e);
    }, 500);
  };

  const handleShapesMouseUp = () => {
    if (pressTimeoutRef.current) {
      clearTimeout(pressTimeoutRef.current);
      pressTimeoutRef.current = null;
    }
  };

  const handleShapesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!showShapesMenu) {
      onToolSelect('shapes');
    }
  };

  const handleShapesContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    showShapesMenuAtPosition(e);
  };

  const showShapesMenuAtPosition = (e: React.MouseEvent) => {
    if (shapesButtonRef.current) {
      const rect = shapesButtonRef.current.getBoundingClientRect();
      // Position the menu to the left of the toolbar to avoid overlapping panels
      setMenuPosition({
        x: rect.left - 80, // Position to the left with margin
        y: rect.top // Align with the button
      });
      setShowShapesMenu(true);
    }
  };

  const handleShapeSelect = (shape: string) => {
    console.log('Shape selected:', shape);
    onToolSelect('shapes');
  };

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="floating-module p-3 flex items-center space-x-2">
          {tools.map((tool) => (
            <button
              key={tool.id}
              ref={tool.id === 'shapes' ? shapesButtonRef : undefined}
              className={`tool-button ${selectedTool === tool.id ? 'active' : ''}`}
              onClick={tool.id === 'shapes' ? handleShapesClick : () => onToolSelect(tool.id as any)}
              onMouseDown={tool.id === 'shapes' ? handleShapesMouseDown : undefined}
              onMouseUp={tool.id === 'shapes' ? handleShapesMouseUp : undefined}
              onContextMenu={tool.id === 'shapes' ? handleShapesContextMenu : undefined}
              title={tool.label}
            >
              <tool.icon className="w-5 h-5" />
            </button>
          ))}
        </div>
      </div>

      <ShapesMenu
        isOpen={showShapesMenu}
        onClose={() => setShowShapesMenu(false)}
        onShapeSelect={handleShapeSelect}
        position={menuPosition}
      />
    </>
  );
};
