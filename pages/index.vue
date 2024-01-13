<template>
  <div class="home">
    <v-container class="px-1">
      <div class="container-title">Partidas ao vivo</div>
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
    <v-container>
      <div class="container-title">Próximas Partidas</div>
      <v-row>
        <v-col :cols="mobile ? 12 : 9" class="d-flex flex-wrap">
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
      <!--  <v-row no-gutters>
        <v-col cols="8">
          <v-sheet class="pa-2 ma-2"> .v-col-2 </v-sheet>
        </v-col>
        <v-col>
          <v-sheet class="pa-2 ma-2"> .v-col-auto </v-sheet>
        </v-col>
      </v-row> -->
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
/* import { useOddsStore } from "~/store/odds"; */
import { storeToRefs } from "pinia";
/* import { useNuxtApp } from "nuxt/app"; */

const { mobile } = useDisplay();

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

/* const nuxtApp = useNuxtApp(); */

// Para auxiliar o carrossel
let model = null;

/* onMounted(async () => {
  nuxtApp.$restCall.get("cleiton/mercearia", { coco: "coco" });
  nuxtApp.$restCall.put(
    "cleiton/mercearia",
    { coco: "coco" },
    { cleber: "cleber" }
  );

  nuxtApp.$restCall.patch(
    "cleiton/mercearia",
    { coco: "coco" },
    { cleber: "cleber" }
  );
  nuxtApp.$restCall.delete(
    "cleiton/mercearia",
    { coco: "coco" },
    { cleber: "cleber" }
  );
}); */
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
