import { MousePointer, PenTool, Square, Type, Move, MessageCircle, Brush, Pencil, Settings, AlignCenter, FileType, Columns2, Palette, Sparkles } from 'lucide-react';
import { ToolDefinition, MainTool, SubTool } from '../types/tools';

// Configuração das sub-ferramentas por ferramenta principal
export const SUB_TOOLS: Record<MainTool, SubTool[]> = {
  select: ['node', 'move', 'comment'],
  pen: ['brush', 'pencil'],
  shapes: [],
  text: [] // Removido submenu anterior, agora usa TextPropertiesSubmenu
};

// Mapeamento de sub-ferramentas para suas ferramentas principais
export const SUB_TOOL_TO_MAIN: Record<SubTool, MainTool> = {
  node: 'select',
  move: 'select', 
  comment: 'select',
  brush: 'pen',
  pencil: 'pen'
};

// Ícones para cada ferramenta
export const TOOL_ICONS = {
  // Ferramentas principais
  select: MousePointer,
  pen: PenTool,
  shapes: Square,
  text: Type,
  
  // Sub-ferramentas
  node: MousePointer,
  move: Move,
  comment: MessageCircle,
  brush: Brush,
  pencil: Pencil
};

// Labels das ferramentas
export const TOOL_LABELS = {
  select: 'Selecionar',
  pen: 'Caneta',
  shapes: 'Formas',
  text: 'Texto',
  node: 'Ferramenta de Nó',
  move: 'Mover',
  comment: 'Comentário',
  brush: 'Pincel',
  pencil: 'Lápis'
};

// Sub-ferramentas para menus (removido text do SUB_TOOL_OPTIONS)
export const SUB_TOOL_OPTIONS = {
  select: [
    { id: 'node', icon: MousePointer, label: 'Ferramenta de Nó' },
    { id: 'move', icon: Move, label: 'Mover' },
    { id: 'comment', icon: MessageCircle, label: 'Comentário' }
  ],
  pen: [
    { id: 'brush', icon: Brush, label: 'Pincel' },
    { id: 'pencil', icon: Pencil, label: 'Lápis' }
  ]
};

// Ferramentas do submenu de propriedades de texto - atualizado com uma única ferramenta de alinhamento
export const TEXT_PROPERTIES_TOOLS = [
  { id: 'typography', icon: Type, label: 'Tipografia' },
  { id: 'alignment', icon: AlignCenter, label: 'Alinhamento' },
  { id: 'advanced', icon: Settings, label: 'Modo Avançado' },
  { id: 'glyph', icon: FileType, label: 'Glyph' },
  { id: 'columns', icon: Columns2, label: 'Colunas' },
  { id: 'color', icon: Palette, label: 'Cor' },
  { id: 'effects', icon: Sparkles, label: 'Efeitos' }
];
