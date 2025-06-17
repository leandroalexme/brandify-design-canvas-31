
import React, { useRef, useCallback, memo, useState } from 'react';
import { ProfessionalCanvas } from './ProfessionalCanvas';
import { SvgEditor } from './SvgEditor';
import { MainToolbar } from './MainToolbar';
import { FloatingPropertiesPanel } from './FloatingPropertiesPanel';
import { LayersButton } from './LayersButton';
import { GridButton } from './GridButton';
import { ArtboardsButton } from './ArtboardsButton';
import { ZoomIndicator } from './ZoomIndicator';
import { EnhancedLayersPanel } from './EnhancedLayersPanel';
import { EnhancedAlignmentPanel } from './EnhancedAlignmentPanel';
import { ArtboardsPanel } from './ArtboardsPanel';
import { ErrorBoundary } from './ErrorBoundary';
import { LoadingSpinner } from './LoadingSpinner';
import { ToolType } from '../types/tools';
import { useIntegratedStudio } from '../hooks/useIntegratedStudio';
import { useTextCreation } from '../hooks/useTextCreation';
import { useProfessionalCanvas } from '../hooks/useProfessionalCanvas';

// Memoizar componentes pesados
const MemoizedProfessionalCanvas = memo(ProfessionalCanvas);
const MemoizedSvgEditor = memo(SvgEditor);
const MemoizedMainToolbar = memo(MainToolbar);
const MemoizedFloatingPropertiesPanel = memo(FloatingPropertiesPanel);

export const OptimizedBrandifyStudio = memo(() => {
  const studio = useIntegratedStudio();
  const [showEnhancedLayers, setShowEnhancedLayers] = useState(false);
  const [showEnhancedAlignment, setShowEnhancedAlignment] = useState(false);
  const [gridEnabled, setGridEnabled] = useState(false);
  const [snapEnabled, setSnapEnabled] = useState(false);
  const [editorMode, setEditorMode] = useState<'konva' | 'svg'>('konva');
  
  const professionalCanvas = useProfessionalCanvas();
  
  const { createTextElement } = useTextCreation({
    selectedTool: studio.toolState.selectedTool,
    selectedColor: studio.toolState.selectedColor,
    addElement: studio.addElement
  });

  const canvasRef = useRef<HTMLDivElement>(null);

  // Log de performance otimizado
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 [ENHANCED STUDIO] State:', {
        selectedTool: studio.toolState.selectedTool,
        elementsCount: studio.elementsCount,
        editorMode,
        hasAnyPanelOpen: studio.hasAnyPanelOpen,
        currentToolInfo: studio.currentToolInfo,
        interactionMode: studio.interactionMode,
        shortcutsCount: studio.shortcuts.length,
        fabricEnabled: true,
        enhancedFeaturesEnabled: true,
        timestamp: new Date().toISOString()
      });
    }
  }, [studio.toolState.selectedTool, studio.elementsCount, editorMode, studio.hasAnyPanelOpen, studio.currentToolInfo, studio.interactionMode, studio.shortcuts.length]);

  // Mapear ferramentas para o Canvas com cache
  const getCanvasToolType = useCallback((tool: ToolType): 'select' | 'pen' | 'shapes' | 'text' => {
    if (tool === 'select' || tool === 'pen' || tool === 'shapes' || tool === 'text') {
      return tool;
    }
    
    switch (tool) {
      case 'node':
      case 'move':
      case 'comment':
        return 'select';
      case 'brush':
      case 'pencil':
        return 'pen';
      default:
        return 'select';
    }
  }, []);

  // Handlers otimizados com useCallback
  const handleColorSelect = useCallback((color: string) => {
    studio.updateToolState({ selectedColor: color });
  }, [studio]);

  const handleShapeSelect = useCallback((shape: string | null) => {
    studio.updateUIState({ selectedShape: shape });
  }, [studio]);

  const handleCreateText = useCallback((x: number, y: number) => {
    createTextElement(x, y);
    studio.saveState('Create text');
  }, [createTextElement, studio]);

  const handleToggleTextPanel = useCallback(() => {
    studio.togglePanel('showTextPropertiesPanel');
  }, [studio]);

  // Enhanced handlers
  const handleLayersToggle = useCallback(() => {
    setShowEnhancedLayers(!showEnhancedLayers);
  }, [showEnhancedLayers]);

  const handleAlignmentToggle = useCallback(() => {
    setShowEnhancedAlignment(!showEnhancedAlignment);
  }, [showEnhancedAlignment]);

  const handleArtboardsToggle = useCallback(() => {
    studio.togglePanel('showArtboardsPanel');
  }, [studio]);

  const handleCloseFloatingPanel = useCallback(() => {
    studio.setSelectedElement(null);
  }, [studio]);

  // Professional canvas handlers
  const handleAlign = useCallback((alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    const selectedIds = studio.elements.filter(el => el.selected).map(el => el.id);
    if (selectedIds.length >= 2) {
      const updates = professionalCanvas.alignElements(selectedIds, studio.elements, alignment);
      updates.forEach(update => {
        if (update.id) {
          studio.updateElement(update.id, update);
        }
      });
      studio.saveState(`Align ${alignment}`);
    }
  }, [studio, professionalCanvas]);

  const handleDistribute = useCallback((direction: 'horizontal' | 'vertical') => {
    const selectedIds = studio.elements.filter(el => el.selected).map(el => el.id);
    if (selectedIds.length >= 3) {
      const updates = professionalCanvas.distributeElements(selectedIds, studio.elements, direction);
      updates.forEach(update => {
        if (update.id) {
          studio.updateElement(update.id, update);
        }
      });
      studio.saveState(`Distribute ${direction}`);
    }
  }, [studio, professionalCanvas]);

  const handleDeleteElement = useCallback((id: string) => {
    studio.deleteElement(id);
    studio.saveState('Delete element');
  }, [studio]);

  const handleCopyElement = useCallback((id: string) => {
    console.log('Copy element:', id);
  }, []);

  const handlePasteElement = useCallback(() => {
    console.log('Paste element');
  }, []);

  const mappedTool = getCanvasToolType(studio.toolState.selectedTool);
  const selectedElementIds = studio.elements.filter(el => el.selected).map(el => el.id);

  // Loading state
  if (!studio.elements && studio.elementsCount === 0) {
    return (
      <div className="h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" color="white" className="mx-auto mb-4" />
          <p className="text-slate-300">Carregando Editor Profissional...</p>
          <p className="text-slate-400 text-sm mt-2">Inicializando recursos avançados...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="h-screen bg-slate-900 overflow-hidden relative">
        <ZoomIndicator zoom={studio.toolState.zoom} />
        
        {/* Editor Mode Toggle */}
        <div className="absolute top-4 left-4 z-50">
          <div className="bg-slate-800 rounded-lg p-2 flex gap-2">
            <button
              onClick={() => setEditorMode('konva')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                editorMode === 'konva' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              Konva.js
            </button>
            <button
              onClick={() => setEditorMode('svg')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                editorMode === 'svg' 
                  ? 'bg-green-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              SVG.js
            </button>
          </div>
        </div>
        
        {/* Status bar para debug */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute top-2 right-2 z-50 text-xs text-slate-400 bg-slate-800/80 p-2 rounded">
            🎯 Enhanced Studio | Modo: {studio.interactionMode} | Editor: {editorMode} | Selecionados: {studio.selectedCount} | 
            Undo: {studio.canUndo ? '✅' : '❌'} | Redo: {studio.canRedo ? '✅' : '❌'} |
            Grid: {gridEnabled ? '✅' : '❌'} | Snap: {snapEnabled ? '✅' : '❌'}
          </div>
        )}
        
        <div ref={canvasRef}>
          {editorMode === 'konva' ? (
            <MemoizedProfessionalCanvas
              elements={studio.elements}
              selectedTool={mappedTool}
              selectedColor={studio.toolState.selectedColor}
              onAddElement={studio.addElement}
              onSelectElement={studio.selectElement}
              onUpdateElement={studio.updateElement}
              onDeleteElement={handleDeleteElement}
              onCopyElement={handleCopyElement}
              onPasteElement={handlePasteElement}
              onCreateText={handleCreateText}
              selectedShape={studio.uiState.selectedShape}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <MemoizedSvgEditor enabled={true} className="w-full max-w-4xl" />
            </div>
          )}
        </div>
        
        {editorMode === 'konva' && (
          <MemoizedMainToolbar 
            selectedTool={studio.toolState.selectedTool}
            onToolSelect={studio.handleToolSelect}
            selectedColor={studio.toolState.selectedColor}
            onColorSelect={handleColorSelect}
            selectedShape={studio.uiState.selectedShape}
            onShapeSelect={handleShapeSelect}
            onOpenTextPanel={handleToggleTextPanel}
            showTextPanel={studio.uiState.showTextPropertiesPanel}
          />
        )}
        
        {editorMode === 'konva' && (
          <>
            <LayersButton onClick={handleLayersToggle} />
            <GridButton onClick={handleAlignmentToggle} />
            <ArtboardsButton onClick={handleArtboardsToggle} />
          </>
        )}
        
        {showEnhancedLayers && (
          <EnhancedLayersPanel
            elements={studio.elements}
            onSelectElement={studio.selectElement}
            onUpdateElement={studio.updateElement}
            onDeleteElement={studio.deleteElement}
            onAddElement={studio.addElement}
            onClose={() => setShowEnhancedLayers(false)}
          />
        )}
        
        {showEnhancedAlignment && (
          <EnhancedAlignmentPanel
            onClose={() => setShowEnhancedAlignment(false)}
            selectedElements={selectedElementIds}
            onAlign={handleAlign}
            onDistribute={handleDistribute}
            onToggleGrid={() => setGridEnabled(!gridEnabled)}
            onToggleSnap={() => setSnapEnabled(!snapEnabled)}
            gridEnabled={gridEnabled}
            snapEnabled={snapEnabled}
          />
        )}
        
        {studio.uiState.showArtboardsPanel && (
          <ArtboardsPanel 
            onClose={() => studio.updateUIState({ showArtboardsPanel: false })} 
          />
        )}
        
        {studio.selectedElementData && editorMode === 'konva' && (
          <MemoizedFloatingPropertiesPanel
            selectedElement={studio.selectedElementData}
            onUpdateElement={studio.updateElement}
            onDeleteElement={studio.deleteElement}
            onClose={handleCloseFloatingPanel}
          />
        )}
      </div>
    </ErrorBoundary>
  );
});

OptimizedBrandifyStudio.displayName = 'OptimizedBrandifyStudio';
