import { RouteRecordRaw } from 'vue-router';
import MasterList from '@/views/admin/master/MasterList.vue';
import MasterForm from '@/views/admin/master/MasterForm.vue';

const adminMasterRoutes: RouteRecordRaw = {
  path: 'masters',
  meta: { requiresAuth: true, layout: 'admin' },
  children: [
    {
      path: '',
      name: 'MasterList',
      component: MasterList,
      meta: { requiresAuth: true, layout: 'admin' },
    },
    {
      path: 'add',
      name: 'MasterAdd',
      component: MasterForm,
      meta: { requiresAuth: true, layout: 'admin' },
    },
    {
      path: 'edit/:id',
      name: 'MasterEdit',
      component: MasterForm,
      meta: { requiresAuth: true, layout: 'admin' },
    },
  ],
};

export default adminMasterRoutes;
