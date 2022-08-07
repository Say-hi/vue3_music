<script lang="ts" setup name="player">
import { useStore } from "@/store/main.js";
import { storeToRefs } from "pinia";
import { Component, computed, nextTick, ref, watch } from "vue";
import useFavorite from "./use-favorite";
import useMode from "./use-mode";
import ProgressBar from "./progress-bar.vue";
import { formatTime } from "@/utils/util";
import { PLAY_MODE } from "@/interface";
import { useCd } from "./use-cd";
import useLyric from "./use-lyric";
import Scroll from "../base/scroll/scroll.vue";
import useMiddleInteractive from "./use-middle-interactive";
import MiniPlayer from "./mini-player.vue";
import useAnimation from "./use-animation";

let progressChanging = false;
const audioRef = ref<HTMLAudioElement | null>(null);
const progressBarRef = ref<
  (Component & { offsetProgress(progress: number): void }) | null
>(null);
const songReady = ref(false);
const currentTime = ref(0);

const store = useStore();
const { currentSong, fullScreen, playing, currentIndex, playList, playMode } =
  storeToRefs(store);
const { modeIcon, changeMode } = useMode();
const { getFavoriteIcon, toggleFavorite } = useFavorite();
const { cdCls } = useCd();
const {
  currentShow,
  middleLStyle,
  middleRStyle,
  onMiddleTouchStart,
  onMiddleTouchMove,
  onMiddleTouchEnd,
} = useMiddleInteractive();
const {
  currentLyric,
  currentLineNum,
  LyricScrollRef,
  LyricListRef,
  pureMusicLyric,
  playingLyric,
  plaLyric,
  stopLyric,
} = useLyric({ songReady, currentTime });
const { cdWrapperRef, enter, afterEnter, leave, afterLeave } = useAnimation();
const duration = ref(0)

function goBack() {
  store.setFullScreen(false);
}
function togglePlay() {
  if (!songReady.value) return;
  store.setPlayingState(!playing.value);
}
function pause() {
  store.setPlayingState(false);
}
function prev() {
  const playListTemp = playList.value;
  if (!playListTemp.length || !songReady.value) return;
  if (playListTemp.length === 1) {
    return loop();
  }
  let index = currentIndex.value - 1;
  if (index === -1) {
    index = playListTemp.length - 1;
  }
  store.setCurrentIndex(index);
  // if (!playing.value) {
  //   store.setPlayingState(true);
  // }
}
function next() {
  const playListTemp = playList.value;
  if (!playListTemp.length || !songReady.value) return;
  if (playListTemp.length === 1) {
    return loop();
  }
  let index = currentIndex.value + 1;
  if (index === playListTemp.length) {
    index = 0;
  }
  store.setCurrentIndex(index);
  // if (!playing.value) {
  //   store.setPlayingState(true);
  // }
}
function loop() {
  const audioEl = audioRef.value;
  audioEl!.currentTime = 0;
  audioEl!.play();
  store.setPlayingState(true);
}
function ready() {
  if (songReady.value) return;
  duration.value = audioRef.value?.duration || 0
  songReady.value = true;
  plaLyric();
}
function error() {
  songReady.value = true;
}
function updateTime(e: Event) {
  if (progressChanging) return;
  currentTime.value = (e.target as HTMLAudioElement).currentTime;
}
function end() {
  currentTime.value = 0;
  if (playMode.value === PLAY_MODE.loop) {
    loop();
  } else {
    next();
  }
}
function handleProgressChanged(progress: number) {
  audioRef.value!.currentTime = currentTime.value =
    Number(currentSong.value.duration || duration.value) * progress;
  if (!playing.value) {
    store.setPlayingState(true);
  }
  plaLyric();
  progressChanging = false;
}
function handleProgressChanging(progress: number) {
  progressChanging = true;
  currentTime.value = Number(currentSong.value.duration  || duration.value) * progress;
  plaLyric();
  stopLyric();
}

const progress = computed(() => {
  return currentTime.value / Number(currentSong.value!.duration || duration.value);
});
const playIcon = computed(() => {
  return playing.value ? "icon-pause" : "icon-play";
});
const disableCls = computed(() => {
  return songReady.value ? "" : "disable";
});

watch(currentSong, (newSong) => {
  if (!newSong.id || !newSong.url) {
    return;
  }
  songReady.value = false;
  const audioEl = audioRef.value as HTMLAudioElement;
  audioEl.src = newSong.url;
  currentTime.value = 0;
  audioEl.play();
  playing.value = true
});
watch(playing, (newVal) => {
  if (!songReady.value) {
    return;
  }
  const audioRefTemp = audioRef.value;
  if (newVal) {
    audioRefTemp?.play();
    plaLyric();
  } else {
    audioRefTemp?.pause();
    stopLyric();
  }
});
watch(fullScreen, async (newFulleScreen) => {
  if (newFulleScreen) {
    await nextTick();
    progressBarRef!.value!.offsetProgress(progress.value);
  }
});
</script>

<template>
  <div class="player" v-show="playList.length">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.pic" alt="图片" />
        </div>
        <div class="top">
          <div class="back" @click="goBack">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{ currentSong.name }}</h1>
          <h2 class="subtitle">{{ currentSong.singer }}</h2>
        </div>
        <div
          class="middle"
          @touchstart.prevent="onMiddleTouchStart"
          @touchend.prevent="onMiddleTouchEnd"
          @touchmove.prevent="onMiddleTouchMove"
        >
          <div class="middle-l" :style="middleLStyle">
            <div class="cd-wrapper" ref="cdWrapperRef">
              <div class="cd" ref="cdRef">
                <img
                  ref="cdImgRef"
                  :class="cdCls"
                  class="image"
                  :src="currentSong.pic"
                />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{ playingLyric }}</div>
            </div>
          </div>
          <Scroll class="middle-r" ref="LyricScrollRef" :style="middleRStyle">
            <div class="lyric-wrapper">
              <div v-if="currentLyric" ref="LyricListRef">
                <p
                  class="text"
                  v-for="(line, index) in currentLyric.lines"
                  :class="{ current: currentLineNum === index }"
                >
                  {{ line.txt }}
                </p>
              </div>
              <div class="pure-music" v-show="pureMusicLyric.length">
                <p>{{ pureMusicLyric }}</p>
              </div>
            </div>
          </Scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span :class="{ active: currentShow === 'cd' }" class="dot"></span>
            <span
              :class="{ active: currentShow === 'lyric' }"
              class="dot"
            ></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{ formatTime(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <ProgressBar
                ref="progressBarRef"
                @progress-changed="handleProgressChanged"
                @progress-changing="handleProgressChanging"
                :progress="progress"
              />
            </div>
            <span class="time time-r">{{
              formatTime(currentSong.duration || duration)
            }}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="modeIcon" @click="changeMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlay" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i
                @click="toggleFavorite(currentSong)"
                :class="getFavoriteIcon(currentSong)"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <MiniPlayer :progress="progress" />
    <audio
      @error="error"
      @pause="pause"
      @canplay="ready"
      @timeupdate="updateTime"
      @ended="end"
      ref="audioRef"
    ></audio>
  </div>
</template>
<style lang="scss" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);

      img {
        width: 100%;
        height: 100%;
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }
      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
        transform: rotate(-90deg);
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }
            .playing {
              animation: rotate 20s linear infinite;
            }
            .playing_pause {
              animation-play-state: paused;
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        // transform: translateX(-375px);
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
            }
          }
          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.6s;
      .top,
      .bottom {
        transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }
    &.normal-enter-from,
    &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
}
</style>
