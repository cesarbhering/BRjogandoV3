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
      fetch('/.netlify/functions/fetchPandaScoreMatches?matchOccurrence=running')
        .then((res) => res.json())
        .then((res) => {
          this.runningMatches = res.data;
        });
    },

    fetchUpcomingMatches() {
      fetch('/.netlify/functions/fetchPandaScoreMatches?matchOccurrence=upcoming')
        .then((res) => res.json())
        .then((res) => {
          this.upcomingMatches = res.data;
        });
    },

    fetchPastMatches() {
      fetch('/.netlify/functions/fetchPandaScoreMatches?matchOccurrence=past')
        .then((res) => res.json())
        .then((res) => {
          this.pastMatches = res.data;
        });
    },

    fetchSupabaseDataForMatch(pandaScoreMatchId, matchOccurrence) {
      fetch(`/.netlify/functions/fetchSupabaseDataForMatch?pandaScoreMatchId=${pandaScoreMatchId}`)
        .then((res) => res.json())
        .then((res) => {
          this.supabaseDataForMatch = res.data;
        });
    },
  },
});
