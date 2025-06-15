
import { useState, useCallback, useRef, useMemo } from 'react';
import { DesignElement } from '../types/design';
import { logger } from '../utils/validation';

interface HistoryState {
  elements: DesignElement[];
  timestamp: number;
  action: string;
}

export const useUndoRedo = (
  elements: DesignElement[],
  setElements: (elements: DesignElement[]) => void,
  maxHistorySize: number = 50
) => {
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const lastSavedState = useRef<string>('');

  // Memoizar estados de disponibilidade
  const canUndo = useMemo(() => currentIndex > 0, [currentIndex]);
  const canRedo = useMemo(() => currentIndex < history.length - 1, [currentIndex, history.length]);

  const saveState = useCallback((action: string = 'Unknown action') => {
    const elementsJson = JSON.stringify(elements);
    
    // Evitar salvar estados duplicados
    if (elementsJson === lastSavedState.current) {
      return;
    }

    lastSavedState.current = elementsJson;

    const newState: HistoryState = {
      elements: JSON.parse(elementsJson), // Deep clone
      timestamp: Date.now(),
      action
    };

    setHistory(prev => {
      // Remover estados futuros se estivermos no meio do histórico
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push(newState);

      // Limitar tamanho do histórico
      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
        setCurrentIndex(newHistory.length - 1);
      } else {
        setCurrentIndex(newHistory.length - 1);
      }

      logger.debug('State saved to history', { 
        action, 
        historySize: newHistory.length,
        currentIndex: newHistory.length - 1
      });

      return newHistory;
    });
  }, [elements, currentIndex, maxHistorySize]);

  const undo = useCallback(() => {
    if (!canUndo || currentIndex <= 0) {
      logger.warn('Cannot undo: no previous state available');
      return;
    }

    const previousState = history[currentIndex - 1];
    setElements(previousState.elements);
    setCurrentIndex(prev => prev - 1);

    logger.debug('Undo performed', { 
      action: previousState.action,
      newIndex: currentIndex - 1 
    });
  }, [canUndo, currentIndex, history, setElements]);

  const redo = useCallback(() => {
    if (!canRedo || currentIndex >= history.length - 1) {
      logger.warn('Cannot redo: no next state available');
      return;
    }

    const nextState = history[currentIndex + 1];
    setElements(nextState.elements);
    setCurrentIndex(prev => prev + 1);

    logger.debug('Redo performed', { 
      action: nextState.action,
      newIndex: currentIndex + 1 
    });
  }, [canRedo, currentIndex, history, setElements]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
    lastSavedState.current = '';
    logger.debug('History cleared');
  }, []);

  // Informações sobre o histórico
  const historyInfo = useMemo(() => ({
    totalStates: history.length,
    currentIndex,
    canUndo,
    canRedo,
    currentAction: history[currentIndex]?.action || 'Initial state',
    previousAction: history[currentIndex - 1]?.action || null,
    nextAction: history[currentIndex + 1]?.action || null
  }), [history, currentIndex, canUndo, canRedo]);

  return {
    saveState,
    undo,
    redo,
    clearHistory,
    canUndo,
    canRedo,
    historyInfo
  };
};
