<script setup lang="ts">
import { watch } from 'vue';
import { ref, onMounted } from 'vue';
import { getInvoiceTypeList } from '@/services/OrderService';
import { useFormContext } from 'vee-validate';
import { executeApi } from '@/utils/executeApiUtils';
import { getProfile } from '@/services/UserService';

const { defineField, errors, setFieldValue } = useFormContext();

const [invoiceType] = defineField('invoiceType');
const [invoiceTarget] = defineField('invoiceTarget');
const [carrierId] = defineField('carrierId');
const [npoban] = defineField('npoban');

const invoiceTypeOptions = ref<any[]>([]);

const initOptions = async () => {
  try {
    const [invoiceRes] = await Promise.all([getInvoiceTypeList()]);

    if (invoiceRes.success) {
      invoiceTypeOptions.value = invoiceRes.data.map((i: any) => ({
        label: i.label,
        value: i.code,
      }));
    }
  } catch (error) {
    console.error('初始化選項失敗', error);
  }
};
const initProfile = async () => {
  await executeApi({
    fn: () => getProfile(),
    onSuccess: async (data) => {
      const invoice = data.invoice || {};
      setFieldValue('invoiceType', invoice.type || '');
      setFieldValue(
        'invoiceTarget',
        invoice.type === 'company' ? invoice.value : ''
      );
      setFieldValue(
        'carrierId',
        invoice.type === 'mobile' || invoice.type === 'citizen'
          ? invoice.value
          : ''
      );
      setFieldValue('npoban', invoice.type === 'donation' ? invoice.value : '');
    },
  });
};

onMounted(() => {
  initOptions();
  initProfile();
});

watch(
  () => invoiceType,
  (newType: any) => {
    switch (newType) {
      case 'company':
        setFieldValue('carrierId', '');
        setFieldValue('npoban', '');
        break;
      case 'mobile':
      case 'citizen':
        setFieldValue('invoiceTarget', '');
        setFieldValue('npoban', '');
        break;
      case 'donate':
        setFieldValue('invoiceTarget', '');
        setFieldValue('carrierId', '');
        break;
      default:
        setFieldValue('invoiceTarget', '');
        setFieldValue('carrierId', '');
        setFieldValue('npoban', '');
    }
  }
);
</script>
<template>
  <h3>發票</h3>
  <select v-model="invoiceType" class="checkout__form-input">
    <option value=""></option>
    <option
      v-for="option in invoiceTypeOptions"
      :key="option.value"
      :value="option.value"
    >
      {{ option.label }}
    </option>
  </select>
  <p v-if="errors.invoiceType" class="checkout__form-error">
    {{ errors.invoiceType }}
  </p>

  <!-- 統一編號 -->
  <div v-if="invoiceType === 'company'" class="checkout__form-group">
    <label>統一編號</label>
    <input v-model="invoiceTarget" class="checkout__form-input" />
    <p v-if="errors.invoiceTarget" class="checkout__form-error">
      {{ errors.invoiceTarget }}
    </p>
  </div>

  <!-- 手機條碼 / 自然人憑證 -->
  <div v-if="invoiceType === 'mobile'" class="checkout__form-group">
    <label>載具內容</label>
    <input v-model="carrierId" class="checkout__form-input" />
    <p v-if="errors.carrierId" class="checkout__form-error">
      {{ errors.carrierId }}
    </p>
  </div>

  <!-- 愛心碼 -->
  <div v-if="invoiceType === 'donation'" class="checkout__form-group">
    <label>愛心碼</label>
    <input v-model="npoban" class="checkout__form-input" />
    <p v-if="errors.npoban" class="checkout__form-error">
      {{ errors.npoban }}
    </p>
  </div>
</template>
