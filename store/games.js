// store/filters.ts
import { defineStore } from "pinia";

export const useGamesStore = defineStore({
  id: "games-store",
  state: () => {
    return {
      upcomingMatches: [],
      runningMatches: []
    };
  },
  actions: {

    fetchRunningMatches() {
      fetch("/.netlify/functions/fetchRunningMatches")
        .then((res) => res.json())
        .then((res) => {
          this.runningMatches = res.data;
        });
    },

    fetchUpcomingMatches() {
      fetch("/.netlify/functions/fetchUpcomingMatches")
        .then((res) => res.json())
        .then((res) => {
          this.upcomingMatches = res.data;
        });
    }
  },
});
