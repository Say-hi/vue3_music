import { getLyric } from "@/api/song";
import { useStore } from "@/store";
import { storeToRefs } from "pinia";
import { watch, ref, Ref, Component, nextTick } from "vue";
import Lyric from "lyric-parser";
import BScroll from "@better-scroll/core";

export default function useLyric({
  songReady,
  currentTime,
}: {
  songReady: Ref<boolean>;
  currentTime: Ref<number>;
}) {
  const store = useStore();
  const currentLyric = ref<Lyric | null>(null);
  const currentLineNum = ref(0);
  const LyricScrollRef = ref<Component & {scroll: BScroll} | null>(null);
  const LyricListRef = ref<HTMLDivElement | null>(null);
  const pureMusicList = ref()
  const playingLyric = ref('')
const pureMusicLyric = ref('')
  const { currentSong } = storeToRefs(store);
  watch(currentSong, async (newVal) => {
    if (!newVal.url || !newVal.id) {
      return;
    } 
    stopLyric()
    currentLyric.value = null
    currentLineNum.value = 0
    const lyricData = await getLyric(newVal);
    newVal.lyric = lyricData;
    if (currentSong.value.lyric !== lyricData) return;
    currentLyric.value = new Lyric(lyricData, handleLyric);
    const hasLyric = currentLyric.value.lines.length 
    if (hasLyric) {
        if (songReady.value) {
            plaLyric();
          }
    } else {
        playingLyric.value = pureMusicLyric.value = lyricData.replace(/\[(\d{2}):(\d{2}):(\d{2})]/g, '')
    }
  });
function  handleLyric ({ lineNum, txt }: {lineNum: number, txt: string}) {
    playingLyric.value = txt || ''
    currentLineNum.value = lineNum;
    const scrollComp = LyricScrollRef.value
    const listEl = LyricListRef.value
    if (!listEl) return
    if (lineNum > 5) {
        const lineEl = listEl.children[lineNum - 5] as HTMLElement
        scrollComp!.scroll.scrollToElement(lineEl, 500, 0, 0)
    } else {
        scrollComp?.scroll.scrollTo(0, 0, 500)
    }
  }

  function plaLyric() {
    const currentLyricTemp = currentLyric.value;
    if (currentLyricTemp) {
      currentLyricTemp.seek(currentTime.value * 1000);
    }
  }

  function stopLyric () {
    const currentLyricTemp = currentLyric.value;
    if (currentLyricTemp) {
        currentLyricTemp.stop()
    }
  }

  return {
    currentLyric,
    currentLineNum,
    LyricScrollRef,
    LyricListRef,
    pureMusicLyric,
    playingLyric,
    plaLyric,
    stopLyric
  };
}
