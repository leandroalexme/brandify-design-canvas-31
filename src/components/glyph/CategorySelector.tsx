
import React from 'react';
import { ChevronDown } from 'lucide-react';

interface CategoryData {
  icon: string;
  glyphs: string[];
}

interface CategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  showCategoryDropdown: boolean;
  onToggleCategoryDropdown: () => void;
}

export const categoryData: Record<string, CategoryData> = {
  'All': { 
    icon: '🔤', 
    glyphs: ['!', '"', '#', '$', '%', '&', '(', ')', '*', '+', ',', '-', '.', '/', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>', '?', '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '_', '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'] 
  },
  'Symbols': { 
    icon: '🔣', 
    glyphs: ['!', '"', '#', '$', '%', '&', '*', '+', '-', '/', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '`'] 
  },
  'Numbers': { 
    icon: '🔢', 
    glyphs: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] 
  },
  'Punctuation': { 
    icon: '❓', 
    glyphs: ['.', ',', ';', ':', '(', ')', '!', '?'] 
  },
  'Uppercase': { 
    icon: '🔠', 
    glyphs: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'] 
  },
  'Lowercase': { 
    icon: '🔡', 
    glyphs: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'] 
  }
};

export const CategorySelector = ({
  selectedCategory,
  onCategoryChange,
  showCategoryDropdown,
  onToggleCategoryDropdown
}: CategorySelectorProps) => {
  const categories = Object.keys(categoryData);

  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
        Categoria
      </label>
      <div className="relative">
        <button
          onClick={onToggleCategoryDropdown}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-700/40 
                   hover:bg-slate-600/60 border border-slate-600/30 hover:border-slate-500/50
                   text-slate-200 text-sm transition-all duration-150"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">{categoryData[selectedCategory]?.icon}</span>
            <span className="font-medium">{selectedCategory}</span>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showCategoryDropdown ? 'rotate-180' : ''}`} />
        </button>
        
        {showCategoryDropdown && (
          <div className="absolute top-full mt-2 w-full bg-slate-800/95 backdrop-blur-sm rounded-xl 
                        border border-slate-600/40 shadow-2xl p-2 z-10 animate-scale-in">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  onCategoryChange(category);
                }}
                className={`w-full text-left p-3 rounded-lg text-sm transition-all duration-150 ${
                  selectedCategory === category 
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' 
                    : 'text-slate-200 hover:bg-slate-700/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{categoryData[category]?.icon}</span>
                  <span className="font-medium">{category}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
