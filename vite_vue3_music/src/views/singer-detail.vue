<script lang="ts">
import { getSingerDetail } from "@/api/singer";
// import { processSongs } from "@/api/song.js";
import { LOCAL_SINGER } from "@/interface/index.js";
// import { onMounted, ref, reactive } from "vue";
// import MusicList from "@/components/music-list/music-list.vue";
// import { computed } from "@vue/reactivity";

import createDetailComponent from '@/utils/create-detail-component'


export default createDetailComponent('SingerDetail', LOCAL_SINGER, getSingerDetail)

// type singerType = SingerType;

// const songs = ref<SongType[]>([]);
// const loading = ref(true)

// const props = defineProps<{
//   singer: singerType;
// }>();

// let singerLocal = reactive<singerType>(props.singer)
// if (singerLocal.id) {
//     checkLocal(LOCAL_SINGER, singerLocal)
// } else {
//     singerLocal = checkLocal(LOCAL_SINGER)
// }

// const pic = computed(() => singerLocal.pic);
// const title = computed(() => singerLocal.name);

// function checkLocal (key: string, data?: singerType): singerType {
//     let datas = null
//     if(data) {
//         localStorage.setItem(key, JSON.stringify(data))
//     } else {
//         datas = JSON.parse(String(localStorage.getItem(key)))
//     }
//     return datas
// }

// onMounted(async () => {
//   const data = await getSingerDetail(singerLocal);
//   songs.value = await processSongs(data.songs);
//   loading.value = false
// });
</script>

<template>
  <div class="singer-detail">
    <MusicList :songs="songs" :pic="pic" :title="title" :loading="loading" />
  </div>
</template>
<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
