
import { MousePointer, Pen, Circle, Type } from 'lucide-react';
import { MainTool } from '../../types/tools';

export interface MainToolConfig {
  id: MainTool;
  icon: any;
  label: string;
  hasSubmenu: boolean;
}

export const MAIN_TOOLS: MainToolConfig[] = [
  {
    id: 'select',
    icon: MousePointer,
    label: 'Select',
    hasSubmenu: false
  },
  {
    id: 'pen',
    icon: Pen,
    label: 'Pen',
    hasSubmenu: false
  },
  {
    id: 'shapes',
    icon: Circle,
    label: 'Shapes',
    hasSubmenu: false
  },
  {
    id: 'text',
    icon: Type,
    label: 'Text',
    hasSubmenu: false
  }
];
