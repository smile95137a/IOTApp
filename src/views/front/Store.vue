<template>
  <div class="mall">
    <SectionBackground variant="divination" />
    <div class="mall__container">
      <MCard customClass="p-48">
        <MallProductList
          v-for="category in categories"
          :key="category.id"
          :title="category.name"
          :description="category.description"
          :products="category.products"
        />
      </MCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import MCard from '@/components/common/MCard.vue';
import MallProductList from '@/components/front/MallProductList.vue';
import SectionBackground from '@/components/common/SectionBackground.vue';
import {
  getCategoryAvailableList,
  getProductListByCategory,
} from '@/services/productServices';

const categories = ref<any[]>([]);

const fetchCategoriesWithProducts = async () => {
  try {
    const { success, data: categoryList } = await getCategoryAvailableList();
    if (!success) return;

    const results = [];

    for (const category of categoryList) {
      const { success: productSuccess, data: productList } =
        await getProductListByCategory({
          categoryId: category.id,
        });

      results.push({
        ...category,
        products: productSuccess
          ? productList.map((p) => ({
              id: p.id,
              name: p.name.trim(),
              price: p.specialPrice,
              originalPrice: p.originalPrice,
              image: p.mainImageUrl || '',
            }))
          : [],
      });
    }

    categories.value = results;
  } catch (err) {
    console.error('載入分類與商品失敗', err);
  }
};

onMounted(() => {
  fetchCategoriesWithProducts();
});
</script>

<style scoped lang="scss">
.mall {
  width: 100%;
  position: relative;
  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;
  }
}
</style>
