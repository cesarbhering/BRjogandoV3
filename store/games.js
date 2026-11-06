import { defineStore } from "pinia";

const mocks = {
  running: () => import("~/mocks/running.json"),
  upcoming: () => import("~/mocks/upcoming.json"),
  past: () => import("~/mocks/past.json"),
};

/**
 * Fetches matches from PandaScore or, with the mock flag on, from the JSON files in /mocks.
 * @param {String} matchOccurrence running, upcoming or past
 * @returns {Promise<Array>} list of matches
 */
const fetchMatches = async (matchOccurrence) => {
  if (useRuntimeConfig().public.mockData) {
    const mock = (await mocks[matchOccurrence]()).default;
    // Logos are saved in public/mocks, so mock mode makes no external calls
    const localMock = JSON.parse(
      JSON.stringify(mock).replaceAll("https://cdn-api.pandascore.co/", "/mocks/")
    );
    // The past mock is a plain array, the others are { data: [...] }
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
