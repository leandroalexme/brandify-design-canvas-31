
import React, { useState } from 'react';
import { X, Grid3X3, Move, Ruler, MoreHorizontal } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('guides');

  const tabs = [
    { id: 'guides', label: 'Guides', icon: Ruler },
    { id: 'grid', label: 'Grid', icon: Grid3X3 },
    { id: 'snap', label: 'Snap', icon: Move },
    { id: 'sizes', label: 'Sizes', icon: Ruler },
  ];

  return (
    <div className="fixed bottom-20 right-6 z-50 floating-module p-4 w-80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-200">Guides Grid</h3>
        <div className="flex items-center gap-2">
          <button className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="grid grid-cols-4 gap-1 mb-4 p-1 bg-slate-800/30 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`p-2 rounded-md text-xs font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Guides Tab */}
      {activeTab === 'guides' && (
        <div className="space-y-4">
          {/* Scale Layout Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">Scale layout</span>
            <button
              onClick={() => setScaleLayout(!scaleLayout)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                scaleLayout ? 'bg-blue-500' : 'bg-slate-600'
              }`}
            >
              <div
                className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform duration-200 ${
                  scaleLayout ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Limit Scale */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">Limit scale at</span>
            <input
              type="text"
              value={limitScale}
              onChange={(e) => setLimitScale(e.target.value)}
              className="w-16 px-2 py-1 text-sm bg-slate-700/50 border border-slate-600/50 rounded text-blue-400 text-right focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Width */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-300">Width</span>
              <span className="text-xs text-slate-500">Stretched {widthStretch}%</span>
            </div>
            <input
              type="text"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="w-16 px-2 py-1 text-sm bg-slate-700/50 border border-slate-600/50 rounded text-blue-400 text-right focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Column Width Control */}
          <div className="bg-slate-800/30 rounded-lg p-4">
            <div className="flex items-center justify-center mb-3">
              <div className="flex items-center gap-3">
                <div className="flex gap-px">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-px h-8 bg-slate-500" />
                  ))}
                </div>
                <div className="flex flex-col items-center">
                  <input
                    type="text"
                    value={columnWidth}
                    onChange={(e) => setColumnWidth(e.target.value)}
                    className="w-12 text-center text-2xl font-bold text-blue-500 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
                  />
                </div>
                <div className="flex gap-px">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-px h-6 bg-slate-500" />
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
                <div className="w-8 h-6 bg-slate-700/50 rounded border border-slate-600/50 mb-1 flex items-center justify-center">
                  <div className="flex flex-col gap-px">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-3 h-px bg-slate-400" />
                    ))}
                  </div>
                </div>
                <input
                  type="text"
                  value={marginLeft}
                  onChange={(e) => setMarginLeft(e.target.value)}
                  className="w-full text-xs text-blue-400 bg-transparent text-center border-none focus:outline-none"
                />
              </div>

              {/* Gutter */}
              <div className="text-center">
                <div className="w-8 h-6 bg-slate-700/50 rounded border border-slate-600/50 mb-1 flex items-center justify-center">
                  <div className="flex gap-px">
                    <div className="flex flex-col gap-px">
                      <div className="w-px h-2 bg-slate-400" />
                      <div className="w-px h-2 bg-slate-400" />
                    </div>
                    <div className="w-2 h-4"></div>
                    <div className="flex flex-col gap-px">
                      <div className="w-px h-2 bg-slate-400" />
                      <div className="w-px h-2 bg-slate-400" />
                    </div>
                  </div>
                </div>
                <input
                  type="text"
                  value={gutter}
                  onChange={(e) => setGutter(e.target.value)}
                  className="w-full text-xs text-blue-400 bg-transparent text-center border-none focus:outline-none"
                />
              </div>

              {/* Padding */}
              <div className="text-center">
                <div className="w-8 h-6 bg-slate-700/50 rounded border border-slate-600/50 mb-1 flex items-center justify-center">
                  <div className="w-4 h-3 border border-slate-400 rounded-sm bg-slate-600/50"></div>
                </div>
                <input
                  type="text"
                  value={padding}
                  onChange={(e) => setPadding(e.target.value)}
                  className="w-full text-xs text-blue-400 bg-transparent text-center border-none focus:outline-none"
                />
              </div>

              {/* Margin Bottom */}
              <div className="text-center">
                <div className="w-8 h-6 bg-slate-700/50 rounded border border-slate-600/50 mb-1 flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-2 bg-slate-600/50 rounded-t"></div>
                    <div className="w-4 h-px bg-slate-400"></div>
                  </div>
                </div>
                <input
                  type="text"
                  value={marginBottom}
                  onChange={(e) => setMarginBottom(e.target.value)}
                  className="w-full text-xs text-blue-400 bg-transparent text-center border-none focus:outline-none"
                />
              </div>

              {/* Margin Right */}
              <div className="text-center">
                <div className="w-8 h-6 bg-slate-700/50 rounded border border-slate-600/50 mb-1 flex items-center justify-center">
                  <div className="flex items-center">
                    <div className="w-2 h-4 bg-slate-600/50 rounded-l"></div>
                    <div className="w-px h-4 bg-slate-400"></div>
                  </div>
                </div>
                <input
                  type="text"
                  value={marginRight}
                  onChange={(e) => setMarginRight(e.target.value)}
                  className="w-full text-xs text-blue-400 bg-transparent text-center border-none focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid Tab */}
      {activeTab === 'grid' && (
        <div className="space-y-4">
          <div className="text-center text-slate-400 text-sm py-8">
            Grid settings
          </div>
        </div>
      )}

      {/* Snap Tab */}
      {activeTab === 'snap' && (
        <div className="space-y-4">
          <div className="text-center text-slate-400 text-sm py-8">
            Snap settings
          </div>
        </div>
      )}

      {/* Sizes Tab */}
      {activeTab === 'sizes' && (
        <div className="space-y-4">
          <div className="text-center text-slate-400 text-sm py-8">
            Size settings
          </div>
        </div>
      )}
    </div>
  );
};
