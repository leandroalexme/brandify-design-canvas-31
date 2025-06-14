
import React from 'react';
import { MousePointer, Move, MessageCircle } from 'lucide-react';
import { ToolSubmenu } from './ToolSubmenu';

interface SelectSubmenuProps {
  isOpen: boolean;
  onClose: () => void;
  onToolSelect: (toolId: string) => void;
  position: { x: number; y: number };
  selectedTool?: string;
}

export const SelectSubmenu = (props: SelectSubmenuProps) => {
  const selectTools = [
    { id: 'select', icon: MousePointer, label: 'Seletor' },
    { id: 'node', icon: MousePointer, label: 'Ferramenta de Nó' },
    { id: 'move', icon: Move, label: 'Mover' },
    { id: 'comment', icon: MessageCircle, label: 'Comentário' },
  ];

  return (
    <ToolSubmenu
      {...props}
      tools={selectTools}
      title="Ferramentas de Seleção"
    />
  );
};
