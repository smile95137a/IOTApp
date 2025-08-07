import { RouteRecordRaw } from 'vue-router';
import MallCategoryManagement from '@/views/admin/mall/category/MallCategoryManagement.vue';
import MallCategoryForm from '@/views/admin/mall/category/MallCategoryForm.vue';
import MallItemManagement from '@/views/admin/mall/item/MallItemManagement.vue';
import MallItemForm from '@/views/admin/mall/item/MallItemForm.vue';

const adminMallRoutes: RouteRecordRaw = {
  path: 'mall',
  meta: { requiresAuth: true, layout: 'admin' },
  children: [
    {
      path: 'categories',
      name: 'MallCategoryList',
      component: MallCategoryManagement,
      meta: { requiresAuth: true, layout: 'admin' },
    },
    {
      path: 'categories/add',
      name: 'MallCategoryAdd',
      component: MallCategoryForm,
      meta: { requiresAuth: true, layout: 'admin' },
    },
    {
      path: 'categories/edit/:id',
      name: 'MallCategoryEdit',
      component: MallCategoryForm,
      meta: { requiresAuth: true, layout: 'admin' },
    },
    {
      path: 'items',
      name: 'MallItemList',
      component: MallItemManagement,
      meta: { requiresAuth: true, layout: 'admin' },
    },
    {
      path: 'items/add',
      name: 'MallItemAdd',
      component: MallItemForm,
      meta: { requiresAuth: true, layout: 'admin' },
    },
    {
      path: 'items/edit/:id',
      name: 'MallItemEdit',
      component: MallItemForm,
      meta: { requiresAuth: true, layout: 'admin' },
    },
  ],
};

export default adminMallRoutes;
