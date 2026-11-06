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
const { formatDate } = useFormatDate();

const props = defineProps({
  matchInfo: { type: Object, required: true },
});

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

/* Dark mode improvements for Small cards */
[data-theme="dark"] .v-card {
  background-color: var(--bg-secondary, #1a1a1a) !important;
  color: var(--text-primary, #ffffff) !important;
  border-bottom: 1px solid var(--border, #333) !important;
  
  /* Score numbers - maximum contrast */
  .score {
    color: #ffffff !important;
    font-weight: 800 !important;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8) !important;
  }
  
  /* Team acronyms - enhanced contrast */
  .acronym {
    color: #ffffff !important;
    font-weight: 700 !important;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7) !important;
  }
  
  /* All heading elements */
  .text-h4 {
    color: #ffffff !important;
    font-weight: 700 !important;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6) !important;
  }
  
  /* Card text (date, game name) */
  .v-card-text {
    color: #e0e0e0 !important;
    font-weight: 500 !important;
  }
  
  /* Title card text */
  .title-card .v-card-text {
    color: #ffffff !important;
    font-weight: 600 !important;
  }
}
</style>
