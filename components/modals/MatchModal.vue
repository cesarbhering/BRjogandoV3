<template>
  <!-- DESKTOP -->
  <v-row class="d-flex align-center justify-center" v-if="!mobile">
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
        <ModalsTeams :opponents-info="props.matchInfo.opponents" />
        <v-row class="rosters mt-5">
          <v-progress-circular v-if="!props.matchInfo.rosters" :size="50" color="primary" class="justify-center mx-auto"
            indeterminate></v-progress-circular>
          <v-col>
            <ModalsRosters :team-roster="props.matchInfo.rosters[0].players" v-if="props.matchInfo.rosters" />
          </v-col>
          <v-col>
            <ModalsRosters :team-roster="props.matchInfo.rosters[1].players" v-if="props.matchInfo.rosters" />
          </v-col>
        </v-row>
        <v-row>
          <v-col v-if="props.matchInfo.supabaseDataForMatch">
            <span>Odds</span>
            {{ props.matchInfo.supabaseDataForMatch.link }}
            {{ props.matchInfo.supabaseDataForMatch.odds0 }}
            {{ props.matchInfo.supabaseDataForMatch.odds1 }}

          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-row>
  <!-- MOBILE -->
  <v-card v-if="mobile">
    <v-row class="close-header">
      <v-col class="d-flex justify-end"><v-icon @click="$emit('closeModal')" class="ma-2">mdi-close</v-icon></v-col>
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
      <ModalsTeams :opponents-info="props.matchInfo.opponents" />
      <v-row class="rosters mt-5">
        <v-progress-circular v-if="!props.matchInfo.rosters" :size="75" color="primary" class="mx-auto"
          indeterminate></v-progress-circular>
        <v-col class="w-50">
          <ModalsRosters :team-roster="props.matchInfo.rosters[0].players" v-if="props.matchInfo.rosters" />
        </v-col>
        <v-col class="w-50">
          <ModalsRosters :team-roster="props.matchInfo.rosters[1].players" v-if="props.matchInfo.rosters" />
        </v-col>
        <div class="line-bottom"></div>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "MatchModal",
};
</script>
<script setup>
import { useDisplay } from "vuetify";
import { useGamesStore } from "~/store/games";

const props = defineProps({
  matchInfo: { type: Object, required: true },
  matchOccurrence: { type: String, required: true },
});

const { mobile } = useDisplay();

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
.rosters {
  border-bottom: 1px solid #E6E6E6;
  min-height: 30dvh;

  @media screen and (min-width: 960px) {
    margin: 0 50px;
  }
}

.close-header {
  max-height: 7vh;
}
</style>
