<script setup lang="ts">
import { Button } from '@craftile/editor/ui';

function onBackClick() {
  history.back();
}
</script>

<template>
  <button
    class="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-white/10 transition-all active:scale-95"
    title="Back"
    @click="onBackClick"
  >
    <i-heroicons-arrow-left class="w-5 h-5" />
  </button>
</template>
