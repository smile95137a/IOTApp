<template>
  <div class="admin-list">
    <h1 class="admin-list__title">購買數疊加設定</h1>

    <div class="light-grid">
      <div
        v-for="light in lightImages"
        :key="light.id"
        class="light-item"
        :class="{ 'light-item--active': selectedId === light.id }"
        @click="selectLight(light.id)"
      >
        <img :src="light.image" :alt="light.name" class="light-item__image" />
        <div class="light-item__label">{{ light.name }}</div>
      </div>
    </div>

    <form class="admin-list__form" @submit.prevent="handleSubmit">
      <label v-if="selectedLightName"
        >設定「{{ selectedLightName }}」的增加值</label
      >
      <input
        type="number"
        v-model.number="count"
        class="admin-list__input"
        required
      />
      <button type="submit" class="admin-list__button">儲存</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { withLoading } from '@/utils/loadingUtils';
import {
  fetchPurchaseLanternCount,
  updatePurchaseLanternCount,
} from '@/services/admin/adminSystemConfigService';
import lightImages from '@/data/lightImages';

// 🔸選中的燈 ID 與疊加值
const selectedId = ref<number | null>(null);
const count = ref(0);

// 🔸從 lightImages 取出名稱
const selectedLightName = computed(() => {
  const light = lightImages.find((l) => l.id === selectedId.value);
  return light?.name || '';
});

const selectLight = (id: number) => {
  selectedId.value = id;
  load(); // 重新查該燈的增加值
};

const load = async () => {
  if (!selectedId.value) return;
  const res = await withLoading(() => fetchPurchaseLanternCount());
  if (res.success) {
    count.value = res.data;
  }
};

const handleSubmit = async () => {
  if (!selectedId.value) {
    alert('請先選擇一個燈種');
    return;
  }
  const res = await withLoading(() =>
    updatePurchaseLanternCount({ count: count.value })
  );
  if (res.success) {
    alert('儲存成功');
  }
};

onMounted(() => {
  selectedId.value = lightImages[0].id;
  load();
});
</script>

<style scoped>
.light-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}
.light-item {
  border: 2px solid #ddd;
  padding: 0.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 8px;
}
.light-item:hover {
  border-color: #999;
}
.light-item--active {
  border-color: #eb6c4d;
  background: #fff5f2;
}
.light-item__image {
  height: 60px;
  object-fit: contain;
}
.light-item__label {
  margin-top: 0.5rem;
  font-size: 14px;
}
</style>
