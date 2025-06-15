
import React from 'react';
import { TextPropertiesSubmenu } from '../TextPropertiesSubmenu';
import { FontConfigPanel } from '../FontConfigPanel';
import { AlignmentConfigPanel } from '../AlignmentConfigPanel';
import { ColorConfigPanel } from '../ColorConfigPanel';
import { GlyphPanel } from '../GlyphPanel';

interface TextPanelsManagerProps {
  showTextPanel: boolean;
  showAlignmentPanel: boolean;
  showColorPanel: boolean;
  showGlyphPanel: boolean;
  showFontPanel: boolean;
  position: { x: number; y: number };
  onTextPanelClose: () => void;
  onAlignmentPanelClose: () => void;
  onColorPanelClose: () => void;
  onGlyphPanelClose: () => void;
  onFontPanelClose: () => void;
  onTextSubmenuToolSelect: (toolId: string) => void;
}

export const TextPanelsManager = ({
  showTextPanel,
  showAlignmentPanel,
  showColorPanel,
  showGlyphPanel,
  showFontPanel,
  position,
  onTextPanelClose,
  onAlignmentPanelClose,
  onColorPanelClose,
  onGlyphPanelClose,
  onFontPanelClose,
  onTextSubmenuToolSelect
}: TextPanelsManagerProps) => {
  return (
    <>
      <TextPropertiesSubmenu
        isOpen={showTextPanel}
        onClose={onTextPanelClose}
        onToolSelect={onTextSubmenuToolSelect}
        position={position}
      />

      {showTextPanel && (
        <>
          <FontConfigPanel
            isOpen={showFontPanel}
            onClose={onFontPanelClose}
            position={position}
          />

          <AlignmentConfigPanel
            isOpen={showAlignmentPanel}
            onClose={onAlignmentPanelClose}
            position={position}
          />

          <ColorConfigPanel
            isOpen={showColorPanel}
            onClose={onColorPanelClose}
            position={position}
          />

          <GlyphPanel
            isOpen={showGlyphPanel}
            onClose={onGlyphPanelClose}
            position={position}
          />
        </>
      )}
    </>
  );
};
