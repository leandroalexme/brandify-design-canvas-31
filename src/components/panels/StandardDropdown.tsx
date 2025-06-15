
import React from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownOption {
  value: string;
  label: string;
  description?: string;
}

interface StandardDropdownProps {
  label: string;
  value: string;
  options: DropdownOption[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
  placeholder?: string;
}

export const StandardDropdown = ({
  label,
  value,
  options,
  isOpen,
  onToggle,
  onSelect,
  placeholder = "Selecionar..."
}: StandardDropdownProps) => {
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="panel-form-group">
      <label className="panel-label">{label}</label>
      <div className="relative">
        <button
          onClick={onToggle}
          className="panel-dropdown-trigger"
        >
          <div className="text-left flex-1">
            {selectedOption ? (
              <div>
                <div className="text-sm font-medium text-slate-200">{selectedOption.label}</div>
                {selectedOption.description && (
                  <div className="text-xs text-slate-400">{selectedOption.description}</div>
                )}
              </div>
            ) : (
              <div className="text-sm text-slate-500">{placeholder}</div>
            )}
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="panel-dropdown-menu">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => onSelect(option.value)}
                className={`panel-dropdown-option ${
                  value === option.value ? 'selected' : ''
                }`}
              >
                <div className="text-left">
                  <div className="text-sm font-medium">{option.label}</div>
                  {option.description && (
                    <div className="text-xs opacity-70">{option.description}</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
