import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { loadState, saveState, removeState } from '@/utils/Localstorage';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string; // ✅ 新增圖片欄位
  option?: string;
}

export const useCartStore = defineStore('cart', () => {
  const cartItems = ref<CartItem[]>(loadState<CartItem[]>('cartItems') || []);

  const totalPrice = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  const itemCount = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
  );

  const addItem = (item: CartItem) => {
    const existing = cartItems.value.find(
      (i) => i.id === item.id && i.option === item.option
    );
    if (existing) {
      existing.quantity += item.quantity;

      // ✅ 如果加完後為 0 或負數，移除
      if (existing.quantity <= 0) {
        cartItems.value = cartItems.value.filter(
          (i) => !(i.id === item.id && i.option === item.option)
        );
      }
    } else if (item.quantity > 0) {
      cartItems.value.push(item);
    }
    saveState('cartItems', cartItems.value);
  };

  const updateQuantity = (item: CartItem, delta: number) => {
    const existing = cartItems.value.find(
      (i) => i.id === item.id && i.option === item.option
    );
    if (existing) {
      existing.quantity += delta;
      if (existing.quantity <= 0) {
        cartItems.value = cartItems.value.filter(
          (i) => !(i.id === item.id && i.option === item.option)
        );
      }
      saveState('cartItems', cartItems.value);
    }
  };

  const removeItem = (index: number) => {
    cartItems.value.splice(index, 1);
    saveState('cartItems', cartItems.value);
  };

  const clearCart = () => {
    cartItems.value = [];
    removeState('cartItems');
  };

  return {
    cartItems,
    totalPrice,
    itemCount,
    addItem,
    updateQuantity, // ✅ 可直接加減數量用
    removeItem,
    clearCart,
  };
});
