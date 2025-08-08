<template>
  <div class="store-detail">
    <div class="store-detail__container">
      <div class="store-detail__slots">
        <h3 class="store-detail__slots-title">可預約時段</h3>
        <p v-if="timeSlots.length === 0" class="store-detail__slots-empty">
          此日無可預約時段
        </p>
        <div v-else class="slots">
          <TimeSlotSelector
            v-for="slot in timeSlots"
            :key="slot.id"
            :start="slot.start"
            :end="slot.end"
            :rate="slot.rate"
            :status="getSlotStatus(slot.id, slot.status)"
            @press="() => toggleSlot(slot.id)"
            @select="confirmBooking"
            @cancel="() => toggleSlot(slot.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useBookingStepStore } from '@/stores/bookingStepStore';
import { useDialogStore } from '@/stores/dialogStore';
import TimeSlotSelector from '@/components/front/TimeSlotSelector.vue';
import moment from 'moment';
import { checkIsUse, getAvailableTimes } from '@/services/gameService';
import { executeApi } from '@/utils/executeApiUtils';
import { usePaymentStore } from '@/stores/paymentStore';

const bookingStore = useBookingStepStore();
const dialogStore = useDialogStore();
const paymentStore = usePaymentStore();

const router = useRouter();

const timeSlots = ref<any[]>([]);
const activeTimeSlots = ref<string[]>([]);

const selectedDate = computed(() =>
  bookingStore.selectedDate ? new Date(bookingStore.selectedDate) : new Date()
);

const store = computed(() => bookingStore.store);
const table = computed(() => bookingStore.table);

const loadTimeSlots = async () => {
  const formattedDate = moment(selectedDate.value).format('YYYY-MM-DD');
  await executeApi({
    fn: () => getAvailableTimes(store.value.id, formattedDate, table.value.id),
    onSuccess: (data) => {
      const slots =
        data[table.value.id]?.map((x: any) => ({
          ...x,
          id: Math.random().toString(36).substring(2, 10),
          rate: x.rate * 60,
        })) || [];
      timeSlots.value = slots;
    },
  });
};

const toggleSlot = (id: string) => {
  const index = activeTimeSlots.value.indexOf(id);
  if (index > -1) {
    activeTimeSlots.value.splice(index, 1);
  } else {
    activeTimeSlots.value.push(id);
  }
};

const getSlotStatus = (id: string, originalStatus: string) => {
  if (originalStatus === 'booked') return 'booked';
  return activeTimeSlots.value.includes(id) ? 'selected' : 'available';
};

const checkIsContinuous = (selected: any[]) => {
  for (let i = 1; i < selected.length; i++) {
    const prevEnd = moment(selected[i - 1].end, 'HH:mm');
    const currentStart = moment(selected[i].start, 'HH:mm');
    if (!currentStart.isSame(prevEnd)) return false;
  }
  return true;
};

const confirmBooking = async () => {
  if (activeTimeSlots.value.length === 0) {
    await dialogStore.openInfoDialog({
      title: '請選擇時段',
      message: '請至少選擇一個時段進行預約',
    });
    return;
  }

  const selected = timeSlots.value
    .filter((slot) => activeTimeSlots.value.includes(slot.id))
    .sort((a, b) => moment(a.start, 'HH:mm').diff(moment(b.start, 'HH:mm')));

  if (!checkIsContinuous(selected)) {
    await dialogStore.openInfoDialog({
      title: '選取錯誤',
      message: '選取的時段不連續，請重新選擇',
    });
    return;
  }

  await executeApi({
    fn: () => checkIsUse(),
    errorTitle: '載入農民曆失敗',
    onFail: (data) => {
      return;
    },
  });

  const confirmText = selected.map((s) => `${s.start} - ${s.end}`).join('\n');
  const confirmed = await dialogStore.openConfirmDialog({
    title: '確認預約',
    message: `確認預約以下時段？\n${confirmText}`,
  });

  if (!confirmed) return;

  paymentStore.type = 'bookGame';
  paymentStore.setPayData({
    poolTableUId: table.value.uid,
    bookDate: moment(selectedDate.value).format('YYYY-MM-DD'),
    selectedTime: selected,
  });
  paymentStore.totalAmount = selected.reduce(
    (sum, s) => sum + (s.rate || store.value.deposit),
    0
  );
  router.push('/member-center/payment');
};

onMounted(() => {
  if (store.value?.id && table.value?.id && bookingStore.selectedDate) {
    loadTimeSlots();
  }
});
</script>

<style scoped lang="scss"></style>
