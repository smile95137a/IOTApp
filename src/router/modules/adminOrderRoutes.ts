import { RouteRecordRaw } from 'vue-router';
import AdminOrderList from '@/views/admin/order/AdminOrderList.vue';
import AdminOrderDetail from '@/views/admin/order/AdminOrderDetail.vue';
import AdminDeliveryNote from '@/views/admin/order/AdminDeliveryNote.vue';

const adminOrderRoutes: RouteRecordRaw = {
  path: 'orders',
  meta: { requiresAuth: true, layout: 'admin' },
  children: [
    {
      path: '',
      name: 'AdminOrderList',
      component: AdminOrderList,
      meta: { requiresAuth: true, layout: 'admin' },
    },
    {
      path: 'detail/:orderId',
      name: 'AdminOrderDetail',
      component: AdminOrderDetail,
      meta: { requiresAuth: true, layout: 'admin' },
    },
    {
      path: 'delivery-note/:orderId',
      name: 'AdminDeliveryNote',
      component: AdminDeliveryNote,
      meta: { requiresAuth: true, layout: 'admin' },
    },
  ],
};

export default adminOrderRoutes;
