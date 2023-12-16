<template>
  <v-card class="mx-auto medium-card" variant="flat" @click="handleOpenMatchDialog">
    <v-card-title>
      <div class="upper-line" v-video-game-based-background></div>
    </v-card-title>
    <v-card-subtitle class="d-flex flex-column text-center match-infos">
      <span>{{ matchInfo.videogame.name }}</span>
      <span>
        {{ matchInfo.league.name }} -
        {{
          mobile
            ? `Md ${matchInfo.games.length}`
            : `Melhor de ${matchInfo.games.length}`
        }}
      </span>
    </v-card-subtitle>
    <v-card-text>
      <!-- LOGO/SIGLA/SCORE -->
      <div
        v-for="(opponent, index) in matchInfo.opponents"
        class="opponent-line justify-space-between"
        :key="index"
        :class="{ 'mb-4': index !== matchInfo.opponents.length - 1 && !mobile }"
      >
        <div class="d-flex align-center ml-5">
          <!-- LOGO -->
          <div class="team-logo">
            <img
              :src="
                teamLogoThumb(
                  opponent.opponent.image_url,
                  opponent.opponent.location
                )
              "
            />
          </div>
          <!-- SIGLA -->
          <p class="text-h4 pl-4 text--primary acronym">
            {{ opponent.opponent.acronym || opponent.opponent.name }}
          </p>
        </div>
        <div>
          <!-- SCORE -->
          <!-- @TODO: QUANDO ESTA 1X0 OS NUMEROS NAO FICAM ALINHADOS -->
          <p class="text-h4 text--primary mr-5 score text-center">
            {{ matchInfo.results[index].score }}
          </p>
        </div>
      </div>
      <!-- AO VIVO SVG -->
      <div class="live text-center">
        <img src="../../assets/image/aovivo.svg" alt="Live game" />
      </div>
    </v-card-text>
  </v-card>
  <MatchDetailsDialog
    v-model="showMatchDialog"
    :match-info="matchInfo"
    @close-match-dialog="showMatchDialog = false"
  />
</template>
<script>
export default {
  name: "CardMedium",
};
</script>
<script setup>
import { useDisplay } from "vuetify";
import { useGamesStore } from "~/store/games";

const props = defineProps({
  matchInfo: { type: Object, required: true },
});

const { mobile } = useDisplay();
const { teamLogoThumb } = useLogos();

const colors = {
  greenFlag: "#009C3B",
  yellowFlag: "#FFDF00",
  blueFlag: "#002776",
  greenAlt: "#04FF63",
  yellowAlt: "#FFB800",
  blueAlt: "#040C2D",
};

function videoGameColor(videogameName) {
  switch (videogameName) {
    case "League of Legends":
      return colors.blueFlag;
    case "Counter-Strike: Global Offensive":
      return colors.yellowFlag;
    case "Dota 2":
      return colors.greenFlag;
    case "Valorant":
      return colors.greenAlt;
    case "Free Fire":
      return colors.yellowAlt;
    case "Rainbow Six Siege":
      return colors.blueAlt;
    default:
      return colors.blueFlag;
  }
}

const vVideoGameBasedBackground = {
  mounted: (el) =>
    (el.style.background = videoGameColor(props.matchInfo.videogame.name)),
};

let showMatchDialog = ref(false);

const gamesStore = useGamesStore();

const handleOpenMatchDialog = async () => {
  await gamesStore.fetchSupabaseDataForMatch(props.matchInfo.id, 'running');
  showMatchDialog.value = true;
};
</script>

<style lang="scss" scoped>
.medium-card {
  border-radius: 8px;
  width: 288px;
  height: 211px;
  @media (max-width: 960px) {
    width: 180px;
    height: 120px;
    .v-card-text {
      padding: 0px 0px 0px 0px;
      margin: 0px 0px 0px 0px;
    }
  }
}

.v-card-title {
  @media (max-width: 960px) {
    padding: 1px;
  }
}
.upper-line {
  position: absolute;
  width: 288px;
  height: 4px;
  left: 0px;
  top: 0px;
}

.match-infos {
  @media (max-width: 960px) {
    display: inline;
    padding: 0;
    font-size: 10px;
  }
}

.team-logo {
  width: 36px;

  img {
    max-height: 41px;
    max-width: 36px;
    @media (max-width: 960px) {
      max-width: 25px;
    }
  }
}

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

.live {
  width: 100%;
  max-width: 31px;
  position: absolute;
  bottom: 0;
  padding-left: 31%;
  @media (max-width: 960px) {
    padding-left: 37%;

    img {
      max-width: 51px;
    }
  }
}
</style>
