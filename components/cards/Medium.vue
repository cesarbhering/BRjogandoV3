<template>
  <!-- LEMBRAR DE REMOVER A SHADE DO CARD -->
  <v-card class="mx-auto medium-card" max-width="288" max-height="211">
    <v-card-title>
      <div class="upper-line"></div>
    </v-card-title>
    <v-card-subtitle class="d-flex flex-column">
      <span>{{ matchInfo.videogame_title.name }}</span>
      <span>
        {{ matchInfo.league.name }} -
        {{ `Melhor de ${matchInfo.games.length}` }}
      </span>
    </v-card-subtitle>
    <v-card-text>
      <div class="opponent-line">
        <img :src="teamLogo(0).URL" :alt="teamLogo(0).ALT" />
        <p class="text-h4 text--primary">
          {{ matchInfo.opponents[0].opponent.acronym }}
        </p>
        <p class="text-h4 text--primary">
          {{ matchInfo.results[0].score }}
        </p>
      </div>
      <div class="opponent-line">
        <img :src="teamLogo(1).URL" :alt="teamLogo(1).ALT" />
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

/**
 * Exibe o logo carregado no panda score, caso não tenha exibe a bandeira do país da organização.
 * @param {Number} opponentNumber index do opponent dentro do array recebido na props matchInfo.opponents.
 * @returns {Object} {URL: URL da logo do time ou da bandeira da organização, ALT: Descrição da imagem}.
 */
function teamLogo(opponentNumber) {
  if (props.matchInfo?.opponents[opponentNumber].opponent.image_url) {
    return {
      URL: props.matchInfo.opponents[opponentNumber].opponent.image_url,
      ALT: `${props.matchInfo.opponents[opponentNumber].opponent.name} logo`,
    };
  }
  // Quando for BR importar o br-flag.svg que já temos no assets, pra economizar tempo de download.
  return {
    URL: `https://flagcdn.com/${props.matchInfo.opponents[
      opponentNumber
    ].opponent.location.toLowerCase()}.svg`,
    ALT: `${props.matchInfo.opponents[opponentNumber].opponent.location} flag`,
  };
}
</script>

<style lang="scss" scoped>



.medium-card {
  border-radius: 8px;
}

.upper-line {
/* Frame 519 */

position: absolute;
width: 288px;
height: 4px;
left: 0px;
top: 0px;
/* FAZER A COR SER RESPONSIVA E VER AS CORES DE CADA JOGO, DECLARAR AS MESMAS NO SASS */
/* Other/Red Error */
background: #FF0000;
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


