
import { useState, useCallback, useMemo } from 'react';
import { DesignElement } from '../types/design';
import { logger } from '../utils/validation';

interface HistorySnapshot {
  id: string;
  elements: DesignElement[];
  timestamp: number;
  action: string;
  thumbnail?: string;
  branch?: string;
}

interface HistoryBranch {
  id: string;
  name: string;
  parentSnapshotId: string;
  snapshots: string[];
}

export const useVisualHistory = (
  elements: DesignElement[],
  setElements: (elements: DesignElement[]) => void,
  maxHistorySize: number = 100
) => {
  const [snapshots, setSnapshots] = useState<HistorySnapshot[]>([]);
  const [branches, setBranches] = useState<HistoryBranch[]>([]);
  const [currentSnapshotId, setCurrentSnapshotId] = useState<string | null>(null);
  const [currentBranchId, setCurrentBranchId] = useState<string>('main');

  // Memoizar estados de disponibilidade
  const canUndo = useMemo(() => {
    const currentIndex = snapshots.findIndex(s => s.id === currentSnapshotId);
    return currentIndex > 0;
  }, [snapshots, currentSnapshotId]);

  const canRedo = useMemo(() => {
    const currentIndex = snapshots.findIndex(s => s.id === currentSnapshotId);
    return currentIndex < snapshots.length - 1;
  }, [snapshots, currentSnapshotId]);

  // Gerar thumbnail do estado atual
  const generateThumbnail = useCallback(async (elements: DesignElement[]): Promise<string> => {
    try {
      // Criar um canvas temporário para gerar thumbnail
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 150;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return '';

      // Fundo branco
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Desenhar elementos simplificados
      elements.forEach(element => {
        ctx.fillStyle = element.color;
        const x = (element.x / 1000) * canvas.width;
        const y = (element.y / 1000) * canvas.height;
        
        if (element.type === 'shape') {
          ctx.fillRect(x, y, 20, 15);
        } else if (element.type === 'text') {
          ctx.font = '12px Arial';
          ctx.fillText(element.content?.substring(0, 10) || 'T', x, y);
        }
      });

      return canvas.toDataURL('image/png');
    } catch (error) {
      logger.error('Error generating thumbnail', error);
      return '';
    }
  }, []);

  const saveSnapshot = useCallback(async (action: string = 'Unknown action') => {
    try {
      const snapshotId = `snapshot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const thumbnail = await generateThumbnail(elements);

      const newSnapshot: HistorySnapshot = {
        id: snapshotId,
        elements: JSON.parse(JSON.stringify(elements)), // Deep clone
        timestamp: Date.now(),
        action,
        thumbnail,
        branch: currentBranchId
      };

      setSnapshots(prev => {
        // Remover snapshots futuros se estivermos no meio do histórico
        const currentIndex = prev.findIndex(s => s.id === currentSnapshotId);
        const newSnapshots = currentIndex >= 0 ? prev.slice(0, currentIndex + 1) : prev;
        newSnapshots.push(newSnapshot);

        // Limitar tamanho do histórico
        if (newSnapshots.length > maxHistorySize) {
          newSnapshots.shift();
        }

        return newSnapshots;
      });

      setCurrentSnapshotId(snapshotId);

      logger.debug('Visual snapshot saved', { 
        action, 
        snapshotId,
        elementsCount: elements.length
      });
    } catch (error) {
      logger.error('Error saving snapshot', error);
    }
  }, [elements, currentSnapshotId, currentBranchId, maxHistorySize, generateThumbnail]);

  const goToSnapshot = useCallback((snapshotId: string) => {
    const snapshot = snapshots.find(s => s.id === snapshotId);
    if (!snapshot) {
      logger.warn('Snapshot not found', snapshotId);
      return;
    }

    setElements(snapshot.elements);
    setCurrentSnapshotId(snapshotId);
    setCurrentBranchId(snapshot.branch || 'main');

    logger.debug('Navigated to snapshot', { 
      snapshotId,
      action: snapshot.action 
    });
  }, [snapshots, setElements]);

  const undo = useCallback(() => {
    if (!canUndo) return;

    const currentIndex = snapshots.findIndex(s => s.id === currentSnapshotId);
    if (currentIndex > 0) {
      const previousSnapshot = snapshots[currentIndex - 1];
      goToSnapshot(previousSnapshot.id);
    }
  }, [canUndo, snapshots, currentSnapshotId, goToSnapshot]);

  const redo = useCallback(() => {
    if (!canRedo) return;

    const currentIndex = snapshots.findIndex(s => s.id === currentSnapshotId);
    if (currentIndex < snapshots.length - 1) {
      const nextSnapshot = snapshots[currentIndex + 1];
      goToSnapshot(nextSnapshot.id);
    }
  }, [canRedo, snapshots, currentSnapshotId, goToSnapshot]);

  const createBranch = useCallback((name: string) => {
    if (!currentSnapshotId) return;

    const branchId = `branch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newBranch: HistoryBranch = {
      id: branchId,
      name,
      parentSnapshotId: currentSnapshotId,
      snapshots: []
    };

    setBranches(prev => [...prev, newBranch]);
    setCurrentBranchId(branchId);

    logger.debug('Branch created', { branchId, name });
  }, [currentSnapshotId]);

  const switchBranch = useCallback((branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    if (!branch) return;

    setCurrentBranchId(branchId);
    
    // Navegar para o último snapshot da branch
    if (branch.snapshots.length > 0) {
      const lastSnapshotId = branch.snapshots[branch.snapshots.length - 1];
      goToSnapshot(lastSnapshotId);
    } else {
      goToSnapshot(branch.parentSnapshotId);
    }
  }, [branches, goToSnapshot]);

  const getCurrentSnapshot = useMemo(() => {
    return snapshots.find(s => s.id === currentSnapshotId) || null;
  }, [snapshots, currentSnapshotId]);

  const getSnapshotsByBranch = useMemo(() => {
    const result: Record<string, HistorySnapshot[]> = {};
    
    snapshots.forEach(snapshot => {
      const branchId = snapshot.branch || 'main';
      if (!result[branchId]) {
        result[branchId] = [];
      }
      result[branchId].push(snapshot);
    });

    return result;
  }, [snapshots]);

  return {
    // State
    snapshots,
    branches,
    currentSnapshotId,
    currentBranchId,
    
    // Actions
    saveSnapshot,
    goToSnapshot,
    undo,
    redo,
    createBranch,
    switchBranch,
    
    // Computed
    canUndo,
    canRedo,
    getCurrentSnapshot,
    getSnapshotsByBranch,
    
    // Info
    historyInfo: {
      totalSnapshots: snapshots.length,
      currentIndex: snapshots.findIndex(s => s.id === currentSnapshotId),
      totalBranches: branches.length
    }
  };
};
