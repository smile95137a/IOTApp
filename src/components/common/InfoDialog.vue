<template>
  <Dialog
    :isOpen="isOpen"
    :customClass="['dialog--infoDialog', customClass].join(' ')"
    @close="handleClose"
  >
    <div class="infoDialog">
      <div class="infoDialog__header">
        <div class="infoDialog__header-title" v-if="infoDialogOptions?.title">
          <p class="infoDialog__text">
            {{ infoDialogOptions?.title }}
          </p>
        </div>
        <div class="infoDialog__close" @click="handleClose">
          <i class="fa-solid fa-xmark" style="font-size: 16px"></i>
        </div>
      </div>

      <div class="infoDialog__main">
        <div class="infoDialog__main-content">
          <div class="infoDialog__main-content-icon">
            <i class="fa-solid fa-exclamation" style="font-size: 22px"></i>
          </div>

          <div class="infoDialog__main-content-msg">
            <span
              class="infoDialog__text"
              v-html="infoDialogOptions?.message"
            ></span>
          </div>
        </div>
        <div class="infoDialog__main-btns">
          <button
            type="button"
            class="infoDialog__main-btn infoDialog__main-btn--confirm"
            @click="handleClose"
          >
            確定
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

const isOpen = computed(() => dialogStore.isInfoDialogOpen);
const customClass = computed(() => dialogStore.infoDialogCustomClass);
const infoDialogOptions = computed(() => dialogStore.infoDialogOptions);

const handleClose = () => {
  dialogStore.closeInfoDialog();
};
</script>

<style scoped></style>
