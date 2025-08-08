<template>
  <div class="store-detail__table-summary">
    <p>桌數：{{ tables.length }}桌</p>
    <p class="store__table-available">可用桌數：{{ available }}桌</p>
  </div>

  <div class="store-detail__table-grid">
    <div
      v-for="table in tables"
      :key="table.id"
      class="store-detail__table-item"
      @click="handleSelectTable(table)"
    >
      <img
        :src="getTableImg(table)"
        :alt="table.name"
        class="store-detail__table-img"
      />
      <div class="store-detail__table-btn store-detail__table-btn--yellow">
        {{ table.tableNumber }} 預約開台
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useBookingStepStore } from '@/stores/bookingStepStore';
import tableEnableImg from '@/assets/image/iot-table-enable.png';
import tableDisableImg from '@/assets/image/iot-table-disable.png';

const bookingStepStore = useBookingStepStore();

const tables = computed(() => bookingStepStore.tables);
const available = computed(() => tables.value.filter((t) => !t.isUse).length);

const isTableAvailable = (table: any) => {
  return (
    !table.isUse && table.status !== 'FAULT' && table.status !== 'UNAVAILABLE'
  );
};

const getTableImg = (table: any) => {
  return tableEnableImg;
};

const handleSelectTable = (table: any) => {
  bookingStepStore.setTable(table);
  bookingStepStore.setStep(2);
};
</script>

<style scoped lang="scss">
.store-detail {
  max-width: 1080px;
  margin: 0 auto;
  padding: 4rem 2rem;
  &__header {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
  }

  &__logo {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    background-color: #ccc;
    margin-right: 16px;
  }

  &__info {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &__title {
    font-size: 28px;
    font-weight: 800;
    color: #fff;
    margin: 0;
  }

  &__address {
    font-size: 14px;
    color: #dcdcdc;
    margin: 4px 0 0;
  }

  &__card {
    background: #fff;
    border-radius: 16px;
    padding: 32px;
  }

  // 🟡 價格區橫向排版
  &__price {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 16px;
  }

  &__price-block {
    display: flex;
    align-items: flex-start;
    gap: 32px;
    flex-wrap: wrap;
  }

  &__price-label {
    font-size: 18px;
    font-weight: bold;
    color: #000;
    min-width: 80px;
    align-self: flex-start;
  }

  &__price-detail {
    display: flex;
    gap: 32px;

    & > div {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
  }

  &__price-main {
    font-size: 20px;
    font-weight: 700;
    color: #000;
  }

  &__price-sub {
    font-size: 14px;
    font-weight: 500;
    color: #444;
  }

  &__price-time {
    font-size: 12px;
    color: #888;
  }

  // 📱 手機響應式：價格區塊改為直排
  @media (max-width: 768px) {
    &__price-block {
      flex-direction: column;
      gap: 16px;
    }

    &__price-detail {
      flex-direction: column;
      gap: 16px;
    }
  }

  &__buttons {
    display: flex;
    gap: 8px;
  }

  &__btn {
    background-color: #198754;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 6px 12px;
    font-size: 14px;
    cursor: pointer;

    &--secondary {
      background-color: #2e9b62;
    }
  }

  &__divider {
    margin: 24px 0;
    border: none;
    border-top: 1px solid #ccc;
  }

  &__table-summary {
    display: flex;
    justify-content: center;
    gap: 24px;
    font-size: 18px;
    font-weight: 700;

    .store__table-available {
      color: #2676e6;
    }
  }

  &__table-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(163px, 1fr));
    gap: 16px;
    justify-content: center;
    margin-top: 24px;
  }

  &__table-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  &__table-img {
    width: 163px;
    height: 122px;
    object-fit: contain; // 保持完整比例顯示
    display: block;
  }

  &__table-btn {
    width: 100%;
    border-radius: 8px;
    padding: 12px 0;
    font-size: 14px;
    font-weight: 600;
    text-align: center;

    &--yellow {
      background-color: #ffc702;
      color: #000;
    }

    &--gray {
      background-color: #a9a9a9;
      color: #fff;
    }
  }
}
.store-pricing {
  display: flex;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 24px;
  height: 100px;
  color: #fff;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  margin: 36px 0;

  &__label {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    margin-right: 24px;
    font-weight: 500;
    line-height: 1.6;
    white-space: nowrap;
  }

  &__columns {
    display: flex;
    gap: 24px;
    align-items: center;
  }

  &__column {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-left: 24px;
    border-left: 1px solid rgba(255, 255, 255, 0.4);
    text-align: center;

    .price {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 4px;
    }

    .desc {
      font-size: 14px;
      opacity: 0.85;
      margin-bottom: 2px;
    }

    .time {
      font-size: 13px;
      opacity: 0.7;
    }
  }

  // ✅ RWD：手機版切換為直向排版
  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    align-items: stretch;
    padding: 16px;

    &__label {
      align-items: center;
      margin-right: 0;
      margin-bottom: 12px;
    }

    &__columns {
      flex-direction: column;
      gap: 16px;
    }

    &__column {
      border-left: none;
      padding-left: 0;
      border-top: 1px solid rgba(255, 255, 255, 0.4);
      padding-top: 16px;

      &:first-child {
        border-top: none;
        padding-top: 0;
      }
    }
  }
}
</style>
