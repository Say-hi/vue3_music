import BScroll, { Options } from "@better-scroll/core";
import { BScrollConstructor } from "@better-scroll/core/dist/types/BScroll";
import ObserveDom from '@better-scroll/observe-dom'
import { Page } from "@better-scroll/slide/dist/types/SlidePages";

import { onMounted, onUnmounted, Ref, ref } from "vue";

BScroll.use(ObserveDom)

export default function useScroll (wrapperRef: Ref, options: Options, emits: Function) {
    const scroll = ref<BScroll>()
    onMounted(() => {
        const scrollVal = scroll.value = new BScroll(wrapperRef.value, {
            observeDOM: true,
            ...options
        }) as BScrollConstructor
        scrollVal.on('scroll', (pos: Page) => {
            emits('scroll', pos)
        })
    })
    onUnmounted(() => {
        scroll.value!.destroy()
    })
    return {
        scroll
    }
}