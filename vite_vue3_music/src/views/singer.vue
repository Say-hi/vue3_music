<script lang="ts" setup>
import { getSingerList } from "@/api/singer.js";
import { onMounted, ref } from "vue";
import IndexList from "@/components/index-list/index-list.vue";
import { SingerListType, SingerType } from "@/interface/index.js";

import { useRouter } from "vue-router";
const singers = ref<SingerListType[]>([])
const selectedSinger = ref<Partial<SingerType>>({})
const router = useRouter()

function selectSinger(singer: SingerType) {
  selectedSinger.value = singer
  router.push({
    name: 'singer-detail',
    params: {
      id: singer.mid
    }
  })
}
onMounted(async () => {
  const result = await getSingerList();
  singers.value = result.singers
});
</script>

<template>
  <div class="singer" v-loading="!singers.length">
    <IndexList :data="singers" @select="selectSinger" />
    <RouterView v-slot="{ Component }" >
      <transition name="slide" appear>
        <component :is="Component" :data="selectedSinger" />
      </transition>
    </RouterView>
  </div>
</template>
<style lang="scss" scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>
