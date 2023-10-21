<template>
  <primeiraPagina/>
  <div>
    <p class="teste">{{ $t("welcome") }}</p>
    <h1>Partidas ao vivo</h1>
    <v-container>
      <v-row no-gutters>
        <v-col
          v-for="(runningMatch, index) in runningMatches"
          :key="index"
          class="mt-1"
          cols="4"
          sm="4"
        >
          <v-card>
            <v-card-title>{{ runningMatch.name }}</v-card-title>
            <v-card-subtitle>{{ runningMatch.begin_at }}</v-card-subtitle>
            <v-card-text>{{ runningMatch.videogame.name }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <h1>Próximas Partidas</h1>
    <v-container>
      <v-row no-gutters>
        <v-col
          v-for="(upcomingMatch, index) in upcomingMatches"
          :key="index"
          class="mt-1"
          cols="4"
          sm="4"
        >
          <v-card>
            <v-card-title>{{ upcomingMatch.name }}</v-card-title>
            <v-card-subtitle>{{ upcomingMatch.begin_at }}</v-card-subtitle>
            <v-card-text>{{ upcomingMatch.videogame.name }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <h1>Últimas Partidas</h1>
    <v-container>
      <v-row no-gutters>
        <v-col
          v-for="(pastMatch, index) in pastMatches"
          :key="index"
          class="mt-1"
          cols="4"
          sm="4"
        >
          <v-card>
            <v-card-title>{{ pastMatch.name }}</v-card-title>
            <!-- <v-card-subtitle>{{ pastMatch.begin_at }}</v-card-subtitle> -->
            <v-card-text>{{ pastMatch.videogame.name }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script setup>
import { useGamesStore } from "~/store/games";
import { storeToRefs } from "pinia";
import primeiraPagina from "../layouts/primeiraPagina.vue"
import { useNuxtApp } from "nuxt/app";

const gamesStore = useGamesStore();
const { upcomingMatches } = storeToRefs(gamesStore);
const { runningMatches } = storeToRefs(gamesStore);
const { pastMatches } = storeToRefs(gamesStore);

const nuxtApp = useNuxtApp();

definePageMeta({
  layout: "teste",
});

onBeforeMount(async () => {
  // Carrega a informação das partidas na store
  gamesStore.fetchRunningMatches();
  gamesStore.fetchUpcomingMatches();
  gamesStore.fetchPastMatches();
});

onMounted(async () => {
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
});
</script>

<style lang="scss" scoped>
</style>