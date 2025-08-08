import { createRouter, createWebHistory } from 'vue-router';
import { frontRoutes } from './frontRouter';
import { useAuthAdminStore } from '@/stores/authAdminStore';
import { useAuthFrontStore } from '@/stores/authFrontStore';

const routes = [...frontRoutes];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const userAuth = useAuthFrontStore();
    if (!userAuth.isLogin) return next('/login');
  }

  next();
});

export default router;
