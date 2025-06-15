
import React, { createContext, useContext, useCallback, useState } from 'react';
import { ToolType, UIState, ToolState } from '../types/tools';
import { DesignElement } from '../types/design';

interface EditorState {
  // Tool State
  toolState: ToolState;
  
  // UI State
  uiState: UIState;
  
  // Design Elements
  elements: DesignElement[];
  selectedElement: string | null;
}

interface EditorActions {
  // Tool Actions
  updateToolState: (updates: Partial<ToolState>) => void;
  
  // UI Actions
  updateUIState: (updates: Partial<UIState>) => void;
  
  // Element Actions
  addElement: (element: Omit<DesignElement, 'id' | 'selected'>) => void;
  updateElement: (id: string, updates: Partial<DesignElement>) => void;
  selectElement: (id: string | null) => void;
  deleteElement: (id: string) => void;
  setSelectedElement: (id: string | null) => void;
  
  // Combined Actions
  toggleTextPanel: () => void;
}

interface EditorContextType extends EditorState, EditorActions {}

const EditorContext = createContext<EditorContextType | null>(null);

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within EditorProvider');
  }
  return context;
};

interface EditorProviderProps {
  children: React.ReactNode;
}

export const EditorProvider = ({ children }: EditorProviderProps) => {
  console.log('📊 [EDITOR CONTEXT] Provider rendering');

  const [state, setState] = useState<EditorState>({
    toolState: {
      selectedTool: 'select',
      selectedColor: '#4285F4',
      zoom: 100
    },
    uiState: {
      showLayersPanel: false,
      showAlignmentPanel: false,
      showArtboardsPanel: false,
      showTextPropertiesPanel: false,
      selectedShape: null,
      textCreated: false
    },
    elements: [],
    selectedElement: null
  });

  // Tool Actions
  const updateToolState = useCallback((updates: Partial<ToolState>) => {
    console.log('📊 [EDITOR CONTEXT] Updating tool state:', updates);
    setState(prev => {
      const newState = {
        ...prev,
        toolState: { ...prev.toolState, ...updates }
      };
      console.log('📊 [EDITOR CONTEXT] New tool state:', newState.toolState);
      return newState;
    });
  }, []);

  // UI Actions
  const updateUIState = useCallback((updates: Partial<UIState>) => {
    console.log('📊 [EDITOR CONTEXT] Updating UI state:', updates);
    setState(prev => {
      const newState = {
        ...prev,
        uiState: { ...prev.uiState, ...updates }
      };
      console.log('📊 [EDITOR CONTEXT] New UI state:', newState.uiState);
      return newState;
    });
  }, []);

  // Element Actions
  const addElement = useCallback((element: Omit<DesignElement, 'id' | 'selected'>) => {
    console.log('📊 [EDITOR CONTEXT] Adding element:', element);
    const newElement: DesignElement = {
      ...element,
      id: Date.now().toString(),
      selected: false,
    };

    setState(prev => ({
      ...prev,
      elements: [...prev.elements, newElement]
    }));
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<DesignElement>) => {
    console.log('📊 [EDITOR CONTEXT] Updating element:', { id, updates });
    setState(prev => ({
      ...prev,
      elements: prev.elements.map(el => 
        el.id === id ? { ...el, ...updates } : el
      )
    }));
  }, []);

  const selectElement = useCallback((id: string | null) => {
    console.log('📊 [EDITOR CONTEXT] Selecting element:', id);
    setState(prev => ({
      ...prev,
      elements: prev.elements.map(el => ({ ...el, selected: el.id === id })),
      selectedElement: id
    }));
  }, []);

  const deleteElement = useCallback((id: string) => {
    console.log('📊 [EDITOR CONTEXT] Deleting element:', id);
    setState(prev => ({
      ...prev,
      elements: prev.elements.filter(el => el.id !== id),
      selectedElement: prev.selectedElement === id ? null : prev.selectedElement
    }));
  }, []);

  const setSelectedElement = useCallback((id: string | null) => {
    console.log('📊 [EDITOR CONTEXT] Setting selected element:', id);
    setState(prev => ({
      ...prev,
      selectedElement: id
    }));
  }, []);

  // Fixed toggleTextPanel function
  const toggleTextPanel = useCallback(() => {
    console.log('📊 [EDITOR CONTEXT] Toggling text panel');
    setState(prev => {
      const isTextPanelOpen = prev.uiState.showTextPropertiesPanel;
      const isTextToolActive = prev.toolState.selectedTool === 'text';
      
      console.log('📊 [EDITOR CONTEXT] Text panel state:', { 
        isTextPanelOpen, 
        isTextToolActive,
        currentTool: prev.toolState.selectedTool 
      });
      
      if (isTextPanelOpen && isTextToolActive) {
        // Fechar painel e voltar para select
        console.log('📊 [EDITOR CONTEXT] Closing text panel and returning to select');
        return {
          ...prev,
          toolState: { ...prev.toolState, selectedTool: 'select' },
          uiState: { ...prev.uiState, showTextPropertiesPanel: false }
        };
      } else {
        // Abrir painel e ativar ferramenta de texto
        console.log('📊 [EDITOR CONTEXT] Opening text panel and activating text tool');
        return {
          ...prev,
          toolState: { ...prev.toolState, selectedTool: 'text' },
          uiState: { ...prev.uiState, showTextPropertiesPanel: true }
        };
      }
    });
  }, []);

  const contextValue: EditorContextType = {
    ...state,
    updateToolState,
    updateUIState,
    addElement,
    updateElement,
    selectElement,
    deleteElement,
    setSelectedElement,
    toggleTextPanel
  };

  console.log('📊 [EDITOR CONTEXT] Current context value:', {
    toolState: state.toolState,
    uiState: state.uiState,
    elementsCount: state.elements.length,
    selectedElement: state.selectedElement
  });

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
};
