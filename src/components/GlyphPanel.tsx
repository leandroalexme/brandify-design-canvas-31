
import React, { useRef, useEffect, useState } from 'react';
import { FileType } from 'lucide-react';
import { StandardPanelHeader } from './panels/StandardPanelHeader';
import { StandardDropdown } from './panels/StandardDropdown';
import { GlyphSearch } from './glyph/GlyphSearch';
import { GlyphGrid } from './glyph/GlyphGrid';
import { categoryData } from './glyph/CategorySelector';
import { PanelPositioningSystem } from '../utils/panelPositioning';

interface GlyphPanelProps {
  isOpen: boolean;
  onClose: () => void;
  position?: { x: number; y: number };
}

export const GlyphPanel = ({ 
  isOpen, 
  onClose, 
  position = { x: 500, y: 200 }
}: GlyphPanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [selectedFont, setSelectedFont] = useState('Inter');
  const [selectedWeight, setSelectedWeight] = useState('Regular');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showWeightDropdown, setShowWeightDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [finalPosition, setFinalPosition] = useState(position);

  // Calculate optimal positioning
  useEffect(() => {
    if (isOpen) {
      const optimalPos = PanelPositioningSystem.calculateOptimalPosition(
        position,
        { width: 320, height: 500 },
        'top'
      );
      setFinalPosition(optimalPos);
    }
  }, [isOpen, position]);

  const handleGlyphSelect = (glyph: string) => {
    console.log('🔤 [GLYPH PANEL] Glyph selected:', glyph, 'Font:', selectedFont, 'Weight:', selectedWeight);
    // TODO: Implement glyph insertion functionality
  };

  // Filter glyphs based on search and category
  const filteredGlyphs = categoryData[selectedCategory]?.glyphs.filter(glyph => 
    searchTerm === '' || glyph.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Font options
  const fontOptions = [
    { value: 'Inter', label: 'Inter', description: 'Sans Serif' },
    { value: 'Roboto', label: 'Roboto', description: 'Sans Serif' },
    { value: 'Arial', label: 'Arial', description: 'Sans Serif' },
    { value: 'Times New Roman', label: 'Times New Roman', description: 'Serif' },
    { value: 'Georgia', label: 'Georgia', description: 'Serif' }
  ];

  const weightOptions = [
    { value: 'Light', label: 'Light' },
    { value: 'Regular', label: 'Regular' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Semi Bold', label: 'Semi Bold' },
    { value: 'Bold', label: 'Bold' },
    { value: 'Extra Bold', label: 'Extra Bold' }
  ];

  // Fix: Create category options using the key as both value and label
  const categoryOptions = Object.keys(categoryData).map(key => ({
    value: key,
    label: key
  }));

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={panelRef}
      className="panel-container animate-scale-in-60fps"
      style={{
        left: finalPosition.x,
        top: finalPosition.y
      }}
      data-glyph-panel
    >
      <StandardPanelHeader 
        title="Glyph Browser"
        icon={FileType}
        iconColor="text-orange-400"
        onClose={onClose}
      />
      
      <div className="panel-content">
        <StandardDropdown
          label="Família da Fonte"
          value={selectedFont}
          options={fontOptions}
          isOpen={showFontDropdown}
          onToggle={() => {
            setShowFontDropdown(!showFontDropdown);
            setShowWeightDropdown(false);
            setShowCategoryDropdown(false);
          }}
          onSelect={(font) => {
            setSelectedFont(font);
            setShowFontDropdown(false);
          }}
        />

        <StandardDropdown
          label="Peso da Fonte"
          value={selectedWeight}
          options={weightOptions}
          isOpen={showWeightDropdown}
          onToggle={() => {
            setShowWeightDropdown(!showWeightDropdown);
            setShowFontDropdown(false);
            setShowCategoryDropdown(false);
          }}
          onSelect={(weight) => {
            setSelectedWeight(weight);
            setShowWeightDropdown(false);
          }}
        />

        <StandardDropdown
          label="Categoria"
          value={selectedCategory}
          options={categoryOptions}
          isOpen={showCategoryDropdown}
          onToggle={() => {
            setShowCategoryDropdown(!showCategoryDropdown);
            setShowFontDropdown(false);
            setShowWeightDropdown(false);
          }}
          onSelect={(category) => {
            setSelectedCategory(category);
            setShowCategoryDropdown(false);
          }}
        />

        <GlyphSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <GlyphGrid
          glyphs={filteredGlyphs}
          selectedFont={selectedFont}
          selectedWeight={selectedWeight}
          onGlyphSelect={handleGlyphSelect}
        />
      </div>
    </div>
  );
};
