<script lang="ts" setup>
import { ref, watch, computed, nextTick } from "vue";
import { search } from "@/api/search";
import { processSongs } from "@/api/song";
// import usePullUpLoad from "./use-pull-up-load";
import { SingerType, SongType } from "@/interface";
import { emit } from "process";

type PropsType = {
  query: string;
  showSinger?: boolean;
};

type EmitsType = {
  (e: "select-song", song: any): void;
  (e: "select-singer", singer: any): void;
};

const props = withDefaults(defineProps<PropsType>(), {
  showSinger: true,
});
const emits = defineEmits<EmitsType>();
const singer = ref<SingerType[]>([]);
const songs = ref<SongType[]>([]);
const hasMore = ref(false);
const page = ref(1);
const loadingText = ref("正在努力搜索中...");
const noResultText = ref("抱歉，暂无搜索结果");
const manualLoading = ref(false);
const pullUpLoading = ref(false);
const loading = ref(true);


async function searchFirst() {
  page.value = 1;
  songs.value = [];
  singer.value = [];
  hasMore.value = true;
  let data = await search(props.query, page.value + "", props.showSinger);
  songs.value = await processSongs(data.songs);
  singer.value = data.singer;
  loading.value = false
}

function selectSong(song: SongType) {
  emits('select-song', song)
}
function selectSinger(singer: any) {
  emits('select-singer', singer)
}

const noResult = computed(() => {
  if (loading.value) return false
  return !songs.value.length && !singer.value.length
})

watch(
  () => props.query,
  async (newVal) => {
    if (!newVal.length) {
      return;
    }
    loading.value = true
    await searchFirst();
  }
);
</script>
<template>
  <div
    ref="rootRef"
    class="suggest"
    v-loading:[loadingText]="loading"
    v-no-result:[noResultText]="noResult"
  >
    <ul class="suggest-list">
      <li  class="suggest-item" :key="item.mid" v-for="item in singer" @click="selectSinger(item)">
        <!-- <div class="icon">
          <i class="icon-mine"></i>
        </div> -->
        <img v-lazy="item.pic" width="20" height="20" class="avatar" alt="">
        <div class="name">
          <p class="text">{{ item.name }}</p>
        </div>
      </li>
      <li
        class="suggest-item"
        v-for="song in songs"
        :key="song.id"
        @click="selectSong(song)"
      >
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">{{ song.singer }}-{{ song.name }}</p>
        </div>
      </li>
      <div class="suggest-item" v-loading:[loadingText]="pullUpLoading"></div>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list {
    padding: 0 30px;
    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      .icon {
        flex: 0 0 30px;
        width: 30px;
        [class^="icon-"] {
          font-size: 14px;
          color: $color-text-d;
        }
      }
      .avatar{
        flex: 0 0 20px;
        border-radius: 50%;
        margin-right: 10px;
      }
      .name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;
        .text {
          @include no-wrap();
        }
      }
    }
  }
}
</style>
