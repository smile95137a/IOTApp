<template>
  <div class="terms-page">
    <SectionBackground variant="divination" />
    <div class="terms-page__container">
      <h1 class="terms-page__title">📜 祈願文舍｜網站服務條款</h1>

      <MCard custom-class="m-t-24">
        <div class="terms">
          <div
            class="terms__item"
            v-for="(section, index) in sections"
            :key="index"
          >
            <h2 class="terms__heading">{{ section.title }}</h2>
            <div class="terms__text" v-html="section.content" />
          </div>
        </div>
      </MCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import MCard from '@/components/common/MCard.vue';
import SectionBackground from '@/components/common/SectionBackground.vue';
const sections = [
  {
    title: '一、服務內容',
    content: `
      本網站所提供之主要服務包括但不限於：<br>
      ・線上抽籤問事、擲筊祈籤、請神明指示<br>
      ・點光明燈、太歲燈、姻緣燈、文昌燈等祈福燈位<br>
      ・線上塔羅牌占卜與自動解析功能<br>
      ・神明介紹與線上供奉儀式<br>
      ・會員註冊、祈願紀錄與燈位追蹤系統<br>
      ・其他由祈願文舍開發或合作之心靈相關內容與活動
    `,
  },
  {
    title: '二、會員與帳號',
    content: `
      使用本網站部分功能（如祈願紀錄、點燈回顧、占卜紀錄）需註冊為會員。<br>
      會員帳號需由本人註冊，不得偽造他人身分資訊。<br>
      若您違反相關規定，本網站有權暫停或終止您的帳號使用權利。
    `,
  },
  {
    title: '三、使用規範',
    content: `
      使用者應遵守中華民國相關法令及國際網路使用規範，不得從事以下行為：<br>
      ・散佈違法、誹謗、猥褻、攻擊他人或具侵權性質之內容<br>
      ・以自動化手段干擾網站運作（如機器人、爬蟲）<br>
      ・未經授權使用他人帳號或嘗試破壞網站安全機制<br><br>
      若您從事任何可能損害網站或其他使用者權益之行為，本網站得限制或停止您之服務使用。
    `,
  },
  {
    title: '四、內容與服務聲明',
    content: `
      本網站提供之祈福、抽籤、占卜等內容皆屬心靈指引與信仰文化參考，不應視為醫療、心理、法律或財務建議。<br>
      占卜、籤詩結果為隨機系統模擬與解讀，不保證其結果準確或符合您期待。<br>
      若您因使用本網站服務而採取之任何決策，風險由您個人承擔。
    `,
  },
  {
    title: '五、智慧財產權聲明',
    content: `
      本網站所有文字、圖片、影片、音樂、系統介面、商標、Logo，均屬神乎奇技文創有限公司或其授權人所有。<br>
      未經書面許可，不得以任何形式複製、轉載、公開發表、再授權、商業使用或修改。
    `,
  },
  {
    title: '六、付費服務與退款原則',
    content: `
      部分服務（如付費點燈、占卜解說、線上供奉）需依公告金額支付費用。<br>
      所有付費皆視為用戶主動選擇，付款完成後恕不接受退款（除系統異常或重複扣款）。<br>
      若因服務系統錯誤導致損失，請提供付款憑證，經本網站確認後得進行處理。
    `,
  },
  {
    title: '七、隱私權保護',
    content: `
      您於本網站所提供之個人資料，將依《祈願文舍隱私權政策》妥善處理與保護。<br>
      本網站使用 Cookie 技術與追蹤碼進行匿名分析，以提升服務品質。
    `,
  },
  {
    title: '八、服務暫停、中止與變更',
    content: `
      本網站可能因系統維護、升級、故障或不可抗力因素暫停或中止服務，恕不另行通知或補償。<br>
      本網站保留隨時變更、終止部分或全部服務內容之權利。
    `,
  },
  {
    title: '九、條款修訂與通知',
    content: `
      本條款如有更新，將公告於網站首頁或會員專區，恕不另行個別通知。<br>
      建議您定期查閱條款內容，以保障自身權益。<br>
      若您繼續使用本網站，視為您同意該次修改條款之內容。
    `,
  },
  {
    title: '十、準據法與管轄法院',
    content: `
      本條款之解釋與適用，以及與本網站之爭議，均以中華民國法律為準據法，並以臺灣台北地方法院為第一審管轄法院。
    `,
  },
  {
    title: '📍 聯絡我們',
    content: `
    若您對本條款有任何疑問，歡迎聯繫我們：<br><br>
    <strong>神乎奇技文創有限公司｜祈願文舍客服</strong><br>
    Email：<a href="mailto:easonandjenny@gmail.com.tw">easonandjenny@gmail.com.tw</a><br>
    LINE 官方帳號：<a href="https://lin.ee/P8IVhyE" target="_blank">點我加入</a><br>
    Instagram：<a href="https://www.instagram.com/magic20.22?igsh=MTY1OGVmMWh5ZGo4Ng==" target="_blank">@magic20.22</a><br>
    Facebook：<a href="https://www.facebook.com/profile.php?id=100079259756919&mibextid=ZbWKwL" target="_blank">神乎奇技文創</a>
  `,
  },
];
</script>

<style scoped lang="scss">
.terms-page {
  width: 100%;
  position: relative;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;
  }

  &__title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 1.5rem;
  }
}

.terms {
  &__item + &__item {
    margin-top: 2rem;
  }

  &__heading {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: #a93e26;
  }

  &__text {
    font-size: 15px;
    line-height: 1.8;
    color: #333;

    a {
      color: #a93e26;
      text-decoration: underline;
    }
  }
}
</style>
