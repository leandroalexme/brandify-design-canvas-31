
import React, { Suspense } from 'react';

// Lazy loading dos painéis para reduzir bundle inicial
const LayersPanel = React.lazy(() => import('./LayersPanel').then(module => ({ default: module.LayersPanel })));
const AlignmentPanel = React.lazy(() => import('./AlignmentPanel').then(module => ({ default: module.AlignmentPanel })));
const ArtboardsPanel = React.lazy(() => import('./ArtboardsPanel').then(module => ({ default: module.ArtboardsPanel })));
const FloatingPropertiesPanel = React.lazy(() => import('./FloatingPropertiesPanel').then(module => ({ default: module.FloatingPropertiesPanel })));

// Loading component otimizado
const PanelSkeleton = () => (
  <div className="floating-module animate-pulse">
    <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-slate-700 rounded w-1/2"></div>
  </div>
);

interface LazyPanelWrapperProps {
  children: React.ReactNode;
}

export const LazyPanelWrapper = ({ children }: LazyPanelWrapperProps) => (
  <Suspense fallback={<PanelSkeleton />}>
    {children}
  </Suspense>
);

export const LazyLayersPanel = LayersPanel;
export const LazyAlignmentPanel = AlignmentPanel;
export const LazyArtboardsPanel = ArtboardsPanel;
export const LazyFloatingPropertiesPanel = FloatingPropertiesPanel;
