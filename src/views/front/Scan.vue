<template>
  <div class="camera-screen">
    <!-- 掃描框（只顯示在中間區域） -->
    <div class="camera-screen__overlay">
      <div class="camera-screen__top-mask" />
      <div class="camera-screen__middle">
        <div class="camera-screen__side-mask" />
        <div class="camera-screen__scan-box">
          <div id="reader" />
          <div class="corner top-left" />
          <div class="corner top-right" />
          <div class="corner bottom-left" />
          <div class="corner bottom-right" />
          <div class="scan-line" :style="scanLineStyle" />
        </div>
        <div class="camera-screen__side-mask" />
      </div>
      <div class="camera-screen__bottom-mask">
        <p class="camera-screen__tip">請將 QR 碼置於框內自動掃描</p>
      </div>
    </div>

    <button class="camera-screen__close" @click="goBack">
      <i class="fas fa-times" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, reactive } from 'vue';
import { Html5Qrcode } from 'html5-qrcode';
import { useRouter } from 'vue-router';
import { decryptObject } from '@/utils/cryptoUtils';
import { useDialogStore } from '@/stores/dialogStore';
import { fetchPoolTableByUid } from '@/services copy/frontend/poolTableService';
import { getGamePrice, startGame } from '@/services/gameService';
import { getErrorMessage } from '@/utils/ErrorUtils';
import { usePaymentStore } from '@/stores/paymentStore';
import { useAuthFrontStore } from '@/stores/authFrontStore';
import { useLoadingStore } from '@/stores/loadingStore';

const router = useRouter();
const dialog = useDialogStore();
const paymentStore = usePaymentStore();
const loading = useLoadingStore();
const authStore = useAuthFrontStore();
const scanned = ref(false);
const scanLineY = ref(0);
const scanLineStyle = reactive({ transform: `translateY(0px)` });

let html5QrCode: Html5Qrcode;
let animationInterval: number | null = null;

const SCAN_BOX_SIZE = 250;

const animateScanLine = () => {
  let direction = 1;
  animationInterval = window.setInterval(() => {
    scanLineY.value += direction * 2;
    if (scanLineY.value >= SCAN_BOX_SIZE - 2 || scanLineY.value <= 0) {
      direction *= -1;
    }
    scanLineStyle.transform = `translateY(${scanLineY.value}px)`;
  }, 16);
};

const goBack = () => {
  stopScanner();
  router.replace('/home');
};

const stopScanner = () => {
  if (html5QrCode?.isScanning) {
    html5QrCode.stop().then(() => {
      html5QrCode.clear();
    });
  }
  if (animationInterval) {
    clearInterval(animationInterval);
  }
};

const handleQRCode = async (text: string) => {
  if (scanned.value) return;
  scanned.value = true;

  try {
    const decrypted = decryptObject(text);
    if (!decrypted || typeof decrypted !== 'object') {
      throw new Error('無法解析 QR Code');
    }

    const { qrCodeType, poolTableUid, storeUid } = decrypted;

    if (qrCodeType === 1 && poolTableUid) {
      const res = await fetchPoolTableByUid(poolTableUid);
      if (res.success) {
        const { storeName, poolTableName, priceByHour, gameId, poolTableId } =
          res.data;
        if (gameId) {
          const confirm = await dialog.openConfirmDialog({
            title: `掃描到 ${storeName} - ${poolTableName} $${priceByHour}/小時`,
            message: '是否前往付款？',
          });
          if (confirm) {
            const { success, data } = await getGamePrice({ gameId });
            if (success) {
              stopScanner();

              paymentStore.setRechargeData({
                type: 'gameEnd',
                payData: { gameId, poolTableId },
                totalAmount: data.price,
              });
              router.replace('/member-center/payment');
            }
          } else {
            scanned.value = false;
          }
        } else {
          const confirm = await dialog.openConfirmDialog({
            title: `掃描到 ${storeName} - ${poolTableName} $${priceByHour}/小時`,
            message: '前往開台？',
          });
          if (confirm) {
            const result = await startGame({
              poolTableUId: poolTableUid,
              payType: 'game',
            });
            if (result.success) {
              await dialog.openInfoDialog({
                title: '系統訊息',
                message: '開局成功',
              });
              stopScanner();
              router.push('/member-center/games-in-progress');
            } else {
              await dialog.openInfoDialog({
                title: '錯誤',
                message: result.message,
              });
            }
          } else {
            scanned.value = false;
          }
        }
      } else {
        const confirm = await dialog.openConfirmDialog({
          title: '已掃描到',
          message: '是否前往開台？',
        });
        if (confirm) {
          stopScanner();
          router.push({ name: 'Reservation', params: { poolTableUid } });
        } else {
          scanned.value = false;
        }
      }
    } else if (qrCodeType === 2 && storeUid) {
      // 預留開門邏輯
    }
  } catch (e: any) {
    await dialog.openInfoDialog({ title: '錯誤', message: getErrorMessage(e) });
    scanned.value = false;
  }
};

onMounted(() => {
  if (!authStore.isLogin) {
    dialog.openInfoDialog({
      title: '請先登入',
      message: '使用此功能前請先登入帳號。',
    });
    router.replace('/login');
    return;
  }
  animateScanLine();
  html5QrCode = new Html5Qrcode('reader');

  html5QrCode
    .start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: SCAN_BOX_SIZE },
      (decodedText) => {
        handleQRCode(decodedText);
      },
      (error) => {
        // 可選：掃描錯誤處理
      }
    )
    .catch((err) => {
      dialog.openInfoDialog({ title: '錯誤', message: getErrorMessage(err) });
    });
});

onUnmounted(() => {
  stopScanner();
});
</script>
<style scoped lang="scss">
.camera-screen {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  overflow: hidden;

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    pointer-events: none;
  }

  &__top-mask,
  &__bottom-mask {
    width: 100%;
    height: calc((100vh - 250px) / 2);
    background: rgba(0, 0, 0, 0.5);
  }

  &__middle {
    display: flex;
    height: 250px;
  }

  &__side-mask {
    flex: 1;
    background: rgba(0, 0, 0, 0.5);
  }

  &__scan-box {
    width: 250px;
    height: 250px;
    position: relative;
    overflow: hidden;
    box-sizing: border-box;

    #reader {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 0;
    }
  }

  .corner {
    width: 20px;
    height: 20px;
    border: 4px solid #00ffaa;
    position: absolute;
    box-sizing: border-box;

    &.top-left {
      top: 0;
      left: 0;
      border-right: none;
      border-bottom: none;
    }

    &.top-right {
      top: 0;
      right: 0;
      border-left: none;
      border-bottom: none;
    }

    &.bottom-left {
      bottom: 0;
      left: 0;
      border-top: none;
      border-right: none;
    }

    &.bottom-right {
      bottom: 0;
      right: 0;
      border-top: none;
      border-left: none;
    }
  }

  .scan-line {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #00ffaa;
    animation: blink 1.5s linear infinite;
  }

  @keyframes blink {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.3;
    }
    100% {
      opacity: 1;
    }
  }

  &__tip {
    color: white;
    text-align: center;
    margin-top: 12px;
    font-size: 16px;
    pointer-events: none;
  }

  &__close {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 3;
    background: rgba(0, 0, 0, 0.6);
    border: none;
    padding: 8px 12px;
    border-radius: 20px;
    color: white;
    font-size: 20px;
    cursor: pointer;
    pointer-events: auto;
  }
}
</style>
