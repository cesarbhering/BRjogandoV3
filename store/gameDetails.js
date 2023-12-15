import { defineStore } from "pinia";

export const useGamesStore = defineStore({
  id: "games-store",
  state: () => {
    return {
      teamPlayers: [],
    };
  },
  actions: {

        fetchTeamPlayers() {
        fetch('/.netlify/functions/fetchPandaScoreMatches?matchOccurrence=running')
            .then((res) => res.json())
            .then((res) => {
            this.teamPlayers = res.data;
            });
        },
    }
    );
