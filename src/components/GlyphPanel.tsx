
import React, { useRef, useEffect, useState } from 'react';
import { GlyphPanelHeader } from './glyph/GlyphPanelHeader';
import { FontSelector } from './glyph/FontSelector';
import { CategorySelector, categoryData } from './glyph/CategorySelector';
import { GlyphSearch } from './glyph/GlyphSearch';
import { GlyphGrid } from './glyph/GlyphGrid';

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

  const handleGlyphSelect = (glyph: string) => {
    console.log('🔤 [GLYPH PANEL] Glyph selected:', glyph, 'Font:', selectedFont, 'Weight:', selectedWeight);
    // TODO: Implement glyph insertion functionality
  };

  // Filter glyphs based on search and category
  const filteredGlyphs = categoryData[selectedCategory]?.glyphs.filter(glyph => 
    searchTerm === '' || glyph.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Handle dropdowns
  const handleFontDropdownToggle = () => {
    setShowFontDropdown(!showFontDropdown);
    setShowWeightDropdown(false);
    setShowCategoryDropdown(false);
  };

  const handleWeightDropdownToggle = () => {
    setShowWeightDropdown(!showWeightDropdown);
    setShowFontDropdown(false);
    setShowCategoryDropdown(false);
  };

  const handleCategoryDropdownToggle = () => {
    setShowCategoryDropdown(!showCategoryDropdown);
    setShowFontDropdown(false);
    setShowWeightDropdown(false);
  };

  const handleFontChange = (font: string) => {
    setSelectedFont(font);
    setShowFontDropdown(false);
  };

  const handleWeightChange = (weight: string) => {
    setSelectedWeight(weight);
    setShowWeightDropdown(false);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setShowCategoryDropdown(false);
  };

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
      className="fixed z-[500] animate-scale-in"
      style={{
        left: position.x,
        top: position.y
      }}
      data-glyph-panel
    >
      <div className="floating-module w-96 overflow-hidden">
        <GlyphPanelHeader onClose={onClose} />
        
        <div className="p-5 space-y-6">
          <FontSelector
            selectedFont={selectedFont}
            selectedWeight={selectedWeight}
            onFontChange={handleFontChange}
            onWeightChange={handleWeightChange}
            showFontDropdown={showFontDropdown}
            showWeightDropdown={showWeightDropdown}
            onToggleFontDropdown={handleFontDropdownToggle}
            onToggleWeightDropdown={handleWeightDropdownToggle}
          />

          <CategorySelector
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            showCategoryDropdown={showCategoryDropdown}
            onToggleCategoryDropdown={handleCategoryDropdownToggle}
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
    </div>
  );
};
