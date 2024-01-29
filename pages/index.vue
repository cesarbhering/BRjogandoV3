<template>
  <div class="home">
    <v-container class="px-1">
      <div class="container-title">Partidas ao vivo</div>
      {{ name.value }}

      <!-- VER ESPAÇAMENTO QUANDO TEM POUCOS CARDS -->
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
    <v-container class="mb-3">
      <v-row class="justify-center">
        <v-col :cols="mobile ? 12 : 9" class="d-flex flex-wrap justify-center">
          <v-row class="justify-center">
            <span class="container-title">Próximas Partidas</span>
          </v-row>
          <v-row class="justify-center">
            <CardsBig
              v-for="(upcomingMatch, index) in upcomingMatches"
              :key="index"
              :match-info="upcomingMatch"
            />
          </v-row>
        </v-col>
        <v-col v-if="!mobile">
          <v-row class="mt-15 ml-6 last-matches">
            <span>Últimas Partidas</span>
          </v-row>
          <v-row>
            <CardsSmall
              v-for="(pastMatch, index) in pastMatches"
              :key="index"
              :match-info="pastMatch"
            />
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <!-- ULTIMAS PARTIDAS MOBILE -->
    <v-container v-if="mobile">
      <v-row class="mb-2">
        <v-row class="justify-center">
          <div class="last-matches">
            <span>Últimas Partidas</span>
          </div>
        </v-row>
        <v-row>
          <v-col
            class="d-flex flex-wrap justify-center pa-0"
            v-for="(pastMatch, index) in pastMatches"
            :key="index"
          >
            <CardsSmall :match-info="pastMatch" />
          </v-col>
        </v-row>
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

useSeoMeta({
  title: 'BRjogando',
  ogTitle: 'BRjogando',
  description: 'Jogos que importam, na hora que importam.',
  ogDescription: 'Jogos que importam, na hora que importam.',
  ogImage: '/og-image.png',
  twitterCard: '/og-image.png',
})

onBeforeMount(async () => {
  // Carrega a informação das partidas na store
  gamesStore.fetchRunningMatches();
  gamesStore.fetchUpcomingMatches();
  gamesStore.fetchPastMatches();
});

// Para auxiliar o carrossel
let model = null;

const { mobile, name, lgAndUp } = useDisplay();

const colsNum = computed(() => {
  switch (name.value) {
    case "xs":
      return 3;
    case "sm":
      return 333;
    case "md":
      return 333;
    case "lg":
      return 392;
    case "xl":
      return 392;
    case "xxl":
      return 392;
    default:
      return 392;
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
  font-size: 3vw;
  line-height: 69px;
  text-align: center;
  /* Flag/Blue */
  color: #002776;
  @media (max-width: 960px) {
    font-size: 2rem;
  }
}

.last-matches {
  /* Desktop/H2 */
  font-family: "Poppins";
  font-style: normal;
  font-weight: 700;
  font-size: 1.3rem;
  color: #000000;
}
</style>
