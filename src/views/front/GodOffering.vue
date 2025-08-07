<template>
  <section class="god-offering">
    <SectionBackground variant="divination" />
    <div class="god-offering__container">
      <Title :text="`請神供奉`" color="white" />
      <div class="god-offering__content">
        <div class="god-offering__text">
          <p class="god-offering__description">
            虔心供奉，神明庇佑。線上請神供奉系統讓您足不出戶即能表達敬意與祈願。
            選擇心儀神明—月老助姻緣、財神添財富、文昌增智慧、鍾馗除邪崇、關公保平安，
            每日可免費隨機獻上三種供品，表達誠心。若願增添祈福力量，另有金香、金果、金牌等強化供品可選，滿足不同祈願需求。
          </p>
          <p class="god-offering__note">
            無論您身在何處，只要一顆虔誠之心，便能與神明心靈相通，獲得無形護持與祝福。
          </p>
        </div>

        <div class="god-offering__gods">
          <div
            v-for="(god, key) in godImages"
            :key="key"
            class="god-offering__god"
          >
            <img
              :src="god.default"
              :alt="god.label"
              class="god-offering__god-img"
            />
            <p class="god-offering__god-name">{{ god.label }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
  <Worship />
  <GodList />
</template>

<script setup lang="ts">
import SectionBackground from '@/components/common/SectionBackground.vue';
import GodList from '@/components/front/GodList.vue';
import Worship from '@/components/front/Worship.vue';
import godImages from '@/data/godImages';
import Title from '@/components/common/Title.vue';
</script>

<style lang="scss" scoped>
.god-offering {
  width: 100%;
  position: relative;
  min-height: 480px;
  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;
  }
  &__content {
    display: flex;
    gap: 2rem;
    align-items: flex-start;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  &__text {
    flex: 1;
    max-width: 50%;

    @media (max-width: 768px) {
      max-width: 100%;
    }
  }

  &__title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
  }

  &__description {
    font-size: 1rem;
    line-height: 1.8;
    margin-bottom: 1rem;
    text-align: left;
  }

  &__note {
    font-size: 0.95rem;
    opacity: 0.9;
  }

  &__gods {
    flex: 1;
    max-width: 50%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    @media (max-width: 768px) {
      max-width: 100%;
      justify-content: center;
    }
  }

  &__god {
    display: flex;
    flex-direction: column;
    align-items: center;

    @media (max-width: 768px) {
      width: 80px;
    }
  }

  &__god-img {
    width: 90px;
    height: 90px;
    object-fit: contain;

    @media (max-width: 768px) {
      width: 64px;
    }
  }

  &__god-name {
    margin-top: 0.5rem;
    font-size: 1rem;
    color: #fff;
  }
}
</style>
