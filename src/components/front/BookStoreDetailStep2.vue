<template>
  <div class="store-picker">
    <div class="store-picker__card">
      <div class="store-picker__top">
        <div class="store-picker__table-label">
          桌台｜{{ bookingStore.table?.tableNumber ?? '未選擇' }}
        </div>
      </div>

      <hr class="store-picker__divider" />

      <div class="store-picker__calendar-wrapper">
        <p class="store-picker__calendar-label">選擇日期</p>
        <div class="calendar-wrapper">
          <Datepicker
            v-model="date"
            locale="zh-TW"
            :inline="true"
            :enable-time-picker="false"
            format="yyyy-MM-dd"
            :min-date="new Date()"
            @update:model-value="handleDateChange"
            auto-apply
            hide-input-icon
            :show-now-button="false"
            :show-select-button="false"
            :teleport="null"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { ref } from 'vue';
import { useBookingStepStore } from '@/stores/bookingStepStore';

const bookingStore = useBookingStepStore();
const date = ref<string>(bookingStore.selectedDate || '');

const handleDateChange = (val: string) => {
  bookingStore.setSelectedDate(val);
  bookingStore.setStep(3);
};
</script>

<style scoped lang="scss">
.store-picker {
  &__card {
    background: #fff;
    border-radius: 16px;
    padding: 32px;
  }

  &__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__table-label {
    font-size: 18px;
    font-weight: bold;
  }

  &__divider {
    margin: 24px 0;
    border: none;
    border-top: 1px solid #ccc;
  }

  &__calendar-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  &__calendar-label {
    font-size: 18px;
    font-weight: 600;
  }
}

.calendar-wrapper {
  background: #fff;
  padding: 20px 24px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: fit-content;

  ::v-deep(.dp__main) {
    border: none;
  }

  ::v-deep(.dp__calendar_header) {
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 8px;
    display: flex;
    justify-content: center;
    gap: 16px;
  }

  ::v-deep(.dp__month_year_row) {
    justify-content: center;
    font-size: 18px;
    font-weight: 700;
    gap: 24px;
  }

  ::v-deep(.dp__month_year_select) {
    font-weight: 700;
    font-size: 18px;
  }

  ::v-deep(.dp__calendar_header_separator) {
    border: none;
    margin: 8px 0;
  }

  ::v-deep(.dp__calendar_header) {
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }

  ::v-deep(.dp__calendar_header_item) {
    flex: 1;
    text-align: center;
  }

  ::v-deep(.dp__calendar) {
    padding: 8px;
  }

  ::v-deep(.dp__cell_inner) {
    border-radius: 12px;
    padding: 8px 0;
    font-size: 16px;
    font-weight: 500;
    text-align: center;
    transition: all 0.2s ease;
  }

  ::v-deep(.dp__cell_inner:hover) {
    background-color: #f0f0f0;
  }

  ::v-deep(.dp__today) {
    font-weight: bold;
    color: #2676e6;
  }

  ::v-deep(.dp__active_date) {
    background-color: #ff944d !important;
    color: #fff !important;
    font-weight: 600;
    border-radius: 12px;
  }

  ::v-deep(.dp__input_wrap) {
    display: none;
  }

  ::v-deep(.dp__calendar_row) {
    justify-content: space-between;
  }

  ::v-deep(.dp__action_row) {
    display: none !important;
  }
}
</style>
