<template>
  <v-row>
    <v-col v-for="(opponent, index) in props.opponentsInfo" :key="index">
      <v-row v-if="index === 0" class="d-flex  justify-center align-center mx-auto ml-5">
        <!-- LOGO/SIGLA/SCORE TIME 0 -->
        <!-- BANDEIRA DA ORG -->
        <v-col  class="d-flex justify-center">
          <v-img class="elevation-1" max-width="6vw" :src="teamLogoThumb(false, opponent.opponent.location)" />
        </v-col>
        <!-- LOGO -->
        <v-col  class="pa-0 d-flex justify-end">
          <v-img max-width="6vw" :src="teamLogoThumb(opponent.opponent.image_url, false)" />
        </v-col>
        <v-col>
          <!-- SIGLA -->
          <span class="text-left acronym">
            {{ opponent.opponent.name }}
          </span>
        </v-col>
      </v-row>
      <v-row v-if="index === 1" class="d-flex align-center mr-5">
        <!-- LOGO/SIGLA/SCORE TIME 1 -->
        <!-- LOGO -->
        <v-col class="text-right">
          <!-- SIGLA -->

          <span class="acronym">
            {{ opponent.opponent.name }}
          </span>

        </v-col>
        <!-- LOGO -->
        <v-col class="pa-0 d-flex justify-start">
          <v-img max-width="6vw" :src="teamLogoThumb(opponent.opponent.image_url, false)" />
        </v-col>
        <!-- BANDEIRA DA ORG -->
        <v-col class="d-flex justify-center">
          <v-img class="elevation-1" max-width="6vw" :src="teamLogoThumb(false, opponent.opponent.location)"
            :alt="opponent.opponent.location + ' flag'" />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script setup>
const { teamLogoThumb } = useLogos();

const props = defineProps({
  opponentsInfo: { type: Array, required: true },
});

</script>

<style lang="scss" scoped>
.acronym {
  font-family: "Poppins";
  font-weight: bold;
  color: #000000;
  font-size: 25px !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 960px) {
    font-size: 21px !important;
  }
}

.score {
  font-family: "Poppins";
  font-weight: bold;
  font-size: 20px !important;
  color: #002776;

  @media (max-width: 960px) {
    font-size: 14px !important;
  }
}

.rosters {
  border-bottom: 1px solid #E6E6E6;
  margin: 0 50px;
  min-height: 30dvh;
}
</style>