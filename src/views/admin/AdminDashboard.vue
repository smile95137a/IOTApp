<template>
  <div class="admin-layout">
    <aside class="admin-layout__sidebar">
      <h2 class="admin-layout__logo">後台管理</h2>
      <ul class="admin-layout__menu">
        <li
          class="admin-layout__menu-item"
          v-for="item in menu"
          :key="item.path"
        >
          <router-link class="admin-layout__link" :to="item.path">{{
            item.label
          }}</router-link>
        </li>
      </ul>
    </aside>

    <div class="admin-layout__main">
      <header class="admin-layout__header">
        <p class="admin-layout__welcome">歡迎使用後台管理系統</p>
      </header>

      <main class="admin-layout__content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const menu = [
  { label: '老師管理', path: '/admin/masters' },
  { label: '老師預約報表', path: '/admin/reports/master-reservations' },
  { label: 'Banner 管理', path: '/admin/banners' },
  { label: '供品管理', path: '/admin/offerings' },
  { label: '商城分類', path: '/admin/mall/categories' },
  { label: '商城商品', path: '/admin/mall/items' },
  { label: '訂單管理', path: '/admin/orders' },
  { label: '物流管理', path: '/admin/shipping-method' },
  { label: '點燈報表', path: '/admin/reports/lantern-purchases' },
  { label: '供品報表', path: '/admin/reports/offering-purchases' },
  { label: '點燈設定', path: '/admin/settings/lantern' },
  { label: '推薦點燈清單', path: '/admin/settings/lantern-recommend' },
];
</script>

<style scoped lang="scss">
.admin-layout {
  display: flex;
  min-height: 100vh;

  &__sidebar {
    width: 240px;
    background: #1f2937;
    color: #fff;
    padding: 24px;
  }

  &__logo {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 24px;
  }

  &__menu {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  &__menu-item {
    margin-bottom: 12px;
  }

  &__link {
    color: #fff;
    text-decoration: none;
    transition: color 0.2s;
    &:hover {
      color: #60a5fa;
    }
  }

  &__main {
    flex: 1;
    background: #f9fafb;
    display: flex;
    flex-direction: column;
  }

  &__header {
    background: #fff;
    padding: 16px 24px;
    border-bottom: 1px solid #e5e7eb;
  }

  &__welcome {
    margin: 0;
    font-size: 16px;
    color: #374151;
  }

  &__content {
    flex: 1;
    padding: 24px;
  }
}
</style>
