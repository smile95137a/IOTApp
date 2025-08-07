<template>
  <Dialog
    :isOpen="isOpen"
    :customClass="['dialog--poeOfferingDialog', customClass].join(' ')"
    @close="handleClose"
  >
    <div class="poeOfferingDialog">
      <SectionBackground variant="red" />
      <section class="offering">
        <p class="offering__title">請選擇要供奉的供品</p>

        <div class="offering__list">
          <div
            v-for="item in offeringOptions"
            :key="item.id"
            class="offering__item"
            :class="{ 'offering__item--selected': selected === item.id }"
            @click="toggleOffering(item.id)"
          >
            <img
              :src="item.imageBase64"
              :alt="item.name"
              class="offering__item-img"
            />
            <p class="offering__item-name">{{ item.name }}</p>
          </div>
        </div>

        <div class="offering__actions">
          <button
            class="offering__btn offering__btn--confirm"
            @click="submit"
            :disabled="!selected"
          >
            確定供奉
          </button>
          <button
            class="offering__btn offering__btn--cancel"
            @click="handleClose(false)"
          >
            取消
          </button>
        </div>
      </section>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Dialog from './Dialog.vue';
import SectionBackground from '@/components/common/SectionBackground.vue';
import { useDialogStore } from '@/stores/dialogStore';
import { fetchOfferingList } from '@/services/GodService';

const dialogStore = useDialogStore();
const isOpen = computed(() => dialogStore.isPoeOfferingDialogOpen);
const customClass = computed(() => dialogStore.customClass);

const selected = ref<string | null>(null);
const offeringOptions = ref<any[]>([]);

const toggleOffering = (id: string) => {
  selected.value = selected.value === id ? null : id;
};

const submit = () => {
  if (!selected.value) return;
  const selectedItem = offeringOptions.value.find(
    (item) => item.id === selected.value
  );
  if (selectedItem) {
    dialogStore.closePoeOfferingDialog(selectedItem);
  }
};

const handleClose = (result: any) => {
  dialogStore.closePoeOfferingDialog(result);
};

const loadOfferings = async () => {
  try {
    const res = await fetchOfferingList();
    if (res.success && Array.isArray(res.data)) {
      offeringOptions.value = res.data;
    } else {
      console.warn('供品資料載入失敗', res.message);
    }
  } catch (error) {
    console.error('載入供品資料失敗:', error);
  }
};

onMounted(loadOfferings);
</script>

<style scoped lang="scss">
.offering {
  padding: 40px 20px;
  text-align: center;
  color: #fff;

  &__title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 24px;
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.5rem;
    margin-bottom: 32px;
  }

  &__item {
    background: #fff;
    color: #333;
    border-radius: 12px;
    padding: 1rem;
    width: 120px;
    cursor: pointer;
    transition: transform 0.2s, background 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 2px solid transparent;

    &--selected {
      border-color: #df5b3c;
      background: #ffe6e1;
    }

    &:hover {
      transform: scale(1.05);
    }
  }

  &__item-img {
    width: 60px;
    height: 60px;
    object-fit: contain;
    margin-bottom: 0.5rem;
  }

  &__item-name {
    font-size: 14px;
    font-weight: 600;
  }

  &__actions {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
  }

  &__btn {
    padding: 0.5rem 1.5rem;
    border: none;
    border-radius: 999px;
    font-weight: bold;
    font-size: 16px;
    cursor: pointer;

    &--confirm {
      background-color: #8b3a1e;
      color: #ffc20e;

      &:hover {
        background-color: #a84627;
      }

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
    }

    &--cancel {
      background-color: transparent;
      color: #fff;
      border: 1px solid #fff;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }
}
</style>
