
import { 
  MousePointer, PenTool, Square, Type, Move, MessageCircle, Brush, Pencil,
  Circle, Minus, ZoomIn, ZoomOut, Hand, Pipette, Ruler, AlignCenter,
  RotateCcw, Copy, Trash2
} from 'lucide-react';
import { ToolType } from '../components/BrandifyStudio';

// Definição completa de ícones por ferramenta
export const TOOL_ICONS = {
  'select': MousePointer,
  'node': MousePointer,
  'move': Move,
  'comment': MessageCircle,
  'pen': PenTool,
  'vector-brush': Brush,
  'pencil': Pencil,
  'shapes': Square,
  'rectangle': Square,
  'circle': Circle,
  'line': Minus,
  'text': Type,
  'zoom-in': ZoomIn,
  'zoom-out': ZoomOut,
  'hand': Hand,
  'pipette': Pipette,
  'ruler': Ruler,
  'align': AlignCenter,
} as const;

// Ferramentas principais expandidas
export const MAIN_TOOLS = [
  { id: 'select', label: 'Selecionar', hasSubmenu: true, shortcut: 'V' },
  { id: 'pen', label: 'Caneta', hasSubmenu: true, shortcut: 'P' },
  { id: 'shapes', label: 'Formas', hasSubmenu: true, shortcut: 'R' },
  { id: 'text', label: 'Texto', hasSubmenu: false, shortcut: 'T' },
  { id: 'hand', label: 'Mão', hasSubmenu: false, shortcut: 'H' },
  { id: 'zoom-in', label: 'Zoom', hasSubmenu: true, shortcut: 'Z' },
] as const;

// Subferramentas expandidas e organizadas
export const SUB_TOOLS = {
  select: [
    { id: 'select', label: 'Seletor', shortcut: 'V' },
    { id: 'node', label: 'Ferramenta de Nó', shortcut: 'A' },
    { id: 'move', label: 'Mover', shortcut: 'M' },
    { id: 'comment', label: 'Comentário', shortcut: 'C' },
  ],
  pen: [
    { id: 'pen', label: 'Caneta', shortcut: 'P' },
    { id: 'vector-brush', label: 'Pincel Vetorial', shortcut: 'B' },
    { id: 'pencil', label: 'Lápis', shortcut: 'N' },
  ],
  shapes: [
    { id: 'rectangle', label: 'Retângulo', shortcut: 'R' },
    { id: 'circle', label: 'Círculo', shortcut: 'O' },
    { id: 'line', label: 'Linha', shortcut: 'L' },
  ],
  'zoom-in': [
    { id: 'zoom-in', label: 'Aumentar Zoom', shortcut: 'Z' },
    { id: 'zoom-out', label: 'Diminuir Zoom', shortcut: 'Alt+Z' },
    { id: 'hand', label: 'Mão', shortcut: 'H' },
  ],
} as const;

// Funções utilitárias aprimoradas
export const getToolIcon = (toolId: ToolType): any => {
  return TOOL_ICONS[toolId] || MousePointer;
};

export const getMainToolForSubTool = (subTool: ToolType): ToolType => {
  if (['select', 'node', 'move', 'comment'].includes(subTool)) return 'select';
  if (['pen', 'vector-brush', 'pencil'].includes(subTool)) return 'pen';
  if (['rectangle', 'circle', 'line'].includes(subTool)) return 'shapes';
  if (['zoom-in', 'zoom-out', 'hand'].includes(subTool)) return 'zoom-in';
  return subTool;
};

export const isSubTool = (tool: ToolType): boolean => {
  return [
    'node', 'move', 'comment', 
    'vector-brush', 'pencil',
    'rectangle', 'circle', 'line',
    'zoom-out'
  ].includes(tool);
};

export const getToolGroup = (tool: ToolType): string => {
  const mainTool = getMainToolForSubTool(tool);
  return mainTool;
};

export const getToolShortcut = (toolId: ToolType): string | undefined => {
  // Buscar nas ferramentas principais
  const mainTool = MAIN_TOOLS.find(tool => tool.id === toolId);
  if (mainTool) return mainTool.shortcut;
  
  // Buscar nas sub-ferramentas
  for (const [_, subTools] of Object.entries(SUB_TOOLS)) {
    const subTool = subTools.find(tool => tool.id === toolId);
    if (subTool) return subTool.shortcut;
  }
  
  return undefined;
};

// Função para obter o ícone dinâmico da ferramenta principal
export const getMainToolDisplayIcon = (mainToolId: string, selectedTool: ToolType): any => {
  const mainTool = getMainToolForSubTool(selectedTool);
  
  // Se a ferramenta principal atual corresponde à solicitada, mostra o ícone da sub-ferramenta
  if (mainTool === mainToolId) {
    return getToolIcon(selectedTool);
  }
  
  // Caso contrário, mostra o ícone padrão da ferramenta principal
  return getToolIcon(mainToolId as ToolType);
};
