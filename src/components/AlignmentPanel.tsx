
import React, { useState } from 'react';
import { X, Grid3X3, Move, Ruler } from 'lucide-react';

interface AlignmentPanelProps {
  onClose: () => void;
}

export const AlignmentPanel = ({ onClose }: AlignmentPanelProps) => {
  const [scaleLayout, setScaleLayout] = useState(true);
  const [limitScale, setLimitScale] = useState('3600');
  const [width, setWidth] = useState('1024');
  const [gridSpacing, setGridSpacing] = useState('5');
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
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
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
              className="w-16 px-2 py-1 text-sm bg-slate-700/50 border border-slate-600/50 rounded text-blue-400 text-right"
            />
          </div>

          {/* Width */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-300">Width</span>
              <span className="text-xs text-slate-500">Stretched 140%</span>
            </div>
            <input
              type="text"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="w-16 px-2 py-1 text-sm bg-slate-700/50 border border-slate-600/50 rounded text-blue-400 text-right"
            />
          </div>

          {/* Grid Visualization */}
          <div className="bg-slate-800/30 rounded-lg p-4">
            <div className="flex items-center justify-center mb-3">
              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-px h-6 bg-slate-500" />
                  ))}
                </div>
                <span className="text-2xl font-bold text-blue-500">{gridSpacing}</span>
                <div className="flex flex-col gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-px h-4 bg-slate-500" />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-xs">
              <span className="text-blue-500">Auto</span>
              <span className="text-blue-500">44</span>
            </div>

            {/* Grid Options */}
            <div className="grid grid-cols-6 gap-2 mt-4">
              {['0', '0', '80', '0', '0', '80'].map((value, index) => (
                <div key={index} className="text-center">
                  <div className="w-8 h-6 bg-slate-700/50 rounded border border-slate-600/50 mb-1 flex items-center justify-center">
                    {index < 2 ? (
                      <div className="flex gap-px">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="w-px h-3 bg-slate-500" />
                        ))}
                      </div>
                    ) : (
                      <div className="w-4 h-3 border border-slate-500 rounded-sm" />
                    )}
                  </div>
                  <span className="text-xs text-blue-400">{value}</span>
                </div>
              ))}
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
