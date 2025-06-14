
import React from 'react';
import { Grid3X3 } from 'lucide-react';

interface GridButtonProps {
  onClick: () => void;
}

export const GridButton = ({ onClick }: GridButtonProps) => {
  return (
    <button 
      className="control-button fixed bottom-6 right-6 z-40"
      title="Grade e Alinhamento"
      onClick={onClick}
    >
      <Grid3X3 className="w-5 h-5" />
    </button>
  );
};
