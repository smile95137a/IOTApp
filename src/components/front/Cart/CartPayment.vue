<script setup lang="ts">
import { useFormContext } from 'vee-validate';

import { ref } from 'vue';
// import { getPayMethodList } from '@/services/OrderService'; // 暫時不用

// 假資料
const payMethodOptions = ref([
  { label: '信用卡', value: 'credit_card' },
  { label: 'ATM 轉帳', value: 'ATM_TRANSFER' },
]);

// 若未來要改回 API 呼叫，可改用這段：
// const initOptions = async () => {
//   try {
//     const [payRes] = await Promise.all([getPayMethodList()]);
//     if (payRes.success) {
//       payMethodOptions.value = payRes.data.map((p: any) => ({
//         label: p.label,
//         value: p.code,
//       }));
//     }
//   } catch (error) {
//     console.error('初始化選項失敗', error);
//   }
// };
// onMounted(() => {
//   initOptions();
// });

const { defineField, errors } = useFormContext();
const [payment] = defineField('payment');
</script>

<template>
  <h3>優惠及結帳</h3>
  <div class="checkout__block">
    <div class="checkout__radio-group">
      <label
        v-for="option in payMethodOptions"
        :key="option.value"
        class="checkout__radio-option"
      >
        <input
          type="radio"
          class="checkout__form-radio"
          :value="option.value"
          v-model="payment"
        />
        {{ option.label }}
      </label>
    </div>
    <p v-if="errors.payment" class="checkout__form-error">
      {{ errors.payment }}
    </p>
  </div>
</template>
