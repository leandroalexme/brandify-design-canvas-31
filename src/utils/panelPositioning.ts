
interface ViewportBounds {
  width: number;
  height: number;
}

interface PanelDimensions {
  width: number;
  height: number;
}

interface Position {
  x: number;
  y: number;
}

export class PanelPositioningSystem {
  private static readonly VIEWPORT_MARGIN = 16;
  private static readonly TOOLBAR_SPACING = 80;
  private static readonly PANEL_GAP = 20;
  
  private static getViewportBounds(): ViewportBounds {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  static calculateOptimalPosition(
    triggerPosition: Position,
    panelDimensions: PanelDimensions,
    preferredSide: 'top' | 'bottom' | 'left' | 'right' = 'top'
  ): Position {
    const viewport = this.getViewportBounds();
    const margin = this.VIEWPORT_MARGIN;
    
    let optimalPosition: Position = { x: 0, y: 0 };
    
    // Calculate position based on preferred side
    switch (preferredSide) {
      case 'top':
        optimalPosition.x = triggerPosition.x - (panelDimensions.width / 2);
        optimalPosition.y = triggerPosition.y - panelDimensions.height - this.TOOLBAR_SPACING;
        break;
      case 'bottom':
        optimalPosition.x = triggerPosition.x - (panelDimensions.width / 2);
        optimalPosition.y = triggerPosition.y + this.TOOLBAR_SPACING;
        break;
      case 'left':
        optimalPosition.x = triggerPosition.x - panelDimensions.width - this.PANEL_GAP;
        optimalPosition.y = triggerPosition.y - (panelDimensions.height / 2);
        break;
      case 'right':
        optimalPosition.x = triggerPosition.x + this.PANEL_GAP;
        optimalPosition.y = triggerPosition.y - (panelDimensions.height / 2);
        break;
    }
    
    // Ensure panel stays within viewport bounds
    optimalPosition.x = Math.max(margin, Math.min(optimalPosition.x, viewport.width - panelDimensions.width - margin));
    optimalPosition.y = Math.max(margin, Math.min(optimalPosition.y, viewport.height - panelDimensions.height - margin));
    
    return optimalPosition;
  }

  static calculateCascadedPosition(
    basePosition: Position,
    panelIndex: number,
    panelDimensions: PanelDimensions
  ): Position {
    const offset = panelIndex * (panelDimensions.width + this.PANEL_GAP);
    const viewport = this.getViewportBounds();
    
    let cascadedPosition = {
      x: basePosition.x + offset,
      y: basePosition.y
    };
    
    // If cascaded position goes off-screen, stack vertically instead
    if (cascadedPosition.x + panelDimensions.width > viewport.width - this.VIEWPORT_MARGIN) {
      cascadedPosition = {
        x: basePosition.x,
        y: basePosition.y + (panelIndex * (panelDimensions.height + this.PANEL_GAP))
      };
    }
    
    return cascadedPosition;
  }
}
