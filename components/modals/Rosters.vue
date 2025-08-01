<template>
  <div class="roster-list">
    <div v-for="(player, index) in teamRosterActivePlayers" :key="index" class="player-item">
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
.roster-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.player-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #e9ecef;
  }
  
  @media (max-width: 960px) {
    padding: 5px 6px;
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