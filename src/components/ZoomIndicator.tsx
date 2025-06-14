
import React from 'react';

interface ZoomIndicatorProps {
  zoom: number;
}

export const ZoomIndicator = ({ zoom }: ZoomIndicatorProps) => {
  return (
    <div className="zoom-indicator">
      {zoom}%
    </div>
  );
};
