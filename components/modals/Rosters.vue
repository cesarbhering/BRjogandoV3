<template>
  <v-row v-for="(player, index) in teamRosterActivePlayers" :key="index" min-width="120%"
    class="ma-1 d-flex align-center rounded-xl justify-center">
    <v-col fluid cols="4" class="d-flex align-center pa-1 rounded-xl justify-center player">
      <span class="ma-1">{{ player.name }}</span>
      <v-img class="elevation-1" min-width="20px" max-width="2vw" :src="teamLogoThumb(false, player.nationality)" />
    </v-col>
  </v-row>
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
.player {
  // marke border 1px solid #002776
  border: 1px solid #E6E6E6;
  color: #002776;
  font-weight: bold;
  font-size: 17px !important;

  @media (max-width: 960px) {
    font-size: 15px !important;
    border: none;
  }

}
</style>