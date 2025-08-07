<template>
  <Dialog
    :isOpen="isOpen"
    :customClass="['dialog--confirmDialog', customClass].join(' ')"
    @close="handleClose"
  >
    <div class="confirmDialog">
      <div class="confirmDialog__header">
        <div
          class="confirmDialog__header-title"
          v-if="confirmDialogOptions?.title"
        >
          <p class="confirmDialog__text">
            {{ confirmDialogOptions?.title }}
          </p>
        </div>
        <div class="confirmDialog__close" @click="handleClose(false)">
          <i class="fa-solid fa-xmark" style="font-size: 16px"></i>
        </div>
      </div>

      <div class="confirmDialog__main">
        <div class="confirmDialog__main-content">
          <div class="confirmDialog__main-content-icon">
            <i class="fa-solid fa-question" style="font-size: 22px"></i>
          </div>

          <div class="confirmDialog__main-content-msg">
            <span
              class="confirmDialog__text"
              v-html="confirmDialogOptions?.message"
            ></span>
          </div>
        </div>
        <div class="confirmDialog__main-btns">
          <button
            type="button"
            class="confirmDialog__main-btn confirmDialog__main-btn--confirm"
            @click="handleConfirm"
          >
            {{ confirmDialogOptions?.confirmText || '確定' }}
          </button>
          <button
            type="button"
            class="confirmDialog__main-btn confirmDialog__main-btn--cancel"
            @click="handleClose(false)"
          >
            {{ confirmDialogOptions?.cancelText || '取消' }}
          </button>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from './Dialog.vue';
import { computed } from 'vue';
import { useDialogStore } from '@/stores/dialogStore';

const dialogStore = useDialogStore();

const isOpen = computed(() => dialogStore.isConfirmDialogOpen);
const customClass = computed(() => dialogStore.customClass);
const confirmDialogOptions = computed(() => dialogStore.confirmDialogOptions);

const handleClose = (result: boolean) => {
  dialogStore.closeConfirmDialog(result);
};

const handleConfirm = () => {
  dialogStore.closeConfirmDialog(true);
};
</script>

<style scoped></style>
