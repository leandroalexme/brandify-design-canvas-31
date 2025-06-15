
import React, { useState } from 'react';
import { 
  Keyboard, 
  Settings, 
  Plus, 
  Trash2, 
  Edit,
  Check,
  X
} from 'lucide-react';
import { PanelContainer } from './ui/PanelContainer';

interface CustomShortcut {
  id: string;
  name: string;
  description: string;
  keys: string[];
  category: 'navigation' | 'edit' | 'tools' | 'view' | 'custom';
  enabled: boolean;
}

interface ShortcutsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: Record<string, string[]>;
  currentMode: string;
  modes: Array<{ id: string; name: string }>;
  onChangeMode: (modeId: string) => void;
  onUpdateShortcut: (action: string, keys: string[]) => void;
  onRemoveShortcut: (action: string) => void;
  getKeyDisplay: (keys: string[]) => string;
  validateShortcut: (keys: string[], excludeAction?: string) => string[];
}

export const ShortcutsPanel = ({
  isOpen,
  onClose,
  shortcuts,
  currentMode,
  modes,
  onChangeMode,
  onUpdateShortcut,
  onRemoveShortcut,
  getKeyDisplay,
  validateShortcut
}: ShortcutsPanelProps) => {
  const [editingAction, setEditingAction] = useState<string | null>(null);
  const [newKeys, setNewKeys] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Categorias de ações
  const actionCategories = {
    navigation: 'Navegação',
    edit: 'Edição',
    tools: 'Ferramentas',
    view: 'Visualização',
    custom: 'Personalizado'
  };

  // Descrições das ações
  const actionDescriptions: Record<string, { name: string; category: keyof typeof actionCategories }> = {
    undo: { name: 'Desfazer', category: 'edit' },
    redo: { name: 'Refazer', category: 'edit' },
    copy: { name: 'Copiar', category: 'edit' },
    paste: { name: 'Colar', category: 'edit' },
    cut: { name: 'Recortar', category: 'edit' },
    delete: { name: 'Deletar', category: 'edit' },
    duplicate: { name: 'Duplicar', category: 'edit' },
    selectAll: { name: 'Selecionar Tudo', category: 'edit' },
    group: { name: 'Agrupar', category: 'edit' },
    ungroup: { name: 'Desagrupar', category: 'edit' },
    zoomIn: { name: 'Zoom In', category: 'view' },
    zoomOut: { name: 'Zoom Out', category: 'view' },
    zoomToFit: { name: 'Ajustar Zoom', category: 'view' },
    resetZoom: { name: 'Resetar Zoom', category: 'view' },
    toggleGrid: { name: 'Mostrar/Ocultar Grade', category: 'view' },
    toggleSnap: { name: 'Ativar/Desativar Snap', category: 'view' }
  };

  // Filtrar atalhos
  const filteredShortcuts = Object.entries(shortcuts).filter(([action]) => {
    const description = actionDescriptions[action];
    if (!description) return false;

    const matchesSearch = !searchTerm || 
      description.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || 
      description.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Gravar nova combinação de teclas
  const startRecording = (action: string) => {
    setEditingAction(action);
    setNewKeys([]);
    setIsRecording(true);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!isRecording) return;

    event.preventDefault();
    const keys = [];
    
    if (event.ctrlKey || event.metaKey) keys.push('ctrl');
    if (event.shiftKey) keys.push('shift');
    if (event.altKey) keys.push('alt');
    
    const key = event.key.toLowerCase();
    if (!['control', 'shift', 'alt', 'meta'].includes(key)) {
      keys.push(key);
      setNewKeys(keys);
    }
  };

  const saveShortcut = () => {
    if (!editingAction || newKeys.length === 0) return;

    const conflicts = validateShortcut(newKeys, editingAction);
    if (conflicts.length > 0) {
      alert(`Conflito com: ${conflicts.map(a => actionDescriptions[a]?.name || a).join(', ')}`);
      return;
    }

    onUpdateShortcut(editingAction, newKeys);
    cancelEditing();
  };

  const cancelEditing = () => {
    setEditingAction(null);
    setNewKeys([]);
    setIsRecording(false);
  };

  // Efeito para capturar teclas durante gravação
  React.useEffect(() => {
    if (isRecording) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isRecording]);

  if (!isOpen) return null;

  return (
    <PanelContainer
      isOpen={isOpen}
      onClose={onClose}
      title="Atalhos de Teclado"
      position={{ x: window.innerWidth - 400 - 24, y: 120 }}
      width={400}
      height={600}
      isDraggable={true}
    >
      <div className="panel-scrollable-unified h-full space-y-4">
        
        {/* Seletor de modo */}
        <div className="panel-section-unified">
          <h3 className="text-sm font-medium text-slate-200 mb-3">Modo de Atalhos</h3>
          <select
            value={currentMode}
            onChange={(e) => onChangeMode(e.target.value)}
            className="w-full p-2 bg-slate-800 border border-slate-600 rounded text-sm text-slate-200"
          >
            {modes.map(mode => (
              <option key={mode.id} value={mode.id}>
                {mode.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filtros */}
        <div className="panel-section-unified">
          <div className="space-y-3">
            {/* Busca */}
            <input
              type="text"
              placeholder="Buscar atalhos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 bg-slate-800 border border-slate-600 rounded text-sm text-slate-200"
            />

            {/* Categoria */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 bg-slate-800 border border-slate-600 rounded text-sm text-slate-200"
            >
              <option value="all">Todas as categorias</option>
              {Object.entries(actionCategories).map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Lista de atalhos */}
        <div className="panel-section-unified">
          <h3 className="text-sm font-medium text-slate-200 mb-3 flex items-center gap-2">
            <Keyboard className="w-4 h-4" />
            Atalhos Configurados ({filteredShortcuts.length})
          </h3>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredShortcuts.map(([action, keys]) => {
              const description = actionDescriptions[action];
              const isEditing = editingAction === action;

              return (
                <div
                  key={action}
                  className="group p-3 bg-slate-800/30 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-200">
                        {description?.name || action}
                      </div>
                      <div className="text-xs text-slate-400 capitalize">
                        {actionCategories[description?.category || 'custom']}
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <div className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300 min-w-[80px] text-center">
                          {isRecording ? (
                            <span className="text-blue-400">
                              {newKeys.length > 0 ? getKeyDisplay(newKeys) : 'Pressione...'}
                            </span>
                          ) : (
                            getKeyDisplay(keys)
                          )}
                        </div>
                        
                        {!isRecording && (
                          <>
                            <button
                              className="w-6 h-6 flex items-center justify-center text-green-400 hover:text-green-300"
                              onClick={saveShortcut}
                              title="Salvar"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              className="w-6 h-6 flex items-center justify-center text-red-400 hover:text-red-300"
                              onClick={cancelEditing}
                              title="Cancelar"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        
                        {isRecording && (
                          <button
                            className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                            onClick={() => setIsRecording(false)}
                          >
                            Parar
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300 font-mono">
                          {getKeyDisplay(keys)}
                        </div>
                        
                        <button
                          className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-opacity"
                          onClick={() => startRecording(action)}
                          title="Editar atalho"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        <button
                          className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center text-red-400 hover:text-red-300 transition-opacity"
                          onClick={() => onRemoveShortcut(action)}
                          title="Remover atalho"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredShortcuts.length === 0 && (
              <div className="text-center text-slate-400 py-8">
                {searchTerm ? 'Nenhum atalho encontrado' : 'Nenhum atalho configurado'}
              </div>
            )}
          </div>
        </div>

        {/* Informações */}
        <div className="panel-section-unified bg-slate-800/50 rounded-lg p-3">
          <div className="text-xs text-slate-400 space-y-2">
            <div className="font-medium text-slate-300">Como usar:</div>
            <ul className="space-y-1 text-slate-500">
              <li>• Clique no ícone de edição para modificar um atalho</li>
              <li>• Pressione as teclas desejadas durante a gravação</li>
              <li>• Use diferentes modos para conjuntos pré-configurados</li>
              <li>• Atalhos conflitantes não são permitidos</li>
            </ul>
          </div>
        </div>
      </div>
    </PanelContainer>
  );
};
