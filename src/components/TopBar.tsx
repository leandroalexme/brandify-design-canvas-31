
import React from 'react';
import { Save, Share, Download, Undo, Redo } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const TopBar = () => {
  return (
    <div className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/50 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <h1 className="text-xl font-semibold text-slate-800">Brandify™ Studio</h1>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" className="rounded-full">
          <Undo className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" className="rounded-full">
          <Redo className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-slate-300 mx-2" />
        <Button variant="ghost" size="sm" className="rounded-full">
          <Save className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" className="rounded-full">
          <Share className="w-4 h-4" />
        </Button>
        <Button className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
};
