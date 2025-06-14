
import { useState, useRef } from 'react';

export const useSubmenuState = () => {
  const [showShapesMenu, setShowShapesMenu] = useState(false);
  const [showSelectMenu, setShowSelectMenu] = useState(false);
  const [showPenMenu, setShowPenMenu] = useState(false);
  
  const [shapesMenuPosition, setShapesMenuPosition] = useState({ x: 0, y: 0 });
  const [selectMenuPosition, setSelectMenuPosition] = useState({ x: 0, y: 0 });
  const [penMenuPosition, setPenMenuPosition] = useState({ x: 0, y: 0 });
  
  const [selectedShape, setSelectedShape] = useState<string>('');
  const [selectedSelectTool, setSelectedSelectTool] = useState<string>('select');
  const [selectedPenTool, setSelectedPenTool] = useState<string>('pen');
  
  const shapesButtonRef = useRef<HTMLButtonElement>(null);
  const selectButtonRef = useRef<HTMLButtonElement>(null);
  const penButtonRef = useRef<HTMLButtonElement>(null);
  
  const shapesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const selectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const penTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close all menus function
  const closeAllMenus = () => {
    setShowShapesMenu(false);
    setShowSelectMenu(false);
    setShowPenMenu(false);
  };

  // Exclusive menu opening functions
  const setShowShapesMenuExclusive = (show: boolean) => {
    if (show) {
      setShowSelectMenu(false);
      setShowPenMenu(false);
    }
    setShowShapesMenu(show);
  };

  const setShowSelectMenuExclusive = (show: boolean) => {
    if (show) {
      setShowShapesMenu(false);
      setShowPenMenu(false);
    }
    setShowSelectMenu(show);
  };

  const setShowPenMenuExclusive = (show: boolean) => {
    if (show) {
      setShowShapesMenu(false);
      setShowSelectMenu(false);
    }
    setShowPenMenu(show);
  };

  return {
    // States
    showShapesMenu, setShowShapesMenu: setShowShapesMenuExclusive,
    showSelectMenu, setShowSelectMenu: setShowSelectMenuExclusive,
    showPenMenu, setShowPenMenu: setShowPenMenuExclusive,
    
    // Positions
    shapesMenuPosition, setShapesMenuPosition,
    selectMenuPosition, setSelectMenuPosition,
    penMenuPosition, setPenMenuPosition,
    
    // Selected items
    selectedShape, setSelectedShape,
    selectedSelectTool, setSelectedSelectTool,
    selectedPenTool, setSelectedPenTool,
    
    // Refs
    shapesButtonRef,
    selectButtonRef,
    penButtonRef,
    
    // Timeouts
    shapesTimeoutRef,
    selectTimeoutRef,
    penTimeoutRef,

    // Close all function
    closeAllMenus,
  };
};
