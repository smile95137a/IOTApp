<template>
  <div class="offeringHallStep4">
    <SectionBackground variant="divination" />
    <div class="offeringHallStep4__container">
      <InvokeSuccess
        v-if="selectedGodImage && selectedGod"
        :god-image="selectedGodImage.default"
        :god-name="selectedGodImage.label"
      />
      <InvokeOfferingPeriod />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useOfferStore } from '@/stores/offerStore';
import SectionBackground from '@/components/common/SectionBackground.vue';
import InvokeSuccess from '@/components/front/InvokeSuccess.vue';
import InvokeOfferingPeriod from '@/components/front/InvokeOfferingPeriod.vue';
import godImages from '@/data/godImages';

const offerStore = useOfferStore();
const selectedGod = computed(() => offerStore.selectedGod);

const selectedGodImage = computed(() =>
  selectedGod.value?.imageCode ? godImages[selectedGod.value.imageCode] : null
);
</script>

<style scoped lang="scss">
.offeringHallStep4 {
  width: 100%;
  position: relative;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;
  }
}
</style>
