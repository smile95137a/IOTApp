import { RouteRecordRaw } from 'vue-router';
import AdminDashboard from '@/views/admin/AdminDashboard.vue';
import AdminLogin from '@/views/admin/AdminLogin.vue';
import AdminNotFound from '@/views/admin/AdminNotFound.vue';

import adminOfferingRoutes from './modules/adminOfferingRoutes';
import adminMasterRoutes from './modules/adminMasterRoutes';
import adminBannerRoutes from './modules/adminBannerRoutes';
import adminMallRoutes from './modules/adminMallRoutes';

import adminOrderRoutes from './modules/adminOrderRoutes';
import adminShippingMethodRoutes from './modules/adminShippingRoutes';
import adminReportRoutes from './modules/adminReportRoutes';
import adminSettingRoutes from './modules/adminSettingRoutes';

export const adminRoutes: Array<RouteRecordRaw> = [
  {
    path: '/admin/login',
    component: AdminLogin,
    meta: { layout: 'admin' },
  },
  {
    path: '/admin',
    component: AdminDashboard,
    meta: { requiresAuth: true, layout: 'admin' },
    children: [
      {
        path: '',
        redirect: '/admin/offerings',
      },
      adminOfferingRoutes,
      adminMasterRoutes,
      adminBannerRoutes,
      adminMallRoutes,
      adminOrderRoutes,
      adminShippingMethodRoutes,
      adminReportRoutes,
      adminSettingRoutes,
      {
        path: ':pathMatch(.*)*',
        name: 'AdminNotFound',
        component: AdminNotFound,
      },
    ],
  },
];

export default adminRoutes;
