<script lang="ts">
import { getAlbum } from "@/api/recommend";
import { LOCAL_ALBUM } from "@/interface";
import createDetailComponent from "@/utils/create-detail-component";
export default createDetailComponent('album', LOCAL_ALBUM, getAlbum)
</script>
<template>
  <div class="album">
    <MusicList :songs="songs" :title="title" :pic="pic" :loading="loading" />
  </div>
</template>
<style lang="scss" scoped>
.album {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
