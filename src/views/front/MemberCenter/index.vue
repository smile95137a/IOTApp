<template>
  <div class="member-center">
    <SectionBackground variant="divination" />

    <div class="member-center__container">
      <MCard customClass="mcard--member-center member-center__card">
        <!-- 導覽 Tabs -->
        <div class="member-center__tabs">
          <router-link
            to="/member-center/memberProfile"
            exact-active-class="active"
          >
            <i class="fas fa-user"></i> 會員資料
          </router-link>
          <router-link
            to="/member-center/purchaseHistory"
            exact-active-class="active"
          >
            <i class="fas fa-receipt"></i> 消費紀錄
          </router-link>
          <router-link
            to="/member-center/myBlessings"
            exact-active-class="active"
          >
            <i class="fas fa-hands"></i> 我的供奉
          </router-link>
          <router-link
            to="/member-center/orderHistory"
            exact-active-class="active"
          >
            <i class="fas fa-clipboard-list"></i> 訂單記錄
          </router-link>
        </div>

        <!-- 子頁面內容 -->
        <div class="member-center__content">
          <router-view />
        </div>
      </MCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import MCard from '@/components/common/MCard.vue';
import SectionBackground from '@/components/common/SectionBackground.vue';
import Header from '@/components/front/Header.vue';
</script>

<style scoped lang="scss">
.member-center {
  position: relative;
  padding-top: 6rem;
  min-height: 100vh;

  &__container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem;
  }

  &__card {
    border-radius: 16px;
    padding: 3rem 2rem;
    background: #fff;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  }

  &__tabs {
    display: flex;
    justify-content: flex-start;
    gap: 2rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;

    a {
      text-decoration: none;
      padding: 0.5rem 1rem;
      font-size: 1rem;
      font-weight: 500;
      color: #888;
      position: relative;
      transition: color 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.4rem;

      i {
        font-size: 1rem;
      }

      &.active {
        color: #b3442e;
        font-weight: bold;

        i {
          color: #b3442e;
        }

        &::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 3px;
          background-color: #b3442e;
          border-radius: 2px;
        }
      }
    }
  }

  &__content {
    padding-top: 1rem;
  }
}
</style>
