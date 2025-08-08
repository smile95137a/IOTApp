import { defineStore } from 'pinia';

// stores/paymentStore.ts
export const usePaymentStore = defineStore('payment', {
  state: () => ({
    type: '' as string,
    totalAmount: 0,
    rechargeOption: null as null | {
      rechargeAmount: number;
      bonusAmount: number;
      isFirst: boolean;
      sendType: string;
    },
    payData: null as any,
    successData: null as null | {
      type: string;
      showStartGame: boolean;
      totalAmount: number;
      data: any;
      rechargeOption: any;
    },
  }),
  actions: {
    setRechargeData(payload) {
      this.type = payload.type;
      this.totalAmount = payload.totalAmount;
      this.rechargeOption = payload.rechargeOption;
    },
    setPayData(payload: any) {
      this.payData = payload;
    },
    setSuccessData(payload: any) {
      this.successData = payload;
    },
    clear() {
      this.type = '';
      this.totalAmount = 0;
      this.rechargeOption = null;
      this.payData = null;
      this.successData = null;
    },
  },
});
