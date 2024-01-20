<template>
  <v-row class="d-flex align-center justify-center">
    <!-- {{ gameRosters }} -->
    <v-card height="90vh" class="w-75">
      <v-row>
        <v-spacer></v-spacer>
        <v-col cols="auto"><v-icon @click="$emit('closeModal')" class="ma-2">mdi-close</v-icon></v-col>
      </v-row>

      <v-card-subtitle class="text-xl font-bold text-center">
        <!-- NOME DA LIGA -->
        <v-row>
          <v-col class="pb-0 pt-2"> {{ matchInfo.league.name }}</v-col>
        </v-row>
        <!-- NOME DA SERIE -->
        <v-row>
          <v-col class="pa-0"> {{ matchInfo.serie.name }}</v-col>
        </v-row>
        <v-row>
          <!-- HORARIO QUE COMEÇOU -->
          <v-col class="pt-0">
            {{ formatDate(matchInfo.begin_at) }}
          </v-col>
        </v-row>
      </v-card-subtitle>
      <v-card-text>
        <v-row class="d-flex align-center justify-center bg-red">
          <v-col v-for="(opponent, index) in matchInfo.opponents" :key="index">
            <v-row v-if="index === 0" class="d-flex align-center ml-5">
              <!-- LOGO/SIGLA/SCORE TIME 0 -->
              <!-- BANDEIRA DA ORG -->
              <v-col cols="3" class="d-flex justify-center">
                <v-img class="elevation-1" max-width="6vw" :src="teamLogoThumb(false, opponent.opponent.location)" />
              </v-col>
              <!-- LOGO -->
              <v-col cols="3" class="pa-0 d-flex justify-end">
                <v-img max-width="6vw" :src="teamLogoThumb(opponent.opponent.image_url, false)" />
              </v-col>
              <v-col>
                <!-- SIGLA -->
                <h1 class="text-left acronym">
                  {{ opponent.opponent.name }}
                </h1>
              </v-col>
            </v-row>
            <v-row v-if="index === 1" class="d-flex align-center mr-5">
              <!-- LOGO/SIGLA/SCORE TIME 1 -->
              <!-- LOGO -->
              <v-col>
                <!-- SIGLA -->

                <h1 class="text-right acronym">
                  {{ opponent.opponent.name }}
                </h1>

              </v-col>
              <!-- LOGO -->
              <v-col cols="3" class="pa-0 d-flex justify-start">
                <v-img max-width="6vw" :src="teamLogoThumb(opponent.opponent.image_url, false)" />
              </v-col>
              <!-- BANDEIRA DA ORG -->
              <v-col cols="3" class="d-flex justify-center">
                <v-img class="elevation-1" max-width="6vw" :src="teamLogoThumb(false, opponent.opponent.location)"
                  :alt="opponent.opponent.location + ' flag'" />
              </v-col>
            </v-row>
          </v-col>
          <!-- SCORE -->
          <!--           <div>
            <p class="text-h4 text--primary mr-5 score text-center">
              {{ matchInfo.results[index].score }}
            </p>
          </div> -->
        </v-row>
        <!-- AO VIVO SVG -->
        <!--         <div class="live text-center">
          <img src="../../assets/image/aovivo.svg" alt="Live game" />
        </div> -->
        <v-row class="d-flex align-center">
          <v-col>
            <!-- <ModalsRosters :gameRosters="gameRosters[0].players" /> -->
          </v-col>
          <v-col>
            <!-- <ModalsRosters :gameRosters="gameRosters[1].players" /> -->
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-row>
</template>

<script>
export default {
  name: "MatchModal",
};
</script>
<script setup>
import { useGamesStore } from "~/store/games";

const { teamLogoThumb } = useLogos();
const props = defineProps({
  matchInfo: { type: Object, required: true },
  matchOccurrence: { type: String, required: true },
});

const gamesStore = useGamesStore();

const teamNames = [
  props.matchInfo.opponents[0].opponent.name,
  props.matchInfo.opponents[1].opponent.name,
];

onBeforeMount(async () => {
  await gamesStore.fetchSupabaseDataForMatch(
    props.matchInfo.id,
    props.matchOccurrence,
    props.matchInfo.serie_id,
    teamNames
  );
  console.log('matchOccurrence', props.matchOccurrence)
  debugger
  await gamesStore.fetchGameRosters(props.matchInfo, props.matchOccurrence);
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
</style>
