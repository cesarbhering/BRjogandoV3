<template>
  <v-card class="mx-auto medium-card" variant="flat" @click="dialog = true">
    <v-card-title class="pb-0">
      <div class="upper-line" v-video-game-based-background></div>
    </v-card-title>
    <v-card-subtitle class="d-flex flex-column text-center match-infos">
      <p>{{ matchInfo.videogame.name }}</p>
      <p :class="mobile ? 'mt-n2':''">
        {{ matchInfo.league.name }}
        -
        {{ $t("cards.bestOf", { n: matchInfo.games.length }) }}
      </p>
      <p v-if="!mobile" class="d-inline-block text-truncate">{{ matchInfo.serie.name || matchInfo.serie.full_name }}</p>
    </v-card-subtitle>
    <v-card-text class="pt-0">
      <!-- LOGO/ACRONYM/SCORE -->
      <div
        v-for="(opponent, index) in matchInfo.opponents"
        class="opponent-line justify-space-between"
        :key="index"
        :class="{ 'mb-4': index !== matchInfo.opponents.length - 1 && !mobile }"
      >
        <div class="d-flex align-center ml-5">
          <!-- LOGO -->
          <div class="team-logo" v-if="opponent.opponent.image_url || opponent.opponent.location" >
            <img
            :class="opponent.opponent.image_url === null ? 'elevation-1' : ''"
              :src="
                teamLogoThumb(
                  opponent.opponent.image_url,
                  opponent.opponent.location
                )
              "
            />
          </div>
          <!-- ACRONYM -->
          <p class="text-h4 text--primary acronym" :class="mobile ? 'pl-0' : 'pl-4'">
            {{
              opponent.opponent.acronym ||
              opponent.opponent.name.substring(0, 10)
            }}
          </p>
        </div>
        <div>
          <!-- SCORE -->
          <!-- TODO: the numbers are not aligned when the score is 1x0 -->
          <p class="text-h4 text--primary mr-5 score text-center">
            {{ matchInfo.results[index].score }}
          </p>
        </div>
      </div>
      <!-- LIVE SVG -->
       <div v-if="!mobile" class="live text-center">
        <img src="../../assets/image/aovivo.svg" :alt="$t('cards.liveGame')" />
      </div>
      <div v-else class="match-infos text-center">
        <p>{{ matchInfo.serie.name || matchInfo.serie.full_name }}</p>
      </div>
    </v-card-text>
  </v-card>
  <v-dialog :fullscreen="mobile ? true: false" v-model="dialog">                                               
    <ModalsMatchModal @closeModal="dialog = false" :match-info="matchInfo" :match-occurrence="'running'" />
  </v-dialog>
</template>
<script>
export default {
  name: "CardMedium",
  data() {
    return {
      dialog: false,
    };
  },
};
</script>
<script setup>
import { useDisplay } from "vuetify";

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
  color: #666666;
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

.custom-dialog .v-dialog__content {
  padding-top: 40px; /* Adjust the value as needed */
}

/* Dark mode improvements for Medium cards */
[data-theme="dark"] .medium-card {
  /* Score numbers - high contrast */
  .score {
    color: #ffffff !important;
    font-weight: 700 !important;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8) !important;
  }
  
  /* Team acronyms - better contrast */
  .acronym {
    color: #ffffff !important;
    font-weight: 600 !important;
  }
  
  /* Match info text */
  .match-infos {
    color: #e0e0e0 !important;
    
    p {
      color: #e0e0e0 !important;
    }
  }
  
  /* Card subtitle */
  .v-card-subtitle {
    color: #e0e0e0 !important;
    
    p {
      color: #e0e0e0 !important;
    }
  }
}
</style>
