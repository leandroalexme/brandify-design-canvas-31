
interface DebugConfig {
  enabled: boolean;
  modules: {
    toolbar: boolean;
    canvas: boolean;
    elements: boolean;
    state: boolean;
    performance: boolean;
  };
}

const DEBUG_CONFIG: DebugConfig = {
  enabled: process.env.NODE_ENV === 'development',
  modules: {
    toolbar: false,
    canvas: false,
    elements: false,
    state: false,
    performance: false
  }
};

export class DebugLogger {
  private static isEnabled(module?: keyof DebugConfig['modules']): boolean {
    if (!DEBUG_CONFIG.enabled) return false;
    if (!module) return true;
    return DEBUG_CONFIG.modules[module];
  }

  static log(message: string, data?: any, module?: keyof DebugConfig['modules']) {
    if (this.isEnabled(module)) {
      console.log(`🔧 [${module?.toUpperCase() || 'DEBUG'}] ${message}`, data || '');
    }
  }

  static warn(message: string, data?: any, module?: keyof DebugConfig['modules']) {
    if (this.isEnabled(module)) {
      console.warn(`⚠️ [${module?.toUpperCase() || 'WARNING'}] ${message}`, data || '');
    }
  }

  static error(message: string, error?: any, module?: keyof DebugConfig['modules']) {
    if (this.isEnabled(module)) {
      console.error(`❌ [${module?.toUpperCase() || 'ERROR'}] ${message}`, error || '');
    }
  }

  static performance(label: string, fn: () => void, module?: keyof DebugConfig['modules']) {
    if (this.isEnabled(module)) {
      const start = performance.now();
      fn();
      const end = performance.now();
      console.log(`⚡ [PERFORMANCE] ${label}: ${(end - start).toFixed(2)}ms`);
    } else {
      fn();
    }
  }

  static enableModule(module: keyof DebugConfig['modules'], enabled: boolean = true) {
    DEBUG_CONFIG.modules[module] = enabled;
  }
}

export const debug = DebugLogger;
