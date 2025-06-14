
export interface MarginGuidesProps {
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;
  centerSpacing: string;
  presetEnabled: boolean;
  onMarginChange: (margin: 'top' | 'right' | 'bottom' | 'left' | 'center', value: string) => void;
  onPresetToggle: () => void;
}

export type MarginSide = 'top' | 'right' | 'bottom' | 'left';

export interface MarginPresetConfig {
  top: string;
  right: string;
  bottom: string;
  left: string;
}

export const PRESETS: Record<string, MarginPresetConfig | null> = {
  personalizado: null,
  padrao: { top: '20', right: '20', bottom: '20', left: '20' },
  compacto: { top: '10', right: '10', bottom: '10', left: '10' },
  espacoso: { top: '40', right: '40', bottom: '40', left: '40' },
  semMargem: { top: '0', right: '0', bottom: '0', left: '0' },
};
