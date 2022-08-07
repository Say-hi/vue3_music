<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { AlbumType, SliderType } from "@/interface/index.js";

import MSlider from "@/components/base/slider/slider.vue";
import Scroll from "@/components/wrap-scroll/wrap-scroll";
import { getRecommend } from "@/api/recommend";
import { useRouter } from "vue-router";

const sliders = ref<SliderType[]>([]);
const albums = ref<AlbumType[]>([]);
const selectedAlbum = ref<Partial<AlbumType>>({})
const loading = ref(true);
const router = useRouter()
const loadingText = '一通乱加载'

function selectItem (album: AlbumType) {
  selectedAlbum.value = album
  router.push({
    path: `/recommend/${album.id}`
  })
};

onMounted(async () => {
  const result = await getRecommend();
  sliders.value = result.sliders;
  albums.value = result.albums;
  loading.value = false
});
</script>

<template>
  <div class="recommend" v-loading:[loadingText]="loading">
    <Scroll class="recommend-content">
      <div>
        <div class="slider-wrapper">
          <div class="slider-content">
            <MSlider v-if="sliders.length" :sliders="sliders" />
          </div>
        </div>
        <div class="recommend-list">
          <h1 class="list-title" v-show="!loading">热门歌单推荐</h1>
          <ul>
            <li
              v-for="item in albums"
              class="item"
              :key="item.id"
              @click="selectItem(item)"
            >
              <div class="icon">
                <img width="60" height="60" v-lazy="item.pic" />
              </div>
              <div class="text">
                <h2 class="name">
                  {{ item.username }}
                </h2>
                <p class="title">
                  {{ item.title }}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Scroll>
    <RouterView v-slot="{ Component }">
      <transition name="slide" appear>
        <component :is="Component" :data="selectedAlbum" />
      </transition>
    </RouterView>
  </div>
</template>
<style lang="scss" scoped>
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  //   overflow: scroll;
  .recommend-content {
    height: 100%;
    overflow: hidden;
    .slider-wrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 40%;
      overflow: hidden;
      .slider-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }
    .recommend-list {
      margin-top: 10px;
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }
      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }
        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;
        }
        .name {
          margin-bottom: 10px;
          color: $color-text;
        }
        .title {
          color: $color-text-d;
        }
      }
    }
  }
}
</style>
