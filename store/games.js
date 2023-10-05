// store/filters.ts
import { defineStore } from "pinia";

export const useGamesStore = defineStore({
  id: "games-store",
  state: () => {
    return {
      upcomingMatches: [],
      runningMatches: [],
      pastMatches: []
    };
  },
  actions: {

    fetchRunningMatches() {
      fetch('/.netlify/functions/fetchRunningMatches')
        .then((res) => res.json())
        .then((res) => {
          this.runningMatches = res.data;
        });
    },

    fetchUpcomingMatches() {
      const thing = 'cleiton'

      fetch(`/.netlify/functions/fetchUpcomingMatches?item=${thing}`)
        .then((res) => res.json())
        .then((res) => {
          this.upcomingMatches = res.data;
        });
    },

    fetchPastMatches() {
      fetch("/.netlify/functions/fetchPastMatches")
        .then((res) => res.json())
        .then((res) => {
          this.pastMatches = res.data;
        });
    }
  },
});
