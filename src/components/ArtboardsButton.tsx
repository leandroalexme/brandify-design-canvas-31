
import React from 'react';
import { Layout } from 'lucide-react';

interface ArtboardsButtonProps {
  onClick: () => void;
}

export const ArtboardsButton = ({ onClick }: ArtboardsButtonProps) => {
  return (
    <button 
      className="control-button fixed top-6 right-6 z-40"
      title="Pranchetas"
      onClick={onClick}
    >
      <Layout className="w-5 h-5" />
    </button>
  );
};
