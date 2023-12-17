import { defineStore } from "pinia";

export const useGameDetailsStore = defineStore({
  id: "game-details-store",
  state: () => {
    return {
      gameRosters: [],
    };
  },
  actions: {
    fetchGameRosters(payload) {
      const videoGameId = payload.videogame.id
      const opponentOneId = payload.opponents[0].opponent.id
      const opponentTwoId = payload.opponents[1].opponent.id
      fetch(`/.netlify/functions/fetchGameRosters?videoGameId=${videoGameId}&opponentOneId=${opponentOneId}&opponentTwoId=${opponentTwoId}`)
          .then((res) => res.json())
          .then((res) => {
          this.gameRosters = res.data;
          });
    },
  }
  });

    