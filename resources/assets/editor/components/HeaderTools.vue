<script setup lang="ts">
import { useCraftileEditor } from '../composables/useCraftileEditor';
import { useState } from '../state';

const editor = useCraftileEditor()!;
const { channel, locale, state } = useState();

function handleChannelChange(newChannel: string) {
  state.channel = newChannel;

  const channels = window.editorConfig.channels;
  const channelData = channels.find((c) => c.code === newChannel);

  if (channelData && !channelData.locales.find((l) => l.code === state.locale)) {
    state.locale = channelData.default_locale;
  }

  reloadPreview();
}

function handleLocaleChange(newLocale: string) {
  state.locale = newLocale;
  reloadPreview();
}

function reloadPreview() {
  const frame = editor.preview.getFrame();
  if (!frame) return;

  const currentUrl = new URL(frame.src);
  currentUrl.searchParams.set('channel', state.channel);
  currentUrl.searchParams.set('locale', state.locale);
  editor.preview.loadUrl(currentUrl.href);
}
</script>

<template>
  <div class="flex items-center gap-4 bg-zinc-900/50 p-1.5 rounded-2xl border border-white/5 shadow-inner">
    <TemplateSelector class="hover:bg-zinc-800 rounded-xl transition-colors" />

    <div class="w-px h-4 bg-white/10 mx-1"></div>

    <div class="flex items-center gap-2">
      <ChannelSelector
        :model-value="channel"
        @update:model-value="handleChannelChange"
        class="hover:bg-zinc-800 rounded-xl transition-colors"
      />

      <LocaleSelector
        :channel="channel"
        :model-value="locale"
        @update:model-value="handleLocaleChange"
        class="hover:bg-zinc-800 rounded-xl transition-colors"
      />
    </div>
  </div>
</template>
