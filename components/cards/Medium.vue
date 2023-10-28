<template>
  <!-- LEMBRAR DE REMOVER A SHADE DO CARD -->
  <v-card class="mx-auto medium-card" max-width="288" max-height="211">
    <v-card-title>
      <div class="upper-line" v-video-game-based-background></div>
    </v-card-title>
    <v-card-subtitle class="d-flex flex-column">
      <span>{{ matchInfo.videogame.name }}</span>
      <span>
        {{ matchInfo.league.name }} -
        {{ `Melhor de ${matchInfo.games.length}` }}
      </span>
    </v-card-subtitle>
    <v-card-text>
      <!-- USAR V-FOR PARA CADA OPONENTE VAI ME AJUDAR COM O INDEX E EVITAR REPETICOES -->
      <div class="opponent-line">
        <img
          :src="teamLogoThumb(team0LogoUrl,team0Nationality).URL"
        />
        <p class="text-h4 text--primary">
          {{ matchInfo.opponents[0].opponent.acronym }}
        </p>
        <p class="text-h4 text--primary">
          {{ matchInfo.results[0].score }}
        </p>
      </div>
      <div class="opponent-line">
        <!-- usar computed -->
        <img
          :src="teamLogoThumb(team1LogoUrl, team1Nationality).URL"
        />
        <p class="text-h4 text--primary">
          {{ matchInfo.opponents[1].opponent.acronym }}
        </p>
        <p class="text-h4 text--primary">
          {{ matchInfo.results[1].score }}
        </p>
      </div>

      <div class="live">
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

const team0LogoUrl = computed(() => {
  return props.matchInfo.opponents[0].opponent.image_url;
});

const team1LogoUrl = computed(() => {
  return props.matchInfo.opponents[1].opponent.image_url;
});

const team0Nationality = computed(() => {
  return props.matchInfo.opponents[0].opponent.location;
});

const team1Nationality = computed(() => {
  return props.matchInfo.opponents[1].opponent.location;
});

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

img {
  width: 100%;
  max-width: 36px;
}

.opponent-line {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}

.live img {
  width: 100%;
  min-width: 81px;
}
</style>


