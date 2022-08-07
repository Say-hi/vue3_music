<script lang="ts" setup>
import { useStore } from "@/store/main.js";
import { storeToRefs } from "pinia";
import { useCd } from "./use-cd.js";
import ProgressCircle from "./progress-circle.vue";
import { Component, computed, ref } from "vue";
import useMiniSlider from "./use-mini-slider.js";
import PlayList from "./play-list.vue";

defineProps<{
  progress: number;
}>();

const store = useStore();
const { fullScreen, currentSong, playing, playList } = storeToRefs(store);
const { cdCls } = useCd();
const { sliderWrapperRef } = useMiniSlider()
const playlistRef = ref<Component & { show(): void } | null>(null)

function showPlayList () {
    playlistRef.value!.show()
}

const miniPlayIcon = computed(() => {
  return playing.value ? "icon-pause-mini" : "icon-play-mini";
});
</script>
<template>
  <transition name="mini">
    <div class="mini-player" v-show="!fullScreen" @click="fullScreen = true">
      <div class="cd-wrapper">
        <div class="cd">
          <img
            :class="cdCls"
            width="40"
            height="40"
            :src="currentSong.pic"
            alt=""
          />
        </div>
      </div>
      <div class="slider-wrapper" ref="sliderWrapperRef">
        <div class="slider-group">
            <div :key="song.id" v-for="song in playList" class="slider-page">
          <h2 class="name">{{ song.name }}</h2>
          <p class="desc">{{ song.singer }}</p>
        </div>
        </div>
      </div>
      <div class="control" @click.prevent.stop="playing = !playing">
        <ProgressCircle :radius="32" :progress="progress">
          <i class="icon-mini" :class="miniPlayIcon"></i>
        </ProgressCircle>
      </div>
      <div class="control" @click.stop="showPlayList">
        <i class="icon-playlist"></i>
      </div>
      <PlayList ref="playlistRef" />
    </div>
  </transition>
</template>
<style lang="scss" scoped>
.mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 180;
  width: 100%;
  height: 60px;
  background: $color-highlight-background;
  .cd-wrapper {
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    padding: 0 10px 0 20px;
    .cd {
      height: 100%;
      width: 100%;
      img {
        border-radius: 50%;
        &.playing {
          animation: rotate 10s linear infinite;
        }
        &.playing_pause {
          animation-play-state: paused;
        }
      }
    }
  }
  .slider-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;
    .slider-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      .slider-page {
        display: inline-block;
        width: 100%;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
        .name {
          margin-bottom: 2px;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text;
        }
        .desc {
          @include no-wrap();
          font-size: $font-size-small;
          color: $color-text-d;
        }
      }
    }
  }
  .control {
    flex: 0 0 30px;
    width: 30px;
    padding: 0 10px;
    .icon-playlist {
      position: relative;
      top: -2px;
      font-size: 28px;
      color: $color-theme-d;
    }
    .icon-mini {
      position: absolute;
      left: 0;
      top: 0;
      color: $color-theme-d;
      font-size: 32px;
    }
  }
  &.mini-enter-active,
  &.mini-leave-active {
    transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
  }
  &.mini-enter-from,
  &.mini-leave-to {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
}
</style>
