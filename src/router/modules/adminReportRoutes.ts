// router/modules/adminReportRoutes.ts
import type { RouteRecordRaw } from 'vue-router';

import LanternPurchaseReport from '@/views/admin/report/LanternPurchaseReport.vue';
import OfferingPurchaseReport from '@/views/admin/report/OfferingPurchaseReport.vue';
import MasterReservationReport from '@/views/admin/report/MasterReservationReport.vue';

const adminReportRoutes: RouteRecordRaw = {
  path: 'reports',
  meta: { requiresAuth: true, layout: 'admin' },
  children: [
    {
      path: 'lantern-purchases',
      name: 'LanternPurchaseReport',
      component: LanternPurchaseReport,
    },
    {
      path: 'offering-purchases',
      name: 'OfferingPurchaseReport',
      component: OfferingPurchaseReport,
    },
    {
      path: 'master-reservations',
      name: 'MasterReservationReport',
      component: MasterReservationReport,
    },
  ],
};

export default adminReportRoutes;
