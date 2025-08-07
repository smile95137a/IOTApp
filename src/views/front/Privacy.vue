<template>
  <div class="policy-page">
    <SectionBackground variant="divination" />
    <div class="policy-page__container">
      <h1 class="policy-page__title">🔐 祈願文舍｜隱私權政策</h1>

      <MCard custom-class="m-t-24">
        <div class="policy">
          <div
            class="policy__item"
            v-for="(section, index) in sections"
            :key="index"
          >
            <h2 class="policy__heading">{{ section.title }}</h2>
            <div class="policy__text" v-html="section.content" />
          </div>
        </div>
      </MCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MCard from '@/components/common/MCard.vue';
import SectionBackground from '@/components/common/SectionBackground.vue';
const sections = [
  {
    title: '一、隱私權保護政策適用範圍',
    content: `
      本政策適用於您在使用祈願文舍網站服務時所蒐集的個人識別資料。<br>
      不適用於本網站以外的第三方網站或非由本網站所委託、參與管理的人員。
    `,
  },
  {
    title: '二、個人資料的蒐集、處理與利用',
    content: `
      本網站於您造訪或使用相關服務（如抽籤、點燈、祈願、會員登入等）時，會依服務性質請您提供必要的個人資訊，並僅在特定目的範圍內使用。<br><br>
      包括但不限於：姓名、電子郵件、出生年月日、地址、裝置 IP、使用紀錄等。<br><br>
      於互動功能（如留言牆、客服信件、問卷調查）中，系統會保留您提供的資訊與操作時間作為紀錄。<br><br>
      所得問卷、祈願統計結果僅供內部分析，除非資料無法辨識個人，否則不會外流或揭露。
    `,
  },
  {
    title: '三、Cookie 技術之使用',
    content: `
      本網站會在您的裝置上寫入 Cookie，以便提供個人化內容與使用體驗。<br>
      若您不願意接受 Cookie，可於瀏覽器設定中停用，但可能導致部分功能無法正常運作。
    `,
  },
  {
    title: '四、個人資料查閱、修改與刪除權利',
    content: `
      您可透過下列方式管理您的個人資料：<br>
      進入會員中心查看／編輯／刪除個人資訊。<br><br>
      如欲刪除帳號，可於會員中心操作，或來信客服信箱提出申請。<br>
      若您選擇刪除帳號，將無法再次以原帳號登入本網站。<br><br>
      若有法令保存需求、合約義務或保護您自身權益，本網站將保留資料而非立即刪除。
    `,
  },
  {
    title: '五、資料安全與保護措施',
    content: `
      本網站主機設有防火牆、防毒系統與資料存取控管，僅限授權人員存取。<br>
      員工皆簽署保密合約，違反者將依法追責。<br><br>
      若有委外第三方技術或支付服務，本網站亦會要求其遵守同等保密規範與查核機制。
    `,
  },
  {
    title: '六、第三方連結政策',
    content: `
      本網站可能提供其他外部連結，但其隱私權政策並不適用本條款。<br>
      請您瀏覽其他網站時，另行審閱其隱私條款。
    `,
  },
  {
    title: '七、個人資料與第三人共用原則',
    content: `
      本網站絕不會擅自提供或出售您的個人資料予任何個人、公司或組織，除非符合下列條件：<br>
      ・經您書面同意。<br>
      ・依法令規定、司法或行政機關合法要求。<br>
      ・為防止人身、財產、權益重大危害。<br>
      ・與學術或研究機構合作，資料經處理無法識別個人。<br>
      ・您違反本網站服務條款，需進行識別、聯絡、法律行動。
    `,
  },
  {
    title: '八、政策更新與公告',
    content: `
      本網站得視需求隨時修訂隱私權政策。修訂後條文將公告於網站，恕不另行個別通知。
    `,
  },
];
</script>

<style scoped lang="scss">
.policy-page {
  width: 100%;
  position: relative;

  &__title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 1.5rem;
  }

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;
  }
}

.policy {
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
  }
}
</style>
