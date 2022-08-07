import { LOCAL_FAVORITE, SongType } from "@/interface"
import { useStore } from "@/store"
import { remove, save } from "@/utils/array-storage"
import { storeToRefs } from "pinia"

export default function useFavorite<T extends SongType> () {

    const store = useStore()
    const { favoriteList } = storeToRefs(store)
    const maxlength = 100

    function getFavoriteIcon (song: T) {
        return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
    }

    function isFavorite(song: T) {
        return favoriteList.value.find(i => i.id === song.id)
    }

    function toggleFavorite(song: T) {
        let list: Array<T> = []
        if (isFavorite(song)) {
            list = remove(LOCAL_FAVORITE, compare)
        } else {
            list = save(song, LOCAL_FAVORITE, compare, maxlength)
        }
        store.setFavoriteList(list)

        function compare (item: T) {
            return item.id === song.id
        }
    }

    return {
        getFavoriteIcon,
        toggleFavorite
    }
}