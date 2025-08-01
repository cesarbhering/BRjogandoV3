<template>
  <div class="roster-container">
    <div v-for="(player, index) in teamRosterActivePlayers" :key="index" class="player-row">
      <span class="player-name">{{ player.name }}</span>
      <v-img class="player-flag" :src="teamLogoThumb(false, player.nationality)" />
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


</script>

<style lang="scss" scoped>
.roster-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  @media (max-width: 960px) {
    gap: 6px;
  }
}

.player-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: white;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f8f9fa;
  }
  
  @media (max-width: 960px) {
    padding: 6px 10px;
  }
}

.player-name {
  font-family: "Poppins";
  font-weight: 500;
  font-size: 14px;
  color: #2c3e50;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 8px;
  
  @media (max-width: 960px) {
    font-size: 13px;
  }
}

.player-flag {
  width: 24px;
  height: 18px;
  border-radius: 2px;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  
  @media (max-width: 960px) {
    width: 20px;
    height: 15px;
  }
}
</style>