
import React from 'react';

export const showMenuAtPosition = (
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

export const createSubmenuHandlers = (
  menuType: 'shapes' | 'select' | 'pen',
  buttonRef: React.RefObject<HTMLButtonElement>,
  setShowMenu: (show: boolean) => void,
  setMenuPosition: (pos: { x: number; y: number }) => void,
  timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>,
  defaultTool: string,
  onToolSelect: (tool: any) => void
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
    onToolSelect(defaultTool);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    showMenuAtPosition(e, buttonRef, setMenuPosition, setShowMenu);
  };

  return { handleMouseDown, handleMouseUp, handleClick, handleContextMenu };
};
