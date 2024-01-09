import { defineStore } from "pinia";

export const useGamesStore = defineStore({
  id: "games-store",
  state: () => {
    return {
      upcomingMatches: [],
      runningMatches: [],
      pastMatches: [],
    };
  },
  actions: {
    fetchRunningMatches() {
      fetch(
        "/.netlify/functions/fetchPandaScoreMatches?matchOccurrence=running"
      )
        .then((res) => res.json())
        .then((res) => {
          this.runningMatches = res.data;
        });
    },

    fetchUpcomingMatches() {
      fetch(
        "/.netlify/functions/fetchPandaScoreMatches?matchOccurrence=upcoming"
      )
        .then((res) => res.json())
        .then((res) => {
          this.upcomingMatches = res.data;
        });
    },

    fetchPastMatches() {
      fetch("/.netlify/functions/fetchPandaScoreMatches?matchOccurrence=past")
        .then((res) => res.json())
        .then((res) => {
          this.pastMatches = res.data;
        });
    },

    /**
     * Faz a chamada no supabase para pegar dados adicionais de um jogo.
     * @param {Number} pandaScoreMatchId
     * @param {String} matchOccurrence
     */
    async fetchSupabaseDataForMatch(
      pandaScoreMatchId,
      matchOccurrence,
      pandaScoreSerieId,
      teamNames
    ) {
      try {
        const response = await fetch(
          `/.netlify/functions/fetchSupabaseDataForMatch?matchOccurrence=${matchOccurrence}&pandaScoreSerieId=${pandaScoreSerieId}&teamNames=${teamNames}`
        );
        const data = await response.json();
        //Adiciona as informações no pinia
        this[`${matchOccurrence}Matches`].find(
          (match) => match.id === pandaScoreMatchId
        ).supabaseDataForMatch = Object.assign({}, ...data.data);
      } catch (error) {
        console.error("Error fetching Supabase data:", error);
      }
    },

    fetchOdds1xBet(matchUrl1xBet, pandaScoreMatchId, matchOccurrence) {
      fetch(`/.netlify/functions/fetchOdds1xBet?matchUrl1xBet=${matchUrl1xBet}`)
        .then((res) => res.json())
        .then(async (res) => {
          const match = this[`${matchOccurrence}Matches`].find(
            (match) => match.id === pandaScoreMatchId
          );
          Object.assign(match, { odds: { odds1xBet: res.data } });
        });
    },
  },
});
