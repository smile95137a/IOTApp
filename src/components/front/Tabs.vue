<script setup lang="ts">
import { ref, provide, onMounted } from 'vue';

const activeTab = ref(null);

const setActiveTab = (name) => {
  activeTab.value = name;
};

onMounted(() => {
  if (!activeTab.value) {
    activeTab.value = '客戶基本資料';
  }
});

provide('activeTab', activeTab);
provide('setActiveTab', setActiveTab);
</script>

<template>
  <div class="tabs">
    <div class="tab-headers">
      <slot
        name="headers"
        :activeTab="activeTab"
        :setActiveTab="setActiveTab"
      ></slot>
    </div>
    <div class="tab-content">
      <slot></slot>
    </div>
  </div>
</template>
