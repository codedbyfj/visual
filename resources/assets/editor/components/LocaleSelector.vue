<script setup lang="ts">
import { computed, watch, onBeforeMount } from 'vue';
import { Menu } from '@ark-ui/vue/menu';
import { Button } from '@craftile/editor/ui';
import useI18n from '../composables/i18n';

const props = defineProps<{ channel: string }>();

const { t } = useI18n();
const channels = window.editorConfig.channels || [];
const selected = defineModel();

const locales = computed(() => {
  let channel = channels.find((c) => c.code === props.channel);
  if (!channel) {
    channel = channels[0];
  }

  return channel.locales;
});
const selectedLabel = computed(() => locales.value.find((c) => c.code === selected.value)?.name);

onBeforeMount(() => {
  if (!selected.value) {
    selected.value = locales.value[0].code;
  }
});

watch(
  () => props.channel,
  (newChannel) => {
    const localeExists = !!locales.value.find((l) => l.code === selected.value);
    if (!localeExists) {
      selected.value = locales.value[0].code;
    }
  }
);
function onSelect({ value }: { value: string }) {
  selected.value = value;
}
</script>

<template>
  <Menu.Root :positioning="{ gutter: 8 }" v-if="locales && locales.length > 1" @select="onSelect">
    <Menu.Trigger as-child>
      <button
        class="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 text-zinc-300 hover:text-white transition-all text-xs font-semibold"
      >
        <i-heroicons-globe-alt class="w-4 h-4 text-blue-500" />
        <span class="max-w-[100px] truncate">{{ selectedLabel }}</span>
        <i-heroicons-chevron-down class="w-3 h-3 text-zinc-600" />
      </button>
    </Menu.Trigger>

    <Menu.Positioner class="z-[100]">
      <Menu.Content
        class="glass-panel min-w-[180px] p-2 flex flex-col gap-1 outline-none rounded-2xl data-[state=open]:animate-fade-in animation-duration-200"
      >
        <div class="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          {{ t('Locales') }}
        </div>
        <Menu.Item
          v-for="l in locales"
          :key="l.code"
          :value="l.code"
          class="rounded-xl cursor-pointer flex items-center px-3 py-2.5 text-xs font-medium text-zinc-300 hover:bg-white/5 hover:text-white transition-colors outline-none data-[highlighted]:bg-white/5 data-[highlighted]:text-white"
        >
          <div
            :class="[selected === l.code ? 'opacity-100' : 'opacity-0']"
            class="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 transition-opacity"
          ></div>
          {{ l.name }}
        </Menu.Item>
      </Menu.Content>
    </Menu.Positioner>
  </Menu.Root>
</template>
