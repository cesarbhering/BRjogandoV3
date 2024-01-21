<template>
 
    <v-row v-for="(player, index) in props.teamRoster" :key="index">
      <v-col  class="d-flex align-center pa-1 rounded-xl justify-center"> 
        <span class="pa-2">{{ player.name }}</span>
        <v-img class="elevation-1" max-width="2vw" :src="teamLogoThumb(false, player.nationality)" />
      </v-col>
    </v-row> 

</template>

<script setup>

const props = defineProps({
  teamRoster: { type: Array, default: [] },
});


const { teamLogoThumb } = useLogos();



</script>

<style lang="scss" scoped></style>