<script setup lang="ts">
import { Menu } from '@ark-ui/vue/menu';
import { Button } from '@craftile/editor/ui';
import NProgress from 'nprogress';
import { useCraftileEditor } from '../composables/useCraftileEditor';
import { useState } from '../state';

const editor = useCraftileEditor();
const { currentTemplate, templates, theme, channel, locale, state } = useState();

function onSelect({ value }: { value: string }) {
  const template = templates.value.find((t) => t.template === value);

  if (template && editor) {
    if (state.pageData?.template !== value) {
      if (state.pageData) {
        state.pageData.template = value;
      }

      editor.engine.setPage({
        regions: [],
        blocks: {},
      });
    }

    NProgress.start();

    const frame = editor.preview.getFrame();
    if (!frame) return;

    const url = new URL(template.previewUrl);
    url.searchParams.set('_designMode', theme.value!.code as string);
    url.searchParams.set('channel', channel.value);
    url.searchParams.set('locale', locale.value);
    editor.preview.loadUrl(url.href);
  }
}
</script>

<template>
  <Menu.Root @select="onSelect" :positioning="{ gutter: 8, strategy: 'fixed', placement: 'bottom' }">
    <Menu.Trigger as-child>
      <button
        class="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 text-zinc-300 hover:text-white transition-all text-xs font-semibold"
      >
        <template v-if="currentTemplate">
          <span v-html="currentTemplate.icon" class="w-4 h-4 opacity-70"></span>
          <span class="max-w-[120px] truncate">{{ currentTemplate.label }}</span>
        </template>
        <template v-else-if="templates.length > 0">
          <span v-html="templates[0].icon" class="w-4 h-4 opacity-70"></span>
          <span class="max-w-[120px] truncate">{{ templates[0].label }}</span>
        </template>
        <template v-else> Select Template </template>
        <i-heroicons-chevron-down class="w-3 h-3 text-zinc-600" />
      </button>
    </Menu.Trigger>

    <Menu.Positioner class="z-[100]">
      <Menu.Content
        class="glass-panel min-w-[200px] p-2 flex flex-col gap-1 outline-none rounded-2xl data-[state=open]:animate-fade-in animation-duration-200"
      >
        <template v-for="t in templates" :key="t.template">
          <Menu.Separator v-if="t.template === '__separator__'" class="h-px bg-white/5 my-1" />
          <Menu.Item
            v-else
            :value="t.template"
            class="rounded-xl cursor-pointer flex items-center px-3 py-2.5 text-xs font-medium text-zinc-300 hover:bg-white/5 hover:text-white transition-colors outline-none data-[highlighted]:bg-white/5 data-[highlighted]:text-white"
          >
            <span v-html="t.icon" class="w-4 h-4 opacity-70 mr-2"></span>
            {{ t.label }}
          </Menu.Item>
        </template>
      </Menu.Content>
    </Menu.Positioner>
  </Menu.Root>
</template>
