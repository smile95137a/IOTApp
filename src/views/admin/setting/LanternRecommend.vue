<template>
  <div class="admin-list">
    <h1 class="admin-list__title">推薦點燈清單設定</h1>

    <form class="admin-list__form" @submit.prevent="handleSubmit">
      <div class="lantern-list">
        <div
          v-for="lantern in lamps"
          :key="lantern.id"
          class="lantern-item"
          :class="{ 'lantern-item--selected': selectedIds.has(lantern.id) }"
          @click="toggleSelect(lantern.id)"
        >
          <img
            :src="imageMap[lantern.iconName]"
            :alt="lantern.name"
            class="lantern-item__img"
          />
          <p class="lantern-item__name">{{ lantern.name }}</p>
        </div>
      </div>

      <button type="submit" class="admin-list__button">儲存</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import lightImages from '@/data/lightImages';
import { withLoading } from '@/utils/loadingUtils';
import {
  fetchPromotionLanternList,
  updatePromotionLanternList,
} from '@/services/admin/adminSystemConfigService';
import { getLanternList } from '@/services/lanternServices';
import { executeApi } from '@/utils/executeApiUtils';

const lamps = ref<any[]>([]);
const selectedIds = ref<Set<string>>(new Set());

const imageMap = Object.fromEntries(
  lightImages.map((item) => [item.key, item.image])
);

const toggleSelect = (id: string) => {
  if (selectedIds.value.has(id)) {
    selectedIds.value.delete(id);
  } else {
    selectedIds.value.add(id);
  }
};

const fetchLamps = async () => {
  try {
    const res = await getLanternList();
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      lamps.value = res.data;
    } else {
      lamps.value = lightImages;
    }
  } catch (err) {
    lamps.value = lightImages;
  }
};

const load = async () => {
  await fetchLamps();

  const res = await withLoading(fetchPromotionLanternList);
  if (res.success && Array.isArray(res.data)) {
    selectedIds.value = new Set(res.data);
  }
};

const handleSubmit = async () => {
  const ids = Array.from(selectedIds.value);

  await executeApi({
    fn: () => updatePromotionLanternList(ids),
    successTitle: '系統通知',
    successMessage: '儲存成功',
    errorTitle: '儲存失敗',
    errorMessage: '請稍後再試。',
  });
};

onMounted(load);
</script>

<style scoped>
.lantern-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
}
.lantern-item {
  border: 2px solid transparent;
  border-radius: 8px;
  padding: 8px;
  text-align: center;
  cursor: pointer;
  width: 100px;
  transition: border-color 0.2s;
}
.lantern-item:hover {
  border-color: #ccc;
}
.lantern-item--selected {
  border-color: #eb6c4d;
  background-color: #fff3ed;
}
.lantern-item__img {
  width: 60px;
  height: 60px;
  object-fit: contain;
  margin-bottom: 6px;
}
.lantern-item__name {
  font-size: 14px;
}
</style>
