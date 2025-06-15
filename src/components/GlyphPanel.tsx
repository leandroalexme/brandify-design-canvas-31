
import React from 'react';
import { PanelContainer } from './ui/PanelContainer';
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
  const [selectedFont, setSelectedFont] = React.useState('Inter');
  const [selectedWeight, setSelectedWeight] = React.useState('Regular');
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showFontDropdown, setShowFontDropdown] = React.useState(false);
  const [showWeightDropdown, setShowWeightDropdown] = React.useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = React.useState(false);

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

  return (
    <PanelContainer
      isOpen={isOpen}
      onClose={onClose}
      title="Glyphs"
      position={position}
      width={384}
      height={600}
      dataAttribute="data-glyph-panel"
      isDraggable={true}
    >
      <div className="panel-scrollable-unified h-full">
        <div className="panel-section-unified space-y-6">
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
    </PanelContainer>
  );
};
