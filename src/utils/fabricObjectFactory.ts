
import { FabricObject, Circle, Rect, IText } from 'fabric';
import { DesignElement } from '../types/design';

export const createFabricObject = (element: DesignElement): FabricObject | null => {
  switch (element.type) {
    case 'shape':
      return new Rect({
        left: element.x,
        top: element.y,
        width: element.width || 100,
        height: element.height || 100,
        fill: element.color,
        angle: element.rotation || 0,
      });

    case 'text':
      return new IText(element.content || 'Texto', {
        left: element.x,
        top: element.y,
        fill: element.color,
        fontSize: element.fontSize || 24,
        fontFamily: element.fontFamily || 'Inter',
        fontWeight: element.fontWeight || 'normal',
        angle: element.rotation || 0,
      });

    case 'drawing':
      return new Circle({
        left: element.x,
        top: element.y,
        radius: (element.width || 4) / 2,
        fill: element.color,
        angle: element.rotation || 0,
      });

    default:
      return null;
  }
};
