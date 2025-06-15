
import React, { useState } from 'react';
import { 
  History, 
  RotateCcw, 
  RotateCw, 
  GitBranch, 
  Plus,
  Eye,
  Clock,
  Trash2
} from 'lucide-react';
import { PanelContainer } from './ui/PanelContainer';

interface HistorySnapshot {
  id: string;
  action: string;
  timestamp: number;
  thumbnail?: string;
  branch?: string;
}

interface HistoryBranch {
  id: string;
  name: string;
  parentSnapshotId: string;
  snapshots: string[];
}

interface VisualHistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  snapshots: HistorySnapshot[];
  branches: HistoryBranch[];
  currentSnapshotId: string | null;
  currentBranchId: string;
  canUndo: boolean;
  canRedo: boolean;
  onGoToSnapshot: (id: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onCreateBranch: (name: string) => void;
  onSwitchBranch: (branchId: string) => void;
}

export const VisualHistoryPanel = ({
  isOpen,
  onClose,
  snapshots,
  branches,
  currentSnapshotId,
  currentBranchId,
  canUndo,
  canRedo,
  onGoToSnapshot,
  onUndo,
  onRedo,
  onCreateBranch,
  onSwitchBranch
}: VisualHistoryPanelProps) => {
  const [showBranches, setShowBranches] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [showNewBranchInput, setShowNewBranchInput] = useState(false);

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'Agora';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m atrás`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h atrás`;
    return new Date(timestamp).toLocaleDateString();
  };

  const handleCreateBranch = () => {
    if (newBranchName.trim()) {
      onCreateBranch(newBranchName.trim());
      setNewBranchName('');
      setShowNewBranchInput(false);
    }
  };

  const currentBranch = branches.find(b => b.id === currentBranchId);
  const branchSnapshots = snapshots.filter(s => s.branch === currentBranchId);

  if (!isOpen) return null;

  return (
    <PanelContainer
      isOpen={isOpen}
      onClose={onClose}
      title="Histórico Visual"
      position={{ x: 24, y: 120 }}
      width={320}
      height={500}
      isDraggable={true}
    >
      <div className="panel-scrollable-unified h-full space-y-4">
        
        {/* Controles principais */}
        <div className="panel-section-unified">
          <div className="flex items-center gap-2 mb-3">
            <button
              className={`button-unified flex items-center gap-2 flex-1 ${!canUndo ? 'opacity-50' : ''}`}
              onClick={onUndo}
              disabled={!canUndo}
              title="Desfazer (Ctrl+Z)"
            >
              <RotateCcw className="w-4 h-4" />
              Desfazer
            </button>
            <button
              className={`button-unified flex items-center gap-2 flex-1 ${!canRedo ? 'opacity-50' : ''}`}
              onClick={onRedo}
              disabled={!canRedo}
              title="Refazer (Ctrl+Y)"
            >
              <RotateCw className="w-4 h-4" />
              Refazer
            </button>
          </div>
        </div>

        {/* Gerenciamento de branches */}
        <div className="panel-section-unified">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-slate-200 flex items-center gap-2">
              <GitBranch className="w-4 h-4" />
              Branches
            </h3>
            <button
              className="text-xs text-slate-400 hover:text-slate-200"
              onClick={() => setShowBranches(!showBranches)}
            >
              {showBranches ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>

          {showBranches && (
            <div className="space-y-2">
              {/* Branch atual */}
              <div className="text-xs text-slate-300 bg-slate-800/50 p-2 rounded">
                Branch atual: {currentBranch?.name || 'main'}
              </div>

              {/* Lista de branches */}
              {branches.length > 0 && (
                <div className="space-y-1">
                  {branches.map(branch => (
                    <button
                      key={branch.id}
                      className={`w-full text-left p-2 rounded text-xs transition-colors ${
                        branch.id === currentBranchId 
                          ? 'bg-blue-600/50 text-blue-200' 
                          : 'hover:bg-slate-700/50 text-slate-300'
                      }`}
                      onClick={() => onSwitchBranch(branch.id)}
                    >
                      {branch.name}
                    </button>
                  ))}
                </div>
              )}

              {/* Nova branch */}
              {showNewBranchInput ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newBranchName}
                    onChange={(e) => setNewBranchName(e.target.value)}
                    placeholder="Nome da branch"
                    className="w-full p-2 bg-slate-800 border border-slate-600 rounded text-sm text-slate-200"
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateBranch()}
                    autoFocus
                  />
                  <div className="flex gap-1">
                    <button
                      className="button-unified text-xs flex-1"
                      onClick={handleCreateBranch}
                    >
                      Criar
                    </button>
                    <button
                      className="button-unified text-xs flex-1"
                      onClick={() => {
                        setShowNewBranchInput(false);
                        setNewBranchName('');
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="button-unified w-full flex items-center gap-2 justify-center text-xs"
                  onClick={() => setShowNewBranchInput(true)}
                >
                  <Plus className="w-3 h-3" />
                  Nova Branch
                </button>
              )}
            </div>
          )}
        </div>

        {/* Histórico de snapshots */}
        <div className="panel-section-unified">
          <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
            <History className="w-4 h-4" />
            Snapshots ({branchSnapshots.length})
          </h3>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {branchSnapshots.length === 0 ? (
              <div className="text-xs text-slate-400 text-center py-4">
                Nenhum snapshot na branch atual
              </div>
            ) : (
              branchSnapshots.slice().reverse().map((snapshot, index) => (
                <div
                  key={snapshot.id}
                  className={`group cursor-pointer p-3 rounded-lg border transition-all duration-200 ${
                    snapshot.id === currentSnapshotId
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-700 hover:border-slate-600 bg-slate-800/30'
                  }`}
                  onClick={() => onGoToSnapshot(snapshot.id)}
                >
                  <div className="flex items-start gap-3">
                    {/* Thumbnail */}
                    <div className="w-12 h-9 bg-slate-700 rounded overflow-hidden flex-shrink-0">
                      {snapshot.thumbnail ? (
                        <img 
                          src={snapshot.thumbnail} 
                          alt={snapshot.action}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Eye className="w-4 h-4 text-slate-500" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-200 truncate">
                        {snapshot.action}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {formatTimestamp(snapshot.timestamp)}
                      </div>
                    </div>

                    {/* Indicador atual */}
                    {snapshot.id === currentSnapshotId && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Info adicional */}
        <div className="panel-section-unified bg-slate-800/50 rounded-lg p-3">
          <div className="text-xs text-slate-400 space-y-1">
            <div>Total de snapshots: {snapshots.length}</div>
            <div>Branches: {branches.length}</div>
            <div className="pt-2 text-slate-500">
              💡 Dica: Use Ctrl+Z/Y para navegar rapidamente
            </div>
          </div>
        </div>
      </div>
    </PanelContainer>
  );
};
