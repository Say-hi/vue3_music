import { LOCAL_HISTORY } from "@/interface";
import { useStore } from "@/store";
import { cleanLocal, load } from "@/utils/array-storage";

const store = useStore()

export default function useSearchHistory() {
  function saveSearch(query: string) {
    let search = load<string>(LOCAL_HISTORY);
    if (search.findIndex((i) => i === query) === -1) {
      search.push(query);
      localStorage.setItem(LOCAL_HISTORY, JSON.stringify(search));
    }
    store.searchHistoryList = search
  }

  function delSearch(query: string) {
    const index = store.searchHistoryList.findIndex(i => i === query)
    store.searchHistoryList.splice(index, 1)
    localStorage.setItem(LOCAL_HISTORY, JSON.stringify(store.searchHistoryList));
  }

  function cleanHistory() {
    store.searchHistoryList = []
    cleanLocal(LOCAL_HISTORY)
  }

  return {
    saveSearch,
    delSearch,
    cleanHistory
  };
}
