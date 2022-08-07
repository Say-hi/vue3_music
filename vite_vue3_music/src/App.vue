<script setup lang="ts">
import MTab from '@/components/tab/index.vue'
import MHeader from '@/components/header/index.vue'
import Player from './components/palyer/player.vue';
import { computed } from 'vue';
import { useStore } from './store';
const store = useStore()
const viewStyle = computed(() => ({
  bottom: store.playList.length ? '60px': '0'
}))

</script>

<template>
  <MHeader />
  <MTab />
  <RouterView :style="viewStyle" />
  <Player />
</template>
