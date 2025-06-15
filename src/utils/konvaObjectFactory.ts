
import Konva from 'konva';
import { DesignElement } from '../types/design';

export const createKonvaObject = (element: DesignElement): Konva.Shape | Konva.Text | null => {
  const commonProps = {
    x: element.x,
    y: element.y,
    rotation: element.rotation || 0,
    opacity: element.opacity || 1,
    visible: element.visible !== false,
    draggable: true,
  };

  switch (element.type) {
    case 'shape':
      return new Konva.Rect({
        ...commonProps,
        width: element.width || 100,
        height: element.height || 100,
        fill: element.color,
      });

    case 'text':
      return new Konva.Text({
        ...commonProps,
        text: element.content || 'Texto',
        fontSize: element.fontSize || 24,
        fontFamily: element.fontFamily || 'Inter',
        fontStyle: element.fontWeight || 'normal',
        fill: element.color,
      });

    case 'drawing':
      return new Konva.Circle({
        ...commonProps,
        radius: (element.width || 4) / 2,
        fill: element.color,
      });

    default:
      return null;
  }
};
