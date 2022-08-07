import { PLAY_MODE } from "@/interface";
import { useStore } from "@/store";
import { storeToRefs } from "pinia";
import { computed } from "vue";

export default function useMode () {
    const store = useStore()
    const { playMode } = storeToRefs(store)
    const modeIcon = computed(() => {
        let icon = ''
        switch (playMode.value) {
            case PLAY_MODE.sequence:
                icon = 'icon-sequence'
                break;
            case PLAY_MODE.random:
                icon = 'icon-random'
                break
            case PLAY_MODE.loop:
                icon = 'icon-loop'
                break
            default:
                icon = 'icon-sequence'
                break;
        }
        return icon
    })
    const modeText = computed(() => {
        const playModelVal = playMode.value;
        return playModelVal === PLAY_MODE.sequence
          ? "顺序播放"
          : playModelVal === PLAY_MODE.random
          ? "随机播放"
          : "单曲循环";
      });

    function changeMode () {
        store.changeMode((playMode.value + 1) % 3)
    }

    return {
        modeIcon,
        modeText,
        changeMode
    }
}