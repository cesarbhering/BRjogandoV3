import { defineStore } from "pinia";

const mocks = {
  running: () => import("~/mocks/running.json"),
  upcoming: () => import("~/mocks/upcoming.json"),
  past: () => import("~/mocks/past.json"),
};

/**
 * Busca os jogos da PandaScore ou, com a flag de mock ligada, dos JSONs em /mocks.
 * @param {String} matchOccurrence running, upcoming ou past
 * @returns {Promise<Array>} lista de jogos
 */
const fetchMatches = async (matchOccurrence) => {
  if (useRuntimeConfig().public.mockData) {
    const mock = (await mocks[matchOccurrence]()).default;
    // Logos baixados em public/mocks, para não fazer chamada externa no modo mock
    const localMock = JSON.parse(
      JSON.stringify(mock).replaceAll("https://cdn-api.pandascore.co/", "/mocks/")
    );
    // O mock de past veio como array puro, os outros como { data: [...] }
    return Array.isArray(localMock) ? localMock : localMock.data;
  }
  const res = await fetch(
    `/.netlify/functions/fetchPandaScoreMatches?matchOccurrence=${matchOccurrence}`
  );
  return (await res.json()).data;
};

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
      fetchMatches("running").then((matches) => {
        this.runningMatches = matches;
      });
    },

    fetchUpcomingMatches() {
      fetchMatches("upcoming").then((matches) => {
        this.upcomingMatches = matches;
      });
    },

    fetchPastMatches() {
      fetchMatches("past").then((matches) => {
        this.pastMatches = matches;
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
      if (useRuntimeConfig().public.mockData) return;
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
      if (useRuntimeConfig().public.mockData) return;
      fetch(`/.netlify/functions/fetchOdds1xBet?matchUrl1xBet=${matchUrl1xBet}`)
        .then((res) => res.json())
        .then(async (res) => {
          const match = this[`${matchOccurrence}Matches`].find(
            (match) => match.id === pandaScoreMatchId
          );
          Object.assign(match, { odds: { odds1xBet: res.data } });
        });
    },

    fetchGameRosters(matchDetails, matchOccurrence) {
      if (useRuntimeConfig().public.mockData) return;
      const videoGameId = matchDetails.videogame.id
      const opponentOneId = matchDetails.opponents[0].opponent.id
      const opponentTwoId = matchDetails.opponents[1].opponent.id
      fetch(`/.netlify/functions/fetchGameRosters?videoGameId=${videoGameId}&opponentOneId=${opponentOneId}&opponentTwoId=${opponentTwoId}`)
        .then((res) => res.json())
        .then((res) => {
          const match = this[`${matchOccurrence}Matches`].find(
            (match) => match.id === matchDetails.id
          );
          Object.assign(match, { rosters: res.data });
        });
    },

    // Store Liquipedia links in match data (similar to rosters)
    async storeLiquipediaLinks(matchDetails, matchOccurrence, links) {
      const match = this[`${matchOccurrence}Matches`].find(
        (match) => match.id === matchDetails.id
      );
      if (match) {
        Object.assign(match, { liquipediaLinks: links });
      }
    },


  },
});
