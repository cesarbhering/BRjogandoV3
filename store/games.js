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

    fetchGameRosters(matchDetails, matchOccurrence) {
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
