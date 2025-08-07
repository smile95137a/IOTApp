<template>
  <div class="light-blessing__tabs">
    <div class="light-blessing__tab" @click="handleTabClick('product')">
      祈福燈產品
    </div>
    <div class="light-blessing__tab" @click="handleTabClick('my')">
      我的祈福燈
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function handleTabClick(tab: 'product' | 'my') {
  navigateToRoute(tab);
}

function navigateToRoute(tab: 'product' | 'my') {
  const routeMap = {
    product: '/lightProduct',
    my: '/myLight',
  };
  router.push(routeMap[tab]);
}
</script>

<style scoped lang="scss">
.light-blessing__tabs {
  border: 1px solid #a53b25;
  display: flex;
  justify-content: center;
  background: #f7c56b;
  border-radius: 100px;
  overflow: hidden;
  width: 100%;
  height: 70px;

  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.light-blessing__tab {
  padding: 0.75rem 2rem;
  font-weight: bold;
  cursor: pointer;
  color: #a53b25;
  font-size: 1rem;
  text-align: center;
  white-space: nowrap;

  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
