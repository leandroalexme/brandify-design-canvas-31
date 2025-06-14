
import React, { useState } from 'react';
import { Percent } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface ColumnGuidesProps {
  type: 'columns' | 'lines';
  columnCount: string;
  spacing: string;
  width: string;
  filledMode: boolean;
  onColumnCountChange: (value: string) => void;
  onSpacingChange: (value: string) => void;
  onWidthChange: (value: string) => void;
  onFilledModeToggle: () => void;
}

export const ColumnGuides = ({
  type,
  columnCount,
  spacing,
  width,
  filledMode,
  onColumnCountChange,
  onSpacingChange,
  onWidthChange,
  onFilledModeToggle,
}: ColumnGuidesProps) => {
  return (
    <div className="bg-slate-800/30 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium text-slate-200">Colunas Guias</h4>
          {type === 'lines' && (
            <span className="px-2 py-0.5 text-xs bg-slate-700 text-slate-300 rounded">
              Linhas
            </span>
          )}
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors">
              <Percent className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Proporção não travada</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Visual Column Diagram */}
      <div className="relative">
        <div className="w-full h-24 bg-slate-700/30 rounded-lg border border-slate-600/40 relative flex items-center justify-center p-2">
          {/* Column visualization */}
          <div className="flex items-center justify-center gap-1 w-full h-full">
            {[...Array(parseInt(columnCount) || 3)].map((_, i) => (
              <div
                key={i}
                className="flex-1 h-full bg-blue-500/60 rounded-sm border border-blue-400/40"
                style={{ maxWidth: '20px' }}
              />
            ))}
          </div>
          
          {/* Column Count Input */}
          <input
            type="text"
            value={columnCount}
            onChange={(e) => onColumnCountChange(e.target.value)}
            className="absolute top-1 left-2 w-8 px-1 py-0.5 text-xs bg-blue-500 text-white rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-400"
            placeholder="3"
          />
          
          {/* Spacing Input */}
          <div className="absolute top-1 left-12 flex items-center gap-1">
            <input
              type="text"
              value={spacing}
              onChange={(e) => onSpacingChange(e.target.value)}
              className="w-8 px-1 py-0.5 text-xs bg-blue-500 text-white rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-400"
              placeholder="2"
            />
            <span className="text-xs text-slate-400">Espaço</span>
          </div>
          
          {/* Width Input */}
          <input
            type="text"
            value={width}
            onChange={(e) => onWidthChange(e.target.value)}
            className="absolute bottom-1 right-2 w-12 px-1 py-0.5 text-xs bg-blue-500 text-white rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-400"
            placeholder="10px"
          />
        </div>
      </div>

      {/* Filled Mode Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-300">Filled</span>
        <Switch
          checked={filledMode}
          onCheckedChange={onFilledModeToggle}
        />
      </div>
    </div>
  );
};
