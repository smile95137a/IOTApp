<template>
  <div class="front-layout">
    <Header />
    <main>
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/front/Header.vue';
import Footer from '@/components/front/Footer.vue';
</script>
