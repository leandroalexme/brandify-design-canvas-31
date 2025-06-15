
export interface DesignElement {
  id: string;
  type: 'text' | 'shape' | 'drawing' | 'group';
  x: number;
  y: number;
  content?: string;
  color: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  width?: number;
  height?: number;
  rotation?: number;
  selected: boolean;
  // New layer properties
  visible?: boolean;
  locked?: boolean;
  opacity?: number;
  zIndex?: number;
  groupId?: string;
  children?: string[]; // For group elements
}

export interface LayerGroup {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  children: string[];
  expanded: boolean;
}
