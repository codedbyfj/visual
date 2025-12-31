import type { PreloadedModels, Setting, Template, ThemeData, ThemeEditorConfig } from './types.d.ts';

declare global {
  interface Window {
    Alpine: any;
    Livewire: any;
    editorConfig: ThemeEditorConfig;

    themeData: ThemeData;
    templates: Template[];
    settingsSchema: { name: string; settings: Setting[] }[];
    preloadedModels: PreloadedModels;
    usedColors: string[];
  }
}
