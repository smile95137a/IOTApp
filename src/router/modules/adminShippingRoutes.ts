import { RouteRecordRaw } from 'vue-router';
import ShippingMethodList from '@/views/admin/shipping/ShippingMethodList.vue';
import ShippingMethodForm from '@/views/admin/shipping/ShippingMethodForm.vue';

const adminShippingMethodRoutes: RouteRecordRaw = {
  path: 'shipping-method',
  meta: { requiresAuth: true, layout: 'admin' },
  children: [
    {
      path: '',
      name: 'ShippingMethodList',
      component: ShippingMethodList,
      meta: { requiresAuth: true, layout: 'admin' },
    },
    {
      path: 'add',
      name: 'ShippingMethodAdd',
      component: ShippingMethodForm,
      meta: { requiresAuth: true, layout: 'admin' },
    },
    {
      path: 'edit/:id',
      name: 'ShippingMethodEdit',
      component: ShippingMethodForm,
      meta: { requiresAuth: true, layout: 'admin' },
    },
  ],
};

export default adminShippingMethodRoutes;
