<template>
    <div v-if="!mobile" class="container-apostas">
          <div class="container-apostas-txt">
            <div>
              <h2>Apostas com Segurança</h2>
            </div>            
            <p>A prática de apostas com segurança é fundamental para garantir uma experiência positiva e responsável no mundo do entretenimento de jogos de azar. Ao adotar medidas prudentes, como definir limites de apostas, entender as regras dos jogos e escolher plataformas confiáveis, os apostadores podem minimizar os riscos financeiros e aproveitar a diversão de forma mais controlada.</p>
          </div>          
    </div>    
    <v-footer :app="mobile? false: true ">     
      <div class="top-line"></div>
      <div class="footer-logo">
        <img src="../assets/image/Logo-Branca.png" alt="">
      </div>
      <div class="footer-infos">
        <div class="footer-infos-links">
          <NuxtLink :to="{ name: 'institutional-about' }"> Sobre </NuxtLink>
          <NuxtLink :to="{ name: 'institutional-contact' }"> Contato </NuxtLink>
          <NuxtLink :to="{ name: 'institutional-terms' }"> Termo de Uso </NuxtLink>
          <NuxtLink :to="{ name: 'institutional-games' }"> Jogos</NuxtLink>
          <NuxtLink :to="{ name: 'institutional-bets' }"> Apostas </NuxtLink>
          <NuxtLink :to="{ name: 'institutional-profile' }"> Perfil </NuxtLink>
          <NuxtLink :to="{ name: 'institutional-questions' }"> Perguntas Frequentes </NuxtLink>
          <NuxtLink :to="{ name: 'institutional-privacy' }"> Política de Privacidade </NuxtLink>
          <NuxtLink :to="{ name: 'institutional-betting' }"> Casas de Apostas </NuxtLink>
        </div>
        <div class="footer-infos-social-media">
          <div><p>Redes Sociais</p></div>
          <div>
            <NuxtLink :to="{ name: 'institutional-cronogram' }"> <img src="../assets/image/logo-twitter-branco.png" alt="logo-twitter"></NuxtLink>
            <NuxtLink :to="{ name: 'institutional-about' }"> <img src="../assets/image/logo-instagram-branco.png" alt=""> </NuxtLink>
            <NuxtLink :to="{ name: 'institutional-support' }"> <img src="../assets/image/logo-facebook-branco.png" alt="logo-facebook"> </NuxtLink>
          </div>
        </div>
      </div>
      <div class="footer-creators">
        <div>
          <p>BR Jogando &copy 2023. Todos os direitos reservados.</p>
        </div>        
      </div> 
    </v-footer>
</template>

<script setup>
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();
</script>

<style lang="scss" scoped>

.container-apostas{
  font-family: "Poppins";
  background-image: url(../assets/image/footer-image.png);
  background-size: 100% 53%;
  height: 825px;
  width: 100vw;
  color: white;

  @media (max-width:960px){

  }
}

.container-apostas-txt{
  margin-left: 101px;
  margin-top: 60px;
  width: 569px;
  height: 254px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.container-apostas-txt h2{
  font-size: 48px;
}

.container-apostas-txt .v-btn{
  align-self: flex-start;
  background-color:rgb(255, 184, 0);
  color: white;
  font-weight: bold;
  height: 40px;
}


.v-footer {
  font-family: "Poppins";
  height: 388px;
  width: 100vw;
  background-color: #040c2d;
  padding: 0;
  display: flex;
  flex-direction: column;

}

.top-line {
  height: 2px !important;
  width: 100vw;
  background-image: linear-gradient(to right, #ffdf00, #009c3b);
  justify-self: flex-start;
}

.footer-logo{
  align-self: flex-start;
  margin: 48px 5% 24px 5%;

  @media (max-width:960px){
    display: none;
  }

}

.footer-logo img{
  width: 196px;
  height: 64px;  
}

.footer-infos{
  width: 100%;
  align-self: flex-start;
  display: flex;
  justify-content: space-between;
  padding: 0 5% 24px 5%;

  @media (max-width:960px){
    flex-direction: column;
    padding-top: 48px;
  }
}
.footer-infos-links{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px 120px;
  font-weight: bold;

  @media (max-width:960px){
    gap: 1rem 1rem;
  }
}

.footer-infos-links a{
  color: white;
  text-decoration: none;
  font-family: "Poppins"; 
}

.footer-infos-social-media{
 color: white;
 font-weight: bold;
 display: flex;
 flex-direction: column;
 justify-content: center;
 align-items: center;
 gap: 20px;
 @media (max-width:960px){
  gap: 0;
  p{
    display: none;    
  }
 }

}

.footer-infos-social-media div{
  display: flex;
  gap: 36px;

  @media (max-width:960px){
    margin-top: 20px;
    img{
      width: 35px;
    }
  }
}
.footer-creators{
  width: 100%; 
  color: white;
}

.footer-creators div{
  border-top: 2px solid white;
  margin: 30px 5%;
  padding-top: 24px;
  display: flex;
  justify-content: center;
  
  @media (max-width:960px){
    margin: 0 5%;
    padding: 12px;
  }
}

</style>