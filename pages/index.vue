<template>
  <div class="home">
    <v-container class="px-1">
      <!-- Filter Button -->
      <div class="d-flex justify-center mb-4">
        <v-btn 
          @click="showOnlyBrazilian = !showOnlyBrazilian"
          :color="showOnlyBrazilian ? 'green' : ''"
          variant="flat"
          size="small"
          class="filter-button"
        >
          {{ showOnlyBrazilian ? 'Todas as partidas' : 'Apenas brasileiros' }}
        </v-btn>
      </div>
      
      <div class="container-title">Partidas ao vivo</div>
      <v-row v-if="!gamesStore.runningMatches.length">
        <v-col v-for="index in new Array(2)">
          <v-skeleton-loader :width="mobile ? '180' : '280'" type="image"></v-skeleton-loader>
        </v-col>
      </v-row>
      <v-sheet color="#E4E7EC">
        <!-- Show centered cards when few matches -->
        <div v-if="filteredRunningMatches.length <= 3" class="centered-matches">
          <div v-for="(runningMatch, index) in filteredRunningMatches" :key="index" class="match-card-wrapper">
            <CardsMedium :match-info="runningMatch" />
          </div>
        </div>
        
        <!-- Show carousel when many matches -->
        <v-slide-group v-else v-model="model" :show-arrows="!mobile">
          <v-slide-group-item v-for="(runningMatch, index) in filteredRunningMatches" :key="index"
            v-slot="{ isSelected, toggle, selectedClass }">
            <div class="mr-3">
              <CardsMedium :match-info="runningMatch" />
            </div>
          </v-slide-group-item>
        </v-slide-group>
      </v-sheet>
    </v-container>
    <v-container class="mb-3">
      <v-row class="justify-center">
        <v-col :cols="mobile ? 12 : 9">
          <v-row class="justify-center">
            <span class="container-title">Próximas Partidas</span>
          </v-row>
          <v-row v-if="!gamesStore.upcomingMatches.length">
            <v-col v-for="index in new Array(14)">
              <v-skeleton-loader width="380" type="image"></v-skeleton-loader>
            </v-col>
          </v-row>
          <v-row v-else class="justify-center upcoming-matches-row">
            <CardsBig v-for="(upcomingMatch, index) in filteredUpcomingMatches" :key="index" :match-info="upcomingMatch" />
          </v-row>
        </v-col>
        <v-col v-if="!mobile">
          <v-row class="mt-15 ml-6 last-matches">
            <span>Últimas Partidas</span>
          </v-row>
          <v-row>
            <CardsSmall v-for="(pastMatch, index) in gamesStore.pastMatches.slice(1)" :key="index" :match-info="pastMatch" />
          </v-row>
          <v-row class="mt-15">
            <a target="_blank"
              href="https://www.amazon.com.br/b?_encoding=UTF8&tag=brjogando-20&linkCode=ur2&linkId=bd4eb4dac09bc4d3474f21381ef8299a&camp=1789&creative=9325&node=16243794011">
              <img width="250" src="../assets/image/amazon-notebook.jpg" />
            </a>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <!-- ULTIMAS PARTIDAS MOBILE -->
    <v-container v-if="mobile">
      <v-row class="mb-2">
        <v-row class="justify-center">
          <div class="last-matches">
            <span>Últimas Partidas</span>
          </div>
        </v-row>
        <v-row>
          <v-col class="d-flex flex-wrap justify-center pa-0" v-for="(pastMatch, index) in gamesStore.pastMatches" :key="index">
            <CardsSmall :match-info="pastMatch" />
          </v-col>
        </v-row>
      </v-row>
    </v-container>
  </div>
</template>
<script>
export default {
  name: "GamesHome",
};
</script>
<script setup>
import { ref, computed, onBeforeMount } from 'vue';
import { useDisplay } from "vuetify";
import { useGamesStore } from "~/store/games";

const gamesStore = useGamesStore();
const showOnlyBrazilian = ref(false);

useSeoMeta({
  title: 'BRjogando',
  ogTitle: 'BRjogando',
  description: 'Jogos que importam, na hora que importam.',
  ogDescription: 'Jogos que importam, na hora que importam.',
  ogImage: '/Logo-Default.png',
  ogUrl: 'brjogando.com.br',
  twitterCard: 'summary_large_image',
  twitterTitle: 'BRjogando',
  twitterDescription: 'Jogos que importam, na hora que importam',
  twitterImage: '/Logo-Default.png'
})

// Function to check if a match has Brazilian connection
function hasBrazilianConnection(match) {
  if (!match) return false;
  
  // Check team organizations for "BR" 
  const teams = match.opponents || [];
  for (const team of teams) {
    const teamName = team.opponent?.name || '';
    const location = team.opponent?.location || '';
    
    // Check if team name or location contains "BR"
    if (teamName.toLowerCase().includes('br') || location.toLowerCase().includes('br')) {
      return true;
    }
  }
  
  // Check players (if rosters are loaded)
  if (match.rosters) {
    for (const roster of match.rosters) {
      if (roster.players) {
        for (const player of roster.players) {
          const nationality = player.nationality || '';
          const playerName = player.name || '';
          
          // Check if player is Brazilian or has "BR" in name
          if (nationality.toLowerCase().includes('br') || playerName.toLowerCase().includes('br')) {
            return true;
          }
        }
      }
    }
  }
  
  return false;
}

// Computed properties to filter matches
const filteredUpcomingMatches = computed(() => {
  if (!showOnlyBrazilian.value) {
    return gamesStore.upcomingMatches;
  }
  
  return gamesStore.upcomingMatches.filter(match => hasBrazilianConnection(match));
});

const filteredRunningMatches = computed(() => {
  if (!showOnlyBrazilian.value) {
    return gamesStore.runningMatches;
  }
  
  return gamesStore.runningMatches.filter(match => hasBrazilianConnection(match));
});

onBeforeMount(async () => {
  // Carrega a informação das partidas na store
  gamesStore.fetchRunningMatches();
  gamesStore.fetchUpcomingMatches();
  gamesStore.fetchPastMatches();
});

// Para auxiliar o carrossel
let model = null;

const { mobile } = useDisplay();

</script>

<style lang="scss" scoped>
.home {
  background-color: #e4e7ec;
  @media (max-width: 960px) {
    padding: 0px;
      margin-top:78px;
  }
}

.container-title {
  /* Desktop/Hero */
  font-family: "Poppins";
  font-style: normal;
  font-weight: 900;
  font-size: 3vw;
  line-height: 69px;
  text-align: center;
  /* Flag/Blue */
  color: #002776;

  @media (max-width: 960px) {
    font-size: 2rem;
  }
}

.filter-button {
  border-radius: 25px !important; /* Very rounded corners */
  padding: 8px 24px !important;
  font-weight: 600;
  text-transform: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  min-height: 40px !important;
  background-color: #002776 !important; /* Same blue as "Partidas ao vivo" */
  color: white !important;
  
  &:hover {
    background-color: #001a5c !important; /* Darker blue on hover */
  }
  
  @media (max-width: 960px) {
    padding: 6px 20px !important;
    font-size: 0.875rem;
    min-height: 36px !important;
  }
}

/* Green state when filtering */
.filter-button.v-btn--variant-flat.bg-green {
  background-color: #4caf50 !important;
  color: white !important;
  
  &:hover {
    background-color: #45a049 !important;
  }
}

/* Center live match cards when there are few of them */
.centered-matches {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  min-height: 200px; /* Ensure consistent height */
  
  @media (max-width: 960px) {
    flex-direction: column;
    gap: 8px;
    padding: 12px;
  }
}

.match-card-wrapper {
  flex-shrink: 0;
}

/* Fix upcoming matches container height */
.upcoming-matches-row {
  min-height: auto !important;
  align-content: flex-start !important;
}

/* Dark mode styles for main page */
[data-theme="dark"] .home {
  background-color: var(--bg-primary, #0a0a0a) !important;
}

[data-theme="dark"] .container-title {
  color: var(--text-primary, #ffffff) !important;
}

[data-theme="dark"] .centered-matches {
  background-color: var(--bg-primary, #0a0a0a) !important;
}

/* Carousel background - should be black like the rest of the site */
[data-theme="dark"] .v-sheet {
  background-color: var(--bg-primary, #0a0a0a) !important;
}

/* Slide group styling for dark mode */
[data-theme="dark"] .v-slide-group {
  background-color: var(--bg-primary, #0a0a0a) !important;
  
  .v-slide-group__content {
    background-color: var(--bg-primary, #0a0a0a) !important;
  }
}

[data-theme="dark"] .filter-button {
  background-color: #1976d2 !important;
  
  &:hover {
    background-color: #1565c0 !important;
  }
  
  &.bg-green {
    background-color: #388e3c !important;
    
    &:hover {
      background-color: #2e7d32 !important;
    }
  }
}

.last-matches {
  /* Desktop/H2 */
  font-family: "Poppins";
  font-style: normal;
  font-weight: 700;
  font-size: 1.3rem;
  color: #000000;
}
</style>
