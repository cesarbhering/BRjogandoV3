<template>
  <v-row class="d-flex align-center justify-center">
    <v-card height="90vh" class="w-75">
      <v-row>
        <v-spacer></v-spacer>
        <v-col cols="auto"
          ><v-icon @click="$emit('closeModal')" class="ma-2"
            >mdi-close</v-icon
          ></v-col
        >
      </v-row>

      <v-card-subtitle class="text-xl font-bold text-center">
        <v-row>
          <v-col class="pb-0 pt-2"> {{ matchInfo.league.name }}</v-col>
        </v-row>
        <v-row>
          <v-col class="pa-0"> {{ matchInfo.serie.name }}</v-col>
        </v-row>
        <v-row>
          <v-col class="pt-0">
            {{ formatDate(matchInfo.begin_at) }}
          </v-col>
        </v-row>
      </v-card-subtitle>
    </v-card>
  </v-row>
</template>

<script>
export default {
  name: "MatchModal",
};
</script>
<script setup>
import { storeToRefs } from "pinia";
import { useGamesStore } from "~/store/games";
import { useGameDetailsStore } from "~/store/gameDetails";

const { teamLogoThumb } = useLogos();
const props = defineProps({
  matchInfo: { type: Object, required: true },
  matchOcurrance: { type: String, required: true },
});

const gameDetailsStore = useGameDetailsStore();

const { gameRosters } = storeToRefs(gameDetailsStore);

const gamesStore = useGamesStore();

const teamNames = [
  props.matchInfo.opponents[0].opponent.name,
  props.matchInfo.opponents[1].opponent.name,
];

onBeforeMount(async () => {
  await gamesStore.fetchSupabaseDataForMatch(
    props.matchInfo.id,
    props.matchOcurrance,
    props.matchInfo.serie_id,
    teamNames
  );
  await gameDetailsStore.fetchGameRosters(props.matchInfo);
});

function formatDate(inputDate) {
  const date = new Date(inputDate);

  // Adjust for GMT-3 - GMT-3 É O NOSSO TIME ZONE NO BRASIL, SEMPRE TER ISTO EM MENTE
  date.setHours(date.getHours());

  // Get day, month, hours, and minutes
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  // Construct the formatted string
  const formattedDate = `${day}/${month} ${hours}:${minutes}`;

  return formattedDate;
}
</script>

<style lang="scss" scoped></style>
