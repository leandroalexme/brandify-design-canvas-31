
import React, { useState } from 'react';
import { X, MoreHorizontal } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
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
    <TooltipProvider>
      <div className="fixed bottom-20 right-6 z-50 floating-module p-4 w-80 max-h-[calc(100vh-200px)] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-200">Guides Grid</h3>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Mais opções</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onClose}
                  className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Fechar painel</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Margin Guides Only */}
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
    </TooltipProvider>
  );
};
