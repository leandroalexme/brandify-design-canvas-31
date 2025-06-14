
import React, { useState, useRef, useEffect } from 'react';
import { MousePointer, PenTool, Square, Type } from 'lucide-react';
import { ShapesMenu } from './ShapesMenu';
import { SelectSubmenu } from './SelectSubmenu';
import { PenSubmenu } from './PenSubmenu';

interface MainToolbarProps {
  selectedTool: 'select' | 'pen' | 'shapes' | 'text' | 'node' | 'move' | 'comment' | 'vector-brush' | 'pencil';
  onToolSelect: (tool: 'select' | 'pen' | 'shapes' | 'text' | 'node' | 'move' | 'comment' | 'vector-brush' | 'pencil') => void;
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export const MainToolbar = ({ selectedTool, onToolSelect }: MainToolbarProps) => {
  // States for each submenu
  const [showShapesMenu, setShowShapesMenu] = useState(false);
  const [showSelectMenu, setShowSelectMenu] = useState(false);
  const [showPenMenu, setShowPenMenu] = useState(false);
  
  // Position states
  const [shapesMenuPosition, setShapesMenuPosition] = useState({ x: 0, y: 0 });
  const [selectMenuPosition, setSelectMenuPosition] = useState({ x: 0, y: 0 });
  const [penMenuPosition, setPenMenuPosition] = useState({ x: 0, y: 0 });
  
  // Selected items for each submenu
  const [selectedShape, setSelectedShape] = useState<string>('');
  const [selectedSelectTool, setSelectedSelectTool] = useState<string>('select');
  const [selectedPenTool, setSelectedPenTool] = useState<string>('pen');
  
  // Refs for buttons
  const shapesButtonRef = useRef<HTMLButtonElement>(null);
  const selectButtonRef = useRef<HTMLButtonElement>(null);
  const penButtonRef = useRef<HTMLButtonElement>(null);
  
  // Timeout refs
  const shapesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const selectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const penTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const tools = [
    { id: 'select', icon: MousePointer, label: 'Selecionar', hasSubmenu: true },
    { id: 'pen', icon: PenTool, label: 'Caneta', hasSubmenu: true },
    { id: 'shapes', icon: Square, label: 'Formas', hasSubmenu: true },
    { id: 'text', icon: Type, label: 'Texto', hasSubmenu: false },
  ];

  // Generic handlers for submenus
  const createSubmenuHandlers = (
    menuType: 'shapes' | 'select' | 'pen',
    buttonRef: React.RefObject<HTMLButtonElement>,
    setShowMenu: (show: boolean) => void,
    setMenuPosition: (pos: { x: number; y: number }) => void,
    timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>,
    defaultTool: string
  ) => {
    const handleMouseDown = (e: React.MouseEvent) => {
      if (e.button === 2) { // Right click
        e.preventDefault();
        showMenuAtPosition(e, buttonRef, setMenuPosition, setShowMenu);
        return;
      }

      // Left click and hold
      timeoutRef.current = setTimeout(() => {
        showMenuAtPosition(e, buttonRef, setMenuPosition, setShowMenu);
      }, 500);
    };

    const handleMouseUp = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      if (!eval(`show${menuType.charAt(0).toUpperCase() + menuType.slice(1)}Menu`)) {
        onToolSelect(defaultTool as any);
      }
    };

    const handleContextMenu = (e: React.MouseEvent) => {
      e.preventDefault();
      showMenuAtPosition(e, buttonRef, setMenuPosition, setShowMenu);
    };

    return { handleMouseDown, handleMouseUp, handleClick, handleContextMenu };
  };

  const showMenuAtPosition = (
    e: React.MouseEvent,
    buttonRef: React.RefObject<HTMLButtonElement>,
    setMenuPosition: (pos: { x: number; y: number }) => void,
    setShowMenu: (show: boolean) => void
  ) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        x: rect.left + rect.width / 2,
        y: rect.top
      });
      setShowMenu(true);
    }
  };

  // Create handlers for each submenu
  const shapesHandlers = createSubmenuHandlers(
    'shapes', shapesButtonRef, setShowShapesMenu, setShapesMenuPosition, shapesTimeoutRef, 'shapes'
  );
  
  const selectHandlers = createSubmenuHandlers(
    'select', selectButtonRef, setShowSelectMenu, setSelectMenuPosition, selectTimeoutRef, 'select'
  );
  
  const penHandlers = createSubmenuHandlers(
    'pen', penButtonRef, setPenMenu, setPenMenuPosition, penTimeoutRef, 'pen'
  );

  // Handle clicks outside to close menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isClickInAnyButton = [shapesButtonRef, selectButtonRef, penButtonRef].some(
        ref => ref.current && ref.current.contains(event.target as Node)
      );
      
      if (!isClickInAnyButton) {
        setShowShapesMenu(false);
        setShowSelectMenu(false);
        setShowPenMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handlers for submenu selections
  const handleShapeSelect = (shape: string) => {
    console.log('Shape selected:', shape);
    setSelectedShape(shape);
    onToolSelect('shapes');
  };

  const handleSelectToolSelect = (tool: string) => {
    console.log('Select tool selected:', tool);
    setSelectedSelectTool(tool);
    onToolSelect(tool as any);
  };

  const handlePenToolSelect = (tool: string) => {
    console.log('Pen tool selected:', tool);
    setSelectedPenTool(tool);
    onToolSelect(tool as any);
  };

  const getToolHandler = (tool: any) => {
    switch (tool.id) {
      case 'select':
        return {
          ref: selectButtonRef,
          onClick: selectHandlers.handleClick,
          onMouseDown: selectHandlers.handleMouseDown,
          onMouseUp: selectHandlers.handleMouseUp,
          onContextMenu: selectHandlers.handleContextMenu,
        };
      case 'pen':
        return {
          ref: penButtonRef,
          onClick: penHandlers.handleClick,
          onMouseDown: penHandlers.handleMouseDown,
          onMouseUp: penHandlers.handleMouseUp,
          onContextMenu: penHandlers.handleContextMenu,
        };
      case 'shapes':
        return {
          ref: shapesButtonRef,
          onClick: shapesHandlers.handleClick,
          onMouseDown: shapesHandlers.handleMouseDown,
          onMouseUp: shapesHandlers.handleMouseUp,
          onContextMenu: shapesHandlers.handleContextMenu,
        };
      default:
        return {
          onClick: () => onToolSelect(tool.id as any),
        };
    }
  };

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[500]">
        <div className="floating-module p-3 flex items-center space-x-2 animate-slide-up">
          {tools.map((tool) => {
            const handlers = getToolHandler(tool);
            const isActive = selectedTool === tool.id || 
              (tool.id === 'select' && ['node', 'move', 'comment'].includes(selectedTool)) ||
              (tool.id === 'pen' && ['vector-brush', 'pencil'].includes(selectedTool));
            
            return (
              <button
                key={tool.id}
                ref={handlers.ref}
                className={`tool-button smooth-transition ${isActive ? 'active' : ''}`}
                onClick={handlers.onClick}
                onMouseDown={handlers.onMouseDown}
                onMouseUp={handlers.onMouseUp}
                onContextMenu={handlers.onContextMenu}
                title={tool.label}
              >
                <tool.icon className="w-5 h-5" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Submenus */}
      <ShapesMenu
        isOpen={showShapesMenu}
        onClose={() => setShowShapesMenu(false)}
        onShapeSelect={handleShapeSelect}
        position={shapesMenuPosition}
        selectedShape={selectedShape}
      />

      <SelectSubmenu
        isOpen={showSelectMenu}
        onClose={() => setShowSelectMenu(false)}
        onToolSelect={handleSelectToolSelect}
        position={selectMenuPosition}
        selectedTool={selectedSelectTool}
      />

      <PenSubmenu
        isOpen={showPenMenu}
        onClose={() => setShowPenMenu(false)}
        onToolSelect={handlePenToolSelect}
        position={penMenuPosition}
        selectedTool={selectedPenTool}
      />
    </>
  );
};
