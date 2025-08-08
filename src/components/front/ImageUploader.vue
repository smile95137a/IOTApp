<template>
  <div class="upload-box" @click="triggerFileInput">
    <input
      type="file"
      ref="fileInput"
      accept="image/*"
      class="hidden"
      @change="onFileChange"
    />
    <div class="upload-placeholder">
      <p>{{ placeholder }}</p>
      <div class="icons">📤 📷</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{ modelValue: File | null; placeholder?: string }>();
const emit = defineEmits(['update:modelValue']);

const fileInput = ref<HTMLInputElement>();

const triggerFileInput = () => {
  fileInput.value?.click();
};

const onFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (files && files[0]) {
    emit('update:modelValue', files[0]);
  }
};
</script>

<style scoped>
.upload-box {
  border: 1px dashed #ccc;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
}
.upload-placeholder {
  color: #999;
}
.icons {
  font-size: 24px;
  margin-top: 8px;
}
</style>
