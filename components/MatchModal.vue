<template>
 
  <v-card
    class="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75"
  >
  {{ gameRosters }}
    <div
      class="bg-white dark:bg-zinc-950 rounded-lg shadow-xl w-4/5 md:w-1/2 lg:w-1/3"
    >
      <v-card-title class="text-xl font-bold text-center p-4">{{matchInfo.name}}</v-card-title>
      <v-card-subtitle class="text-xl font-bold text-center p-4">{{ formatDate(matchInfo.begin_at) }}</v-card-subtitle>
      <div v-for="(opponent, index) in matchInfo.opponents" class="grid grid-cols-2 divide-x">
        <div class="p-4">
          <v-card-subtitle class="text-lg font-semibold mb-2">{{ opponent.opponent.name }}</v-card-subtitle>
          <v-list class="divide-y divide-gray-200">
            <v-list-item class="flex items-center py-2">
              <img
                src="~/assets/image/br-flag.svg"
                alt="Country Flag"
                width="30"
                height="20"
                class="mr-2"
                style="aspect-ratio: 30 / 20; object-fit: cover"
              />
              <span>
                cleiton
                
              </span>
            </v-list-item>
          </v-list>
        </div>
        <!-- <div class="p-4">
          <v-card-subtitle class="text-lg font-semibold mb-2">{{ matchInfo.opponents}}</v-card-subtitle>
          <v-list class="divide-y divide-gray-200">
            <v-list-item class="flex items-center py-2">
              <img
                src="~/assets/image/br-flag.svg"
                alt="Country Flag"
                width="30"
                height="20"
                class="mr-2"
                style="aspect-ratio: 30 / 20; object-fit: cover"
              />
              <span>Player 1</span>
            </v-list-item>
          </v-list>
        </div> -->
      </div>
      <div class="p-4">
        <v-card-subtitle class="text-lg font-semibold mb-2">Betting Odds</v-card-subtitle>
        <v-list class="divide-y divide-gray-200">
          <v-list-item class="flex items-center justify-center justify-between py-2">
            <v-list-item-title>1xBet</v-list-item-title>
            <v-list-item-subtitle class="d-flex items-center justify-center">{{props.matchInfo.supabaseDataForMatch?.odds_1xbet}}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item class="flex items-center justify-center justify-between py-2">
            <v-list-item-title>Bookmaker 1</v-list-item-title>
            <v-list-item-subtitle class="d-flex items-center justify-center">1.5 : 2.5</v-list-item-subtitle>
          </v-list-item>
          <v-list-item class="flex items-center justify-center justify-between py-2">
            <v-list-item-title>Bookmaker 1</v-list-item-title>
            <v-list-item-subtitle class="d-flex items-center justify-center">1.5 : 2.5</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </div>
      <div class="p-4">
        <v-card-subtitle class="text-lg font-semibold mb-2"></v-card-subtitle>
        <v-list  v-for="(stream, index) in matchInfo.streams_list"  class="divide-y divide-gray-200">
          <v-list-item class="flex items-center py-2">
            ><a
              :href="stream.raw_url"
              class="text-blue-600 hover:text-blue-800 visited:text-purple-600"
              >Stream Link {{ index+1 }}</a
            >
          </v-list-item>
        </v-list>
      </div>
    </div>
  </v-card>
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
  matchInfo: {type: Object, required: true},
  matchOcurrance: {type: String, required: true}
})


const { gameRosters } = storeToRefs(useGameDetailsStore);


const gamesStore = useGamesStore();
const gameDetailsStore = useGameDetailsStore();

onBeforeMount(async () => {
  await gamesStore.fetchSupabaseDataForMatch(props.matchInfo.id, props.matchOcurrance, props.matchInfo.serie_id);
  await gameDetailsStore.fetchGameRosters(props.matchInfo);
})

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

<style lang="scss" scoped>
</style>