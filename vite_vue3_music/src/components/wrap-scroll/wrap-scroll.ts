import Scroll from "@/components/base/scroll/scroll.vue";
import { useStore } from "@/store";
import BScroll from "@better-scroll/core";
import { Page } from "@better-scroll/slide/dist/types/SlidePages";
import { computed, nextTick, ref, h, renderSlot, watch, withCtx, mergeProps } from "vue";

export default {
  name: "wrap-scroll",
  props: Scroll.props,
  emits: Scroll.emits,
  render(ctx: any) {
    return h(
      Scroll,
      mergeProps({
        ...ctx.$props,
        ref: "scrollRef",
        onScroll: (e: Page) => {
          ctx.$emit("scroll", e);
        },
      }),
      {
        default: withCtx(() => [renderSlot(ctx.$slots, "default")]),
      }
    );
  },
  setup() {
    const scrollRef = ref<typeof Scroll | null>(null);
    const store = useStore();
    const scroll = computed<BScroll>(() => scrollRef.value!.scroll);
    watch(
      () => store.playList,
      async () => {
        await nextTick();
        scroll.value.refresh();
      }
    );
    return {
      scrollRef,
      scroll,
    };
  },
};
