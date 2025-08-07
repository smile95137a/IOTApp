// utils/paymentUtils.ts

export type SendType =
  | '0' // 信用卡
  | '1' // 銀聯卡
  | '2' // 超商條碼
  | '3' // WebATM
  | '4' // 虛擬帳號
  | '6' // 超商代碼
  | '7'; // LinePay

export interface PaymentFormPayload {
  sendType?: SendType;
  orderNumber: string;
  totalAmount: string;
  buyerName?: string;
  buyerPhone?: string;
  buyerEmail?: string;
  buyerMemo?: string;
  callbackUrl?: string;
  returnUrl?: string;
}

export const appendHiddenInput = (
  form: HTMLFormElement,
  name: string,
  value: string
) => {
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = name;
  input.value = value;
  form.appendChild(input);
};
export const submitPaymentForm = (payload: PaymentFormPayload) => {
  const sendType = payload.sendType || '0'; // 預設為信用卡

  const form = document.createElement('form');
  form.action = import.meta.env.VITE_PAYMENT_GATEWAY_URL;
  form.method = 'post';

  const appendHiddenInput = (name: string, value: string) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
  };

  // ✅ 共用欄位
  appendHiddenInput('Send_Type', sendType);
  appendHiddenInput('Pay_Mode_No', '2');
  appendHiddenInput('CustomerId', import.meta.env.VITE_PAYMENT_CUSTOMER_ID);
  appendHiddenInput('Order_No', payload.orderNumber);
  appendHiddenInput('Amount', payload.totalAmount);

  if (sendType === '0') {
    // ✅ 信用卡專屬欄位
    appendHiddenInput('TransMode', '1');
    appendHiddenInput('Installment', '0');
    appendHiddenInput('TransCode', '00');
    appendHiddenInput('Buyer_Memo', payload.buyerMemo || '商品購買');
    appendHiddenInput(
      'Return_url',
      payload.returnUrl || `${window.location.origin}/PaymentCB`
    );
  } else if (sendType === '4') {
    // ✅ ATM 轉帳欄位
    appendHiddenInput('Buyer_Name', payload.buyerName || '');
    appendHiddenInput('Buyer_Telm', payload.buyerPhone || '');
    appendHiddenInput('Buyer_Mail', payload.buyerEmail || '');
    appendHiddenInput('Buyer_Memo', payload.buyerMemo || 'ATM付款');
    appendHiddenInput('Callback_Url', payload.callbackUrl || '');
  } else {
    appendHiddenInput('Buyer_Name', payload.buyerName || '');
    appendHiddenInput('Buyer_Telm', payload.buyerPhone || '');
    appendHiddenInput('Buyer_Mail', payload.buyerEmail || '');
    appendHiddenInput('Buyer_Memo', payload.buyerMemo || '購物付款');
    appendHiddenInput('Callback_Url', payload.callbackUrl || '');
  }

  document.body.appendChild(form);
  setTimeout(() => {
    form.submit();
  }, 300);
};
