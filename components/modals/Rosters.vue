<template>
  <div class="roster-list">
    <div v-for="(player, index) in teamRosterActivePlayers" :key="index" class="player-item">
      <div class="player-basic-info">
        <span class="player-name">{{ formatPlayerName(player) }}</span>
        <div class="flag-container">
          <v-img class="player-flag" :src="teamLogoThumb(false, player.nationality)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  teamRoster: { type: Array, default: [] },
});


const { teamLogoThumb } = useLogos();

const teamRosterActivePlayers = computed(() => {
  return props.teamRoster.filter((player) => player.active === true).slice(0, 5);
});

// Format player name as: FirstName "Nickname" LastName
function formatPlayerName(player) {
  if (!player) return '';
  
  // Try different name field combinations
  const firstName = player.first_name || '';
  const lastName = player.last_name || '';
  const nickname = player.name || player.slug || player.nickname || '';
  
  // If we have first and last name, format as: FirstName "Nickname" LastName
  if (firstName && lastName && nickname) {
    return `${firstName} "${nickname}" ${lastName}`;
  }
  
  // If we only have nickname, show it without quotes
  if (nickname && !firstName && !lastName) {
    return nickname;
  }
  
  // If we have first/last but no nickname
  if ((firstName || lastName) && !nickname) {
    return `${firstName} ${lastName}`.trim();
  }
  
  // Fallback to whatever name we have
  return nickname || firstName || lastName || 'Unknown Player';
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
  

  
  @media (max-width: 960px) {
    padding: 5px 6px;
  }
}

.player-basic-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.player-name {
  font-family: "Poppins";
  font-weight: 500;
  font-size: 13px;
  color: #333;
  flex: 0 1 80%; /* Takes 80% of the container */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  @media (max-width: 960px) {
    font-size: 12px;
  }
}

.flag-container {
  flex: 0 0 20%; /* Takes exactly 20% of the container */
  display: flex;
  justify-content: flex-end;
}

.player-flag {
  width: 20px;
  height: 15px;
  border-radius: 2px;
  
  @media (max-width: 960px) {
    width: 18px;
    height: 13px;
  }
}

/* Dark mode styles for roster component */
[data-theme="dark"] .roster-list {
  background-color: var(--bg-secondary, #1a1a1a) !important;
}

[data-theme="dark"] .player-item {
  background-color: var(--bg-tertiary, #2a2a2a) !important;
  color: var(--text-primary, #ffffff) !important;
  border: 1px solid var(--border, #333) !important;
  
  &:hover {
    background-color: #3a3a3a !important;
  }
}

[data-theme="dark"] .player-name {
  color: var(--text-primary, #ffffff) !important;
}
</style>