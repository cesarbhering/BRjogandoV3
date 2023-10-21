<template>    
    <header>
        <div class="box">
           <img src="../assets/image/Logo-Branca.png" alt="brjogando"/>
        <nav>
                <ul>
                    <v-btn>Início</v-btn>
                    <v-menu>
                        <template v-slot:activator="{props}">
                            <v-btn v-bind="props" >Jogos</v-btn>
                        </template>
                        <template v-slot:default>
                            <v-list>
                                <v-list-item v-for="(item, index) in arrayDeJogos" :key="index">
                                    <v-list-item-title>{{ item }}</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </template>
                    </v-menu>
                    <v-btn>Cronograma</v-btn>
                    <v-btn>Sobre nós</v-btn>
                    <v-btn>Suporte</v-btn>
                </ul>
        </nav>
            
        </div>
        <div class="bottom-line"></div>
    </header>

    <div></div>

    <footer>

    </footer>

  </template>
  
  <script > 
   
   
   export default {
    data() {
        return{
            arrayDeJogos: ["Dota 2", "League of Legends", "Counter Strike", "Overwatch"],
        };        
    },
    name: 'primeiraPagina'
   }
  </script>

  <style lang="scss" scoped>
    header{
        height: 80px;
        background-color: #040C2D;
        display: flex;
        flex-direction: row;             
    }
    .bottom-line{
        height: 2px;
        width: 100vw;
        position: absolute;
        background-image: linear-gradient(to right, #FFDF00, #009C3B);
        align-self: flex-end;
    }

    .box{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap:20px;
        right: 30px;
        margin-left: 71px;
    }
    img{
        height: 50px;
    }
    nav ul{
        height: 100%;
        display: flex;
        flex-direction: row;
        gap: 8px;
        align-items: center;
        list-style: none;
        color: #FFFF;
    }

    .v-btn{
        text-transform: none;
        background-color: transparent;
        color: #FFFF;
    }

   
  </style>