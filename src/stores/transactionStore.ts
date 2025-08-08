import { defineStore } from 'pinia';

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    transaction: null as any,
  }),
  actions: {
    setTransaction(data: any) {
      this.transaction = data;
    },
  },
});
