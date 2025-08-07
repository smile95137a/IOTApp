<template>
  <div class="checkout-success">
    <SectionBackground variant="divination" />
    <div class="checkout-success__container">
      <MCard customClass="p-48">
        <h2 class="checkout-success__title">訂購成功！</h2>
        <p class="checkout-success__subtitle">
          感謝您的消費！以下為您的訂單明細
        </p>

        <div class="checkout-success__content">
          <!-- 商品資訊 -->
          <div class="checkout-success__section">
            <h3>商品資訊</h3>
            <div
              class="checkout-success__product"
              v-for="item in products"
              :key="item.productId"
            >
              <div class="checkout-success__image">
                <img
                  v-if="item.productUrl"
                  :src="getImageUrl(item.productUrl)"
                  :alt="item.productName"
                />
              </div>
              <div class="checkout-success__product-info">
                <p>{{ item.productName }}</p>
                <p class="checkout-success__price">${{ item.unitPrice }}</p>
              </div>
            </div>
          </div>

          <!-- 寄送資訊 -->
          <div class="checkout-success__section">
            <h3>寄送資訊</h3>
            <p>{{ shippingMethod }}</p>
            <p>收件人：{{ recipientName }}（{{ recipientPhone }}）</p>
            <p v-if="recipientAddress">地址：{{ recipientAddress }}</p>
            <p>發票：{{ invoiceInfo }}</p>
          </div>

          <!-- 優惠 -->
          <div class="checkout-success__section" v-if="discount > 0">
            <h3>優惠</h3>
            <p>優惠折抵</p>
            <p class="checkout-success__price">-${{ discount }}</p>
          </div>

          <!-- 付款 -->
          <div class="checkout-success__section">
            <h3>付款</h3>
            <p>{{ paymentMethod }}</p>
          </div>

          <!-- 總金額 -->
          <div class="checkout-success__total">
            <span>總金額：</span>
            <strong>${{ totalAmount }}</strong>
          </div>
        </div>
      </MCard>

      <!-- 按鈕 -->
      <div class="checkout-success__actions">
        <button class="btn btn-outline" @click="goHome">回首頁</button>
        <button class="btn btn-primary" @click="continueShopping">
          繼續購買
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MCard from '@/components/common/MCard.vue';
import SectionBackground from '@/components/common/SectionBackground.vue';
import { getOrderDetail } from '@/services/OrderService';
import { useDialogStore } from '@/stores/dialogStore';
import { executeApi } from '@/utils/executeApiUtils';
import { getImageUrl } from '@/utils/ImageUtils';
const route = useRoute();
const router = useRouter();
const dialogStore = useDialogStore();

const orderId = route.params.id as string;

const products = ref<any[]>([]);
const shippingMethod = ref('');
const invoiceInfo = ref('');
const recipientName = ref('');
const recipientPhone = ref('');
const recipientAddress = ref('');
const discount = ref(0);
const totalAmount = ref(0);
const paymentMethod = ref('');

const init = async () => {
  await executeApi({
    fn: () => getOrderDetail(orderId),
    errorTitle: '錯誤',
    errorMessage: '取得訂單失敗，請稍後再試。',
    onSuccess: (order) => {
      products.value = order.items || [];
      totalAmount.value = order.totalAmount ?? 0;
      discount.value = order.discount ?? 0;

      shippingMethod.value = order.shippingMethod || '';
      const invoiceLabelMap: Record<string, string> = {
        company: '三聯式發票',
        mobile: '手機載具',
      };

      invoiceInfo.value =
        invoiceLabelMap[order.invoiceType] || '個人二聯式發票';
      paymentMethod.value = '待付款';

      recipientName.value = order.recipientName || '';
      recipientPhone.value = order.recipientPhone || '';
      recipientAddress.value = order.recipientAddress || '';
    },
    onFail: async (data) => {
      await dialogStore.openInfoDialog({
        title: '錯誤',
        message: data?.message ?? '取得訂單失敗',
      });
    },
  });
};

const goHome = () => {
  router.push('/');
};

const continueShopping = () => {
  router.push('/store');
};

onMounted(() => {
  if (orderId) init();
});
</script>

<style scoped lang="scss">
.checkout-success {
  width: 100%;
  position: relative;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;
  }

  &__title {
    font-size: 1.75rem;
    color: #a93e26;
    text-align: center;
    margin-bottom: 0.5rem;
  }

  &__subtitle {
    text-align: center;
    margin-bottom: 2rem;
    color: #a93e26;
  }

  &__content {
    font-size: 1rem;
    line-height: 1.8;
    color: #333;
  }

  &__section {
    margin-bottom: 1.5rem;
  }

  &__product {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  &__image {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    flex-shrink: 0;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__product-info {
    flex: 1;
  }

  &__price {
    float: right;
    font-weight: bold;
  }

  &__total {
    border-top: 1px solid #ccc;
    padding-top: 1rem;
    text-align: right;
    font-size: 1.25rem;
    font-weight: bold;
    margin-top: 1rem;
  }

  &__actions {
    margin-top: 2.5rem;
    display: flex;
    justify-content: center;
    gap: 1.5rem;

    .btn {
      padding: 0.75rem 2rem;
      font-size: 1.125rem;
      border-radius: 999px;
      min-width: 120px;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .btn-outline {
      background: white;
      border: 2px solid #a93e26;
      color: #a93e26;

      &:hover {
        background: #f5d8d2;
      }
    }

    .btn-primary {
      background: #a93e26;
      color: white;
      border: 2px solid #a93e26;

      &:hover {
        background: #902f1d;
      }
    }
  }

  @media (max-width: 600px) {
    &__container {
      padding: 2rem 1rem;
    }

    &__actions {
      flex-direction: column;
      align-items: center;

      .btn {
        width: 100%;
        max-width: 300px;
      }
    }

    &__product {
      flex-direction: column;
      align-items: flex-start;
    }

    &__image {
      margin-bottom: 0.5rem;
    }

    &__price {
      float: none;
      text-align: left;
    }

    &__total {
      text-align: center;
    }
  }
}
</style>
