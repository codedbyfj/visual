<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@craftile/editor/ui';
import useI18n from '../composables/i18n';
import { usePublish } from '../composables/usePublish';
import { useCraftileEditor } from '../composables/useCraftileEditor';

const CONFIRM_PUBLISH_KEY = 'bagisto_visual_editor_confirm_publish';

const { t } = useI18n();
const editor = useCraftileEditor()!;
const { isPublishing, publish } = usePublish();

const dontAskNextTime = ref(false);

function onPublish() {
  if (dontAskNextTime.value) {
    localStorage.setItem(CONFIRM_PUBLISH_KEY, 'true');
  }

  publish();
}
</script>

<template>
  <div class="p-6 space-y-6 bg-zinc-950 text-zinc-300">
    <div class="space-y-4">
      <p class="text-sm leading-relaxed">{{ t('publish_warning_line1') }}</p>
      <p class="text-sm leading-relaxed">{{ t('publish_warning_line2') }}</p>
    </div>

    <div class="flex items-center gap-3 py-2">
      <Checkbox
        :label="t('Don\'t ask next time')"
        v-model="dontAskNextTime"
        class="text-xs text-zinc-500 font-medium"
      />
    </div>

    <div class="flex gap-3 justify-end pt-2">
      <button class="studio-button-secondary" :disabled="isPublishing" @click="editor.ui.closeModal('confirm-publish')">
        {{ t('Cancel') }}
      </button>
      <button class="studio-button-primary min-w-[100px]" :disabled="isPublishing" @click="onPublish">
        <span
          v-if="isPublishing"
          class="animate-spin border-2 border-white/20 border-t-white rounded-full w-4 h-4 mr-2"
        ></span>
        {{ isPublishing ? t('Publishing...') : t('Publish Now') }}
      </button>
    </div>
  </div>
</template>
