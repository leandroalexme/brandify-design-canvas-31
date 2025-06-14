
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
  const getLineStyles = (side: MarginSide) => {
    const isActive = selectedMargin === side;
    const baseStyle = {
      position: 'absolute' as const,
      transition: 'all 0.3s ease',
      borderRadius: '4px',
    };

    if (!isActive) {
      return {
        ...baseStyle,
        backgroundColor: 'rgba(148, 163, 184, 0.3)',
      };
    }

    // Active gradient styles
    const gradientColor = guideColor || '#6366f1';
    switch (side) {
      case 'top':
        return {
          ...baseStyle,
          background: `linear-gradient(90deg, transparent 0%, ${gradientColor} 50%, transparent 100%)`,
          boxShadow: `0 0 8px ${gradientColor}40`,
        };
      case 'right':
        return {
          ...baseStyle,
          background: `linear-gradient(180deg, transparent 0%, ${gradientColor} 50%, transparent 100%)`,
          boxShadow: `0 0 8px ${gradientColor}40`,
        };
      case 'bottom':
        return {
          ...baseStyle,
          background: `linear-gradient(90deg, transparent 0%, ${gradientColor} 50%, transparent 100%)`,
          boxShadow: `0 0 8px ${gradientColor}40`,
        };
      case 'left':
        return {
          ...baseStyle,
          background: `linear-gradient(180deg, transparent 0%, ${gradientColor} 50%, transparent 100%)`,
          boxShadow: `0 0 8px ${gradientColor}40`,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <div className="relative bg-slate-700/30 rounded-2xl flex items-center justify-center" style={{ width: '280px', height: '280px', padding: '60px' }}>
      {/* Top Margin Input */}
      <div className="absolute" style={{ top: '20px', left: '50%', transform: 'translateX(-50%)' }}>
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
      <div className="absolute" style={{ left: '20px', top: '50%', transform: 'translateY(-50%)' }}>
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
      <div className="absolute" style={{ right: '20px', top: '50%', transform: 'translateY(-50%)' }}>
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
      <div className="absolute" style={{ bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
        <SpinnerInput 
          value={marginBottom} 
          onChange={value => onInputChange('bottom', value)} 
          onClick={() => onMarginClick('bottom')} 
          onSpinner={direction => onSpinner('bottom', direction)} 
          isSelected={selectedMargin === 'bottom'} 
          position="bottom" 
        />
      </div>

      {/* Connection Lines */}
      {/* Top Line */}
      <div 
        style={{
          ...getLineStyles('top'),
          top: '74px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80px',
          height: selectedMargin === 'top' ? '3px' : '2px',
        }}
      />
      
      {/* Right Line */}
      <div 
        style={{
          ...getLineStyles('right'),
          right: '74px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: selectedMargin === 'right' ? '3px' : '2px',
          height: '80px',
        }}
      />
      
      {/* Bottom Line */}
      <div 
        style={{
          ...getLineStyles('bottom'),
          bottom: '74px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80px',
          height: selectedMargin === 'bottom' ? '3px' : '2px',
        }}
      />
      
      {/* Left Line */}
      <div 
        style={{
          ...getLineStyles('left'),
          left: '74px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: selectedMargin === 'left' ? '3px' : '2px',
          height: '80px',
        }}
      />

      {/* Central Square */}
      <div 
        className="rounded-2xl bg-slate-600/20 border-2 border-slate-600/30 transition-all duration-300"
        style={{ width: '120px', height: '120px' }}
      />
    </div>
  );
};
