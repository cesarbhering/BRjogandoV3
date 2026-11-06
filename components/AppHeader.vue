<template>
  <!-- HEADER DESKTOP -->
  <v-toolbar v-if="!mobile" class="header">
    <img src="../assets/image/Logo-Branca.png" alt="brjogando" />
    
    <v-spacer></v-spacer>
    
    <!-- Language Switch -->
    <v-btn class="lang-switch" variant="outlined" size="small" :title="$t('header.switchLanguage')" :aria-label="$t('header.switchLanguage')" @click="toggleLocale">
      <v-icon start>mdi-translate</v-icon>{{ nextLocaleLabel }}
    </v-btn>

    <!-- Clean Dark Mode Toggle -->
    <div class="theme-toggle">
      <v-icon class="theme-icon">mdi-weather-sunny</v-icon>
      <v-switch
        v-model="isDarkMode"
        @update:model-value="toggleDarkMode"
        hide-details
        inset
        color="primary"
        class="theme-switch"
      ></v-switch>
      <v-icon class="theme-icon">mdi-weather-night</v-icon>
    </div>
    
    <!-- <NuxtLink to="/"> Home </NuxtLink>      
    
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn outlined v-bind="props">Games <span>V</span></v-btn>
      </template>
      <template v-slot:default>
        <v-list>
          <v-list-item v-for="(item, index) in arrayDeJogos" :key="index">
            <NuxtLink :to="'esports/' + item">{{
              item.split("_").join(" ")
            }}</NuxtLink>
          </v-list-item>
        </v-list>
      </template>
    </v-menu> 

    <NuxtLink :to="{ name: 'institutional-cronogram' }"> Schedule </NuxtLink>
    <NuxtLink :to="{ name: 'institutional-about' }"> About us </NuxtLink>
    <NuxtLink :to="{ name: 'institutional-support' }"> Support </NuxtLink> -->
  </v-toolbar>

  <!-- HEADER MOBILE -->
  <v-app-bar v-else class="header mobile-header pl-0">
    <img src="../assets/image/Logo-Branca.png" alt="brjogando" />
    
    <template v-slot:append>
      <!-- Mobile Language Switch -->
      <v-btn class="lang-switch mobile" variant="text" size="small" :title="$t('header.switchLanguage')" :aria-label="$t('header.switchLanguage')" @click="toggleLocale">
        {{ nextLocaleLabel }}
      </v-btn>

      <!-- Mobile Dark Mode Toggle -->
      <v-switch
        v-model="isDarkMode"
        @update:model-value="toggleDarkMode"
        hide-details
        inset
        color="primary"
        class="theme-switch mobile"
      ></v-switch>
      
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </template>
  </v-app-bar>
  <!-- <v-navigation-drawer class="mobile-header-navigation" app temporary v-model="drawer" location="right">
    <v-list-item to="/">Home</v-list-item>
    <v-list-item to="/institutional/cronogram">Schedule</v-list-item>
    <v-list-item to="/institutional/about">About us</v-list-item>
    <v-list-item to="/institutional/support">Support</v-list-item>
    <v-list>
      <v-list-subheader>Games</v-list-subheader>
      <v-list-item v-for="(item, index) in arrayDeJogos" :key="index">
        <NuxtLink :to="'esports/' + item">{{
          item.split("_").join(" ")
        }}</NuxtLink>
      </v-list-item>
    </v-list>
  </v-navigation-drawer> -->
  <div class="nation-colors-line"></div>
</template>
  
<script setup>
import { useDisplay } from "vuetify";
import { useDarkMode } from "~/composables/useDarkMode";

const { mobile } = useDisplay();
const { isDarkMode, toggleDarkMode } = useDarkMode();
const { nextLocaleLabel, toggleLocale } = useLocaleSwitch();

const arrayDeJogos = [
  'Dota_2',
  'League_of_Legends',
  'Counter_Strike_2',
  'Overwatch',
];

const selectedItem= null

const drawer = ref(false);


</script>

<style lang="scss" scoped>

.v-toolbar {
  height: 80px;
  width: 100vw;
  background-color: #040c2d;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 99;
}

/* TODO: improve this selector */
#__nuxt > div > div > div > div > header {

}

.v-toolbar *{
  margin-right: 16px;
}

.v-toolbar:first-child{
  padding-left: 71px;
}

.v-toolbar:nth-child(2){
  font-weight: bold;
}

img {
  height: 50px;
}

.v-btn {
  text-transform: none;
  background-color: #040c2d;
  color: #ffff;
  padding: 0;
}

.v-btn span{
  margin-left: 8px;
  font-weight: bold;
  font-size: 10px;
  font-family: 'Orbitron', sans-serif;
  transition: transform 0.5s ease-in-out;
}

.v-btn:active span{
  transform:rotate(180deg);
}

a{
  text-decoration: none;
  color: #ffff;
}


.mobile-header{
  position: fixed !important;
}

.mobile-header-navigation{
  position: fixed !important;
}
.v-navigation-drawer{
  margin-top: 16px;
}

.v-list-item{
  color: #000;
}
.v-list-item a{
  text-decoration: none;
  color: #000;
}

.v-list-item a:hover {
  background-color: #e6e6e6;
}

/* Language Switch */
.v-btn.lang-switch {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.5);
  background-color: transparent;
  padding: 0 10px;
  font-weight: bold;
  letter-spacing: 0.5px;

  &.mobile {
    min-width: 0;
    margin-right: 4px;
  }
}

/* Theme Toggle Styles */
.theme-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 16px;
  
  @media (max-width: 960px) {
    margin-right: 8px;
  }
}

.theme-icon {
  color: rgba(255, 255, 255, 0.7);
  font-size: 18px;
  
  @media (max-width: 960px) {
    display: none;
  }
}

.theme-switch {
  :deep(.v-switch__track) {
    background-color: rgba(255, 255, 255, 0.3) !important;
    border: 1px solid rgba(255, 255, 255, 0.5);
  }
  
  :deep(.v-switch__thumb) {
    background-color: white !important;
  }
  
  &.mobile {
    transform: scale(0.8);
  }
}

/* Dark mode switch styling */
[data-theme="dark"] .theme-icon {
  color: rgba(255, 255, 255, 0.9);
}

[data-theme="dark"] .theme-switch {
  :deep(.v-switch__track) {
    background-color: rgba(255, 255, 255, 0.2) !important;
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
}
</style>