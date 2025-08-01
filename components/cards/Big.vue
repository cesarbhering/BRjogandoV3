<template>
  <v-card class="big-card ma-2" :width="width" variant="flat" @click="dialog = true">
    <v-card-title class="title-big">
      <img class="game-image-big" :src="videoGameImage(matchInfo.videogame.name)" :alt="matchInfo.videogame.name" />
      <div class="final-alert-big" v-if="matchInfo.name.includes('final')">
        <span class="ml-3 special-match-name">{{ specialMatchName }}</span>
        <span class="special-match-countdown" :class="mobile ? 'mr-1' : ''">{{
          specialMatchCountdown
        }}</span>
      </div>
    </v-card-title>
    <v-card-text>
      <div class="match-info-big d-flex flex-column">
        <!-- NOME DA LIGA -->
        <span>{{ matchInfo.league.name }}</span>
        <!-- DATA E HORARIO DE INICIO -->
        <span>{{ formatDate(matchInfo.begin_at) }}</span>
      </div>
    </v-card-text>
    <v-card-actions v-if="matchInfo.opponents.length">
      <!-- LOGO/SIGLA TIME 0 -->
      <div class="opponent-actions">
        <div class="d-flex align-center">
          <!-- LOGO -->
          <div class="team-logo" v-if="matchInfo.opponents[0].opponent.image_url ||
            matchInfo.opponents[0].opponent.location
            ">
            <v-img :class="matchInfo.opponents[0].opponent.image_url === null ? 'elevation-1' : ''" :src="teamLogoThumb(
              matchInfo.opponents[0].opponent.image_url,
              matchInfo.opponents[0].opponent.location
            )
              " />
          </div>
          <!-- SIGLA -->
          <div>
            <p class="text-h4 pl-0 text--primary acronym">
              {{
                matchInfo.opponents[0].opponent.acronym ||
                matchInfo.opponents[0].opponent.name.substring(0, 6)
              }}
            </p>
          </div>
        </div>
      </div>
      <!-- O "X" -->
      <div class="versusX">X</div>
      <!-- LOGO/SIGLA TIME 1 -->
      <div class="opponent-actions">
        <div class="d-flex align-center">
          <!-- LOGO -->
          <div class="team-logo" v-if="matchInfo.opponents[1].opponent.image_url || matchInfo.opponents[1].opponent.location">
            <v-img :class="matchInfo.opponents[1].opponent.image_url === null ? 'elevation-1' : ''" :src="teamLogoThumb(
              matchInfo.opponents[1].opponent.image_url,
              matchInfo.opponents[1].opponent.location
            )
              " />
          </div>
          <!-- SIGLA -->
          <div>
            <p class="text-h4 pl-1 text--primary acronym">
              {{
                matchInfo.opponents[1].opponent.acronym ||
                matchInfo.opponents[1].opponent.name.substring(0, 6)
              }}
            </p>
          </div>
        </div>
      </div>
    </v-card-actions>
  </v-card>
  <v-dialog v-model="dialog">
    <ModalsMatchModal @closeModal="dialog = false" :match-info="matchInfo" :match-occurrence="'upcoming'" />
  </v-dialog>
</template>
<script>
export default {
  name: "CardBig",
  data() {
    return {
      dialog: false,
    }
  }
};
</script>
<script setup>
import { useDisplay } from "vuetify";


const props = defineProps({
  matchInfo: { type: Object, required: true },
});

const { teamLogoThumb } = useLogos();

let now = ref(Date.now());



onMounted(() => {
  // Para atualizar a função specialMatchCountdown
  setInterval(() => {
    now.value = Date.now();
  }, 1000);
});
// @TODO fazer esta função mais maleável, para que possa ser usada na internacionalização
/**
 * Retorna o tipo de partida no play-off
 * @returns {String}
 */
const specialMatchName = computed(() => {
  if (props.matchInfo.name.toLowerCase().includes("semifinal")) {
    return "Semifinal";
  } else if (props.matchInfo.name.toLowerCase().includes("quarterfinal")) {
    return "Quartas de Final";
  } else if (props.matchInfo.name.toLowerCase().includes("playoffs")) {
    return "Playoffs";
  } else if (props.matchInfo.name.toLowerCase().includes("final")) {
    return "Final";
  }
});

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
    default:
      /* VERIFICAR COM O DESIGNER UMA IMAGEM PADRÃO */
      return new URL("../../assets/image/LoLBg.png", import.meta.url);
  }
}

/**
 * Esta função é apenas uma copia do chatGPT, com certeza pode ser simplificada.
 * @param {String} inputDate Data do begin_at informado na prop matchInfo
 * @returns {String} string formata dd/MM HH:mm
 */
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

// @TODO fazer função amis maleavel na questão do fuso para atender internacionalização.
/**
 * Countdown exibido na div final-alert-big
 * @returns {String}
 */
const specialMatchCountdown = computed(() => {
  const date = new Date(props.matchInfo.begin_at);
  const diff = date - now.value;
  const hours = Math.floor(diff / 1000 / 60 / 60)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((diff / 1000 / 60 / 60 - hours) * 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(
    ((diff / 1000 / 60 / 60 - hours) * 60 - minutes) * 60
  )
    .toString()
    .padStart(2, "0");
  // Remove 3grs da conta devido ao GMT-3, @TODO fazer função mais flexivel para internacionalização
  return `${hours}:${minutes}:${seconds}`;
});


const { mobile, name } = useDisplay();

const width = computed(() => {
  switch (name.value) {
    case 'xs': return 333
    case 'sm': return 333
    case 'md': return 333
    case 'lg': return 392
    case 'xl': return 392
    case 'xxl': return 392
    default: return 392
  }
})

</script>

<style lang="scss" scoped>
.big-card {
  border-radius: 8px;
  height: 280px;

  @media (max-width: 960px) {
    max-width: 100%;
    max-height: 215px;

    .v-card-text {
      padding: 0px 0px 0px 0px;
      margin: 0px 0px 0px 0px;
    }
  }
}

.v-card-title {
  height: 136px;
  padding: 0px;

  @media (max-width: 960px) {
    margin-bottom: -30px;
  }

  .game-image-big {
    position: relative;

    @media (max-width: 960px) {
      width: 100%;
      height: 80%;
      object-fit: cover;
    }
  }

  .final-alert-big {
    width: 100%;
    position: absolute;
    top: 104px;
    background: #ffdf00;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    @media (max-width: 960px) {
      top: 78px;
      width: 100%;
    }

    .special-match-name {
      margin: 0 auto;
      width: 144px;
      height: 30px;
      font-family: "Poppins";
      font-style: normal;
      font-weight: 700;
      font-size: 20px;
      color: #ffffff;
    }

    .special-match-countdown {
      width: 70px;
      font-family: "Poppins";
      font-style: bold;
      font-weight: 900;
      font-size: 17px;
      color: #666666;
    }
  }

  @media (max-width: 960px) {
    padding: 1px;
  }
}

.match-info-big {
  padding-top: 10px;
  width: 360px;
  height: 42px;

  @media (max-width: 960px) {
    width: 100%;
    height: 100%;
    padding-top: 4px;
  }

  /* Desktop/Body 1 */
  font-family: "Poppins";
  font-style: normal;
  font-weight: 400;
  font-size: 17px;
  line-height: 26px;
  text-align: center;

  /* Neutral/Fog */
  color: #b3b3b3;

  /* Inside auto layout */
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
}

.v-card-actions {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  padding: 0px;
}

.team-logo {
  width: 36px;
  line-height: 0px;

  img {
    max-height: 41px;
    max-width: 36px;

    @media (max-width: 960px) {
      max-width: 25px;
    }
  }
}

.opponent-actions {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

.versusX {
  /* x */
  width: 18px;
  height: 45px;

  /* Desktop/H1 */
  font-family: "Poppins";
  font-style: normal;
  font-weight: 700;
  font-size: 30px;
  line-height: 48px;

  /* Neutral/Fog */
  color: #b3b3b3;
}
</style>
