<template>
  <v-card variant="flat">
    <div class="title-card">
      <v-card-text>{{ matchInfo.videogame.name }}</v-card-text>
      <v-card-text class="d-flex justify-end">{{
        formatDate(matchInfo.end_at)
      }}</v-card-text>
    </div>
    <div
      v-for="(opponent, index) in matchInfo.opponents"
      class="games-card"
      :key="index"
    >
      <div class="games-card-team">
        <img
          :src="
            teamLogoThumb(
              opponent.opponent.image_url,
              opponent.opponent.location
            )
          "
        />
        <span class="text-h4 pl-4 text--primary acronym">
          {{ opponent.opponent.acronym || opponent.opponent.name }}
        </span>
      </div>
      <span class="text-h4 text--primary mr-5 text-center score">{{
        matchInfo.results[index].score
      }}</span>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "CardsSmall",
};
</script>

<script setup>
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const { teamLogoThumb } = useLogos();

const props = defineProps({
  matchInfo: { type: Object, required: true },
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
.v-card {
  font-family: "Poppins";
  width: 250px;
  height: 145px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  border-bottom: 1px solid #b3b3b3;
  border-radius: 0;
  padding: 10px;
}

.title-card {
  width: 100%;
  height: calc(100 / 3);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.games-card {
  width: 100%;
  height: calc(100 / 3);
  display: flex;
  justify-content: space-between;
}

.v-card-text {
  color: #b3b3b3;
  width: 100%;
  padding: 0;
}

img {
  width: 24px;
}

.acronym {
  font-weight: bold;
  font-size: 25px !important;
  @media (max-width: 960px) {
    font-size: 18px !important;
  }
}

.score {
  font-weight: bold;
  font-size: 20px !important;
  color: #002776;
  @media (max-width: 960px) {
    font-size: 14px !important;
  }
}
</style>
