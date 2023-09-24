// store/filters.ts
import { defineStore } from "pinia";

export const useMainStore = defineStore({
  id: "main-store",
  state: () => {
    return {
      list: ["youtube", "twitch"],
    };
  },
  actions: {
    addValueToFilterList(value) {
      this.filtersList.push(value);
    },
  },
  getters: {
    filtersList: (state) => state.filtersList,
  },
});
