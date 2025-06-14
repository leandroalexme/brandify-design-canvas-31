
import { MousePointer, PenTool, Square, Type, Move, MessageCircle, Brush, Pencil } from 'lucide-react';
import { ToolType } from '../components/BrandifyStudio';

// Definição simples de ícones por ferramenta
export const TOOL_ICONS = {
  'select': MousePointer,
  'node': MousePointer,
  'move': Move,
  'comment': MessageCircle,
  'pen': PenTool,
  'vector-brush': Brush,
  'pencil': Pencil,
  'shapes': Square,
  'text': Type,
} as const;

// Definição das ferramentas principais
export const MAIN_TOOLS = [
  { id: 'select', label: 'Selecionar', hasSubmenu: true },
  { id: 'pen', label: 'Caneta', hasSubmenu: true },
  { id: 'shapes', label: 'Formas', hasSubmenu: true },
  { id: 'text', label: 'Texto', hasSubmenu: false },
] as const;

// Subferramentas organizadas por grupo
export const SUB_TOOLS = {
  select: [
    { id: 'select', label: 'Seletor' },
    { id: 'node', label: 'Ferramenta de Nó' },
    { id: 'move', label: 'Mover' },
    { id: 'comment', label: 'Comentário' },
  ],
  pen: [
    { id: 'pen', label: 'Caneta' },
    { id: 'vector-brush', label: 'Pincel Vetorial' },
    { id: 'pencil', label: 'Lápis' },
  ],
} as const;

// Funções utilitárias
export const getToolIcon = (toolId: ToolType): any => {
  return TOOL_ICONS[toolId] || MousePointer;
};

export const getMainToolForSubTool = (subTool: ToolType): ToolType => {
  if (['select', 'node', 'move', 'comment'].includes(subTool)) return 'select';
  if (['pen', 'vector-brush', 'pencil'].includes(subTool)) return 'pen';
  return subTool;
};

export const isSubTool = (tool: ToolType): boolean => {
  return ['node', 'move', 'comment', 'vector-brush', 'pencil'].includes(tool);
};

export const getToolGroup = (tool: ToolType): string => {
  const mainTool = getMainToolForSubTool(tool);
  return mainTool;
};
