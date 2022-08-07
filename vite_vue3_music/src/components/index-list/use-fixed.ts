import BScroll from "@better-scroll/core";
import { Page } from "@better-scroll/slide/dist/types/SlidePages";
import { Component, computed, nextTick, Ref, ref, watch } from "vue";
import { IndexListPropType } from "./index-list-type";

export default function useFixed(props: IndexListPropType) {
  const TITLE_HEIGHT = 30;
  const ANCHOR_HEIGHT = 18;
  const groupRef = ref<HTMLElement | null>(null);
  const shortcutList = ref<string[]>([]);
  const listHeights = ref<Array<number>>([]);
  const scrollY = ref(0);
  const currentIndex = ref(0);
  const distance = ref(0);
  const scrollRef = ref<(Component & { scroll: BScroll }) | null>(null);
  const touch: {
    [k: string]: number;
  } = {};

  const fixedStyle = computed(() => {
    const distanceVal = distance.value;
    const diff =
      distanceVal > 0 && distanceVal < TITLE_HEIGHT
        ? distanceVal - TITLE_HEIGHT
        : 0;

    return {
      transform: `translate3d(0, ${diff}px, 0)`,
    };
  });
  const fixedTitle = computed(() => {
    if (scrollY.value < 0) {
      return "";
    }
    const currentGroup = props.data[currentIndex.value];
    return currentGroup ? currentGroup.title : "";
  });

  watch(
    () => props.data,
    async () => {
      await nextTick();
      cacultate();
      setShortcutList();
    },
    {
      immediate: true,
    }
  );

  watch(scrollY, (newVal) => {
    const list = listHeights.value;
    for (let i = 0; i < list.length - 1; i++) {
      const heightTop = list[i];
      const heightBottom = list[i + 1];
      if (newVal >= heightTop && newVal <= heightBottom) {
        currentIndex.value = i;
        distance.value = heightBottom - newVal;
      }
    }
  });

  function setShortcutList() {
    shortcutList.value = props.data.map((i) => i.title);
  }

  function cacultate() {
    const list = groupRef!.value!.children;
    const listHeightsVal = listHeights.value;
    let height = 0;

    listHeightsVal.length = 0;
    listHeightsVal.push(height);
    for (let i = 0; i < list.length; i++) {
      height += list[i].clientHeight;
      listHeightsVal.push(height);
    }
  }

  function onScroll(pos: Page) {
    scrollY.value = -pos.y;
  }

  function onShortcutTouchStart(e: TouchEvent | MouseEvent) {
    const anchorIndex = parseInt(
      String((e!.target as HTMLElement)!.dataset!.index)
    );
    try {
      touch.y1 = (e as TouchEvent)!.touches[0].pageY;
      touch.anchorIndex = anchorIndex;
    } catch (e) {}
    scrollTo(anchorIndex);
  }
  function onShortcutTouchMove(e: TouchEvent) {
    touch.y2 = e.touches[0].pageY;
    const delta = ((touch.y2 - touch.y1) / ANCHOR_HEIGHT) | 0;
    const anchorIndex = touch.anchorIndex + delta;
    scrollTo(anchorIndex);
  }

  function scrollTo(index: number) {
    if (isNaN(index)) return;
    index = Math.max(0, Math.min(index, shortcutList.value.length - 1));
    const targetEl = groupRef.value!.children[index] as HTMLElement;
    const scroll = scrollRef!.value!.scroll;
    scroll.scrollToElement(targetEl, 0, 0, 0);
  }

  return {
    groupRef,
    shortcutList,
    fixedTitle,
    fixedStyle,
    currentIndex,
    scrollRef,
    onScroll,
    onShortcutTouchStart,
    onShortcutTouchMove,
  };
}
