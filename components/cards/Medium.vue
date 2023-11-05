<template>
  <v-card class="mx-auto medium-card" variant="flat" width="288" height="211">
    <v-card-title>
      <div class="upper-line" v-video-game-based-background></div>
    </v-card-title>
    <v-card-subtitle class="d-flex flex-column text-center">
      <span>{{ matchInfo.videogame.name }}</span>
      <span>
        {{ matchInfo.league.name }} -
        {{ `Melhor de ${matchInfo.games.length}` }}
      </span>
    </v-card-subtitle>
    <v-card-text>
      <!-- LOGO/SIGLA/SCORE -->
      <div
        v-for="(opponent, index) in matchInfo.opponents"
        class="opponent-line justify-space-between"
        :key="index"
        :class="{ 'mb-4': index !== matchInfo.opponents.length - 1 }"
      >
        <div class="d-flex align-center ml-5">
          <!-- LOGO -->
          <!-- logo esta ficando acima da sigla, colocar na mesma altura -->
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
          <!-- QUANDO ESTA 1X0 OS NUMERO NAO FICAM ALINHADOS -->
          <p class="text-h4 text--primary mr-5 score text-center">
            {{ matchInfo.results[index].score }}
          </p>
        </div>
      </div>
      <!-- AO VIVO SVG -->
      <div class="live text-center">
        <img
          src="../../assets/image/aovivo.svg"
          alt="Live game"
          min-width="81px"
        />
      </div>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  name: "CardMedium",
};
</script>
<script setup>
const props = defineProps({
  matchInfo: { type: Object, required: true },
});

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
}

.upper-line {
  position: absolute;
  width: 288px;
  height: 4px;
  left: 0px;
  top: 0px;
}

.team-logo {
  width: 36px;

  img {
    max-height: 41px;
    max-width: 36px;
  }
}

.opponent-line {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  .acronym {
    font-family: "Poppins";
    font-weight: bold;
    font-size: 25px !important;
  }

  .score {
    font-family: "Poppins";
    font-weight: bold;
    font-size: 20px !important;
    color: #002776;
  }
}

.live {
  width: 100%;
  min-width: 81px;
  max-width: 36px;
  position: absolute;
    bottom: 0;
  padding-left: 31%;
}
</style>
