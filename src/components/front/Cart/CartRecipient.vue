<script setup lang="ts">
import { nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useFormContext } from 'vee-validate';
import { ref, onMounted } from 'vue';

import {
  getAllCityNames,
  getAreaListByCityName,
  getZipCodeByCityAndAreaName,
} from '@/services/taiwanCitiesService';
import { getProfile } from '@/services/UserService';
import { withLoading } from '@/utils/loadingUtils';
const router = useRouter();

const cityOptions = ref<any[]>([]);
const areaOptions = ref<any[]>([]);

const initOptions = async () => {
  const cityNames = getAllCityNames();
  cityOptions.value = [
    { value: '', label: '縣市' },
    ...cityNames.map((city) => ({ value: city, label: city })),
  ];
  areaOptions.value = [{ value: '', label: '行政區' }];
};

const { defineField, errors, setFieldValue } = useFormContext();
// ---- 拆解欄位綁定（v-model） ----
const [recipientName] = defineField('recipient.name');
const [recipientEmail] = defineField('recipient.email');
const [recipientPhone] = defineField('recipient.phone');
const [recipientCity] = defineField('recipient.city');
const [recipientArea] = defineField('recipient.area');
const [recipientAddress] = defineField('recipient.address');

const initProfile = async () => {
  const { success, data } = await withLoading(() => getProfile());

  if (success && data) {
    console.log(data.email);

    await setFieldValue('recipient.name', data.nickName || '');
    await setFieldValue('recipient.phone', data.phone || '');
    await setFieldValue('recipient.email', data.email || '');
    await setFieldValue('recipient.address', data.address || '');
    await setFieldValue('recipient.city', data.city || '');
    await setFieldValue('recipient.area', data.area || '');
  }
};

onMounted(() => {
  initOptions();
  initProfile();
});

watch(recipientCity, (newCity) => {
  if (newCity) {
    setFieldValue('recipient.area', '');
    const areas = getAreaListByCityName(newCity);
    areaOptions.value = [
      { value: '', label: '行政區' },
      ...areas.map((area) => ({
        value: area.areaName,
        label: area.areaName,
      })),
    ];
  } else {
    areaOptions.value = [{ value: '', label: '行政區' }];
  }
});

watch(recipientArea, (newArea) => {
  if (newArea) {
    const zipCode = getZipCodeByCityAndAreaName(recipientCity.value, newArea);
    if (zipCode) {
    }
  } else {
  }
});
</script>
<template>
  <h3>收件人資訊</h3>
  <div class="checkout__block">
    <div class="checkout__form-grid">
      <div class="checkout__form-group">
        <label>姓名</label>
        <input v-model="recipientName" class="checkout__form-input" />
        <p v-if="errors['recipient.name']" class="checkout__form-error">
          {{ errors['recipient.name'] }}
        </p>
      </div>

      <div class="checkout__form-group">
        <label>Email</label>
        <input v-model="recipientEmail" class="checkout__form-input" />
        <p v-if="errors['recipient.email']" class="checkout__form-error">
          {{ errors['recipient.email'] }}
        </p>
      </div>

      <div class="checkout__form-group">
        <label>電話</label>
        <input v-model="recipientPhone" class="checkout__form-input" />
        <p v-if="errors['recipient.phone']" class="checkout__form-error">
          {{ errors['recipient.phone'] }}
        </p>
      </div>

      <div class="checkout__form-group">
        <label>縣市</label>
        <select v-model="recipientCity" class="checkout__form-input">
          <option
            v-for="option in cityOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
        <p v-if="errors['recipient.city']" class="checkout__form-error">
          {{ errors['recipient.city'] }}
        </p>
      </div>

      <div class="checkout__form-group">
        <label>行政區</label>
        <select v-model="recipientArea" class="checkout__form-input">
          <option
            v-for="option in areaOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
        <p v-if="errors['recipient.area']" class="checkout__form-error">
          {{ errors['recipient.area'] }}
        </p>
      </div>

      <div class="checkout__form-group checkout__form-group--full">
        <label>詳細地址</label>
        <input v-model="recipientAddress" class="checkout__form-input" />
        <p v-if="errors['recipient.address']" class="checkout__form-error">
          {{ errors['recipient.address'] }}
        </p>
      </div>
    </div>
  </div>
</template>
