<template>
  <v-card class="big-card" variant="flat">
    <v-card-title>
      <div class="upper-image">
        <img
          :src="videoGameImage(matchInfo.videogame.name)"
          :alt="matchInfo.videogame.name"
        />
      </div>
    </v-card-title>
    <v-card-text class="bg-blue">
      <div class="match-info d-flex flex-column bg-pink">
        <!-- NOME DA LIGA -->
        <span>{{ matchInfo.league.name }}</span>
        <!-- DATA E HORARIO DE INICIO -->
        <span class="bg-blue">{{ formatDate(matchInfo.begin_at) }}</span>
      </div>
      <!-- LOGO/SIGLA -->
      <div class="d-flex align-center ml-5">
        <div v-for="(opponent, index) in matchInfo.opponents" :key="index">
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
            <div>
              <p class="text-h4 pl-4 text--primary acronym">
                {{ opponent.opponent.acronym || opponent.opponent.name }}
              </p>
            </div>
          </div>
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
    case "LoL":
      return new URL("~/assets/image/LoLBg.png", import.meta.url);
    case "Counter-Strike":
      return new URL("~/assets/image/counterStrikeBg.png", import.meta.url);
    case "Dota 2":
      return new URL("~/assets/image/dota2Bg.png", import.meta.url);
    case "Valorant":
      return new URL("~/assets/image/valorantBg.png", import.meta.url);
    case "Free Fire":
      return new URL("~/assets/image/dota2Bg.png", import.meta.url);
    case "Rainbow 6 Siege":
      return new URL("~/assets/image/rb6Bg.png", import.meta.url);
    /* default: */
    /* VERIFICAR COM O DESIGNER UMA IMAGEM PADRÃO */
    /* return new URL("../../assets/image/LoLBg.png", import.meta.url); */
  }
}

/**
 * Esta função é apenas uma copia do chatGPT, com certeza pode ser simplificada.
 * @param {String} inputDate Data do begin_at informado na prop matchInfo
 * @returns {String} string formata dd/MM HH:mm
 */
function formatDate(inputDate) {
  const date = new Date(inputDate);

  // Adjust for GMT-3 - GMT-3 É O NOSOS TIME ZONE NO BRASIL, SEMPRE TER ISTO EM MENTE
  date.setHours(date.getHours() - 3);

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
  background-color: red;
  height: 136px;
  padding: 0px;

  @media (max-width: 960px) {
    padding: 1px;
  }
}

.match-info {
  text-align: center;
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
}
</style>
