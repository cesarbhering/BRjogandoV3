<template>
  <v-card class="mx-auto big-card" variant="flat">
    <v-card-title>
      <div class="upper-image">
        <img
          :src="videoGameImage(matchInfo.videogame.name)"
          :alt="matchInfo.videogame.name"
        />
      </div>
    </v-card-title>
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
          <!-- @TODO: QUANDO ESTA 1X0 OS NUMERO NAO FICAM ALINHADOS -->
          <p class="text-h4 text--primary mr-5 score text-center">
            {{ matchInfo.results[index].score }}
          </p>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  name: "CardBig",
};
</script>
<script setup>
import { useDisplay } from "vuetify";

const props = defineProps({
  matchInfo: { type: Object, required: true },
});

const { mobile } = useDisplay();
const { teamLogoThumb } = useLogos();

/**
 * Recebe o nome do videogame e retorna a imagem a ser utilizada no topo do cartão.
 * @param {String} videogameName
 * @returns {URL} URL montado com a imagem hospedada localmente.
 */
function videoGameImage(videogameName) {
  switch (videogameName) {
    case "League of Legends":
      return new URL("../../assets/image/LoLBg.png", import.meta.url);
    case "Counter-Strike":
      return new URL("../../assets/image/counterStrikeBg.png", import.meta.url);
    /*     case "Dota 2":
      return colors.greenFlag;
    case "Valorant":
      return colors.greenAlt;
    case "Free Fire":
      return colors.yellowAlt;
    case "Rainbow Six Siege":
      return colors.blueAlt; */
    default:
      debugger;
      return new URL("../../assets/image/LoLBg.png", import.meta.url);
  }
}
</script>

<style lang="scss" scoped>
.big-card {
  border-radius: 8px;
  width: 392px;
  height: 339px;
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
  .upper-image {
    object-fit: cover;
    width: 100%;
    height: 90px;
    left: 0px;
    top: 0px;
  }

  @media (max-width: 960px) {
    padding: 1px;
  }
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
</style>
