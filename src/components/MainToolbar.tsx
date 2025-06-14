
import React, { useEffect } from 'react';
import { MousePointer, PenTool, Square, Type, Move, MessageCircle, Brush, Pencil } from 'lucide-react';
import { ShapesMenu } from './ShapesMenu';
import { SelectSubmenu } from './SelectSubmenu';
import { PenSubmenu } from './PenSubmenu';
import { ToolbarButton } from './ToolbarButton';
import { useSubmenuState } from '../hooks/useSubmenuState';
import { createSubmenuHandlers } from '../utils/submenuHandlers';
import { ToolType } from './BrandifyStudio';

interface MainToolbarProps {
  selectedTool: ToolType;
  onToolSelect: (tool: ToolType) => void;
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export const MainToolbar = ({ selectedTool, onToolSelect }: MainToolbarProps) => {
  const {
    showShapesMenu, setShowShapesMenu,
    showSelectMenu, setShowSelectMenu,
    showPenMenu, setShowPenMenu,
    shapesMenuPosition, setShapesMenuPosition,
    selectMenuPosition, setSelectMenuPosition,
    penMenuPosition, setPenMenuPosition,
    selectedShape, setSelectedShape,
    selectedSelectTool, setSelectedSelectTool,
    selectedPenTool, setSelectedPenTool,
    shapesButtonRef,
    selectButtonRef,
    penButtonRef,
    shapesTimeoutRef,
    selectTimeoutRef,
    penTimeoutRef,
    closeAllMenus,
  } = useSubmenuState();

  // IMPLEMENTAÇÃO DA TROCA DINÂMICA DE ÍCONES
  const getToolIcon = (baseToolId: string) => {
    switch (baseToolId) {
      case 'select':
        // Mostra ícone da sub-ferramenta ativa ou volta ao padrão
        if (selectedTool === 'move') return Move;
        if (selectedTool === 'comment') return MessageCircle;
        if (selectedTool === 'node') return MousePointer; // Ícone diferenciado para node
        return MousePointer;
      case 'pen':
        // Mostra ícone da sub-ferramenta ativa ou volta ao padrão
        if (selectedTool === 'vector-brush') return Brush;
        if (selectedTool === 'pencil') return Pencil;
        return PenTool;
      case 'shapes':
        return Square;
      case 'text':
        return Type;
      default:
        return MousePointer;
    }
  };

  // Determina qual ferramenta está ativa para mostrar o estado correto
  const getActiveToolGroup = (tool: any) => {
    const subToolMap: { [key: string]: string } = {
      'node': 'select',
      'move': 'select', 
      'comment': 'select',
      'vector-brush': 'pen',
      'pencil': 'pen',
    };
    
    return subToolMap[selectedTool] === tool.id || selectedTool === tool.id;
  };

  const tools = [
    { id: 'select', icon: getToolIcon('select'), label: 'Selecionar', hasSubmenu: true },
    { id: 'pen', icon: getToolIcon('pen'), label: 'Caneta', hasSubmenu: true },
    { id: 'shapes', icon: Square, label: 'Formas', hasSubmenu: true },
    { id: 'text', icon: Type, label: 'Texto', hasSubmenu: false },
  ];

  // Create handlers for each submenu
  const shapesHandlers = createSubmenuHandlers(
    'shapes', shapesButtonRef, setShowShapesMenu, setShapesMenuPosition, shapesTimeoutRef, 'shapes', onToolSelect
  );
  
  const selectHandlers = createSubmenuHandlers(
    'select', selectButtonRef, setShowSelectMenu, setSelectMenuPosition, selectTimeoutRef, 'select', onToolSelect
  );
  
  const penHandlers = createSubmenuHandlers(
    'pen', penButtonRef, setShowPenMenu, setPenMenuPosition, penTimeoutRef, 'pen', onToolSelect
  );

  // Handle clicks outside to close menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isClickInAnyButton = [shapesButtonRef, selectButtonRef, penButtonRef].some(
        ref => ref.current && ref.current.contains(event.target as Node)
      );
      
      if (!isClickInAnyButton) {
        closeAllMenus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeAllMenus]);

  // IMPLEMENTAÇÃO DO AUTO-RETORNO ÀS FERRAMENTAS PRINCIPAIS
  useEffect(() => {
    const handleAutoReturn = () => {
      const subTools = ['node', 'move', 'comment', 'vector-brush', 'pencil'];
      const primaryTools = ['select', 'pen', 'shapes', 'text'];
      
      if (subTools.includes(selectedTool)) {
        // Detecta quando usuário clica fora da área de trabalho ou muda contexto
        const handleOutsideActivity = () => {
          // Retorna à ferramenta principal correspondente
          if (['node', 'move', 'comment'].includes(selectedTool)) {
            onToolSelect('select');
          } else if (['vector-brush', 'pencil'].includes(selectedTool)) {
            onToolSelect('pen');
          }
        };

        // Timer para auto-retorno após período de inatividade
        const inactivityTimer = setTimeout(handleOutsideActivity, 10000); // 10 segundos
        
        return () => clearTimeout(inactivityTimer);
      }
    };

    handleAutoReturn();
  }, [selectedTool, onToolSelect]);

  // Handlers for submenu selections
  const handleShapeSelect = (shape: string) => {
    console.log('Shape selected:', shape);
    setSelectedShape(shape);
    onToolSelect('shapes');
    closeAllMenus();
  };

  const handleSelectToolSelect = (tool: string) => {
    console.log('Select tool selected:', tool);
    setSelectedSelectTool(tool);
    onToolSelect(tool as ToolType);
    closeAllMenus();
  };

  const handlePenToolSelect = (tool: string) => {
    console.log('Pen tool selected:', tool);
    setSelectedPenTool(tool);
    onToolSelect(tool as ToolType);
    closeAllMenus();
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
          onClick: () => onToolSelect(tool.id as ToolType),
        };
    }
  };

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[500]">
        <div className="floating-module p-3 flex items-center space-x-2 animate-slide-up">
          {tools.map((tool) => {
            const handlers = getToolHandler(tool);
            const isActive = getActiveToolGroup(tool);
            
            return (
              <ToolbarButton
                key={tool.id}
                id={tool.id}
                icon={tool.icon}
                label={tool.label}
                isActive={isActive}
                buttonRef={handlers.ref}
                onClick={handlers.onClick}
                onMouseDown={handlers.onMouseDown}
                onMouseUp={handlers.onMouseUp}
                onContextMenu={handlers.onContextMenu}
              />
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
