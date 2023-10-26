<template>
  <!-- HEADER DESKTOP -->
  <v-tool-bar v-if="!mobile" class="header">
    <img src="../assets/image/Logo-Branca.png" alt="brjogando" />
    <v-btn to="/"> Início </v-btn>
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props">Jogos</v-btn>
      </template>
      <template v-slot:default>
        <v-list>
          <v-list-item v-for="(item, index) in arrayDeJogos" :key="index">
            <v-btn :to="'esports/' + item">{{
              item.split("_").join(" ")
            }}</v-btn>
          </v-list-item>
        </v-list>
      </template>
    </v-menu>
    <v-btn :to="{ name: 'institutional-cronogram' }"> Cronograma </v-btn>
    <v-btn :to="{ name: 'institutional-about' }"> Sobre nós </v-btn>
    <v-btn :to="{ name: 'institutional-support' }"> Suporte </v-btn>
  </v-tool-bar>

  <!-- HEADER MOBILE -->
  <v-app-bar v-else class="header">
    <template v-slot:append>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </template>
    <img src="../assets/image/Logo-Branca.png" alt="brjogando" />
  </v-app-bar>
  <v-navigation-drawer app temporary v-model="drawer" location="right">
    <v-list-item to="/">Início</v-list-item>
    <v-list-item to="/institutional/cronogram">Cronograma</v-list-item>
    <v-list-item to="/institutional/about">Sobre nós</v-list-item>
    <v-list-item to="/institutional/support">Suporte</v-list-item>
    <v-list>
      <v-list-subheader>Jogos</v-list-subheader>
      <v-list-item v-for="(item, index) in arrayDeJogos" :key="index">
        <NuxtLink :to="'esports/' + item">{{
          item.split("_").join(" ")
        }}</NuxtLink>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <div class="nation-colors-line"></div>
</template>
  
<script setup>
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();

const arrayDeJogos = [
  "Dota_2",
  "League_of_Legends",
  "Counter_Strike_2",
  "Overwatch",
];

const drawer = ref(false);
</script>

<style lang="scss" scoped>
.header {
  height: 80px;
  background-color: #040c2d;
  display: flex;
  flex-direction: row;
}

img {
  height: 50px;
}

.v-btn {
  text-transform: none;
  background-color: #040c2d;
  color: #ffff;
  padding: 0;
  display: inline;
  margin-top: 25px;
}
.v-list-item a {
  text-decoration: none;
  color: #000;
}

.v-list-item:hover {
  background-color: #e6e6e6;
}
</style>