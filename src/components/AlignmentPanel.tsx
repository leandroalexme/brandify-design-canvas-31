
import React, { useState, useRef, useCallback } from 'react';
import { X, Grid3X3, MoreHorizontal, Square, RectangleHorizontal, RectangleVertical, SeparatorHorizontal, SeparatorVertical } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

interface AlignmentPanelProps {
  onClose: () => void;
}

export const AlignmentPanel = ({ onClose }: AlignmentPanelProps) => {
  const [scaleLayout, setScaleLayout] = useState(true);
  const [limitScale, setLimitScale] = useState('3600');
  const [width, setWidth] = useState('1226');
  const [widthStretch, setWidthStretch] = useState('117');
  const [columnWidth, setColumnWidth] = useState('10');
  const [marginLeft, setMarginLeft] = useState('25');
  const [gutter, setGutter] = useState('0');
  const [padding, setPadding] = useState('0');
  const [marginBottom, setMarginBottom] = useState('0');
  const [marginRight, setMarginRight] = useState('20');
  const [guideStyle, setGuideStyle] = useState<'filled' | 'outline'>('outline');
  const [guideColor, setGuideColor] = useState('#3b82f6');

  const dragRefs = {
    limitScale: useRef<HTMLSpanElement>(null),
    width: useRef<HTMLSpanElement>(null),
    columnWidth: useRef<HTMLSpanElement>(null),
    marginLeft: useRef<HTMLSpanElement>(null),
    gutter: useRef<HTMLSpanElement>(null),
    padding: useRef<HTMLSpanElement>(null),
    marginBottom: useRef<HTMLSpanElement>(null),
    marginRight: useRef<HTMLSpanElement>(null),
  };

  const useDragToChange = (
    value: string,
    setValue: (value: string) => void,
    step: number = 1,
    min: number = 0,
    max: number = 9999
  ) => {
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      const startY = e.clientY;
      const startValue = parseInt(value) || 0;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const deltaY = (startY - moveEvent.clientY) * step;
        const newValue = Math.max(min, Math.min(max, startValue + deltaY));
        setValue(newValue.toString());
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'default';
      };

      document.body.style.cursor = 'ns-resize';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }, [value, setValue, step, min, max]);

    return handleMouseDown;
  };

  const dragHandlers = {
    limitScale: useDragToChange(limitScale, setLimitScale, 10),
    width: useDragToChange(width, setWidth, 5),
    columnWidth: useDragToChange(columnWidth, setColumnWidth, 1, 1),
    marginLeft: useDragToChange(marginLeft, setMarginLeft),
    gutter: useDragToChange(gutter, setGutter),
    padding: useDragToChange(padding, setPadding),
    marginBottom: useDragToChange(marginBottom, setMarginBottom),
    marginRight: useDragToChange(marginRight, setMarginRight),
  };

  return (
    <TooltipProvider>
      <div className="fixed bottom-20 right-6 z-50 floating-module p-4 w-80">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-slate-200">Guides Grid</h3>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>More options</p>
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
                <p>Close panel</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="space-y-4">
          {/* Scale Layout Toggle */}
          <div className="flex items-center justify-between">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-sm text-slate-300 cursor-help">Scale layout</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Automatically scale grid with zoom level</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setScaleLayout(!scaleLayout)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 ${
                    scaleLayout ? 'bg-blue-500' : 'bg-slate-600'
                  }`}
                  aria-label={`Scale layout ${scaleLayout ? 'enabled' : 'disabled'}`}
                  role="switch"
                  aria-checked={scaleLayout}
                >
                  <div
                    className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform duration-200 ${
                      scaleLayout ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle scale layout</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Limit Scale */}
          <div className="flex items-center justify-between">
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  ref={dragRefs.limitScale}
                  className="text-sm text-slate-300 cursor-ns-resize select-none hover:text-blue-400 transition-colors"
                  onMouseDown={dragHandlers.limitScale}
                >
                  Limit scale at
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Maximum scale limit (drag to adjust)</p>
              </TooltipContent>
            </Tooltip>
            <input
              type="text"
              value={limitScale}
              onChange={(e) => setLimitScale(e.target.value)}
              className="w-16 px-2 py-1 text-sm bg-slate-700/50 border border-slate-600/50 rounded text-blue-400 text-right focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="Limit scale value"
            />
          </div>

          {/* Width */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    ref={dragRefs.width}
                    className="text-sm text-slate-300 cursor-ns-resize select-none hover:text-blue-400 transition-colors"
                    onMouseDown={dragHandlers.width}
                  >
                    Width
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Grid width (drag to adjust)</p>
                </TooltipContent>
              </Tooltip>
              <span className="text-xs text-slate-500">Stretched {widthStretch}%</span>
            </div>
            <input
              type="text"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="w-16 px-2 py-1 text-sm bg-slate-700/50 border border-slate-600/50 rounded text-blue-400 text-right focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="Grid width"
            />
          </div>

          {/* Guide Style Options */}
          <div className="bg-slate-800/30 rounded-lg p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300">Guide Style</span>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setGuideStyle('outline')}
                      className={`p-1.5 rounded border transition-colors ${
                        guideStyle === 'outline'
                          ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                          : 'border-slate-600 text-slate-400 hover:text-slate-200'
                      }`}
                      aria-label="Outline style"
                    >
                      <Square className="w-3 h-3" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Outline style</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setGuideStyle('filled')}
                      className={`p-1.5 rounded border transition-colors ${
                        guideStyle === 'filled'
                          ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                          : 'border-slate-600 text-slate-400 hover:text-slate-200'
                      }`}
                      aria-label="Filled style"
                    >
                      <div className="w-3 h-3 bg-current rounded-sm" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Filled style</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300">Guide Color</span>
              <input
                type="color"
                value={guideColor}
                onChange={(e) => setGuideColor(e.target.value)}
                className="w-8 h-6 rounded border border-slate-600 bg-transparent cursor-pointer"
                aria-label="Guide color"
              />
            </div>
          </div>

          {/* Column Width Control */}
          <div className="bg-slate-800/30 rounded-lg p-4">
            <div className="flex items-center justify-center mb-3">
              <div className="flex items-center gap-3">
                <div className="flex gap-px">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-px h-8" style={{ backgroundColor: guideColor, opacity: guideStyle === 'filled' ? 1 : 0.6 }} />
                  ))}
                </div>
                <div className="flex flex-col items-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span
                        ref={dragRefs.columnWidth}
                        className="text-4xl font-bold text-blue-500 bg-transparent cursor-ns-resize select-none hover:text-blue-400 transition-colors"
                        onMouseDown={dragHandlers.columnWidth}
                      >
                        {columnWidth}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Column width (drag to adjust)</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex gap-px">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-px h-6" style={{ backgroundColor: guideColor, opacity: guideStyle === 'filled' ? 1 : 0.6 }} />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-xs mb-4">
              <span className="text-blue-500">Auto</span>
              <span className="text-blue-500">17</span>
            </div>

            {/* Spacing Controls */}
            <div className="grid grid-cols-5 gap-3">
              {/* Margin Left */}
              <div className="text-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-8 h-6 bg-slate-700/50 rounded border border-slate-600/50 mb-1 flex items-center justify-center cursor-help">
                      <SeparatorVertical className="w-3 h-3 text-slate-400" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Left margin</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      ref={dragRefs.marginLeft}
                      className="text-xs text-blue-400 cursor-ns-resize select-none hover:text-blue-300 transition-colors"
                      onMouseDown={dragHandlers.marginLeft}
                    >
                      {marginLeft}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Left margin (drag to adjust)</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Gutter */}
              <div className="text-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-8 h-6 bg-slate-700/50 rounded border border-slate-600/50 mb-1 flex items-center justify-center cursor-help">
                      <RectangleVertical className="w-3 h-3 text-slate-400" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Column gutter</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      ref={dragRefs.gutter}
                      className="text-xs text-blue-400 cursor-ns-resize select-none hover:text-blue-300 transition-colors"
                      onMouseDown={dragHandlers.gutter}
                    >
                      {gutter}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Column gutter (drag to adjust)</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Padding */}
              <div className="text-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-8 h-6 bg-slate-700/50 rounded border border-slate-600/50 mb-1 flex items-center justify-center cursor-help">
                      <Square className="w-3 h-3 text-slate-400" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Inner padding</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      ref={dragRefs.padding}
                      className="text-xs text-blue-400 cursor-ns-resize select-none hover:text-blue-300 transition-colors"
                      onMouseDown={dragHandlers.padding}
                    >
                      {padding}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Inner padding (drag to adjust)</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Margin Bottom */}
              <div className="text-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-8 h-6 bg-slate-700/50 rounded border border-slate-600/50 mb-1 flex items-center justify-center cursor-help">
                      <SeparatorHorizontal className="w-3 h-3 text-slate-400" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Bottom margin</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      ref={dragRefs.marginBottom}
                      className="text-xs text-blue-400 cursor-ns-resize select-none hover:text-blue-300 transition-colors"
                      onMouseDown={dragHandlers.marginBottom}
                    >
                      {marginBottom}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Bottom margin (drag to adjust)</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Margin Right */}
              <div className="text-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-8 h-6 bg-slate-700/50 rounded border border-slate-600/50 mb-1 flex items-center justify-center cursor-help">
                      <RectangleHorizontal className="w-3 h-3 text-slate-400" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Right margin</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      ref={dragRefs.marginRight}
                      className="text-xs text-blue-400 cursor-ns-resize select-none hover:text-blue-300 transition-colors"
                      onMouseDown={dragHandlers.marginRight}
                    >
                      {marginRight}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Right margin (drag to adjust)</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
