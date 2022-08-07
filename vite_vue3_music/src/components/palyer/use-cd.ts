import { useStore } from "@/store";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

export function useCd () {
    const store = useStore()
    const { playing } = storeToRefs(store)
    // const cdRef = ref<HTMLDivElement | null>(null)
    // const cdImgRef = ref<HTMLImageElement | null>(null)

    const cdCls = computed(() => {
        return playing.value ? 'playing' : 'playing playing_pause'
    })

    return {
        cdCls
    }
}