// stores/useBookingStepStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useBookingStepStore = defineStore('bookingStep', () => {
  const step = ref<1 | 2 | 3>(1);
  const store = ref<any>(null);
  const table = ref<any>(null);
  const tables = ref<any[]>([]);
  const selectedDate = ref<string>('');
  const timeSlot = ref<string>('');

  const setStep = (value: 1 | 2 | 3) => {
    step.value = value;
  };

  const setStore = (value: any) => {
    store.value = value;
  };

  const setTable = (value: any) => {
    table.value = value;
  };

  const setTables = (value: any[]) => {
    tables.value = value;
  };

  const setSelectedDate = (value: string) => {
    selectedDate.value = value;
  };

  const setTimeSlot = (value: string) => {
    timeSlot.value = value;
  };

  const resetBooking = () => {
    step.value = 1;
    store.value = null;
    table.value = null;
    tables.value = [];
    selectedDate.value = '';
    timeSlot.value = '';
  };

  return {
    step,
    store,
    table,
    tables,
    selectedDate,
    timeSlot,
    setStep,
    setStore,
    setTable,
    setTables,
    setSelectedDate,
    setTimeSlot,
    resetBooking,
  };
});
