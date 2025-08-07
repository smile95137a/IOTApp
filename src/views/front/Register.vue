<script setup lang="ts">
import MCard from '@/components/common/MCard.vue';
import SectionBackground from '@/components/common/SectionBackground.vue';
import Header from '@/components/front/Header.vue';
import {
  getAllCityNames,
  getAreaListByCityName,
  getZipCodeByCityAndAreaName,
} from '@/services/taiwanCitiesService';
import { register } from '@/services/UserService';
import { useDialogStore } from '@/stores/dialogStore';
import { useLoadingStore } from '@/stores/loadingStore';
import { getErrorMessage } from '@/utils/ErrorUtils';
import { executeApi } from '@/utils/executeApiUtils';
import { withLoading } from '@/utils/loadingUtils';
import { useForm } from 'vee-validate';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import * as yup from 'yup';
const dialogStore = useDialogStore();
const cityOptions = ref<{ value: string; label: string }[]>([]);
const areaOptions = ref<{ value: string; label: string }[]>([]);
const router = useRouter();
const schema = yup.object({
  email: yup.string().required('Email 是必填項').email('Email 格式不正確'),
  phone: yup.string().required('手機是必填項'),
  password: yup.string().required('密碼是必填項').min(6, '密碼最少6個字符'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], '密碼不匹配')
    .required('確認密碼是必填項'),
  nickName: yup.string().required('暱稱是必填項'),
  addressName: yup.string(),
  zipCode: yup.string(),
  city: yup.string(),
  area: yup.string(),
  address: yup.string(),
  lineId: yup.string().required('LINE ID 是必填項'),
  agreeTerms: yup
    .boolean()
    .oneOf([true], '您必須同意網站服務條款和隱私權政策。')
    .required(),
});

const { defineField, handleSubmit, errors, setFieldValue } = useForm({
  validationSchema: schema,
  initialValues: {
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    nickName: '',
    lineId: '',
    addressName: '',
    city: '',
    area: '',
    address: '',
    agreeTerms: false,
  },
});

const [email, emailProps] = defineField('email');
const [phone, phoneProps] = defineField('phone');
const [password, passwordProps] = defineField('password');
const [confirmPassword, confirmPasswordProps] = defineField('confirmPassword');
const [nickName, nickNameProps] = defineField('nickName');
const [addressName, addressNameProps] = defineField('addressName');
const [city, cityProps] = defineField('city');
const [area, areaProps] = defineField('area');
const [address, addressProps] = defineField('address');
const [lineId, lineIdProps] = defineField('lineId');
const [agreeTerms, agreeTermsProps] = defineField('agreeTerms');

const onSubmit = handleSubmit(async (values) => {
  await executeApi({
    fn: () => register(values),
    successTitle: '系統通知',
    successMessage: '註冊成功，歡迎加入祈願文舍！',
    errorTitle: '註冊失敗',
    errorMessage: '請稍後再試。',
    onSuccess: async () => {
      await dialogStore.openInfoDialog({
        title: '註冊成功',
        message: '歡迎加入祈願文舍 🙏\n祝您願望早日實現！',
        confirmText: '前往首頁',
      });
      router.push('/home');
    },
    showCatchDialog: true,
  });
});

onMounted(() => {
  const cityNames = getAllCityNames();
  cityOptions.value = [
    { value: '', label: '縣市' },
    ...cityNames.map((city) => ({ value: city, label: city })),
  ];
  areaOptions.value = [{ value: '', label: '行政區' }];
});

watch(city, (newCity) => {
  if (newCity) {
    setFieldValue('area', '');
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

watch(area, (newArea) => {
  if (newArea) {
    const zipCode = getZipCodeByCityAndAreaName(city.value, newArea);
    if (zipCode) {
    }
  } else {
  }
});
</script>

<template>
  <div class="register">
    <SectionBackground variant="divination" />
    <div class="register__container">
      <MCard customClass="mcard--login login__card">
        <form @submit="onSubmit">
          <div class="register__content">
            <div class="register__main">
              <div class="register__form">
                <div class="register__form-inputs">
                  <p class="register__text register__text--required">信箱</p>
                  <input
                    class="register__form-input"
                    v-model="email"
                    v-bind="emailProps"
                    :class="{ 'register__form-input--error': errors.email }"
                  />
                  <p class="register__text register__text--error">
                    {{ errors.email }}
                  </p>
                </div>
                <div class="register__form-inputs m-t-20">
                  <p class="register__text register__text--required">手機</p>
                  <input
                    class="register__form-input"
                    v-model="phone"
                    v-bind="phoneProps"
                    :class="{
                      'register__form-input--error': errors.phone,
                    }"
                  />
                  <p class="register__text register__text--error">
                    {{ errors.phone }}
                  </p>
                </div>
                <div class="register__form-inputs m-t-20">
                  <p class="register__text register__text--required">密碼</p>
                  <input
                    class="register__form-input"
                    type="password"
                    v-model="password"
                    v-bind="passwordProps"
                    :class="{ 'register__form-input--error': errors.password }"
                  />
                  <p class="register__text register__text--error">
                    {{ errors.password }}
                  </p>
                </div>
                <div class="register__form-inputs m-t-20">
                  <p class="register__text register__text--required">
                    確認密碼
                  </p>
                  <input
                    class="register__form-input"
                    type="password"
                    v-model="confirmPassword"
                    v-bind="confirmPasswordProps"
                    :class="{
                      'register__form-input--error': errors.confirmPassword,
                    }"
                  />
                  <p class="register__text register__text--error">
                    {{ errors.confirmPassword }}
                  </p>
                </div>
              </div>
              <div class="register__divider">
                <div class="register__divider-line"></div>
              </div>
              <div class="register__form">
                <div class="register__form-inputs">
                  <p class="register__text register__text--required">暱稱</p>
                  <input
                    class="register__form-input"
                    v-model="nickName"
                    v-bind="nickNameProps"
                    :class="{ 'register__form-input--error': errors.nickName }"
                  />
                  <p class="register__text register__text--error">
                    {{ errors.nickName }}
                  </p>
                </div>
                <div class="register__form-inputs m-t-20">
                  <p class="register__text register__text--required">LINE ID</p>
                  <input
                    class="register__form-input"
                    v-model="lineId"
                    v-bind="lineIdProps"
                    :class="{ 'register__form-input--error': errors.lineId }"
                  />
                  <p class="register__text register__text--error">
                    {{ errors.lineId }}
                  </p>
                </div>
                <div class="register__form-inputs m-t-20">
                  <p class="register__text">收貨姓名</p>
                  <input
                    class="register__form-input"
                    v-model="addressName"
                    v-bind="addressNameProps"
                    :class="{
                      'register__form-input--error': errors.addressName,
                    }"
                  />
                  <p class="register__text register__text--error">
                    {{ errors.addressName }}
                  </p>
                </div>
                <div class="register__form-inputs--addr">
                  <div class="register__form-inputs w-50 m-t-20">
                    <p class="register__text">收貨地址</p>
                    <select
                      class="register__form-input"
                      v-model="city"
                      v-bind="cityProps"
                      :class="{ 'register__form-input--error': errors.city }"
                    >
                      <option
                        v-for="option in cityOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </option>
                    </select>

                    <p class="register__text register__text--error">
                      {{ errors.city }}
                    </p>
                  </div>
                  <div class="register__form-inputs w-50 m-t-20">
                    <select
                      class="register__form-input"
                      v-model="area"
                      v-bind="areaProps"
                      :class="{ 'register__form-input--error': errors.area }"
                    >
                      <option
                        v-for="option in areaOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </option>
                    </select>

                    <p class="register__text register__text--error">
                      {{ errors.area }}
                    </p>
                  </div>
                </div>

                <div class="register__form-inputs m-t-20">
                  <p class="register__text">詳細地址</p>
                  <input
                    class="register__form-input"
                    v-model="address"
                    v-bind="addressProps"
                    :class="{ 'register__form-input--error': errors.address }"
                  />
                  <p class="register__text register__text--error">
                    {{ errors.address }}
                  </p>
                </div>
              </div>
            </div>
            <div class="register__other">
              <div class="register__checkbox">
                <input
                  id="agreeTerms"
                  type="checkbox"
                  v-model="agreeTerms"
                  :class="{ 'register__checkbox--error': errors.agreeTerms }"
                />
                <label for="agreeTerms" class="register__agreeTerms-text">
                  我同意 <u>祈願文舍</u> 提供的
                  <u><a href="./policy" target="_blank">網站服務條款</a></u>
                  與
                  <u> <a href="./privacy" target="_blank">隱私權政策</a></u>
                  。
                </label>
              </div>
              <p class="register__text register__text--error">
                {{ errors.agreeTerms }}
              </p>
              <div class="register__other-btn">
                <button type="submit" class="register__btn">
                  註冊成為會員
                </button>
              </div>
            </div>
          </div>
        </form>
      </MCard>
    </div>
  </div>
</template>
