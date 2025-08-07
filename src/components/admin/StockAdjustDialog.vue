<template>
  <Dialog
    :isOpen="isOpen"
    :customClass="['dialog--stockAdjustDialog', customClass].join(' ')"
    @close="handleClose"
  >
    <div class="stockAdjustDialog">
      <SectionBackground variant="red" />
      <section class="stockAdjust">
        <h2 class="stockAdjust__title">調整商品庫存</h2>

        <div v-if="loading" class="stockAdjust__loading">載入中...</div>

        <div v-else class="stockAdjust__form">
          <div class="stockAdjust__field">
            <label>總庫存：</label>
            <input type="number" v-model.number="form.totalStock" />
          </div>
          <div class="stockAdjust__field">
            <label>備註：</label>
            <input type="text" v-model="form.remark" />
          </div>

          <div class="stockAdjust__actions">
            <button
              class="stockAdjust__button stockAdjust__button--primary"
              @click="submit"
            >
              儲存
            </button>
            <button
              class="stockAdjust__button stockAdjust__button--secondary"
              @click="handleClose"
            >
              取消
            </button>
          </div>
        </div>
      </section>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from '@/components/common/Dialog.vue';
import SectionBackground from '@/components/common/SectionBackground.vue';
import { computed, onMounted, ref } from 'vue';
import { useDialogStore } from '@/stores/dialogStore';

import { withLoading } from '@/utils/loadingUtils';
import {
  adjustProductTotalStock,
  fetchProductStockById,
} from '@/services/admin/adminStockServices';

const dialogStore = useDialogStore();

const isOpen = computed(() => dialogStore.isStockAdjustDialogOpen);
const customClass = computed(() => dialogStore.customClass);
const productId = computed(() => dialogStore.stockAdjustDialogProductId);

const loading = ref(false);
const form = ref({ totalStock: 0, remark: '' });

const handleClose = () => {
  dialogStore.closeStockAdjustDialog(false);
};

const submit = async () => {
  await withLoading(async () => {
    await adjustProductTotalStock(productId.value, {
      totalStock: form.value.totalStock,
      remark: form.value.remark,
    });
    dialogStore.closeStockAdjustDialog(true); // 可選：true 表示已更新
  });
};

onMounted(async () => {
  loading.value = true;
  const res = await fetchProductStockById(productId.value);
  if (res.success && res.data) {
    form.value.totalStock = res.data.totalStock;
    form.value.remark = res.data.remark ?? '';
  }
  loading.value = false;
});
</script>

<style scoped lang="scss">
.stockAdjust {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  color: #fff;

  &__title {
    font-size: 22px;
    margin-bottom: 24px;
    text-align: center;
  }

  &__form {
    width: 100%;
    max-width: 400px;
  }

  &__field {
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;

    label {
      margin-bottom: 4px;
      font-weight: bold;
    }

    input {
      padding: 8px;
      border-radius: 6px;
      border: 1px solid #ccc;
      font-size: 16px;
    }
  }

  &__actions {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 24px;
  }

  &__button {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;

    &--primary {
      background-color: #eb6c4d;
      color: #fff;

      &:hover {
        background-color: #d65a3b;
      }
    }

    &--secondary {
      background-color: #ccc;
      color: #333;

      &:hover {
        background-color: #b3b3b3;
      }
    }
  }

  &__loading {
    margin-top: 24px;
    font-size: 16px;
  }
}
</style>
