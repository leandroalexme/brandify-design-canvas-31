
import { useEffect, useCallback } from 'react';
import Konva from 'konva';

interface UseKonvaKeyboardShortcutsParams {
  stage: Konva.Stage | null;
  layer: Konva.Layer | null;
  selectedShape: Konva.Shape | null;
  onDeleteElement: (id: string) => void;
  onCopyElement: (id: string) => void;
  onPasteElement: () => void;
}

export const useKonvaKeyboardShortcuts = ({
  stage,
  layer,
  selectedShape,
  onDeleteElement,
  onCopyElement,
  onPasteElement
}: UseKonvaKeyboardShortcutsParams) => {

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ignorar se estiver digitando em um input
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    const elementId = selectedShape?.getAttr('elementId');

    switch (e.key) {
      case 'Delete':
      case 'Backspace':
        if (elementId) {
          e.preventDefault();
          onDeleteElement(elementId);
        }
        break;

      case 'c':
        if ((e.ctrlKey || e.metaKey) && elementId) {
          e.preventDefault();
          onCopyElement(elementId);
        }
        break;

      case 'v':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          onPasteElement();
        }
        break;

      case 'd':
        if ((e.ctrlKey || e.metaKey) && elementId) {
          e.preventDefault();
          // Duplicar elemento (copiar + colar)
          onCopyElement(elementId);
          setTimeout(() => onPasteElement(), 10);
        }
        break;

      case 'Escape':
        // Deselecionar tudo
        if (stage) {
          stage.fire('click', { target: stage });
        }
        break;
    }
  }, [selectedShape, onDeleteElement, onCopyElement, onPasteElement, stage]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {};
};
