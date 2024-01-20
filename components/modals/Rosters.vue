<template>
  <div class="bg-blue text-center">

    <v-row v-for="(player, index) in props.gameRosters" :key="index">
      <v-col> {{ player.name }}</v-col>
      <v-col>
        <v-img class="elevation-1" max-width="2vw" :src="teamLogoThumb(false, player.nationality)" />
      </v-col>
    </v-row>

  </div>
</template>

<script setup>

const props = defineProps({
  gameRosters: { type: Object, required: true, default: [] },
});


const { teamLogoThumb } = useLogos();



</script>

<style lang="scss" scoped></style>