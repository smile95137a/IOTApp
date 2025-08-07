<template>
  <div class="admin-delivery-note">
    <h1 class="admin-delivery-note__title">出貨單</h1>

    <div v-if="note" class="admin-delivery-note__content">
      <!-- 基本資訊 -->
      <div class="admin-delivery-note__section">
        <h2 class="admin-delivery-note__section-title">訂單資訊</h2>
        <p><strong>訂單編號：</strong>{{ note.orderId }}</p>
        <p>
          <strong>訂單日期：</strong>
          <DateFormatter :date="note.orderDate" format="YYYY/MM/DD HH:mm:ss" />
        </p>
        <p><strong>會員 Email：</strong>{{ note.memberEmail }}</p>
        <p><strong>訂單金額：</strong>${{ note.totalAmount.toFixed(2) }}</p>
        <p><strong>運費：</strong>${{ note.shippingAmount.toFixed(2) }}</p>
        <p><strong>備註：</strong>{{ note.remark || '—' }}</p>
        <p><strong>物流單號：</strong>{{ note.trackingNo || '—' }}</p>
      </div>

      <!-- 收件人資訊 -->
      <div class="admin-delivery-note__section">
        <h2 class="admin-delivery-note__section-title">收件人資訊</h2>
        <p><strong>姓名：</strong>{{ note.recipientName }}</p>
        <p><strong>電話：</strong>{{ note.recipientPhone }}</p>
        <p><strong>地址：</strong>{{ note.address || '—' }}</p>
      </div>

      <!-- 商品明細 -->
      <div class="admin-delivery-note__section">
        <h2 class="admin-delivery-note__section-title">出貨商品</h2>
        <table class="admin-delivery-note__table">
          <thead>
            <tr>
              <th>商品名稱</th>
              <th>單價</th>
              <th>數量</th>
              <th>小計</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in note.items" :key="item.productId">
              <td>{{ item.productName }}</td>
              <td>${{ item.unitPrice.toFixed(2) }}</td>
              <td>{{ item.quantity }}</td>
              <td>${{ item.subtotal.toFixed(2) }}</td>
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
import { fetchDeliveryNote } from '@/services/admin/adminOrderServices';
import DateFormatter from '@/components/common/DateFormatter.vue';

const route = useRoute();
const note = ref<any>(null);

const loadDeliveryNote = async () => {
  const res = await fetchDeliveryNote(route.params.orderId as string);
  if (res.success) {
    note.value = res.data;
  }
};

onMounted(loadDeliveryNote);
</script>

<style scoped lang="scss">
.admin-delivery-note {
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
