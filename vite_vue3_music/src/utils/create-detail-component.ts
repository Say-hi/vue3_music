import MusicList from "@/components/music-list/music-list.vue";
import { processSongs } from "@/api/song";
import { computed, onMounted, reactive, ref } from "vue";
import { AlbumType, SingerType, SongType } from "@/interface";
import { useRoute, useRouter } from "vue-router";

type dataType = SingerType | AlbumType;

export default function createDetailComponent(
  name: string,
  key: string,
  fetch: Function
) {
  return {
    name,
    props: ["data"],
    components: {
        MusicList
    },
    setup(props: { data: dataType; }) {
      const route = useRoute();
      const router = useRouter();
      const songs = ref<SongType[]>([]);
      const loading = ref(true);

      let propsData = reactive<dataType>(props.data);
      if (propsData?.id) {
        checkLocal(key, propsData);
      } else {
        propsData = checkLocal(key);
      }

      const pic = computed(() => propsData.pic);
      const title = computed(() => propsData.name || (propsData as AlbumType).title);

      function checkLocal(key: string, data?: dataType): dataType {
        let datas = null;
        try {
          if (data) {
            localStorage.setItem(key, JSON.stringify(data));
          } else {
            datas = JSON.parse(String(localStorage.getItem(key)));
          }
        } catch (e) {}
        return datas;
      }
      onMounted(async () => {
        const singerLocalTemp = propsData;
        if (!singerLocalTemp) {
          const path = route.matched[0].path;
          router.push({
            path,
          });
          return;
        }
        const data = await fetch(singerLocalTemp);
        songs.value = await processSongs(data.songs);
        loading.value = false;
      });
      return {
        songs,
        loading,
        props,
        pic,
        title,
      };
    },
  };
}
