
import { useEffect, useCallback } from 'react';
import { logger } from '../utils/validation';

interface ShortcutHandler {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  handler: () => void;
  description: string;
}

export const useKeyboardShortcuts = (shortcuts: ShortcutHandler[]) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const matchingShortcut = shortcuts.find(shortcut => {
      const keyMatch = shortcut.key.toLowerCase() === event.key.toLowerCase();
      const ctrlMatch = (shortcut.ctrlKey || false) === (event.ctrlKey || event.metaKey);
      const shiftMatch = (shortcut.shiftKey || false) === event.shiftKey;
      const altMatch = (shortcut.altKey || false) === event.altKey;
      
      return keyMatch && ctrlMatch && shiftMatch && altMatch;
    });

    if (matchingShortcut) {
      event.preventDefault();
      matchingShortcut.handler();
      logger.debug('Keyboard shortcut triggered', { 
        key: matchingShortcut.key,
        description: matchingShortcut.description 
      });
    }
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Função para obter lista de atalhos ativos
  const getShortcutsList = useCallback(() => {
    return shortcuts.map(shortcut => ({
      keys: [
        shortcut.ctrlKey && (navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'),
        shortcut.shiftKey && 'Shift',
        shortcut.altKey && 'Alt',
        shortcut.key.toUpperCase()
      ].filter(Boolean).join(' + '),
      description: shortcut.description
    }));
  }, [shortcuts]);

  return { getShortcutsList };
};
