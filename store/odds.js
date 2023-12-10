import { defineStore } from "pinia";

export const useOddsStore = defineStore({
  id: "odds-store",
  state: () => {
    return {
      odds: [],
    };
  },
  actions: {
    fetchOdds1xBet(matchUrl) {
      fetch(`/.netlify/functions/fetchOdds1xBet?matchUrl1xBet=${matchUrl}`)
        .then((res) => res.json())
        .then((res) => {
          this.odds = res.data;
        });
    },
  },
});