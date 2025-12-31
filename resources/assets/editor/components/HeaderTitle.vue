<script setup lang="ts">
import useI18n from '../composables/i18n';
import { useState } from '../state';

const { theme } = useState();
const { t } = useI18n();
</script>

<template>
  <div class="flex items-center gap-3 pl-2">
    <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
      <i-heroicons-swatch class="w-5 h-5 text-white" />
    </div>
    <div>
      <h1 class="font-bold text-sm tracking-tight text-white/90 leading-none mb-1">
        {{ t('title') }}
      </h1>
      <h2 class="text-zinc-500 text-[10px] uppercase tracking-widest font-bold leading-none">
        {{ theme?.name }} <span v-if="theme?.version" class="opacity-50">v{{ theme.version }}</span>
      </h2>
    </div>
  </div>
</template>
