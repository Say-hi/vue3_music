<script lang="ts" setup>
import Scroll from "@/components/base/scroll/scroll.vue";
import Confirm from '@/components/base/confirm/confirm.vue'
import { SongType } from "@/interface/index.js";
import { useStore } from "@/store/main.js";
import BScroll from "@better-scroll/core";
import { storeToRefs } from "pinia";
import { Component, nextTick, ref, watch } from "vue";
import useFavorite from "./use-favorite.js";
import useMode from "./use-mode.js";

const { modeIcon, modeText,changeMode } = useMode();
const { getFavoriteIcon, toggleFavorite } = useFavorite();

const store = useStore();
const { playList, sequenceList, currentSong } = storeToRefs(store);
const scrollRef = ref<Component & {scroll: BScroll} | null>(null)
const confirmRef = ref<typeof Confirm & {show(): void} | null>(null)
const visible = ref(false)
const removing = ref(false)

function getCurrentIcon (song: SongType) {
    if (song.id === currentSong.value.id) {
        return 'icon-play'
    }
}


function selectItem(song: SongType) {
    const index = playList.value.findIndex(i => i.id === song.id)
    store.setCurrentIndex(index)
    store.setPlayingState(true)
}
function removeSong(song: SongType){
    if (removing.value) return
    removing.value = true
    store.removeSong(song)
    if (!playList.value.length) {
      hide()
    }
    setTimeout(() => {
        removing.value = false
    }, 300);
}
function showAddSong(){}
function showConfirm (){
  confirmRef.value!.show()
}
function confirmClear(){
  store.clearSongList()
  hide()
}

async function  show () {
    visible.value = true
    await nextTick()
    refreshScroll()
}
function hide () {
    visible.value = false
}

function refreshScroll() {
    scrollRef.value!.scroll.refresh()
    scrollToCurrent()
}

async function scrollToCurrent() {
    await nextTick()
    const index = sequenceList.value.findIndex(song => song.id === currentSong.value.id)
    if (index === -1) return
    const lis_content = document.getElementById('list_content')
    const target = lis_content!.children[index] as HTMLElement
    scrollRef.value!.scroll.scrollToElement(target, 300, 0, 0)
}

watch(currentSong, (newVal) => {
    if(!visible.value  || !newVal.id) return
    scrollToCurrent()
})

defineExpose({
    show
})

</script>
<template>
  <teleport to="body">
    <transition name="list-fade">
      <div class="playlist" v-show="visible && playList.length" @click="hide">
        <div class="list-wrapper" @click.stop>
          <div class="list-header">
            <h1 class="title">
              <i class="icon" :class="modeIcon" @click="changeMode"> </i>
              <span class="text">{{ modeText }}</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
          </div>
          <Scroll ref="scrollRef" class="list-content">
            <transition-group name="list" tag="ul" id="list_content">
              <li
                class="item"
                v-for="song in sequenceList"
                :key="song.id"
                @click="selectItem(song)"
              >
                <i class="current" :class="getCurrentIcon(song)"></i>
                <span class="text">{{ song.name }}</span>
                <span class="favorite" @click.stop="toggleFavorite(song)">
                  <i :class="getFavoriteIcon(song)"></i>
                </span>
                <span
                  class="delete"
                  @click.stop="removeSong(song)"
                  :class="{ disable: removing }"
                >
                  <i class="icon-delete"></i>
                </span>
              </li>
            </transition-group>
          </Scroll>
          <!-- <div class="list-add">
            <div class="add" @click="showAddSong">
              <i class="icon-add"></i>
              <span class="text">添加歌曲到队列</span>
            </div>
          </div> -->
          <div class="list-footer" @click="hide">
            <span>关闭</span>
          </div>
        </div>
        <Confirm
          ref="confirmRef"
          @confirm="confirmClear"
          text="是否清空播放列表？"
          confirm-btn-text="清空"
        ></Confirm>
        <!-- <AddSong ref="addSongRef" /> -->
      </div>
    </transition>
  </teleport>
</template>

<style lang="scss" scoped>
.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background-d;
  &.list-fade-enter-active,
  &.list-fade-leave-active {
    transition: opacity 0.3s;
    .list-wrapper {
      transition: all 0.3s;
    }
  }
  &.list-fade-enter-from,
  &.list-fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
  .list-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 210;
    width: 100%;
    background-color: $color-highlight-background;
    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;
      .title {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 10px;
          font-size: 24px;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
        .clear {
          @include extend-click();
          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }
    .list-content {
      max-height: 240px;
      overflow: hidden;
      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;
        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-small;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text-d;
        }
        .favorite {
          @include extend-click();
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
        .delete {
          @include extend-click();
          font-size: $font-size-small;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
        }
      }
    }
    .list-add {
      width: 140px;
      margin: 20px auto 30px auto;
      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid $color-text-l;
        border-radius: 100px;
        color: $color-text-l;
        .icon-add {
          margin-right: 5px;
          font-size: $font-size-small-s;
        }
        .text {
          font-size: $font-size-small;
        }
      }
    }
    .list-footer {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
}
</style>
