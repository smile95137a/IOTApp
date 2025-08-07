<template>
  <section class="order-success">
    <SectionBackground variant="divination" />
    <div class="order-success__container">
      <Title color="dark" text="訂購確認" />
      <div class="order-success__main">
        <div class="order-success__card">
          <div class="order-success__header">
            <h1 class="order-success__title">訂購成功！</h1>
          </div>

          <div class="order-success__card">
            <div class="order-success__row">
              <div class="order-success__label">訂購內容：</div>
              <div class="order-success__value">
                {{ masterName }}{{ masterTitle }} 親算 - {{ selectedTopic }}
              </div>
            </div>
            <div class="order-success__row">
              <div class="order-success__label">訂購金額：</div>
              <div class="order-success__value">2,000元</div>
            </div>
            <div class="order-success__row">
              <div class="order-success__label">商品編號：</div>
              <div class="order-success__value order-success__value--highlight">
                {{ productCode }}
              </div>
            </div>
            <div class="order-success__row order-success__note-row">
              <div class="order-success__label">訂單附註：</div>
              <div class="order-success__note-box">
                <ol class="order-success__note-list">
                  <li>請複製商品編號</li>
                  <li>
                    至官方 line（<a
                      href="https://line.me/@efgsx"
                      target="_blank"
                      rel="noopener noreferrer"
                      >line.me/@efgsx</a
                    >）
                  </li>
                  <li>留下訂單編號，與老師約時間</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import SectionBackground from '@/components/common/SectionBackground.vue';
import Title from '@/components/common/Title.vue';
import { useMasterOrderStore } from '@/stores/masterOrderStore';

const store = useMasterOrderStore();

const masterName = store.selectedMaster?.name || '';
const masterTitle = store.selectedMaster?.title || '';
const selectedTopic = store.selectedTopic;
const productCode = store.productCode || '';
</script>

<style scoped lang="scss">
.order-success {
  width: 100%;
  position: relative;
  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;
  }
  &__main {
    background: #f5e1e0;
    padding: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 12px;
  }

  &__card {
    background: #fbeceb;
    border-radius: 16px;
    padding: 3rem;
    width: 100%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  &__header {
    margin-bottom: 2rem;
  }

  &__icon {
    width: 60px;
    margin-bottom: 1rem;
  }

  &__title {
    font-size: 1.8rem;
    font-weight: bold;
    color: #a53b25;
  }

  &__card {
    background: #ffffff;
    border-radius: 12px;
    padding: 2rem;
    text-align: left;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.5rem;
    font-size: 1rem;

    @media (max-width: 480px) {
      flex-direction: column;
      gap: 0.3rem;
    }
  }

  &__label {
    font-weight: bold;
    color: #333;
    width: 40%;
    min-width: 100px;
  }

  &__value {
    color: #555;
    width: 60%;
    word-break: break-word;

    &--highlight {
      color: #e85028;
      font-weight: bold;
    }
  }

  &__note-row {
    align-items: flex-start;
  }

  &__note-box {
    border-radius: 8px;
    padding: 1rem;
    width: 60%;
    font-size: 1rem;

    @media (max-width: 480px) {
      width: 100%;
    }
  }

  &__note-list {
    padding-left: 1.5rem;
    list-style-type: decimal;
    color: #c0392b;

    li {
      margin-bottom: 0.5rem;
      line-height: 1.6;

      a {
        color: #c0392b;
        text-decoration: underline;
      }
    }
  }
}
</style>
