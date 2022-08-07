<script lang="ts" setup>
import { getHotKeys } from "@/api/search.js";
import SearchInput from "@/components/search/search-input.vue";
import { HotKeyType, SingerType, SongType } from "@/interface";
import { onMounted, ref } from "vue";
import Suggest from "@/components/search/suggest.vue";
import { useStore } from "@/store/main.js";
import { useRouter } from "vue-router";
import SearchList from "../components/base/search-list/search-list.vue";
import { storeToRefs } from "pinia";
import useSearchHistory from "@/components/search/use-search-history";
import Confirm from "@/components/base/confirm/confirm.vue";

const router = useRouter();
const store = useStore();
const { searchHistoryList: searchHistory } = storeToRefs(store);
const { saveSearch, delSearch, cleanHistory } = useSearchHistory();

const query = ref("");
const hotKeys = ref<HotKeyType[]>([]);
const selectedSinger = ref<SingerType | null>(null);
const confirmRef= ref<typeof Confirm & {show(): void} | null>(null)

function addQuery(queryStr: string) {
  query.value = queryStr;
}
function handleSelectSinger(singer: SingerType) {
  saveSearch(query.value);
  selectedSinger.value = singer;
  router.push({
    name: "search-singer-detail",
    params: {
      id: singer.mid,
    },
  });
}
function handleSelectSong(song: SongType) {
  store.addSong(song);
  saveSearch(query.value);
}
function handleSelect (item: string) {
    query.value = item
}
function handleDelete (item: string) {
    delSearch(item)
}
function showConfirm () {
    confirmRef.value!.show()
}
function handleCleanHistory () {
    cleanHistory()
}
onMounted(async () => {
  const data = await getHotKeys();
  hotKeys.value = data?.hotKey?.length
    ? data.hotKey
    : [
        {
          id: 1,
          key: "周杰伦",
        },
        {
          id: 2,
          key: "最美",
        },
      ];
});
</script>

<template>
  <div class="search">
    <div class="search-input-wrapper">
      <SearchInput v-model="query" />
    </div>
    <div class="search-content" v-show="!query">
      <div class="hot-keys">
        <h1 class="title">热门搜索</h1>
        <ul
          class="item"
          v-for="item in hotKeys"
          :key="item.id"
          @click="addQuery(item.key)"
        >
          <li>
            <span>{{ item.key }}</span>
          </li>
        </ul>
      </div>
      <div class="search-history" v-show="searchHistory.length">
        <h1 class="title">
          <span class="text">搜索历史</span>
          <span class="clear" @click="showConfirm">
            <i class="icon-clear"></i>
          </span>
        </h1>
        <Confirm @confirm="handleCleanHistory" ref='confirmRef' text="是否清空搜索历史" confirm-btn-text="清空"  />
        <SearchList @select="handleSelect" @delete="handleDelete" :searches="searchHistory" />
      </div>
    </div>

    <div class="search-result" v-show="query">
      <Suggest
        :query="query"
        @select-singer="handleSelectSinger"
        @select-song="handleSelectSong"
      />
    </div>
    <RouterView v-slot="{ Component }">
      <transition name="slide" appear>
        <component :is="Component" :data="selectedSinger" />
      </transition>
    </RouterView>
  </div>
</template>
<style lang="scss" scoped>
.search {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  .search-input-wrapper {
    margin: 20px;
  }
  .search-content {
    flex: 1;
    overflow: hidden;
    .hot-keys {
      margin: 0 20px 20px 20px;
      .title {
        margin-bottom: 20px;
        font-size: $font-size-medium;
        color: $color-text-l;
      }
      .item {
        display: inline-block;
        padding: 5px 10px;
        margin: 0 20px 10px 0;
        border-radius: 6px;
        background: $color-highlight-background;
        font-size: $font-size-medium;
        color: $color-text-d;
      }
    }
    .search-history {
      position: relative;
      margin: 0 20px;
      .title {
        display: flex;
        align-items: center;
        height: 40px;
        font-size: $font-size-medium;
        color: $color-text-l;
        .text {
          flex: 1;
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
  }
  .search-result {
    flex: 1;
    overflow: hidden;
  }
}
</style>
