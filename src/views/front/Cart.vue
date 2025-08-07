<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useCartStore } from '@/stores/cartStore';
import MCard from '@/components/common/MCard.vue';
import SectionBackground from '@/components/common/SectionBackground.vue';
import NumberFormatter from '@/components/common/NumberFormatter.vue';
import CartRecipient from '@/components/front/Cart/CartRecipient.vue';
import CartInvoice from '@/components/front/Cart/CartInvoice.vue';
import CartShipping from '@/components/front/Cart/CartShipping.vue';
import CartPayment from '@/components/front/Cart/CartPayment.vue';
import { ref, onMounted } from 'vue';
import { createOrder, getShippingMethodList } from '@/services/OrderService';
import { useDialogStore } from '@/stores/dialogStore';
import { getErrorMessage } from '@/utils/ErrorUtils';
import { withLoading } from '@/utils/loadingUtils';
import { getImageUrl } from '@/utils/ImageUtils';
import { useAuthFrontStore } from '@/stores/authFrontStore';
import { getProfile } from '@/services/UserService';
import { submitPaymentForm } from '@/utils/paymentUtils';

const router = useRouter();

const cart = useCartStore();
const authStore = useAuthFrontStore();
const dialogStore = useDialogStore();
const cartItems = cart.cartItems;
const shippingMethodOptions = ref<any[]>([]);

const initOptions = async () => {
  try {
    const [shippingRes] = await Promise.all([getShippingMethodList()]);

    if (shippingRes.success) {
      shippingMethodOptions.value = shippingRes.data.map((s: any) => ({
        id: s.id,
        label: s.name,
        value: s.code,
        fee: s.fee,
      }));
    }
  } catch (error) {
    console.error('初始化選項失敗', error);
  }
};

onMounted(async () => {
  if (!authStore.isLogin) {
    await dialogStore.openInfoDialog({
      title: '錯誤',
      message: '請先登入後再結帳。',
    });
    router.replace({ name: 'Login' });
    return;
  }

  if (cartItems.length === 0) {
    await dialogStore.openInfoDialog({
      title: '錯誤',
      message: '購物車為空，請先選購商品。',
    });
    router.replace({ name: 'StoreProductList' });
    return;
  }

  await initOptions();
});

const schema = yup.object({
  recipient: yup.object({
    name: yup.string().required('姓名為必填'),
    email: yup.string().email('Email 格式錯誤').required('Email 為必填'),
    phone: yup.string().required('電話為必填'),
    city: yup.string().required('縣市為必填'),
    area: yup.string().required('行政區為必填'),
    address: yup.string().required('地址為必填'),
  }),
  shippingMethod: yup.string().required('請選擇寄送方式'),
  invoiceType: yup.string().required('請選擇發票格式'),
  payment: yup.string().required('請選擇付款方式'),

  invoiceTarget: yup
    .string()
    .when('invoiceType', (invoiceType: any, schema) => {
      return invoiceType === 'company'
        ? schema.required('請填寫統一編號')
        : schema.optional().nullable();
    }),

  carrierId: yup.string().when('invoiceType', (invoiceType: any, schema) => {
    return ['mobile', 'citizen'].includes(invoiceType ?? '')
      ? schema.required('請輸入載具內容')
      : schema.optional().nullable();
  }),

  npoban: yup.string().when('invoiceType', (invoiceType: any, schema) => {
    return invoiceType === 'donate'
      ? schema.required('請填寫愛心碼')
      : schema.optional().nullable();
  }),
});

// ---- useForm 統一表單 ----
const { handleSubmit, defineField, errors, values, setFieldValue, setValues } =
  useForm({
    validationSchema: schema,
    initialValues: {
      recipient: {
        name: '',
        email: '',
        phone: '',
        city: '',
        area: '',
        address: '',
      },
      shippingMethod: '',
      invoiceType: '',
      invoiceTarget: '',
      carrierType: '9',
      carrierId: '',
      npoban: '',
      payment: '',
      storeId: '',
      storeName: '',
      storeAddress: '',
    },
  });

const [shippingMethod] = defineField('shippingMethod');

// ---- 價格計算 ----
const productTotal = computed(() =>
  cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

const shippingFee = computed(() => {
  const selected: any = shippingMethodOptions.value.find(
    (opt) => opt.value === shippingMethod.value
  );
  return selected ? selected.fee ?? 0 : 0;
});

const total = computed(() => productTotal.value + shippingFee.value);

const submitOrder = handleSubmit(async (formData) => {
  const selectedShipping = shippingMethodOptions.value.find(
    (opt) => opt.value === formData.shippingMethod
  );
  const payload = {
    items: cartItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    })),
    shippingMethodId: selectedShipping.id,
    payMethod: formData.payment,
    invoiceType: formData.invoiceType,
    invoiceTarget: formData.invoiceTarget || '',
    carrierType:
      {
        mobile: '1',
        citizen: '2',
        member: '3',
        donate: '9',
        personal: '9',
        company: '9',
      }[formData.invoiceType] ?? '9',
    carrierId: formData.carrierId || '',
    npoban: formData.npoban || '',
    remark: '',

    ...{
      homeDeliveryRecipient: {
        name: formData.recipient.name,
        phone: formData.recipient.phone,
        address: `${formData.recipient.city}${formData.recipient.area}${formData.recipient.address}`,
      },
    },

    ...(['FAMILY', 'HI_LIFE', '7_ELEVEN', 'OK_MART', 'FAMILY_COLD'].includes(
      formData.shippingMethod
    ) && {
      storePickupRecipient: {
        storeId: formData.storeId,
        storeName: formData.storeName,
        storeAddress: formData.storeAddress,
        recipientName: formData.recipient.name,
        phone: formData.recipient.phone,
      },
    }),
  };

  try {
    const { success, data, message } = await withLoading(() =>
      createOrder(payload)
    );

    if (success) {
      cart.clearCart();

      switch (data.payMethod) {
        case 'credit_card':
          submitPaymentForm({
            sendType: '0',
            orderNumber: data.externalOrderNo,
            totalAmount: data.totalAmount,
            buyerMemo: '開運商城 - 信用卡付款',
            returnUrl: `${window.location.origin}/PaymentCB`,
          });
          break;

        case 'ATM_TRANSFER':
          const res = await getProfile();
          const profile = res.success ? res.data : {};

          submitPaymentForm({
            sendType: '4',
            orderNumber: data.externalOrderNo,
            totalAmount: data.totalAmount,
            buyerName: profile.nickName || '',
            buyerPhone: profile.phone || '',
            buyerEmail: profile.email || '',
            buyerMemo: '開運商城 - ATM轉帳',
            callbackUrl: `${
              import.meta.env.VITE_BASE_API_URL
            }/payment/atmCallback`,
          });
          break;

        default:
          // 預設導頁至成功頁（若有其他付款方式）
          router.push({
            name: 'CheckoutSuccess',
            params: { orderId: data.orderId },
          });
      }

      return;
    } else {
      await dialogStore.openInfoDialog({
        title: '錯誤',
        message: message || '密碼重置失敗，請稍後再試。',
      });
    }
  } catch (error) {
    await dialogStore.openInfoDialog({
      title: '錯誤',
      message: getErrorMessage(error),
    });
  }
});

const handleDecrease = (index: number) => {
  const item = cartItems[index];
  if (item.quantity > 1) {
    item.quantity -= 1;
  } else {
    cart.removeItem(index);
  }
};
</script>
<template>
  <form @submit.prevent="submitOrder">
    <div class="checkout">
      <SectionBackground variant="divination" />
      <div class="checkout__container">
        <MCard customClass="p-48">
          <h3>商品資訊</h3>
          <div
            v-for="(item, index) in cartItems"
            :key="index"
            class="checkout__item"
          >
            <div class="checkout__item-img">
              <img :src="getImageUrl(item.imageUrl)" :alt="item.name" />
            </div>

            <div class="checkout__item-info">
              <p>{{ item.name }}</p>
              <div class="checkout__item-control">
                <button @click="handleDecrease(index)">
                  <i class="fas fa-minus"></i>
                </button>
                <span>{{ item.quantity }}</span>
                <button @click="item.quantity += 1">
                  <i class="fas fa-plus"></i>
                </button>
                <p class="price">
                  NT$
                  <NumberFormatter :number="~~item.price * ~~item.quantity" />
                </p>
              </div>
            </div>
          </div>

          <div class="flex flex-column gap-y-24">
            <div>
              <CartRecipient />
            </div>
            <div>
              <CartShipping />
            </div>
            <div>
              <CartInvoice />
            </div>
            <div>
              <CartPayment />
            </div>
          </div>
          <div class="checkout__total">
            <p>商品：NT$ <NumberFormatter :number="productTotal ?? 0" /></p>
            <p>
              運費：NT$

              <NumberFormatter :number="shippingFee ?? 0" />
            </p>
            <p class="total">
              總金額：<strong
                >NT$

                <NumberFormatter :number="total ?? 0" />
              </strong>
            </p>
          </div>

          <div class="checkout__buttons">
            <button class="btn btn-outline" @click="$router.back()">
              回上頁
            </button>
            <button class="btn btn-primary" type="submit">結帳</button>
          </div>
        </MCard>
      </div>
    </div>
  </form>
</template>
