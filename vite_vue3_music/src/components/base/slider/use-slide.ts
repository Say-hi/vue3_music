import BScroll from "@better-scroll/core";
import Slide from "@better-scroll/slide";
import { Page } from "@better-scroll/slide/dist/types/SlidePages";
import { onMounted, onUnmounted, Ref, ref } from "vue";
BScroll.use(Slide)

export default function useSlide (wrapperRef: Ref) {
    const slider = ref<BScroll | null>(null)
    const currentPageIndex = ref(0)
    onMounted(() => {
        const slidVal = slider.value = new BScroll(wrapperRef.value, {
            click: true,
            scrollX: true,
            scrollY: false,
            momentum: false,
            bounce: false,
            probeType: 2,
            slide: true
        })
        slidVal.on('slideWillChange', (page: Page) => currentPageIndex.value = page.pageX)
    })
    onUnmounted(() => {
        slider.value?.destroy()
    })
    return {
        slider,
        currentPageIndex
    }
}