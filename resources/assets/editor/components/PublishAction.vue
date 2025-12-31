<script setup lang="ts">
import useI18n from '../composables/i18n';
import { usePublish } from '../composables/usePublish';
import { useState } from '../state';
import { useCraftileEditor } from '../composables/useCraftileEditor';

const CONFIRM_PUBLISH_KEY = 'bagisto_visual_editor_confirm_publish';

const { t } = useI18n();
const editor = useCraftileEditor()!;
const { isPublishing, publish } = usePublish();
const { haveEdits } = useState();

function onClick() {
  if (null === localStorage.getItem(CONFIRM_PUBLISH_KEY)) {
    editor.ui.openModal('confirm-publish');
    return;
  }

  publish();
}
</script>

<template>
  <button
    class="studio-button-primary disabled:opacity-30 disabled:scale-100 flex items-center gap-2 group"
    :disabled="!haveEdits"
    @click="onClick"
  >
    <i-heroicons-cloud-arrow-up-solid
      v-if="!isPublishing"
      class="w-4 h-4 text-white/70 group-hover:text-white transition-colors"
    />
    <span v-if="isPublishing" class="animate-spin border-2 border-white/20 border-t-white rounded-full w-4 h-4"></span>
    {{ isPublishing ? t('Publishing...') : t('Publish') }}
  </button>
</template>
