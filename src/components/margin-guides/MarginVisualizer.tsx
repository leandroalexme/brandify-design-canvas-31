
import React from 'react';
import { SpinnerInput } from './SpinnerInput';
import { MarginSide } from './types';

interface MarginVisualizerProps {
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;
  selectedMargin: MarginSide | null;
  guideColor: string;
  onMarginClick: (margin: MarginSide) => void;
  onInputChange: (margin: MarginSide, value: string) => void;
  onSpinner: (margin: MarginSide, direction: 'up' | 'down') => void;
}

export const MarginVisualizer = ({
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
  selectedMargin,
  guideColor,
  onMarginClick,
  onInputChange,
  onSpinner
}: MarginVisualizerProps) => {
  const getBorderStyle = () => {
    if (!selectedMargin) return 'border-2 border-slate-600/30';
    
    const baseStyle = 'border-2';
    switch (selectedMargin) {
      case 'top':
        return `${baseStyle} border-t-4 border-r-slate-600/30 border-b-slate-600/30 border-l-slate-600/30`;
      case 'right':
        return `${baseStyle} border-r-4 border-t-slate-600/30 border-b-slate-600/30 border-l-slate-600/30`;
      case 'bottom':
        return `${baseStyle} border-b-4 border-t-slate-600/30 border-r-slate-600/30 border-l-slate-600/30`;
      case 'left':
        return `${baseStyle} border-l-4 border-t-slate-600/30 border-r-slate-600/30 border-b-slate-600/30`;
      default:
        return `${baseStyle} border-slate-600/30`;
    }
  };

  const getGradientStyle = () => {
    if (!selectedMargin) return {};
    
    const gradientColor = `${guideColor}80`; // Adding transparency
    
    switch (selectedMargin) {
      case 'top':
        return {
          borderTopImage: `linear-gradient(90deg, transparent, ${gradientColor}, transparent)`,
          borderImageSlice: '1 0 0 0',
        };
      case 'right':
        return {
          borderRightImage: `linear-gradient(180deg, transparent, ${gradientColor}, transparent)`,
          borderImageSlice: '0 1 0 0',
        };
      case 'bottom':
        return {
          borderBottomImage: `linear-gradient(90deg, transparent, ${gradientColor}, transparent)`,
          borderImageSlice: '0 0 1 0',
        };
      case 'left':
        return {
          borderLeftImage: `linear-gradient(180deg, transparent, ${gradientColor}, transparent)`,
          borderImageSlice: '0 0 0 1',
        };
      default:
        return {};
    }
  };

  return (
    <div className="relative bg-slate-700/30 p-16 flex items-center justify-center my-0 rounded-2xl px-[42px] py-[47px]">
      {/* Top Margin Input */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <SpinnerInput 
          value={marginTop} 
          onChange={value => onInputChange('top', value)} 
          onClick={() => onMarginClick('top')} 
          onSpinner={direction => onSpinner('top', direction)} 
          isSelected={selectedMargin === 'top'} 
          position="top" 
        />
      </div>
      
      {/* Left Margin Input */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <SpinnerInput 
          value={marginLeft} 
          onChange={value => onInputChange('left', value)} 
          onClick={() => onMarginClick('left')} 
          onSpinner={direction => onSpinner('left', direction)} 
          isSelected={selectedMargin === 'left'} 
          position="left" 
        />
      </div>
      
      {/* Right Margin Input */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <SpinnerInput 
          value={marginRight} 
          onChange={value => onInputChange('right', value)} 
          onClick={() => onMarginClick('right')} 
          onSpinner={direction => onSpinner('right', direction)} 
          isSelected={selectedMargin === 'right'} 
          position="right" 
        />
      </div>
      
      {/* Bottom Margin Input */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <SpinnerInput 
          value={marginBottom} 
          onChange={value => onInputChange('bottom', value)} 
          onClick={() => onMarginClick('bottom')} 
          onSpinner={direction => onSpinner('bottom', direction)} 
          isSelected={selectedMargin === 'bottom'} 
          position="bottom" 
        />
      </div>

      {/* Central Square Canvas Area */}
      <div 
        className={`w-40 h-40 rounded-2xl bg-slate-600/20 transition-all duration-300 ${getBorderStyle()}`} 
        style={getGradientStyle()}
      />
    </div>
  );
};
