<script setup lang="ts">
import { computed } from 'vue';
import { Menu } from '@ark-ui/vue/menu';
import { Button } from '@craftile/editor/ui';
import { useState } from '../state';
import useI18n from '../composables/i18n';

const { t } = useI18n();
const { channels } = useState();

const selected = defineModel<string>();
const selectedLabel = computed(() => channels.value.find((c) => c.code === selected.value)?.name);

function onSelect({ value }: { value: string }) {
  selected.value = value;
}
</script>

<template>
  <Menu.Root :positioning="{ gutter: 8 }" @select="onSelect" v-if="channels.length > 1">
    <Menu.Trigger as-child>
      <button
        class="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 text-zinc-300 hover:text-white transition-all text-xs font-semibold"
      >
        <i-heroicons-building-storefront class="w-4 h-4 text-blue-500" />
        <span class="max-w-[100px] truncate">{{ selectedLabel }}</span>
        <i-heroicons-chevron-down class="w-3 h-3 text-zinc-600" />
      </button>
    </Menu.Trigger>

    <Menu.Positioner class="z-[100]">
      <Menu.Content
        class="glass-panel min-w-[180px] p-2 flex flex-col gap-1 outline-none rounded-2xl data-[state=open]:animate-fade-in animation-duration-200"
      >
        <div class="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          {{ t('Channels') }}
        </div>
        <Menu.Item
          v-for="c in channels"
          :key="c.code"
          :value="c.code"
          class="rounded-xl cursor-pointer flex items-center px-3 py-2.5 text-xs font-medium text-zinc-300 hover:bg-white/5 hover:text-white transition-colors outline-none data-[highlighted]:bg-white/5 data-[highlighted]:text-white"
        >
          <div
            :class="[selected === c.code ? 'opacity-100' : 'opacity-0']"
            class="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 transition-opacity"
          ></div>
          {{ c.name }}
        </Menu.Item>
      </Menu.Content>
    </Menu.Positioner>
  </Menu.Root>
</template>
