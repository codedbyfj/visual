<script setup lang="ts">
import { inject, ref } from 'vue';
import { Accordion } from '@ark-ui/vue';
import { PropertyField } from '@craftile/editor/ui';
import { debounce } from 'perfect-debounce';
import useI18n from '../composables/i18n';
import { useState } from '../state';
import { persistThemeSettings as persistThemeSettingsApi } from '../api';
import { CRAFTILE_EDITOR } from '../plugin';
import { useCraftileEditor } from '../composables/useCraftileEditor';

const { t } = useI18n();
const { theme } = useState();
const editor = useCraftileEditor();

// Accumulator for pending setting changes
const pendingUpdates = ref<Record<string, any>>({});

const persistThemeSettings = debounce(async () => {
  if (!editor || Object.keys(pendingUpdates.value).length === 0) return;

  // Capture current updates and clear accumulator
  const updates = { ...pendingUpdates.value };
  pendingUpdates.value = {};

  const request = persistThemeSettingsApi(updates);

  request.onSuccess((html) => {
    if (html) {
      editor.preview.sendMessage('page.refresh', {
        html,
      });
    } else {
      // Full page reload if no HTML returned
      editor.preview.reload();
    }
  });

  request.onError((error) => {
    console.error('Failed to persist theme settings:', error);
    editor.ui.toast({
      type: 'error',
      title: 'Failed to save theme settings',
    });
  });

  await request.execute();
}, 500);

const updateSetting = (id: string, value: any) => {
  if (!theme.value) return;

  // Update local state immediately for UI responsiveness
  theme.value.settings[id] = value;

  // Accumulate the change in pending updates
  pendingUpdates.value[id] = value;

  // Trigger debounced save (will batch all changes in 500ms window)
  persistThemeSettings();
};
</script>

<template>
  <div class="h-full flex flex-col overflow-y-hidden z-[100] bg-zinc-950">
    <div class="flex-none h-14 flex items-center border-b border-white/5 px-6">
      <h2 class="text-sm font-bold uppercase tracking-widest text-zinc-400">{{ t('Theme Settings') }}</h2>
    </div>
    <div class="flex-1 overflow-y-auto custom-scrollbar">
      <div v-if="theme?.settingsSchema && theme.settingsSchema.length > 0">
        <Accordion.Root :value="theme.settingsSchema[0]?.name" collapsible>
          <Accordion.Item
            v-for="group in theme.settingsSchema"
            :key="group.name"
            :value="group.name"
            class="border-b border-white/5"
          >
            <Accordion.ItemTrigger
              class="w-full bg-zinc-950 z-10 cursor-pointer px-6 py-4 font-bold text-xs uppercase tracking-wider hover:bg-zinc-900 flex items-center justify-between text-zinc-300 transition-colors"
            >
              <span>{{ group.name }}</span>
              <Accordion.ItemIndicator
                class="text-zinc-500 transition-transform duration-200 data-[state=open]:rotate-180"
              >
                <i-heroicons-chevron-down class="w-3.5 h-3.5" />
              </Accordion.ItemIndicator>
            </Accordion.ItemTrigger>
            <Accordion.ItemContent class="px-6 py-4 space-y-6">
              <template v-for="setting in group.settings" :key="setting.id">
                <div v-if="setting.type === 'header'" class="border-t border-white/5 pt-4 mb-2">
                  <h3 class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{{ setting.label }}</h3>
                </div>
                <div v-else class="space-y-2">
                  <PropertyField
                    :field="setting"
                    :model-value="theme?.settings?.[setting.id] ?? setting.default"
                    @update:model-value="updateSetting(setting.id, $event)"
                  />
                </div>
              </template>
            </Accordion.ItemContent>
          </Accordion.Item>
        </Accordion.Root>
      </div>
      <div v-else class="p-12 text-sm text-zinc-600 text-center flex flex-col items-center justify-center gap-4">
        <i-heroicons-face-frown class="w-10 h-10 opacity-20" />
        <p>{{ t('No theme settings available') }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
</style>
