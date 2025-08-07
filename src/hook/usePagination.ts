import { computed, reactive, Ref, watch } from 'vue';

const DEFAULT_SHOW_PAGINATION_PAGE_NUM = 3;

export function usePagination<T>(
  list: Ref<T[]>,
  pageLimitSize: Ref<number>,
  initialPage: number = 1,
  showPaginationPageNum: number = DEFAULT_SHOW_PAGINATION_PAGE_NUM
) {
  const state = reactive({
    position: (initialPage - 1) * pageLimitSize.value,
  });

  watch(pageLimitSize, () => {
    state.position = 0; // Reset position when page limit size changes
  });

  const totalPages = computed(() =>
    Math.ceil(list.value.length / pageLimitSize.value)
  );

  const currentPage = computed(() => {
    if (
      list.value.length === 0 ||
      pageLimitSize.value < 1 ||
      state.position < 0
    )
      return 0;
    return state.position >= list.value.length
      ? totalPages.value
      : Math.floor(state.position / pageLimitSize.value) + 1;
  });

  const renderPaginationNums = computed(() => {
    const total = totalPages.value;
    if (total === 0) return [];
    const showPageNum =
      showPaginationPageNum > total ? total : showPaginationPageNum;
    const centerIndex = Math.ceil(showPageNum / 2);
    const diff = showPageNum - centerIndex;
    const firstIndex =
      centerIndex >= currentPage.value
        ? 1
        : currentPage.value + diff >= total
        ? total - showPageNum + 1
        : currentPage.value - diff;
    return Array.from({ length: showPageNum }, (_, i) => i + firstIndex);
  });

  const currentPageItems = computed(() => {
    const start = (currentPage.value - 1) * pageLimitSize.value;
    const end = start + pageLimitSize.value;
    return list.value.slice(start, end);
  });

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      state.position += pageLimitSize.value;
    }
  };

  const previousPage = () => {
    if (currentPage.value > 1) {
      state.position -= pageLimitSize.value;
    }
  };

  const goToPage = (pageNum: number) => {
    state.position = (pageNum - 1) * pageLimitSize.value;
  };

  return {
    totalPages,
    currentPageItems,
    renderPaginationNums,
    currentPage,
    nextPage,
    previousPage,
    goToPage,
  };
}
