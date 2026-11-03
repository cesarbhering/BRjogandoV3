<template>
  <!-- DESKTOP -->
  <v-row class="d-flex align-center justify-center" v-if="!mobile">
    <div class="modal-backdrop" @click="emit('closeModal')"></div>
    <v-card height="90vh" width="800px" class="modal-card" @click.stop>
      <!-- Non-scrollable close button area -->
      <div class="modal-top-bar">
        <div class="close-header">
          <v-icon @click="emit('closeModal')" class="close-button">mdi-close</v-icon>
        </div>
      </div>

      <!-- Scrollable content area -->
      <div class="modal-content-scroll">
        <!-- Fixed Header Container (Desktop) -->
      <div class="fixed-header-container">
        <!-- Tournament Header -->
        <div class="tournament-header">
          <div class="header-with-icon">
            <div class="tournament-text">
              <h2 class="tournament-title">{{ matchInfo.league.name }} - {{ matchInfo.serie.name }}</h2>
              <div class="tournament-info">
                <div class="date-with-icon">
                  <Icon v-if="getGameIcon(matchInfo.videogame?.name)" :icon="getGameIcon(matchInfo.videogame?.name)" class="game-icon-inline" />
                  <p class="tournament-date">{{ formatDate(matchInfo.begin_at) }}</p>
                </div>
                <div class="match-format-info">
                  <span v-if="matchFormat" class="match-format">{{ matchFormat }}</span>
                  <span v-if="currentScore" class="current-score">{{ currentScore }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Teams Horizontal Layout -->
        <div class="teams-horizontal-section">
        <div class="team-lineup">
          <!-- Team 1 Flag -->
          <v-img 
            class="country-flag" 
            :src="teamLogoThumb(false, props.matchInfo.opponents?.[0]?.opponent?.location)" 
            v-if="props.matchInfo.opponents?.[0]"
          />
          
          <!-- Team 1 Logo -->
          <v-img 
            class="team-logo-medium" 
            :src="teamLogoThumb(props.matchInfo.opponents?.[0]?.opponent?.image_url, false)" 
            v-if="props.matchInfo.opponents?.[0]"
          />
          
          <!-- Team Names -->
          <div class="team-names">
            <span class="team-name-text">{{ props.matchInfo.opponents?.[0]?.opponent?.name || 'Team 1' }}</span>
            <v-icon class="vs-icon">mdi-close</v-icon>
            <span class="team-name-text">{{ props.matchInfo.opponents?.[1]?.opponent?.name || 'Team 2' }}</span>
          </div>
          
          <!-- Team 2 Logo -->
          <v-img 
            class="team-logo-medium" 
            :src="teamLogoThumb(props.matchInfo.opponents?.[1]?.opponent?.image_url, false)" 
            v-if="props.matchInfo.opponents?.[1]"
          />
          
          <!-- Team 2 Flag -->
          <v-img 
            class="country-flag" 
            :src="teamLogoThumb(false, props.matchInfo.opponents?.[1]?.opponent?.location)" 
            v-if="props.matchInfo.opponents?.[1]"
          />
        </div>
      </div>
      </div>

      <!-- Main Content -->
      <div class="modal-content">
        <!-- Team Members Section -->
        <div class="team-members-section">
          <h3 class="section-title">Integrantes do time</h3>
          
          <div v-if="!props.matchInfo.rosters" class="loading-container">
            <v-progress-circular :size="40" color="primary" indeterminate></v-progress-circular>
          </div>
          
          <div v-if="props.matchInfo.rosters" class="team-rosters">
            <!-- Team 1 Roster (Left) -->
            <div class="roster-column">
              <ModalsRosters 
                :team-roster="props.matchInfo.rosters[0].players" 
              />
            </div>
            
            <!-- Team 2 Roster (Right) -->
            <div class="roster-column">
              <ModalsRosters 
                :team-roster="props.matchInfo.rosters[1].players"
              />
            </div>
          </div>
        </div>

        <!-- Streams Section -->
        <div v-if="availableStreams.length > 0" class="streams-section">
          <h3 class="section-title">Live Streams</h3>
          <div class="streams-container">
            <a 
              v-for="(stream, index) in availableStreams" 
              :key="index"
              :href="stream.raw_url" 
              target="_blank" 
              class="stream-item"
              :class="{ 'official': stream.official, 'main': stream.main }"
            >
              <div class="stream-info">
                <i :class="getStreamIcon(stream.raw_url)" class="stream-icon"></i>
                <span class="stream-platform">{{ getStreamPlatform(stream.raw_url) }}</span>
                <span v-if="stream.language" class="stream-language">{{ stream.language.toUpperCase() }}</span>
              </div>
              <div class="stream-badges">
                <span v-if="stream.official" class="badge official">OFICIAL</span>
                <span v-if="stream.main" class="badge main">PRINCIPAL</span>
              </div>
            </a>
          </div>
        </div>

        <!-- Links Section -->
        <div class="links-section">
          <h3 class="section-title">Links Relevantes</h3>
          <p v-if="isSearchingLinks" class="links-subtitle">Buscando diretamente na Liquipedia...</p>
          <div class="links-container">
            <div v-if="matchInfo.league?.name || matchInfo.serie?.name" class="link-item">
              <img src="/liquipedia.svg" alt="Liquipedia" class="liquipedia-icon" />
              <a 
                v-if="dynamicLinks.tournament.url && dynamicLinks.tournament.url !== '#'" 
                :href="dynamicLinks.tournament.url" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="link-text"
              >
                {{ dynamicLinks.tournament.title }}
                <v-icon class="external-link-icon" size="x-small">mdi-open-in-new</v-icon>
              </a>
              <span v-else-if="dynamicLinks.tournament.loading" class="link-text loading">
                <v-progress-circular size="12" width="2" indeterminate></v-progress-circular>
                Procurando {{ matchInfo.league?.name || matchInfo.serie?.name }}...
              </span>
              <span v-else class="link-text unavailable">
                {{ matchInfo.league?.name || matchInfo.serie?.name }} - Não encontrado
              </span>
            </div>
            <div v-if="teamNames[0] !== 'Team 1'" class="link-item">
              <img src="/liquipedia.svg" alt="Liquipedia" class="liquipedia-icon" />
              <a 
                v-if="dynamicLinks.team1.url && dynamicLinks.team1.url !== '#'" 
                :href="dynamicLinks.team1.url" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="link-text"
              >
                {{ dynamicLinks.team1.title }}
                <v-icon class="external-link-icon" size="x-small">mdi-open-in-new</v-icon>
              </a>
              <span v-else-if="dynamicLinks.team1.loading" class="link-text loading">
                <v-progress-circular size="12" width="2" indeterminate></v-progress-circular>
                Procurando {{ teamNames[0] }}...
              </span>
              <span v-else class="link-text unavailable">
                {{ teamNames[0] }} - Não encontrado
              </span>
            </div>
            <div v-if="teamNames[1] !== 'Team 2'" class="link-item">
              <img src="/liquipedia.svg" alt="Liquipedia" class="liquipedia-icon" />
              <a 
                v-if="dynamicLinks.team2.url && dynamicLinks.team2.url !== '#'" 
                :href="dynamicLinks.team2.url" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="link-text"
              >
                {{ dynamicLinks.team2.title }}
                <v-icon class="external-link-icon" size="x-small">mdi-open-in-new</v-icon>
              </a>
              <span v-else-if="dynamicLinks.team2.loading" class="link-text loading">
                <v-progress-circular size="12" width="2" indeterminate></v-progress-circular>
                Procurando {{ teamNames[1] }}...
              </span>
              <span v-else class="link-text unavailable">
                {{ teamNames[1] }} - Não encontrado
              </span>
            </div>
          </div>
        </div>
      </div>
      </div> <!-- Close modal-content-scroll -->
    </v-card>
  </v-row>

  <!-- MOBILE -->
  <div v-if="mobile" class="mobile-backdrop" @click="emit('closeModal')">
    <v-card class="mobile-modal" @click.stop>
      <!-- Non-scrollable close button area -->
      <div class="modal-top-bar mobile">
        <div class="close-header mobile">
          <v-icon @click="emit('closeModal')" class="close-button">mdi-close</v-icon>
        </div>
      </div>

      <!-- Scrollable content area -->
      <div class="modal-content-scroll mobile">
    
         <div class="tournament-header mobile">
       <div class="header-with-icon mobile">
         <div class="tournament-text mobile">
           <h3 class="tournament-title">{{ matchInfo.league.name }}</h3>
           <div class="tournament-info mobile">
             <div class="date-with-icon mobile">
               <Icon v-if="getGameIcon(matchInfo.videogame?.name)" :icon="getGameIcon(matchInfo.videogame?.name)" class="game-icon-inline mobile" />
               <p class="tournament-date">{{ formatDate(matchInfo.begin_at) }}</p>
             </div>
             <div class="match-format-info mobile">
               <span v-if="matchFormat" class="match-format">{{ matchFormat }}</span>
               <span v-if="currentScore" class="current-score">{{ currentScore }}</span>
             </div>
           </div>
         </div>
       </div>
     </div>

    <div class="teams-horizontal-section mobile">
      <div class="team-lineup mobile">
        <v-img 
          class="country-flag" 
          :src="teamLogoThumb(false, props.matchInfo.opponents?.[0]?.opponent?.location)" 
          v-if="props.matchInfo.opponents?.[0]"
        />
        <span class="team-name-text">{{ props.matchInfo.opponents?.[0]?.opponent?.name || 'Team 1' }}</span>
        <v-icon class="vs-icon">mdi-close</v-icon>
        <span class="team-name-text">{{ props.matchInfo.opponents?.[1]?.opponent?.name || 'Team 2' }}</span>
        <v-img 
          class="country-flag" 
          :src="teamLogoThumb(false, props.matchInfo.opponents?.[1]?.opponent?.location)" 
          v-if="props.matchInfo.opponents?.[1]"
        />
      </div>
    </div>

    <div class="modal-content mobile">
      <h3 class="section-title">Integrantes do time</h3>
      <div v-if="props.matchInfo.rosters" class="team-rosters mobile">
        <!-- Team 1 Roster (Mobile) -->
        <div class="roster-column mobile">
          <ModalsRosters 
            :team-roster="props.matchInfo.rosters[0].players"
          />
        </div>
        
        <!-- Team 2 Roster (Mobile) -->
        <div class="roster-column mobile">
          <ModalsRosters 
            :team-roster="props.matchInfo.rosters[1].players"
          />
        </div>
      </div>
      
      <!-- Mobile Streams Section -->
      <div v-if="availableStreams.length > 0" class="streams-section mobile">
        <h3 class="section-title">Live Streams</h3>
        <div class="streams-container">
          <a 
            v-for="(stream, index) in availableStreams" 
            :key="index"
            :href="stream.raw_url" 
            target="_blank" 
            class="stream-item"
            :class="{ 'official': stream.official, 'main': stream.main }"
          >
            <div class="stream-info">
              <i :class="getStreamIcon(stream.raw_url)" class="stream-icon"></i>
              <span class="stream-platform">{{ getStreamPlatform(stream.raw_url) }}</span>
              <span v-if="stream.language" class="stream-language">{{ stream.language.toUpperCase() }}</span>
            </div>
            <div class="stream-badges">
              <span v-if="stream.official" class="badge official">OFICIAL</span>
              <span v-if="stream.main" class="badge main">PRINCIPAL</span>
            </div>
          </a>
        </div>
      </div>
      
      <div class="links-section mobile">
        <h3 class="section-title">Links Relevantes</h3>
        <p v-if="isSearchingLinks" class="links-subtitle">Buscando diretamente na Liquipedia...</p>
        <div class="links-container mobile">
          <div v-if="matchInfo.league?.name || matchInfo.serie?.name" class="link-item">
            <img src="/liquipedia.svg" alt="Liquipedia" class="liquipedia-icon" />
            <a 
              v-if="dynamicLinks.tournament.url && dynamicLinks.tournament.url !== '#'" 
              :href="dynamicLinks.tournament.url" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="link-text"
            >
              {{ dynamicLinks.tournament.title }}
              <v-icon class="external-link-icon" size="x-small">mdi-open-in-new</v-icon>
            </a>
            <span v-else-if="dynamicLinks.tournament.loading" class="link-text loading">
              <v-progress-circular size="12" width="2" indeterminate></v-progress-circular>
              Procurando {{ matchInfo.league?.name || matchInfo.serie?.name }}...
            </span>
            <span v-else class="link-text unavailable">
              {{ matchInfo.league?.name || matchInfo.serie?.name }} - Não encontrado
            </span>
          </div>
          <div v-if="teamNames[0] !== 'Team 1'" class="link-item">
            <img src="/liquipedia.svg" alt="Liquipedia" class="liquipedia-icon" />
            <a 
              v-if="dynamicLinks.team1.url && dynamicLinks.team1.url !== '#'" 
              :href="dynamicLinks.team1.url" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="link-text"
            >
              {{ dynamicLinks.team1.title }}
              <v-icon class="external-link-icon" size="x-small">mdi-open-in-new</v-icon>
            </a>
            <span v-else-if="dynamicLinks.team1.loading" class="link-text loading">
              <v-progress-circular size="12" width="2" indeterminate></v-progress-circular>
              Procurando {{ teamNames[0] }}...
            </span>
            <span v-else class="link-text unavailable">
              {{ teamNames[0] }} - Não encontrado
            </span>
          </div>
          <div v-if="teamNames[1] !== 'Team 2'" class="link-item">
            <img src="/liquipedia.svg" alt="Liquipedia" class="liquipedia-icon" />
            <a 
              v-if="dynamicLinks.team2.url && dynamicLinks.team2.url !== '#'" 
              :href="dynamicLinks.team2.url" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="link-text"
            >
              {{ dynamicLinks.team2.title }}
              <v-icon class="external-link-icon" size="x-small">mdi-open-in-new</v-icon>
            </a>
            <span v-else-if="dynamicLinks.team2.loading" class="link-text loading">
              <v-progress-circular size="12" width="2" indeterminate></v-progress-circular>
              Procurando {{ teamNames[1] }}...
            </span>
            <span v-else class="link-text unavailable">
              {{ teamNames[1] }} - Não encontrado
            </span>
          </div>
        </div>
      </div>
    </div>
      </div> <!-- Close modal-content-scroll mobile -->
  </v-card>
  </div>
</template>

<script>
export default {
  name: "MatchModal",
};
</script>
<script setup>
import { useDisplay } from "vuetify";
import { useGamesStore } from "~/store/games";

const props = defineProps({
  matchInfo: { type: Object, required: true },
  matchOccurrence: { type: String, required: true },
});

const emit = defineEmits(['closeModal']);

// Use store-based caching instead of component-level cache

const { mobile } = useDisplay();
const { teamLogoThumb } = useLogos();
const gamesStore = useGamesStore();

const teamNames = computed(() => {
  if (!props.matchInfo?.opponents || props.matchInfo.opponents.length < 2) {
    return ['Team 1', 'Team 2'];
  }
  return [
    props.matchInfo.opponents[0]?.opponent?.name || 'Team 1',
    props.matchInfo.opponents[1]?.opponent?.name || 'Team 2',
  ];
});

// Dynamic links state
const dynamicLinks = ref({
  tournament: { url: null, title: '', loading: false },
  team1: { url: null, title: '', loading: false },
  team2: { url: null, title: '', loading: false }
});

const isSearchingLinks = ref(false);

// This is intentionally empty - cache moved outside component

const availableStreams = computed(() => {
  if (!props.matchInfo?.streams_list || !Array.isArray(props.matchInfo.streams_list)) {
    return [];
  }
  return props.matchInfo.streams_list.filter(stream => stream.raw_url);
});



function getGameIcon(videogameName) {
  if (!videogameName) {
    return 'mdi:gamepad-variant';
  }
  
  switch (videogameName.toLowerCase()) {
    case 'lol':
    case 'league of legends':
      return 'simple-icons:leagueoflegends';
    case 'counter-strike':
    case 'cs:go':
    case 'cs2':
      return 'simple-icons:counterstrike';
    case 'dota 2':
    case 'dota2':
      return 'simple-icons:dota2';
    case 'valorant':
      return 'simple-icons:valorant';
    case 'rainbow 6 siege':
    case 'r6':
      return 'simple-icons:ubisoft'; // R6 Siege via Ubisoft
    case 'free fire':
      return 'mdi:fire';
    case 'rocket league':
      return 'simple-icons:rocketleague';
    case 'overwatch':
    case 'overwatch 2':
      return 'simple-icons:overwatch';
    case 'fortnite':
      return 'simple-icons:epicgames';
    case 'apex legends':
      return 'simple-icons:apexlegends';
    case 'call of duty':
    case 'cod':
      return 'simple-icons:activision';
    case 'fifa':
      return 'simple-icons:ea';
    default:
      return 'mdi:gamepad-variant'; // Generic gaming icon
  }
}



// Direct Liquipedia search using Playwright
async function searchLiquipediaDirectly(searchTerm, gameType) {
  
  try {
    const queryParams = new URLSearchParams({
      searchTerm: searchTerm,
      gameType: gameType || ''
    });
    
    const response = await fetch(`/.netlify/functions/searchLiquipediaLinks?${queryParams}`);
    
    if (!response.ok) {
      // In development, Netlify functions might not be available
      if (response.status === 404 && process.env.NODE_ENV === 'development') {
        console.warn('Liquipedia search not available in development mode (Netlify functions not running)');
        const fallbackResult = { 
          url: `https://liquipedia.net/leagueoflegends/Special:Search?search=${encodeURIComponent(searchTerm)}`, 
          title: `${searchTerm} - Buscar na Liquipedia` 
        };
        return fallbackResult;
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    const result = data.data;
    return result;
  } catch (error) {
    console.error('Error searching Liquipedia directly:', error);
    // Provide a fallback search URL
    const gameMap = {
      'lol': 'leagueoflegends',
      'league of legends': 'leagueoflegends',
      'counter-strike': 'counterstrike',
      'cs:go': 'counterstrike',
      'cs2': 'counterstrike',
      'dota 2': 'dota2',
      'valorant': 'valorant'
    };
    const game = gameMap[gameType?.toLowerCase()] || 'leagueoflegends';
    const fallbackResult = { 
      url: `https://liquipedia.net/${game}/Special:Search?search=${encodeURIComponent(searchTerm)}`,
      title: `Buscar "${searchTerm}" na Liquipedia` 
    };
    
    // Cache the fallback result too
    return fallbackResult;
  }
}

async function loadDynamicLinks() {
  const gameType = props.matchInfo.videogame?.name;
  
  // Check if links are already stored in match data
  if (props.matchInfo.liquipediaLinks) {
    console.log('📋 Using cached Liquipedia links from store...');
    dynamicLinks.value = { ...props.matchInfo.liquipediaLinks };
    isSearchingLinks.value = false;
    return;
  }
  
  const tournamentName = props.matchInfo.league?.name || props.matchInfo.serie?.name;
  
  // Create an array to hold all parallel search promises
  const searchPromises = [];
  
  // Set searching state to true
  isSearchingLinks.value = true;
  
  // Add tournament search if available
  if (tournamentName) {
    dynamicLinks.value.tournament.loading = true;
    searchPromises.push(
      searchLiquipediaDirectly(tournamentName, gameType).then(result => ({
        type: 'tournament',
        result: {
          url: result.url,
          title: result.title || `${tournamentName} - Liquipedia`,
          loading: false
        }
      }))
    );
  }
  
  // Add team 1 search if available
  if (teamNames.value[0] !== 'Team 1') {
    dynamicLinks.value.team1.loading = true;
    searchPromises.push(
      searchLiquipediaDirectly(teamNames.value[0], gameType).then(result => ({
        type: 'team1',
        result: {
          url: result.url,
          title: result.title || `${teamNames.value[0]} - Liquipedia`,
          loading: false
        }
      }))
    );
  }
  
  // Add team 2 search if available
  if (teamNames.value[1] !== 'Team 2') {
    dynamicLinks.value.team2.loading = true;
    searchPromises.push(
      searchLiquipediaDirectly(teamNames.value[1], gameType).then(result => ({
        type: 'team2',
        result: {
          url: result.url,
          title: result.title || `${teamNames.value[1]} - Liquipedia`,
          loading: false
        }
      }))
    );
  }
  
  // Execute only uncached searches in parallel
  if (searchPromises.length > 0) {
    try {
      console.log(`🚀 Starting ${searchPromises.length} parallel Liquipedia searches...`);
      const results = await Promise.all(searchPromises);
      
      // Update the dynamic links with results
      results.forEach(({ type, result }) => {
        dynamicLinks.value[type] = result;
      });
      
      console.log('✅ All Liquipedia searches completed');
      
      // Store the results in the match data for future use
      await gamesStore.storeLiquipediaLinks(props.matchInfo, props.matchOccurrence, dynamicLinks.value);
    } catch (error) {
      console.error('❌ Error in parallel Liquipedia searches:', error);
      // Set any still-loading items to error state
      ['tournament', 'team1', 'team2'].forEach(type => {
        if (dynamicLinks.value[type].loading) {
          dynamicLinks.value[type] = {
            url: '#',
            title: 'Erro na busca',
            loading: false
          };
        }
      });
    } finally {
      // Hide the searching message when all searches are done
      isSearchingLinks.value = false;
    }
  } else {
    // No searches to perform, hide the searching message immediately
    isSearchingLinks.value = false;
  }
}

function getStreamPlatform(url) {
  if (!url) return 'Stream';
  
  if (url.includes('twitch.tv')) return 'Twitch';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
  if (url.includes('kick.com')) return 'Kick';
  if (url.includes('facebook.com')) return 'Facebook';
  if (url.includes('instagram.com')) return 'Instagram';
  if (url.includes('tiktok.com')) return 'TikTok';
  
  return 'Stream';
}

function getStreamIcon(url) {
  if (!url) return 'fas fa-play';
  
  if (url.includes('twitch.tv')) return 'fab fa-twitch';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'fab fa-youtube';
  if (url.includes('kick.com')) return 'fas fa-play'; // Kick doesn't have FA icon
  if (url.includes('facebook.com')) return 'fab fa-facebook';
  if (url.includes('instagram.com')) return 'fab fa-instagram';
  if (url.includes('tiktok.com')) return 'fab fa-tiktok';
  
  return 'fas fa-play';
}

const matchFormat = computed(() => {
  // Check for number_of_games field first
  if (props.matchInfo?.number_of_games) {
    return `BO${props.matchInfo.number_of_games}`;
  }
  
  // Check for games array length as fallback
  if (props.matchInfo?.games && Array.isArray(props.matchInfo.games)) {
    const totalGames = props.matchInfo.games.length;
    if (totalGames > 0) {
      // Determine BO format based on games array
      if (totalGames === 1) return 'BO1';
      if (totalGames <= 3) return 'BO3';
      if (totalGames <= 5) return 'BO5';
      if (totalGames <= 7) return 'BO7';
      return `BO${totalGames}`;
    }
  }
  
  // Check for match name patterns
  if (props.matchInfo?.name) {
    const name = props.matchInfo.name.toLowerCase();
    if (name.includes('bo1') || name.includes('best of 1')) return 'BO1';
    if (name.includes('bo3') || name.includes('best of 3')) return 'BO3';
    if (name.includes('bo5') || name.includes('best of 5')) return 'BO5';
    if (name.includes('bo7') || name.includes('best of 7')) return 'BO7';
  }
  
  return null;
});

const currentScore = computed(() => {
  // Only show score for ongoing or completed matches
  if (!props.matchInfo?.games || !Array.isArray(props.matchInfo.games)) {
    return null;
  }
  
  const games = props.matchInfo.games;
  if (games.length === 0) return null;
  
  let team1Wins = 0;
  let team2Wins = 0;
  
  // Count wins for each team
  games.forEach(game => {
    if (game.finished && game.winner) {
      if (game.winner.id === props.matchInfo.opponents?.[0]?.opponent?.id) {
        team1Wins++;
      } else if (game.winner.id === props.matchInfo.opponents?.[1]?.opponent?.id) {
        team2Wins++;
      }
    }
  });
  
  // Only show score if at least one game has been played
  if (team1Wins === 0 && team2Wins === 0) {
    // Check if match is live or has started
    if (props.matchInfo.status === 'running' || props.matchInfo.status === 'not_started') {
      return '0x0';
    }
    return null;
  }
  
  return `${team1Wins}x${team2Wins}`;
});





onBeforeMount(async () => {
  try {
    if (props.matchInfo?.opponents && props.matchInfo.opponents.length >= 2) {
      await gamesStore.fetchGameRosters(props.matchInfo, props.matchOccurrence);
      
      // Load dynamic Liquipedia links
      await loadDynamicLinks();
    }
  } catch (error) {
    console.warn('Error loading modal data:', error);
  }
});





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
</script>

<style lang="scss" scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 5;
}

/* Dark mode modal styles */
[data-theme="dark"] .modal-card {
  background-color: var(--bg-secondary, #1a1a1a) !important;
  color: var(--text-primary, #ffffff) !important;
  border: 1px solid var(--border, #333) !important;
}

[data-theme="dark"] .mobile-modal {
  background-color: var(--bg-secondary, #1a1a1a) !important;
  color: var(--text-primary, #ffffff) !important;
}

[data-theme="dark"] .tournament-title {
  color: var(--accent, #64b5f6) !important;
}

[data-theme="dark"] .section-title {
  color: var(--text-primary, #ffffff) !important;
}

[data-theme="dark"] .team-name {
  color: var(--text-primary, #ffffff) !important;
}

[data-theme="dark"] .tournament-header {
  background-color: var(--bg-secondary, #1a1a1a) !important;
  border-bottom: 1px solid var(--border, #333) !important;
}

[data-theme="dark"] .teams-horizontal-section {
  background-color: var(--bg-secondary, #1a1a1a) !important;
  border-bottom: 1px solid var(--border, #333) !important;
}

[data-theme="dark"] .fixed-header-container {
  background-color: var(--bg-secondary, #1a1a1a) !important;
  border-bottom: 1px solid var(--border, #333) !important;
}

[data-theme="dark"] .stream-item {
  background-color: var(--bg-tertiary, #2a2a2a) !important;
  color: var(--text-primary, #ffffff) !important;
  border: 1px solid var(--border, #333) !important;
  
  &:hover {
    background-color: #3a3a3a !important;
  }
}

[data-theme="dark"] .link-text {
  color: var(--accent, #64b5f6) !important;
  
  &:hover {
    color: #90caf9 !important;
  }
}

[data-theme="dark"] .close-button {
  color: var(--text-primary, #ffffff) !important;
  
  &:hover {
    color: var(--accent, #64b5f6) !important;
  }
}

.mobile-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-card {
  background: white;
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
}

.modal-top-bar {
  position: relative;
  z-index: 1002;
  height: 0;
  flex-shrink: 0;
  
  &.mobile {
    height: 0;
  }
}

.modal-content-scroll {
  flex: 1;
  overflow-y: auto;
  
  /* Fixed header styles for desktop */
  .fixed-header-container {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: white;
    border-bottom: 1px solid #e0e0e0;
  }
}

.mobile-modal {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
}

.close-header {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 1003;
  
  &.mobile {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 1003;
  }
}

.close-button {
  color: #666;
  cursor: pointer;
  font-size: 24px;
  
  &:hover {
    color: #333;
  }
}

.tournament-header {
  text-align: center;
  padding: 20px 24px 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  
  &.mobile {
    padding: 16px 20px 12px;
  }

  .tournament-title {
    font-family: "Poppins";
    font-weight: 600;
    font-size: 20px;
    color: #333;
    margin: 0 0 8px 0;
    

    
    @media (max-width: 960px) {
      font-size: 16px;
      margin: 0 0 6px 0;
    }
  }
  
  .tournament-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    
    &.mobile {
      flex-direction: column;
      gap: 6px;
    }
    
    @media (max-width: 960px) {
      flex-direction: column;
      gap: 6px;
    }
  }

  .tournament-date {
    font-family: "Poppins";
    font-size: 14px;
    color: #666;
    margin: 0;
    
    @media (max-width: 960px) {
      font-size: 12px;
    }
  }
  
  .match-format-info {
    display: flex;
    align-items: center;
    gap: 12px;
    
    &.mobile {
      gap: 8px;
    }
  }
  
  .match-format {
    font-family: "Poppins";
    font-weight: 600;
    font-size: 12px;
    color: #fff;
    background: #007bff;
    padding: 4px 8px;
    border-radius: 12px;
    text-transform: uppercase;
    
    @media (max-width: 960px) {
      font-size: 11px;
      padding: 3px 6px;
    }
  }
  
  .current-score {
    font-family: "Poppins";
    font-weight: 700;
    font-size: 14px;
    color: #333;
    background: #fff;
    padding: 4px 12px;
    border-radius: 6px;
    border: 2px solid #e9ecef;
    
    @media (max-width: 960px) {
      font-size: 12px;
      padding: 3px 8px;
    }
  }
}

.header-with-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.mobile {
    justify-content: center;
  }
}

.date-with-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &.mobile {
    gap: 6px;
  }
}

.game-icon-inline {
  font-size: 18px; /* Same height as text */
  color: #007bff;
  flex-shrink: 0;
  
  &.mobile {
    font-size: 16px;
  }
}

.tournament-text {
  flex: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  &.mobile {
    flex: 1;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}

.teams-horizontal-section {
  padding: 10px 24px;
  background: white;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: center;
  
  &.mobile {
    padding: 16px 20px;
  }
}

.team-lineup {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  max-width: 50%;
  width: fit-content;
  
  &.mobile {
    gap: 16px;
    max-width: 85%;
  }
  
  @media (max-width: 960px) {
    max-width: 90%;
  }
}

.country-flag {
  width: 36px;
  height: 27px;
  border-radius: 3px;
  flex-shrink: 0;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  
  @media (max-width: 960px) {
    width: 28px;
    height: 21px;
    filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.25));
  }
}

.team-logo-medium {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  flex-shrink: 0;
  
  @media (max-width: 960px) {
    width: 30px;
    height: 30px;
    border-radius: 4px;
  }
}

.team-names {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 0 12px;
  
  @media (max-width: 960px) {
    gap: 12px;
    margin: 0 8px;
  }
}

.team-name-text {
  font-family: "Poppins";
  font-weight: 600;
  font-size: 18px;
  color: #333;
  white-space: nowrap;
  

  
  @media (max-width: 960px) {
    font-size: 14px;
  }
}

.vs-icon {
  color: #666;
  font-size: 16px;
  transform: rotate(45deg);
}

.modal-content {
  padding: 20px 24px;
  
  &.mobile {
    padding: 16px 20px;
  }
}

.section-title {
  font-family: "Poppins";
  font-weight: 600;
  font-size: 16px;
  color: #333;
  margin-bottom: 16px;
  
  @media (max-width: 960px) {
    font-size: 14px;
    margin-bottom: 12px;
  }
}

.team-members-section {
  margin-bottom: 32px;
  
  @media (max-width: 960px) {
    margin-bottom: 24px;
  }
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

.team-rosters {
  display: flex;
  gap: 16px;
  
  &.mobile {
    flex-direction: column;
    gap: 20px;
  }
  
  @media (max-width: 960px) {
    flex-direction: column;
    gap: 20px;
  }
}

.roster-column {
  flex: 1;
  padding: 0 12px;
  
  &.mobile {
    padding: 0;
    margin-bottom: 16px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  @media (max-width: 960px) {
    padding: 0;
  }
}

.streams-section {
  margin-bottom: 32px;
  
  @media (max-width: 960px) {
    margin-bottom: 24px;
  }
}

.streams-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stream-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    border-color: #007bff;
  }
  
  &.official {
    border-left: 4px solid #28a745;
  }
  
  &.main {
    border-left: 4px solid #dc3545;
  }
  
  &.official.main {
    border-left: 4px solid #fd7e14;
  }
}

.links-section {
  margin-bottom: 20px;
  
  @media (max-width: 960px) {
    margin-bottom: 16px;
  }
}

.links-subtitle {
  font-family: "Poppins";
  font-size: 12px;
  color: #6c757d;
  font-style: italic;
  margin-bottom: 12px;
  margin-top: -8px;
  
  @media (max-width: 960px) {
    font-size: 11px;
    margin-bottom: 10px;
  }
}

.links-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  &.mobile {
    gap: 6px;
  }
}

.link-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
}

.link-number {
  font-family: "Poppins";
  font-weight: 600;
  font-size: 14px;
  color: #666;
  min-width: 20px;
  
  @media (max-width: 960px) {
    font-size: 12px;
    min-width: 18px;
  }
}

.link-text {
  font-family: "Poppins";
  font-weight: 500;
  font-size: 14px;
  color: #007bff;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    color: #0056b3;
    text-decoration: underline;
  }
  
  .external-link-icon {
    opacity: 0.7;
    transition: opacity 0.2s ease;
  }
  
  &:hover .external-link-icon {
    opacity: 1;
  }
  
  @media (max-width: 960px) {
    font-size: 13px;
  }
  
  &.loading {
    color: #6c757d;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-style: italic;
  }
  
  &.unavailable {
    color: #6c757d;
    font-style: italic;
    cursor: not-allowed;
  }
}

.stream-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stream-icon {
  font-size: 18px;
  color: #6c757d;
  min-width: 20px;
  
  &.fa-twitch {
    color: #9146ff;
  }
  
  &.fa-youtube {
    color: #ff0000;
  }
  
  &.fa-facebook {
    color: #1877f2;
  }
  
  &.fa-instagram {
    color: #e4405f;
  }
  
  &.fa-tiktok {
    color: #000000;
  }
}

.stream-platform {
  font-family: "Poppins";
  font-weight: 600;
  font-size: 14px;
  color: #333;
}

.stream-language {
  font-family: "Poppins";
  font-size: 11px;
  color: #6c757d;
  background: #f8f9fa;
  padding: 2px 6px;
  border-radius: 3px;
  text-transform: uppercase;
}

.stream-badges {
  display: flex;
  gap: 6px;
}

.badge {
  font-family: "Poppins";
  font-size: 10px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 12px;
  text-transform: uppercase;
  
  &.official {
    background: #d1ecf1;
    color: #0c5460;
  }
  
  &.main {
    background: #f8d7da;
    color: #721c24;
  }
}

.links-section {
  margin-top: 24px;
  
  &.mobile {
    margin-top: 20px;
  }
}

.links-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  &.mobile {
    gap: 6px;
  }
}

.link-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  
  &:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }
}

  .liquipedia-icon {
    width: 20px;
    height: 20px;
    margin-right: 8px;
    flex-shrink: 0;
  }

.link-text {
  font-family: "Poppins";
  color: #007bff;
  text-decoration: none;
  font-size: 14px;
  
  &:hover {
    text-decoration: underline;
  }
}

.mobile-modal {
  height: 100vh;
  overflow-y: auto;
  
  /* Custom scrollbar for webkit browsers */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
}

@media (max-width: 960px) {
  .modal-card {
    height: 100vh !important;
    width: 100% !important;
    
    /* Reset fixed header for mobile */
    .fixed-header-container {
      position: relative;
      background: transparent;
      border-bottom: none;
    }
  }
}

/* Custom scrollbar for the modal */
.modal-card::-webkit-scrollbar {
  width: 8px;
}

.modal-card::-webkit-scrollbar-track {
  background: #f8f9fa;
}

.modal-card::-webkit-scrollbar-thumb {
  background: #dee2e6;
  border-radius: 4px;
}

.modal-card::-webkit-scrollbar-thumb:hover {
  background: #adb5bd;
}
</style>

