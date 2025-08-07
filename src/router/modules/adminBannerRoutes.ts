import { RouteRecordRaw } from 'vue-router';
import BannerManagement from '@/views/admin/banner/BannerManagement.vue';
import BannerForm from '@/views/admin/banner/BannerForm.vue';

const adminBannerRoutes: RouteRecordRaw = {
  path: 'banners',
  meta: { requiresAuth: true, layout: 'admin' },
  children: [
    {
      path: '',
      name: 'BannerList',
      component: BannerManagement,
      meta: { requiresAuth: true, layout: 'admin' },
    },
    {
      path: 'add',
      name: 'BannerAdd',
      component: BannerForm,
      meta: { requiresAuth: true, layout: 'admin' },
    },
    {
      path: 'edit/:id',
      name: 'BannerEdit',
      component: BannerForm,
      meta: { requiresAuth: true, layout: 'admin' },
    },
  ],
};

export default adminBannerRoutes;
