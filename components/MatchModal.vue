<template>
  <v-row class="d-flex align-center justify-center">
    <!-- {{ gameRosters }} -->
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
        <v-row class="d-flex align-center justify-center">
          <v-col v-for="(opponent, index) in matchInfo.opponents" :key="index">
            <v-row v-if="index === 0" class="d-flex align-center ml-5">
              <!-- LOGO/SIGLA/SCORE TIME 0 -->
              <!-- BANDEIRA DA ORG -->
              <v-col cols="3">
                <v-img
                  max-width="75px"
                  :src="teamLogoThumb(false, opponent.opponent.location)"
                />
              </v-col>
              <!-- LOGO -->
              <v-col cols="3" class="pa-0">
                <v-img
                  max-width="75px"
                  :src="teamLogoThumb(opponent.opponent.image_url, false)"
                />
              </v-col>
              <v-col>
                <!-- SIGLA -->
                <p class="text-h3 text-left text--primary acronym">
                  {{ opponent.opponent.name }}
                </p>
              </v-col>
            </v-row>
            <v-row v-if="index === 1" class="d-flex align-center ml-5">
              <!-- LOGO/SIGLA/SCORE TIME 1 -->
              <!-- LOGO -->
              <v-col>
                <!-- SIGLA -->
                <p class="text-h3 text-right text--primary acronym">
                  {{ opponent.opponent.name }}
                </p>
              </v-col>
              <v-col class="pa-0">
                <v-img
                  max-width="75px"
                  :src="teamLogoThumb(opponent.opponent.image_url, false)"
                />
              </v-col>
              <v-col>
                <v-img
                  max-width="75px"
                  :src="teamLogoThumb(false, opponent.opponent.location)"
                />
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

<style lang="scss" scoped>
.opponent-line {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  @media (max-width: 960px) {
    margin: 0px 0px 0px 0px;
    height: 30px;
  }

  .acronym {
    font-family: "Poppins";
    font-weight: bold;
    font-size: 25px !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    @media (max-width: 960px) {
      font-size: 18px !important;
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
}
</style>
