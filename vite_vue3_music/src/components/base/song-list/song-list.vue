<script lang='ts' setup>
import { SongType } from '@/interface/index.js';
import { ref } from 'vue';

const props = defineProps<{
    songs: Array<SongType>
    rank: boolean
}>()
const emits = defineEmits<{
    (e: 'select', {song, index}: {song: SongType, index: number}): void
}>()

function selectItem (song: SongType, index: number): void {
    emits('select', {song, index})
}
function getRankCls (index: number) {
  if (index <= 2) {
    return `icon icon${index}`
  }
  return 'text'
}
function getRankText (index: number) {
  if (index > 2) {
    return index + 1
  }
}
function getDesc (song: SongType): string {
    return song.name
}
</script>

<template>
  <ul class="song-list">
    <li
      class="item"
      v-for="(song, index) in songs"
      :key="song.id"
      @click="selectItem(song, index)"
    >
      <div class="rank" v-if="rank">
        <span :class="getRankCls(index)">{{ getRankText(index) }}</span>
      </div>
      <div class="content">
        <h2 class="name">{{song.name}}</h2>
        <p class="desc">{{getDesc(song)}}</p>
      </div>
    </li>
  </ul>
</template>
<style lang="scss" scoped>
  .song-list {
    .item {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 64px;
      font-size: $font-size-medium;
      .rank {
        flex: 0 0 25px;
        width: 25px;
        margin-right: 20px;
        text-align: center;
        .icon {
          display: inline-block;
          width: 25px;
          height: 24px;
          background-size: 25px 24px;
          &.icon0 {
            @include bg-image('./first');
          }
          &.icon1 {
            @include bg-image('./second');
          }
          &.icon2 {
            @include bg-image('./third');
          }
        }
        .text {
          color: $color-theme;
          font-size: $font-size-large;
        }
      }
      .content {
        flex: 1;
        line-height: 20px;
        overflow: hidden;
        .name {
          @include no-wrap();
          color: $color-text
        }
        .desc {
          @include no-wrap();
          margin-top: 4px;
          color: $color-text-d;
        }
      }
    }
  }
</style>