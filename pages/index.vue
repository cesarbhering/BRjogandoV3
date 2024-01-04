<template>
  <div class="home">
    <p>{{ $t("welcome") }}</p>
    <h1>Partidas ao vivo</h1>
    <v-container class="px-1">
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
    <h1>Próximas Partidas</h1>
    <v-container>
      <v-row>
        <v-col
          v-for="(upcomingMatch, index) in upcomingMatches"
          :key="index"
          :sm="6"
          :lg="4"
          :xl="3"
          :class="mobile ? 'px-1 py-1' : ''"
        >
        <div :class="mobile ? '' : 'mr-3'">
          <CardsBig  :match-info="upcomingMatch" />
        </div>
        </v-col>
      </v-row>
    </v-container>
    <h1>Últimas Partidas</h1>
    <v-container>
      <v-row>
        <v-col
          v-for="(pastMatch, index) in pastMatches"
          :key="index"
          class="mt-1"
          :sm="4"
          :lg="3"
          :xl="2"
        >
        <CardsSmall :match-info="pastMatch"/>
        <!--
          <v-card>
            <v-card-title>{{ pastMatch.name }}</v-card-title>
             <v-card-subtitle>{{ pastMatch.begin_at }}</v-card-subtitle>
            <v-card-text>{{ pastMatch.videogame.name }}</v-card-text>
          </v-card> -->
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
  background-color: #E4E7EC;
  margin-top: 80px;
}

</style>
