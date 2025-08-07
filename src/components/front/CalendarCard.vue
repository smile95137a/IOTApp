<template>
  <div class="calendar-card" v-if="calendarData">
    <!-- 上：紅底 header -->
    <div class="calendar-card__header">
      <div class="calendar-card__date">
        <div class="calendar-card__month">{{ calendarData.month }}</div>
        <div class="calendar-card__day">{{ calendarData.day }}</div>
        <div class="calendar-card__weekday">{{ calendarData.weekday }}</div>
      </div>

      <div class="calendar-card__right">
        <div class="calendar-card__lunar">
          <div class="calendar-card__lunar-year">
            {{ calendarData.lunarYear }}
          </div>
          <div class="calendar-card__lunar-date">
            {{ calendarData.lunarDate }}
          </div>
        </div>
        <div class="calendar-card__zodiac-circle">
          {{ calendarData.zodiac }}
        </div>
      </div>
    </div>

    <!-- 下：白底宜忌 -->
    <div class="calendar-card__body">
      <a href="#" class="calendar-card__link">
        查看其他日期 <i class="fas fa-arrow-right"></i>
      </a>

      <div
        v-for="(item, index) in calendarData.info"
        :key="index"
        class="calendar-card__info-item"
      >
        <span class="calendar-card__info-tag" :class="item.color">
          {{ item.type }}
        </span>
        <span class="calendar-card__info-text">{{ item.text }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import moment from 'moment';
import { queryChineseCalendar } from '@/services/calendarService';
import { executeApi } from '@/utils/executeApiUtils';

interface CalendarInfo {
  type: string;
  text: string;
  color: 'green' | 'purple' | 'gray';
}

interface CalendarData {
  month: string;
  day: string;
  weekday: string;
  lunarYear: string;
  lunarDate: string;
  zodiac: string;
  info: CalendarInfo[];
}

const calendarData = ref<CalendarData | null>(null);

const formatCalendarData = (raw: any): CalendarData => {
  const weekdayMap: Record<string, string> = {
    Sunday: '星期日',
    Monday: '星期一',
    Tuesday: '星期二',
    Wednesday: '星期三',
    Thursday: '星期四',
    Friday: '星期五',
    Saturday: '星期六',
  };

  const zodiacMap = [
    '鼠',
    '牛',
    '虎',
    '兔',
    '龍',
    '蛇',
    '馬',
    '羊',
    '猴',
    '雞',
    '狗',
    '豬',
  ];
  const zodiacIndex = (raw.lunar_year - 4) % 12;
  const zodiac = zodiacMap[zodiacIndex];

  const date = moment(`${raw.date_year}-${raw.date_month}-${raw.date_day}`);
  const weekday = weekdayMap[date.format('dddd')];

  return {
    month: `${raw.date_month}月`,
    day: String(raw.date_day),
    weekday,
    lunarYear: `${raw.lunar_year} ${zodiac}年`,
    lunarDate: `農曆${raw.lunar_month}月${raw.lunar_day}日`,
    zodiac,
    info: [
      { type: '沖', text: raw.chong_sha || '', color: 'green' },
      { type: '宜', text: raw.yi || '', color: 'purple' },
      { type: '忌', text: raw.ji || '', color: 'gray' },
    ],
  };
};

onMounted(async () => {
  const today = moment();
  await executeApi({
    fn: () =>
      queryChineseCalendar({
        year: today.year(),
        month: today.month() + 1,
        day: today.date(),
      }),
    errorTitle: '載入農民曆失敗',
    onSuccess: (data) => {
      calendarData.value = formatCalendarData(data[0]);
    },
  });
});
</script>

<style scoped lang="scss">
.calendar-card {
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  font-family: 'Noto Sans TC', sans-serif;
  position: relative;

  &__header {
    background: #a53b25;
    color: #fff;
    display: flex;
    justify-content: flex-end;
    padding: 1rem;
    position: relative;
    height: 80px;
  }

  &__date {
    position: absolute;
    left: 1.5rem;
    bottom: -50px;
    width: 108px;
    height: 108px;
    background: #e0664d;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 2;

    .calendar-card__month {
      font-size: 0.85rem;
      margin-bottom: 0.1rem;
    }

    .calendar-card__day {
      font-size: 2rem;
      font-weight: bold;
      line-height: 1;
    }

    .calendar-card__weekday {
      font-size: 0.85rem;
      margin-top: 0.1rem;
    }
  }

  &__right {
    text-align: right;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    color: #eeafa2;
    gap: 0.75rem;
  }

  &__lunar {
    line-height: 1.4;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  &__lunar-year,
  &__lunar-date {
    line-height: 1.2;
  }

  &__lunar-year {
    margin-bottom: 0.15rem;
  }

  &__zodiac-circle {
    background: transparent;
    border: 1.5px solid #eeafa2;
    font-size: 24px;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__body {
    position: relative;
    padding: 3.5rem 1.5rem 1.5rem;
    background: #fff;
    border-top: 1px solid #eee;
    font-size: 0.9rem;
    color: #333;
  }

  &__info-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 0.6rem;
  }

  &__info-tag {
    display: inline-block;
    font-size: 0.75rem;
    font-weight: bold;
    color: #fff;
    border-radius: 999px;
    padding: 0.25rem 0.65rem;
    margin-right: 0.6rem;

    &.green {
      background: #72c26d;
    }

    &.purple {
      background: #b06ed2;
    }

    &.gray {
      background: #999;
    }
  }

  &__info-text {
    flex: 1;
    line-height: 1.6;
  }

  &__link {
    position: absolute;
    top: 1rem;
    right: 1rem;
    font-size: 0.85rem;
    color: #c2aeaa;

    i {
      margin-left: 0.3rem;
    }
  }
}
</style>
