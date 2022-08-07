<script lang="ts" setup>
import Scroll from "@/components/wrap-scroll/wrap-scroll";
import SongList from "@/components/base/song-list/song-list.vue";
import { SongType } from "@/interface/index";
import { useStore } from "@/store/main";
import { Page } from "@better-scroll/slide/dist/types/SlidePages";
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";

interface MusicListType {
  songs?: Array<SongType>;
  pic?: string;
  title?: string;
  loading?: boolean
  rank?: boolean
}
const props = withDefaults(defineProps<MusicListType>(), {
  songs: () => [],
  loading: true,
  rank: false
});

const store = useStore()

const RESERVED_HEIGHT = 40;

const noResultText = '暂时无法获取到该歌手的歌曲数据';
const router = useRouter();
const imageHeight = ref(0);
const bgImage = ref<HTMLElement | null>(null);
const scrollY = ref(0);
const maxTranslateY = ref(0);

const playBtnStyle = computed(() => {
    let display = ''
    if (scrollY.value >= maxTranslateY.value) {
        display = 'none'
    }
    return {
        display
    }
})
const bgImageStyle = computed(() => {
  const scrollYTemp = scrollY.value;
  let zIndex = 0;
  let paddingTop = '70%'
  let height = '0px'
  let translateZ = 0
  let scale = 1
  if (scrollYTemp > maxTranslateY.value) {
    zIndex = 10;
    paddingTop = '0'
    height = RESERVED_HEIGHT + 'px'
    translateZ = 1
  }
  if (scrollYTemp < 0) {
    scale = 1 + Math.abs(scrollYTemp / imageHeight.value)
  }
  return {
    zIndex,
    paddingTop,
    height,
    transform: `scale(${scale}) translateZ(${translateZ})`,
    backgroundImage: `url(${props.pic})`,
  };
});
const scrollStyle = computed(() => ({
  top: `${imageHeight.value}px`,
  bottom: store.playList.length ? '60px': '0'
}));
const filterStyle = computed(() => {
    let blur = 0
    const maxTranslateYTemp = maxTranslateY.value
    const imageHeightTemp = imageHeight.value
    if (scrollY.value >=0) {
        blur = Math.min(maxTranslateYTemp / imageHeightTemp, scrollY.value / imageHeightTemp) * 20
    }
    return {
        backdropFilter: `blur(${blur}px)`
    }
})
const noResult = computed(() => {
    return !props.loading && !props.songs.length
})

onMounted(() => {
  imageHeight.value = bgImage!.value!.clientHeight;
  maxTranslateY.value = imageHeight.value - RESERVED_HEIGHT;
});

function onScroll(pos: Page) {
  scrollY.value = -pos.y;
}
function goBack() {
  router.back();
}
function selectItem({song, index}: {song: SongType, index: number}) {
    store.selectPlay(props.songs, index)
}
function random() {
    store.randomPlay(props.songs)
}
</script>

<template>
  <div class="music-list">
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div class="bg-image" :style="bgImageStyle" ref="bgImage">
      <div class="play-btn-wrapper" :style="playBtnStyle">
        <div v-show="songs.length > 0" class="play-btn" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" :style="filterStyle"></div>
    </div>
    <Scroll
      class="list"
      :style="scrollStyle"
      v-loading="loading"
      v-no-result:[noResultText]="noResult"
      :probe-type="3"
      @scroll="onScroll"
    >
      <div class="song-list-wrapper">
        <SongList :songs="songs" @select="selectItem" :rank="rank" />
      </div>
    </Scroll>
  </div>
</template>
<style lang="scss" scoped>
.music-list {
  position: relative;
  height: 100%;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 20;
    transform: translateZ(2px);
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    z-index: 20;
    transform: translateZ(2px);
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }
  .bg-image {
    position: relative;
    width: 100%;
    transform-origin: top;
    background-size: cover;
    .play-btn-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 10;
      width: 100%;
      .play-btn {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;
      }
      .icon-play {
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        font-size: $font-size-medium-x;
      }
      .text {
        display: inline-block;
        vertical-align: middle;
        font-size: $font-size-small;
      }
    }
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }
  .list {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 0;
    .song-list-wrapper {
      padding: 20px 30px;
      background: $color-background;
    }
  }
}
</style>
