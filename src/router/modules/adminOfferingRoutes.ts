// src/router/modules/adminOfferingRoutes.ts
import { RouteRecordRaw } from 'vue-router';
import OfferingManagement from '@/views/admin/offering/OfferingManagement.vue';
import OfferingForm from '@/views/admin/offering/OfferingForm.vue';

const adminOfferingRoutes: RouteRecordRaw = {
  path: 'offerings',
  meta: { requiresAuth: true, layout: 'admin' },
  children: [
    {
      path: '',
      name: 'AdminOfferingList',
      component: OfferingManagement,
      meta: { requiresAuth: true, layout: 'admin' },
    },
    {
      path: 'add',
      name: 'AdminOfferingAdd',
      component: OfferingForm,
      meta: { requiresAuth: true, layout: 'admin' },
    },
    {
      path: 'edit/:id',
      name: 'AdminOfferingEdit',
      component: OfferingForm,
      meta: { requiresAuth: true, layout: 'admin' },
    },
  ],
};

export default adminOfferingRoutes;
