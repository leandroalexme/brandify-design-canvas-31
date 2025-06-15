
import Konva from 'konva';
import { DesignElement } from '../types/design';

export const createDesignElementFromKonva = (
  konvaObj: Konva.Shape | Konva.Text, 
  type: DesignElement['type'],
  fallbackColor: string
): Omit<DesignElement, 'id' | 'selected'> => {
  const commonProps = {
    x: konvaObj.x(),
    y: konvaObj.y(),
    rotation: konvaObj.rotation() || 0,
    visible: konvaObj.visible(),
    opacity: konvaObj.opacity() || 1,
  };

  switch (type) {
    case 'shape':
      return {
        ...commonProps,
        type: 'shape',
        width: konvaObj.width() || 100,
        height: konvaObj.height() || 100,
        color: (konvaObj as Konva.Shape).fill() as string || fallbackColor,
      };

    case 'text':
      const textObj = konvaObj as Konva.Text;
      return {
        ...commonProps,
        type: 'text',
        content: textObj.text() || 'Texto',
        fontSize: textObj.fontSize() || 24,
        fontFamily: textObj.fontFamily() || 'Inter',
        fontWeight: textObj.fontStyle() || 'normal',
        color: textObj.fill() as string || fallbackColor,
      };

    case 'drawing':
      const circleObj = konvaObj as Konva.Circle;
      return {
        ...commonProps,
        type: 'drawing',
        width: (circleObj.radius() || 2) * 2,
        height: (circleObj.radius() || 2) * 2,
        color: circleObj.fill() as string || fallbackColor,
      };

    default:
      return commonProps as any;
  }
};
