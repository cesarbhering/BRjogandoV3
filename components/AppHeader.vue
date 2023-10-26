<template>
  <header>
    <div class="box">
      <img src="../assets/image/Logo-Branca.png" alt="brjogando" />
      <nav>
        <ul>
          <NuxtLink to="/"> Início </NuxtLink>
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props">Jogos</v-btn>
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
          <NuxtLink :to="{ name: 'institutional-cronogram'}"> Cronograma </NuxtLink>
          <NuxtLink :to="{ name: 'institutional-about'}"> Sobre nós </NuxtLink>
          <NuxtLink :to="{ name: 'institutional-support'}"> Suporte </NuxtLink>
        </ul>
      </nav>
    </div>
    <div class="bottom-line"></div>
  </header>
    <div class="bottom-line"></div>
</template>
  
  <script >
export default {
  data() {
    return {
      arrayDeJogos: [
        "Dota_2",
        "League_of_Legends",
        "Counter_Strike_2",
        "Overwatch",
      ],
    };
  },
  name: "Header",
};
</script>

  <style lang="scss" scoped>
header {
  height: 80px;
  background-color: #040c2d;
  display: flex;
  flex-direction: row;
}
.bottom-line {
  height: 2px;
  width: 100vw;
  position: absolute;
  background-image: linear-gradient(to right, #ffdf00, #009c3b);
  align-self: flex-end;
}

.box {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
  right: 30px;
  margin-left: 71px;
}
img {
  height: 50px;
}
nav ul {
  height: 100%;
  display: flex;
  flex-direction: row;
  gap: 12px;
  align-items: center;
  list-style: none;
  color: #ffff;
}

ul a {
  color: #ffff;
  text-decoration: none;
}

.v-btn {
  text-transform: none;
  background-color: transparent;
  color: #ffff;
  padding: 0;
  display: inline;
}
.v-list-item a {
  text-decoration: none;
  color: #000;
}

.v-list-item:hover a {
  color: #ffff;
}

.v-list-item:hover {
  background-image: linear-gradient(45deg, #040c2d 40%, #002776, #ffff);
  color: #ffff;
}
</style>