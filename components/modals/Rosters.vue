<template>
  <div class="roster-list">
    <div v-for="(player, index) in teamRosterActivePlayers" :key="index" class="player-item" :class="{ 'live': props.isLive }">
      <div class="player-basic-info">
        <span class="player-name">{{ player.name }}</span>
        <v-img class="player-flag" :src="teamLogoThumb(false, player.nationality)" />
      </div>
      
      <!-- Live Stats Display -->
      <div v-if="props.isLive && playerLiveStats(player)" class="live-stats">
        <div class="stats-row">
          <template v-if="isCSGame">
            <span class="stat">K: {{ playerLiveStats(player)?.kills || 0 }}</span>
            <span class="stat">D: {{ playerLiveStats(player)?.deaths || 0 }}</span>
            <span class="stat">A: {{ playerLiveStats(player)?.assists || 0 }}</span>
            <span class="stat kd-ratio">{{ getKDRatio(playerLiveStats(player)) }}</span>
          </template>
          
          <template v-else-if="isLoLGame">
            <span class="stat">{{ playerLiveStats(player)?.kills || 0 }}/{{ playerLiveStats(player)?.deaths || 0 }}/{{ playerLiveStats(player)?.assists || 0 }}</span>
            <span class="stat">CS: {{ playerLiveStats(player)?.creep_score || 0 }}</span>
            <span class="stat gold">{{ formatGold(playerLiveStats(player)?.gold) }}</span>
          </template>
          
          <template v-else-if="isValorantGame">
            <span class="stat">K: {{ playerLiveStats(player)?.kills || 0 }}</span>
            <span class="stat">D: {{ playerLiveStats(player)?.deaths || 0 }}</span>
            <span class="stat">A: {{ playerLiveStats(player)?.assists || 0 }}</span>
            <span class="stat score">{{ playerLiveStats(player)?.combat_score || 0 }}</span>
          </template>
          
          <template v-else>
            <!-- Generic stats for other games -->
            <span class="stat" v-if="playerLiveStats(player)?.kills !== undefined">
              K: {{ playerLiveStats(player).kills }}
            </span>
            <span class="stat" v-if="playerLiveStats(player)?.deaths !== undefined">
              D: {{ playerLiveStats(player).deaths }}
            </span>
            <span class="stat" v-if="playerLiveStats(player)?.assists !== undefined">
              A: {{ playerLiveStats(player).assists }}
            </span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  teamRoster: { type: Array, default: [] },
  liveStats: { type: Object, default: () => ({}) },
  isLive: { type: Boolean, default: false },
  gameType: { type: String, default: '' },
});


const { teamLogoThumb } = useLogos();

const teamRosterActivePlayers = computed(() => {
  return props.teamRoster.filter((player) => player.active === true).slice(0, 5);
});

const isCSGame = computed(() => {
  return props.gameType?.toLowerCase().includes('counter-strike') || 
         props.gameType?.toLowerCase().includes('cs:go') ||
         props.gameType?.toLowerCase().includes('cs2');
});

const isLoLGame = computed(() => {
  return props.gameType?.toLowerCase().includes('league of legends') ||
         props.gameType?.toLowerCase().includes('lol');
});

const isValorantGame = computed(() => {
  return props.gameType?.toLowerCase().includes('valorant');
});

function playerLiveStats(player) {
  return props.liveStats[player.id] || null;
}

function getKDRatio(stats) {
  if (!stats || stats.deaths === 0) return (stats?.kills || 0).toFixed(1);
  return (stats.kills / stats.deaths).toFixed(1);
}

function formatGold(gold) {
  if (!gold) return '0';
  if (gold >= 1000) {
    return (gold / 1000).toFixed(1) + 'k';
  }
  return gold.toString();
}


</script>

<style lang="scss" scoped>
.roster-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.player-item {
  padding: 6px 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
  transition: all 0.2s;
  
  &:hover {
    background-color: #e9ecef;
  }
  
  &.live {
    background: linear-gradient(90deg, #f8f9fa 0%, #e3f2fd 100%);
    border-left: 3px solid #2196f3;
  }
  
  @media (max-width: 960px) {
    padding: 5px 6px;
  }
}

.player-basic-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.live-stats {
  margin-top: 4px;
  padding-top: 4px;
  border-top: 1px solid #e0e0e0;
}

.stats-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  
  @media (max-width: 960px) {
    gap: 6px;
  }
}

.stat {
  font-family: "Poppins";
  font-size: 10px;
  font-weight: 600;
  padding: 2px 4px;
  background: #fff;
  border-radius: 3px;
  border: 1px solid #e0e0e0;
  color: #333;
  
  &.kd-ratio {
    background: #4caf50;
    color: white;
    border-color: #4caf50;
  }
  
  &.gold {
    background: #ffc107;
    color: #333;
    border-color: #ffc107;
  }
  
  &.score {
    background: #ff5722;
    color: white;
    border-color: #ff5722;
  }
  
  @media (max-width: 960px) {
    font-size: 9px;
    padding: 1px 3px;
  }
}

.player-name {
  font-family: "Poppins";
  font-weight: 500;
  font-size: 13px;
  color: #333;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 8px;
  
  @media (max-width: 960px) {
    font-size: 12px;
  }
}

.player-flag {
  width: 20px;
  height: 15px;
  border-radius: 2px;
  flex-shrink: 0;
  
  @media (max-width: 960px) {
    width: 18px;
    height: 13px;
  }
}
</style>