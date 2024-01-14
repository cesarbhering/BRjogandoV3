<template>
  <div class="home">
    <v-container class="px-1">
      <div class="container-title">Partidas ao vivo</div>
      {{ name.value }}

      <v-sheet color="#E4E7EC">
        <v-slide-group v-model="model" :show-arrows="!mobile">
          <v-slide-group-item
            v-for="(runningMatch, index) in runningMatches"
            :key="index"
            v-slot="{ isSelected, toggle, selectedClass }"
          >
            <div class="mr-3">
              <!-- REATIVIDADE MOBILE VERIFICAR -->
              <CardsMedium :match-info="runningMatch" />
            </div>
          </v-slide-group-item>
        </v-slide-group>
      </v-sheet>
    </v-container>
    <v-container>
      <div class="container-title">Próximas Partidas</div>
      <v-row>
        <v-col :cols="colsNum" class="d-flex flex-wrap">
          <CardsBig
            v-for="(upcomingMatch, index) in upcomingMatches"
            :key="index"
            class="ma-2"
            :match-info="upcomingMatch"
          />
        </v-col>
        <v-col v-if="!mobile">
          <CardsSmall
            v-for="(pastMatch, index) in pastMatches"
            :key="index"
            :match-info="pastMatch"
          />
        </v-col>
      </v-row>
    </v-container>

    <v-container v-if="mobile">
      <h1>Últimas Partidas</h1>
      <v-row>
        <v-col
          v-for="(pastMatch, index) in pastMatches"
          :key="index"
          class="mt-1"
          :sm="4"
          :lg="3"
          :xl="2"
        >
          <CardsSmall :match-info="pastMatch" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script setup>
import { useDisplay } from "vuetify";
import { useGamesStore } from "~/store/games";
import { storeToRefs } from "pinia";

const gamesStore = useGamesStore();
const { upcomingMatches } = storeToRefs(gamesStore);
const { runningMatches } = storeToRefs(gamesStore);
const { pastMatches } = storeToRefs(gamesStore);

onBeforeMount(async () => {
  // Carrega a informação das partidas na store
  gamesStore.fetchRunningMatches();
  gamesStore.fetchUpcomingMatches();
  gamesStore.fetchPastMatches();
});

// Para auxiliar o carrossel
let model = null;

const { mobile, name } = useDisplay();

const colsNum = computed(() => {
  switch (name.value) {
    case "xs":
      return 12;
    case "sm":
      return 12;
    case "md":
      return 9;
    case "lg":
      return 9;
    case "xl":
      return 10;
    case "xxl":
      return 9;
    default:
      return 9;
  }
});
</script>

<style lang="scss" scoped>
.home {
  background-color: #e4e7ec;
  margin-top: 80px;
}

.container-title {
  /* Desktop/Hero */
  font-family: "Poppins";
  font-style: normal;
  font-weight: 900;
  font-size: 46px;
  line-height: 69px;
  /* identical to box height */
  text-align: center;

  /* Flag/Blue */
  color: #002776;
}
</style>
