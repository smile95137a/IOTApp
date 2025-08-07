// utils/logisticsUtils.ts
export const openStoreMap = (opmode: string, callbackUrl: string) => {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://logistics.gomypay.asia/Logisticstm.aspx';

  const urlInput = document.createElement('input');
  urlInput.name = 'Url';
  urlInput.value = callbackUrl;
  form.appendChild(urlInput);

  const opmodeInput = document.createElement('input');
  opmodeInput.name = 'Opmode';
  opmodeInput.value = opmode;
  form.appendChild(opmodeInput);

  document.body.appendChild(form);

  setTimeout(() => {
    form.submit();
    document.body.removeChild(form);
  }, 500);
};
