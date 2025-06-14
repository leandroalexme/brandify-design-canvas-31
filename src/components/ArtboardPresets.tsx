
import React from 'react';
import { Smartphone, Monitor, Tablet, Square } from 'lucide-react';

interface ArtboardPreset {
  id: string;
  name: string;
  width: number;
  height: number;
  icon: React.ComponentType<any>;
}

interface ArtboardPresetsProps {
  onPresetSelect: (preset: ArtboardPreset) => void;
}

const presets: ArtboardPreset[] = [
  {
    id: 'instagram-stories',
    name: 'Stories Instagram',
    width: 1080,
    height: 1920,
    icon: Smartphone
  },
  {
    id: 'instagram-post',
    name: 'Post Instagram',
    width: 1080,
    height: 1080,
    icon: Square
  },
  {
    id: 'facebook-cover',
    name: 'Capa Facebook',
    width: 1640,
    height: 859,
    icon: Monitor
  },
  {
    id: 'linkedin-post',
    name: 'Post LinkedIn',
    width: 1200,
    height: 627,
    icon: Tablet
  }
];

export const ArtboardPresets = ({ onPresetSelect }: ArtboardPresetsProps) => {
  return (
    <div className="space-y-2 mb-4">
      {presets.map((preset) => {
        const IconComponent = preset.icon;
        return (
          <button
            key={preset.id}
            onClick={() => onPresetSelect(preset)}
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-700/50 transition-colors text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center text-slate-400 group-hover:text-slate-200 transition-colors">
                <IconComponent className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-slate-200">{preset.name}</span>
            </div>
            <span className="text-xs text-slate-400">{preset.width}×{preset.height}</span>
          </button>
        );
      })}
    </div>
  );
};
