
import React, { useState } from 'react';
import { PanelContainer } from './ui/PanelContainer';
import { MarginGuides } from './MarginGuides';

interface AlignmentPanelProps {
  onClose: () => void;
}

export const AlignmentPanel = ({ onClose }: AlignmentPanelProps) => {
  // Margin states
  const [marginTop, setMarginTop] = useState('10');
  const [marginRight, setMarginRight] = useState('10');
  const [marginBottom, setMarginBottom] = useState('10');
  const [marginLeft, setMarginLeft] = useState('30');
  const [presetEnabled, setPresetEnabled] = useState(false);

  const handleMarginChange = (margin: 'top' | 'right' | 'bottom' | 'left' | 'center', value: string) => {
    switch (margin) {
      case 'top':
        setMarginTop(value);
        break;
      case 'right':
        setMarginRight(value);
        break;
      case 'bottom':
        setMarginBottom(value);
        break;
      case 'left':
        setMarginLeft(value);
        break;
    }
  };

  return (
    <PanelContainer
      isOpen={true}
      onClose={onClose}
      title="Guides Grid"
      position={{ x: window.innerWidth - 384 - 24, y: window.innerHeight - 400 - 100 }}
      width={384}
      height={400}
      isDraggable={true}
    >
      <div className="panel-scrollable-unified h-full">
        <div className="panel-section-unified">
          <MarginGuides
            marginTop={marginTop}
            marginRight={marginRight}
            marginBottom={marginBottom}
            marginLeft={marginLeft}
            centerSpacing=""
            presetEnabled={presetEnabled}
            onMarginChange={handleMarginChange}
            onPresetToggle={() => setPresetEnabled(!presetEnabled)}
          />
        </div>
      </div>
    </PanelContainer>
  );
};
