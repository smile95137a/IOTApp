import { createRouter, createWebHistory } from 'vue-router';
import { frontRoutes } from './frontRouter';
import { adminRoutes } from './adminRouter';
import { useAuthAdminStore } from '@/stores/authAdminStore';
import { useAuthFrontStore } from '@/stores/authFrontStore';

const routes = [...frontRoutes, ...adminRoutes];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  const isAdminRoute = to.path.startsWith('/admin');

  if (to.meta.requiresAuth) {
    if (isAdminRoute) {
      const adminAuth = useAuthAdminStore();
      if (!adminAuth.isLogin) return next('/admin/login');
    } else {
      const userAuth = useAuthFrontStore();
      if (!userAuth.isLogin) return next('/login');
    }
  }

  next();
});

export default router;
