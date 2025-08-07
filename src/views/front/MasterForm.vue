<template>
  <section class="master-form">
    <SectionBackground variant="divination" />
    <div class="master-form__container">
      <Title color="dark" text="大師親算" />
      <div class="master-form__main">
        <div class="master-form__card">
          <h2 class="master-form__title">
            購買：{{ store.selectedMaster.name }}
            {{ store.selectedMaster.title }} 親算
          </h2>

          <div class="master-form__field-row">
            <label class="master-form__label">選擇親算項目</label>
            <select v-model="store.selectedTopic" class="master-form__select">
              <option v-for="topic in topics" :key="topic" :value="topic">
                {{ topic }}
              </option>
            </select>
          </div>

          <div class="master-form__field-row">
            <label class="master-form__label">費用</label>
            <span class="master-form__price"
              >NT

              <NumberFormatter :number="selectedPrice" />
            </span>
          </div>

          <div class="master-form__info-block">
            <p class="master-form__block-title">填寫聯絡資訊</p>
            <div class="master-form__input-group">
              <label>姓名：</label>
              <input v-model="store.name" class="master-form__input" />
            </div>
            <div class="master-form__input-group">
              <label>電話：</label>
              <input v-model="store.phone" class="master-form__input" />
            </div>
            <div class="master-form__input-group">
              <label>E-mail：</label>
              <input v-model="store.email" class="master-form__input" />
            </div>
            <div class="master-form__input-group">
              <label>LINE ID：</label>
              <input v-model="store.lineId" class="master-form__input" />
            </div>
          </div>

          <div class="master-form__btn-wrapper">
            <button class="master-form__btn" @click="submitForm">
              確認送出 <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useMasterOrderStore } from '@/stores/masterOrderStore';
import SectionBackground from '@/components/common/SectionBackground.vue';
import Title from '@/components/common/Title.vue';
import { reserveMasterService } from '@/services/masterServices';
import { useDialogStore } from '@/stores/dialogStore';
import { withLoading } from '@/utils/loadingUtils';
import NumberFormatter from '@/components/common/NumberFormatter.vue';
import { submitPaymentForm } from '@/utils/paymentUtils';
import { getProfile } from '@/services/UserService';
import { useRouter } from 'vue-router';
const router = useRouter();

const store = useMasterOrderStore();
const dialog = useDialogStore();

const topics = computed(() => {
  return store.selectedMaster?.serviceItem?.map((item) => item.title) || [];
});
const selectedPrice = computed(() => {
  const match = store.selectedMaster?.serviceItem?.find(
    (item) => item.title === store.selectedTopic
  );
  return match?.price || 0;
});

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPhone = (phone: string) => /^09\d{8}$/.test(phone); // 台灣 10 碼手機格式

const validateForm = async (): Promise<boolean> => {
  if (!store.selectedTopic) {
    await dialog.openInfoDialog({
      title: '格式錯誤',
      message: '請選擇親算項目',
    });
    return false;
  }

  if (!store.name?.trim()) {
    await dialog.openInfoDialog({
      title: '格式錯誤',
      message: '請輸入姓名',
    });
    return false;
  }

  if (!store.phone?.trim() || !isValidPhone(store.phone)) {
    await dialog.openInfoDialog({
      title: '格式錯誤',
      message: '請輸入正確的電話號碼（例如：0912345678）',
    });
    return false;
  }

  if (!store.email?.trim() || !isValidEmail(store.email)) {
    await dialog.openInfoDialog({
      title: '格式錯誤',
      message: '請輸入正確的 Email 格式，例如：example@example.com',
    });
    return false;
  }

  if (!store.lineId?.trim()) {
    await dialog.openInfoDialog({
      title: '格式錯誤',
      message: '請輸入 LINE ID',
    });
    return false;
  }

  return true;
};

const submitForm = async () => {
  const isValid = await validateForm();
  if (!isValid) return;

  const resProfile = await getProfile();

  if (resProfile.data.invoice == null) {
    const goToProfile = await dialog.openConfirmDialog({
      title: '尚未填寫發票資訊',
      message: '您尚未填寫發票資訊，是否前往會員中心補填？',
      confirmText: '前往填寫',
      cancelText: '取消',
    });

    if (goToProfile) {
      router.push('/member-center/memberProfile');
    }
    return;
  }

  try {
    const res = await dialog.openPaymentMethodDialog();

    if (!res?.code) {
      await dialog.openInfoDialog({
        title: '尚未選擇付款方式',
        message: '請選擇付款方式後再送出',
      });
      return;
    }
    const confirmed = await dialog.openConfirmDialog({
      title: '確認送出',
      message: '是否確認送出預約申請？',
      confirmText: '確認送出',
      cancelText: '再想想',
    });

    if (!confirmed) return;

    const payload = {
      serviceItem: store.selectedTopic,
      masterCode: store.selectedMaster.code,
      customerName: store.name,
      customerLine: store.lineId,
      customerEmail: store.email,
      customerPhone: store.phone,
      note: '',
      paymentMethod: res.code,
    };

    const { success, data } = await withLoading(() =>
      reserveMasterService(payload)
    );

    if (success) {
      store.productCode = data;

      await dialog.openInfoDialog({
        title: '預約成功',
        message: '已成功送出您的預約申請，稍後將有專人與您聯繫！',
      });
      if (res?.code === 'credit_card') {
        submitPaymentForm({
          sendType: '0',
          orderNumber: data.externalPaymentNo,
          totalAmount: data.price,
          buyerMemo: '大師親算 - 信用卡付款',
          returnUrl: `${window.location.origin}/paymentCBMaster`,
        });
      }
    } else {
      await dialog.openInfoDialog({
        title: '預約失敗',
        message: '預約未成功，請稍後再試。',
      });
    }
  } catch (error) {
    await dialog.openInfoDialog({
      title: '系統錯誤',
      message: '系統異常，請稍後再試。',
    });
  }
};
</script>

<style scoped lang="scss">
.master-form {
  width: 100%;
  position: relative;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;
  }

  &__card {
    background: #fff;
    border-radius: 12px;
    padding: 2rem;
    width: 100%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  &__title {
    font-weight: bold;
    font-size: 1.2rem;
    color: #a53b25;
    margin-bottom: 1.5rem;
  }

  &__field-row {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    gap: 1rem;

    label {
      width: 120px;
      font-weight: bold;
    }
  }

  &__select {
    flex: 1;
    padding: 0.5rem;
    border-radius: 6px;
    border: 1px solid #ccc;
  }

  &__price {
    color: #e85028;
    font-weight: bold;
    font-size: 1rem;
  }

  &__info-block {
    background: #fbe9e7;
    padding: 1.5rem;
    border-radius: 8px;
    margin-top: 1.5rem;
  }

  &__block-title {
    font-weight: bold;
    color: #333;
    margin-bottom: 1rem;
  }

  &__input-group {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;

    label {
      width: 80px;
    }

    input {
      flex: 1;
    }
  }

  &__input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    width: 100%;
  }

  &__btn-wrapper {
    margin-top: 2rem;
    text-align: center;
  }

  &__btn {
    background: #a53b25;
    color: white;
    padding: 0.75rem 2rem;
    border-radius: 999px;
    border: none;
    font-weight: bold;
    cursor: pointer;
    font-size: 1rem;

    i {
      margin-left: 0.5rem;
    }

    &:hover {
      background: #892d1f;
    }
  }
}
</style>
