import { useStore } from "@/store"
import BScroll from "@better-scroll/core"
import Slide from "@better-scroll/slide"
import { Page } from "@better-scroll/slide/dist/types/SlidePages"
import { storeToRefs } from "pinia"
import { computed, nextTick, onUnmounted, ref, watch } from "vue"
BScroll.use(Slide)

export default function useMiniSlider () {
    const sliderWrapperRef = ref<HTMLElement | null>(null)
    const slider = ref<BScroll | null>(null)
    const store = useStore()
    const { fullScreen, playList, currentIndex } = storeToRefs(store)

    const sliderShow = computed(() => {
        return !fullScreen.value && playList.value.length
    })

    watch(sliderShow, async (newVal) => {
        if(newVal) {
            await nextTick()
            if (slider.value) {
                slider.value.refresh()
            } else {
                slider.value = new BScroll(sliderWrapperRef.value as HTMLElement, {
                    click: true,
                    scrollX: true,
                    scrollY: false,
                    momentum: false,
                    bounce: false,
                    probeType: 2,
                    slide: {
                        autoplay: false,
                        loop: true
                    }
                })
                slider.value.on('slidePageChanged', (page: Page) => {
                    currentIndex.value = page.pageX
                    // store.setPlayingState(true)
                })
            }
            slider.value.goToPage(currentIndex.value, 0, 0)
        }
    })

    watch(currentIndex, newVal => {
        if (slider.value && sliderShow.value) {
            slider.value.goToPage(currentIndex.value, 0, 0)
        }
    })

    watch(playList, async (newList) => {
        if (slider.value && sliderShow.value && newList.length) {
            await nextTick()
            slider.value.refresh()
        }
    })

    onUnmounted(() => {
        slider?.value?.destroy()
    })

    return {
        slider,
        sliderWrapperRef
    }
}