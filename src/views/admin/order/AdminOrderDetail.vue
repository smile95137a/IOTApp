<template>
  <div class="admin-order-detail">
    <h1 class="admin-order-detail__title">訂單詳情</h1>

    <div v-if="order" class="admin-order-detail__content">
      <!-- 基本資訊 -->
      <div class="admin-order-detail__section">
        <h2 class="admin-order-detail__section-title">基本資訊</h2>
        <p><strong>訂單編號：</strong>{{ order.id }}</p>
        <p>
          <strong>總金額：</strong>
          $
          <NumberFormatter :number="order.totalAmount" />
        </p>
        <p><strong>訂單狀態：</strong>{{ order.status }}</p>
        <p><strong>付款狀態：</strong>{{ order.paymentStatus }}</p>
        <p><strong>物流方式：</strong>{{ order.shippingMethod }}</p>
        <p><strong>物流單號：</strong>{{ order.trackingNo || '—' }}</p>
        <p><strong>備註：</strong>{{ order.remark || '—' }}</p>
        <p>
          <strong>建立時間：</strong>
          <DateFormatter
            :date="order.createTime"
            format="YYYY/MM/DD HH:mm:ss"
          />
        </p>
      </div>

      <!-- 收件人資訊 -->
      <div class="admin-order-detail__section">
        <h2 class="admin-order-detail__section-title">收件人資訊</h2>
        <p><strong>姓名：</strong>{{ order.recipientName }}</p>
        <p><strong>電話：</strong>{{ order.recipientPhone }}</p>
        <p><strong>地址：</strong>{{ order.recipientAddress || '—' }}</p>
      </div>

      <!-- 發票資訊 -->
      <div class="admin-order-detail__section">
        <h2 class="admin-order-detail__section-title">發票資訊</h2>
        <p>
          <strong>發票類型：</strong
          >{{ getInvoiceTypeLabel(order.invoiceType) }}
        </p>
        <p><strong>發票抬頭：</strong>{{ order.invoiceTarget || '—' }}</p>
      </div>

      <!-- 商品明細 -->
      <div class="admin-order-detail__section">
        <h2 class="admin-order-detail__section-title">商品明細</h2>
        <table class="admin-order-detail__table">
          <thead>
            <tr>
              <th>商品名稱</th>
              <th>單價</th>
              <th>數量</th>
              <th>小計</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in order.items" :key="item.productId">
              <td>{{ item.productName }}</td>
              <td>$<NumberFormatter :number="item.unitPrice" /></td>
              <td>{{ item.quantity }}</td>
              <td>
                $
                <NumberFormatter :number="item.subtotal" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { fetchOrderDetail } from '@/services/admin/adminOrderServices';
import DateFormatter from '@/components/common/DateFormatter.vue';
import NumberFormatter from '@/components/common/NumberFormatter.vue';

const route = useRoute();
const order = ref<any>(null);

const getInvoiceTypeLabel = (type: string): string => {
  switch (type) {
    case 'mobile':
      return '手機載具';
    case 'triplicate':
      return '三聯式發票';
    case 'donate':
      return '捐贈發票';
    default:
      return '無';
  }
};

const loadDetail = async () => {
  const res = await fetchOrderDetail(route.params.orderId as string);
  if (res.success) {
    order.value = res.data;
  }
};

onMounted(() => {
  loadDetail();
});
</script>

<style scoped lang="scss">
.admin-order-detail {
  padding: 2rem;

  &__title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  &__section {
    background-color: #f9f9f9;
    padding: 1.5rem;
    border-radius: 6px;
    border: 1px solid #ddd;
  }

  &__section-title {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: #a2352c;
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;

    th,
    td {
      border: 1px solid #ccc;
      padding: 0.75rem;
      text-align: center;
    }

    th {
      background-color: #eee;
    }
  }
}
</style>
