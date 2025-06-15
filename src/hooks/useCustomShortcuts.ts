
import { useState, useCallback, useEffect, useMemo } from 'react';
import { logger } from '../utils/validation';

export interface CustomShortcut {
  id: string;
  name: string;
  description: string;
  keys: string[];
  action: () => void;
  category: 'navigation' | 'edit' | 'tools' | 'view' | 'custom';
  enabled: boolean;
}

interface ShortcutMode {
  id: string;
  name: string;
  shortcuts: Partial<Record<string, string[]>>;
}

const DEFAULT_MODES: ShortcutMode[] = [
  {
    id: 'default',
    name: 'Padrão',
    shortcuts: {
      'undo': ['ctrl', 'z'],
      'redo': ['ctrl', 'y'],
      'copy': ['ctrl', 'c'],
      'paste': ['ctrl', 'v'],
      'delete': ['delete'],
      'selectAll': ['ctrl', 'a']
    }
  },
  {
    id: 'photoshop',
    name: 'Photoshop',
    shortcuts: {
      'undo': ['ctrl', 'z'],
      'redo': ['ctrl', 'shift', 'z'],
      'copy': ['ctrl', 'c'],
      'paste': ['ctrl', 'v'],
      'delete': ['delete'],
      'selectAll': ['ctrl', 'a'],
      'zoom': ['ctrl', '+'],
      'zoomOut': ['ctrl', '-']
    }
  },
  {
    id: 'figma',
    name: 'Figma',
    shortcuts: {
      'undo': ['ctrl', 'z'],
      'redo': ['ctrl', 'shift', 'z'],
      'copy': ['ctrl', 'c'],
      'paste': ['ctrl', 'v'],
      'delete': ['delete'],
      'selectAll': ['ctrl', 'a'],
      'duplicate': ['ctrl', 'd'],
      'group': ['ctrl', 'g']
    }
  }
];

export const useCustomShortcuts = () => {
  const [shortcuts, setShortcuts] = useState<CustomShortcut[]>([]);
  const [currentMode, setCurrentMode] = useState<string>('default');
  const [modes] = useState<ShortcutMode[]>(DEFAULT_MODES);
  const [customShortcuts, setCustomShortcuts] = useState<Record<string, string[]>>({});

  // Carregar configurações salvas
  useEffect(() => {
    try {
      const saved = localStorage.getItem('brandify-shortcuts');
      if (saved) {
        const parsed = JSON.parse(saved);
        setCurrentMode(parsed.currentMode || 'default');
        setCustomShortcuts(parsed.customShortcuts || {});
      }
    } catch (error) {
      logger.error('Error loading shortcuts', error);
    }
  }, []);

  // Salvar configurações
  const saveShortcuts = useCallback(() => {
    try {
      const config = {
        currentMode,
        customShortcuts
      };
      localStorage.setItem('brandify-shortcuts', JSON.stringify(config));
      logger.debug('Shortcuts saved', config);
    } catch (error) {
      logger.error('Error saving shortcuts', error);
    }
  }, [currentMode, customShortcuts]);

  // Normalizar teclas
  const normalizeKeys = useCallback((keys: string[]): string[] => {
    return keys.map(key => {
      const normalized = key.toLowerCase();
      // Substituir meta keys baseado na plataforma
      if (normalized === 'cmd' && navigator.platform.includes('Mac')) {
        return 'meta';
      }
      if (normalized === 'ctrl' && !navigator.platform.includes('Mac')) {
        return 'ctrl';
      }
      return normalized;
    });
  }, []);

  // Obter atalhos ativos
  const getActiveShortcuts = useMemo(() => {
    const mode = modes.find(m => m.id === currentMode);
    if (!mode) return {};

    const result: Record<string, string[]> = {};
    
    // Atalhos do modo
    Object.entries(mode.shortcuts).forEach(([action, keys]) => {
      if (keys) {
        result[action] = normalizeKeys(keys);
      }
    });

    // Atalhos customizados sobrescrevem os do modo
    Object.entries(customShortcuts).forEach(([action, keys]) => {
      result[action] = normalizeKeys(keys);
    });

    return result;
  }, [currentMode, modes, customShortcuts, normalizeKeys]);

  // Registrar atalho
  const registerShortcut = useCallback((shortcut: Omit<CustomShortcut, 'id'>) => {
    const id = `shortcut-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newShortcut: CustomShortcut = {
      ...shortcut,
      id,
      keys: normalizeKeys(shortcut.keys)
    };

    setShortcuts(prev => [...prev, newShortcut]);
    logger.debug('Shortcut registered', newShortcut);
    
    return id;
  }, [normalizeKeys]);

  // Atualizar atalho customizado
  const updateCustomShortcut = useCallback((action: string, keys: string[]) => {
    setCustomShortcuts(prev => ({
      ...prev,
      [action]: normalizeKeys(keys)
    }));
  }, [normalizeKeys]);

  // Remover atalho customizado
  const removeCustomShortcut = useCallback((action: string) => {
    setCustomShortcuts(prev => {
      const newShortcuts = { ...prev };
      delete newShortcuts[action];
      return newShortcuts;
    });
  }, []);

  // Mudar modo
  const changeMode = useCallback((modeId: string) => {
    const mode = modes.find(m => m.id === modeId);
    if (mode) {
      setCurrentMode(modeId);
      logger.debug('Shortcut mode changed', { mode: mode.name });
    }
  }, [modes]);

  // Handler de teclas
  const handleKeyDown = useCallback((event: KeyboardEvent, actionHandlers: Record<string, () => void>) => {
    const pressedKeys = [];
    
    if (event.ctrlKey || event.metaKey) pressedKeys.push('ctrl');
    if (event.shiftKey) pressedKeys.push('shift');
    if (event.altKey) pressedKeys.push('alt');
    pressedKeys.push(event.key.toLowerCase());

    const activeShortcuts = getActiveShortcuts;
    
    // Verificar se algum atalho corresponde
    for (const [action, shortcutKeys] of Object.entries(activeShortcuts)) {
      if (arraysEqual(pressedKeys, shortcutKeys)) {
        const handler = actionHandlers[action];
        if (handler) {
          event.preventDefault();
          handler();
          logger.debug('Shortcut triggered', { action, keys: pressedKeys });
          return true;
        }
      }
    }

    return false;
  }, [getActiveShortcuts]);

  // Função auxiliar para comparar arrays
  const arraysEqual = (a: string[], b: string[]): boolean => {
    return a.length === b.length && a.every((val, i) => val === b[i]);
  };

  // Obter representação visual das teclas
  const getKeyDisplay = useCallback((keys: string[]): string => {
    const keyMap: Record<string, string> = {
      'ctrl': navigator.platform.includes('Mac') ? '⌘' : 'Ctrl',
      'meta': '⌘',
      'shift': 'Shift',
      'alt': navigator.platform.includes('Mac') ? '⌥' : 'Alt',
      'delete': 'Del',
      'backspace': '⌫',
      'enter': '↵',
      'escape': 'Esc',
      'arrowup': '↑',
      'arrowdown': '↓',
      'arrowleft': '←',
      'arrowright': '→'
    };

    return keys.map(key => keyMap[key.toLowerCase()] || key.toUpperCase()).join(' + ');
  }, []);

  // Validar conflitos de atalhos
  const validateShortcut = useCallback((keys: string[], excludeAction?: string): string[] => {
    const conflicts: string[] = [];
    const normalizedKeys = normalizeKeys(keys);

    Object.entries(getActiveShortcuts).forEach(([action, shortcutKeys]) => {
      if (action !== excludeAction && arraysEqual(normalizedKeys, shortcutKeys)) {
        conflicts.push(action);
      }
    });

    return conflicts;
  }, [getActiveShortcuts, normalizeKeys]);

  // Efeito para salvar automaticamente
  useEffect(() => {
    saveShortcuts();
  }, [saveShortcuts]);

  return {
    // State
    shortcuts,
    currentMode,
    modes,
    customShortcuts,
    
    // Actions
    registerShortcut,
    updateCustomShortcut,
    removeCustomShortcut,
    changeMode,
    handleKeyDown,
    
    // Utils
    getKeyDisplay,
    validateShortcut,
    getActiveShortcuts,
    
    // Info
    currentModeName: modes.find(m => m.id === currentMode)?.name || 'Desconhecido'
  };
};
