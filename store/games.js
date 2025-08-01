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

    async fetchLivePlayerStats(matchInfo) {
      try {
        // Only fetch live stats for running matches
        if (matchInfo.status !== 'running') {
          return null;
        }

        // Get current game ID if available
        const currentGame = matchInfo.games?.find(game => 
          game.status === 'running' || (!game.finished && !game.forfeit)
        );
        
        const queryParams = new URLSearchParams({
          matchId: matchInfo.id,
          ...(currentGame?.id && { gameId: currentGame.id })
        });

        const responseData = await fetch(
          `/.netlify/functions/fetchLivePlayerStats?${queryParams}`
        );
        
        if (!responseData.ok) {
          // In development, Netlify functions might not be available
          if (responseData.status === 404 && process.env.NODE_ENV === 'development') {
            console.warn('Live stats not available in development mode (Netlify functions not running)');
            return null;
          }
          throw new Error(`HTTP ${responseData.status}: ${responseData.statusText}`);
        }

        const response = await responseData.json();
        
        // Store live stats in match object - find in all match arrays
        const allMatches = [...this.runningMatches, ...this.upcomingMatches, ...this.pastMatches];
        const matchIndex = allMatches.findIndex((match) => match.id === matchInfo.id);
        
        if (matchIndex !== -1) {
          // Update in the specific array based on match status
          let targetArray;
          if (matchInfo.status === 'running') targetArray = this.runningMatches;
          else if (matchInfo.status === 'not_started') targetArray = this.upcomingMatches;
          else targetArray = this.pastMatches;
          
          const targetIndex = targetArray.findIndex((match) => match.id === matchInfo.id);
          if (targetIndex !== -1) {
            Object.assign(targetArray[targetIndex], {
              livePlayerStats: response.playerStats,
              currentGameInfo: response.currentGame,
              statsTimestamp: response.timestamp
            });
          }
        }
        
        // Also update the passed matchInfo object
        Object.assign(matchInfo, {
          livePlayerStats: response.playerStats,
          currentGameInfo: response.currentGame,
          statsTimestamp: response.timestamp
        });

        return response;
      } catch (error) {
        console.error("Error fetching live player stats:", error);
        return null;
      }
    }
  },
});
