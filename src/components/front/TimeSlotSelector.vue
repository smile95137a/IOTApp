<template>
  <div class="timeslot" :class="`timeslot--${status}`" @click="onPress">
    <div class="timeslot__time">{{ `${start} ~ ${end}` }}</div>

    <div v-if="status === 'available'" class="timeslot__rate">
      {{ rate }} 元/小時
    </div>

    <div v-if="status === 'selected'" class="timeslot__actions">
      <button @click.stop="onSelect">預約</button>
      <button @click.stop="onCancel">取消</button>
    </div>

    <div v-if="status === 'booked'" class="timeslot__booked">已預約</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  start: string;
  end: string;
  rate: number;
  status: 'selected' | 'available' | 'booked';
  onPress?: () => void;
  onSelect?: () => void;
  onCancel?: () => void;
}>();
</script>

<style scoped lang="scss">
.timeslot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-radius: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: background 0.2s ease;

  &--available {
    background-color: #ededed;
    color: #000;
  }

  &--selected {
    background-color: #ff924f;
    color: #fff;
  }

  &--booked {
    background-color: #8b9594;
    color: #fff;
  }

  &__time {
    font-weight: bold;
    font-size: 16px;
    flex: 1;
  }

  &__rate {
    font-size: 14px;
    border: 1px solid #000;
    padding: 6px 12px;
    border-radius: 6px;
  }

  &__actions {
    display: flex;
    gap: 8px;

    button {
      background: transparent;
      border: 1px solid white;
      border-radius: 6px;
      padding: 6px 12px;
      color: white;
      font-size: 14px;
      cursor: pointer;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }

  &__booked {
    padding: 6px 12px;
    border: 1px solid white;
    border-radius: 6px;
  }
}
</style>
