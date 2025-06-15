
export const keyframes = {
  'accordion-down': {
    from: {
      height: '0'
    },
    to: {
      height: 'var(--radix-accordion-content-height)'
    }
  },
  'accordion-up': {
    from: {
      height: 'var(--radix-accordion-content-height)'
    },
    to: {
      height: '0'
    }
  },
  'fade-in': {
    '0%': { opacity: '0', transform: 'translateY(10px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' }
  },
  'fade-out': {
    '0%': { opacity: '1', transform: 'translateY(0)' },
    '100%': { opacity: '0', transform: 'translateY(10px)' }
  },
  'scale-in': {
    '0%': { opacity: '0', transform: 'scale(0.95)' },
    '100%': { opacity: '1', transform: 'scale(1)' }
  },
  'scale-out': {
    '0%': { opacity: '1', transform: 'scale(1)' },
    '100%': { opacity: '0', transform: 'scale(0.95)' }
  },
  'slide-up': {
    '0%': { 
      opacity: '0', 
      transform: 'translateY(20px) scale(0.95)'
    },
    '100%': { 
      opacity: '1', 
      transform: 'translateY(0) scale(1)'
    }
  },
  'slide-down': {
    '0%': { 
      opacity: '0', 
      transform: 'translateY(-20px) scale(0.95)'
    },
    '100%': { 
      opacity: '1', 
      transform: 'translateY(0) scale(1)'
    }
  },
  'slide-left': {
    '0%': { 
      opacity: '0', 
      transform: 'translateX(20px) scale(0.95)'
    },
    '100%': { 
      opacity: '1', 
      transform: 'translateX(0) scale(1)'
    }
  },
  'slide-right': {
    '0%': { 
      opacity: '0', 
      transform: 'translateX(-20px) scale(0.95)'
    },
    '100%': { 
      opacity: '1', 
      transform: 'translateX(0) scale(1)'
    }
  },
  'bounce-in': {
    '0%': { 
      opacity: '0', 
      transform: 'scale(0.3)'
    },
    '50%': { 
      opacity: '1', 
      transform: 'scale(1.05)'
    },
    '70%': { 
      transform: 'scale(0.98)'
    },
    '100%': { 
      opacity: '1', 
      transform: 'scale(1)'
    }
  },
  'pulse-select': {
    '0%, 100%': { 
      transform: 'scale(1)',
      boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.7)'
    },
    '50%': { 
      transform: 'scale(1.02)',
      boxShadow: '0 0 0 8px rgba(59, 130, 246, 0)'
    }
  },
  'stagger-fade': {
    '0%': { 
      opacity: '0', 
      transform: 'translateY(10px)'
    },
    '100%': { 
      opacity: '1', 
      transform: 'translateY(0)'
    }
  }
} as const;

export const animation = {
  'accordion-down': 'accordion-down 0.2s ease-out',
  'accordion-up': 'accordion-up 0.2s ease-out',
  'fade-in': 'fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  'fade-out': 'fade-out 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  'scale-in': 'scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
  'scale-out': 'scale-out 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
  'slide-up': 'slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  'slide-down': 'slide-down 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  'slide-left': 'slide-left 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  'slide-right': 'slide-right 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  'bounce-in': 'bounce-in 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
  'pulse-select': 'pulse-select 1.5s infinite',
  'stagger-fade': 'stagger-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
} as const;
