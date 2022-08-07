<script lang="ts" setup>
const tabs = [
  {
    name: "推荐",
    path: "/recommend",
  },
  {
    name: "歌手",
    path: "/singer",
  },
  {
    name: "排行",
    path: "/top-list",
  },
  {
    name: "搜索",
    path: "/search",
  },
];
</script>

<template>
  <div class="tab">
    <RouterLink
      class="tab-item"
      v-for="tab in tabs"
      :key="tab.path"
      :to="tab.path"
    >
      <span class="tab-link">
        {{ tab.name }}
      </span>
    </RouterLink>
  </div>
</template>
<style scoped lang="scss">
.tab {
  display: flex;
  height: 44px;
  line-height: 44px;
  font-size: $font-size-medium;

  .tab-item {
    flex: 1;
    text-align: center;

    .tab-link {
      padding-bottom: 5px;
      color: $color-text-l;
      transition: all .3s;
      border-bottom: 0 solid transparent;
    }

    &.router-link-active {
      .tab-link {
        color: $color-theme;
        border-bottom: 2px solid $color-theme;
      }
    }
  }
}
</style>
