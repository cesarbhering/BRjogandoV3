<template>
  <!-- DESKTOP -->
  <v-row class="d-flex align-center justify-center" v-if="!mobile">
    <v-card height="90vh" width="800px" class="modal-card">
      <!-- Close Button -->
      <div class="close-header">
        <v-icon @click="$emit('closeModal')" class="close-button">mdi-close</v-icon>
      </div>

      <!-- Tournament Header -->
      <div class="tournament-header">
        <h2 class="tournament-title">{{ matchInfo.league.name }} - {{ matchInfo.serie.name }}</h2>
        <p class="tournament-date">{{ formatDate(matchInfo.begin_at) }}</p>
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
              <ModalsRosters :team-roster="props.matchInfo.rosters[0].players" />
            </div>
            
            <!-- Team 2 Roster (Right) -->
            <div class="roster-column">
              <ModalsRosters :team-roster="props.matchInfo.rosters[1].players" />
            </div>
          </div>
        </div>

        <!-- Betting Odds Section -->
        <div class="betting-section">
          <h3 class="section-title">Betting odds</h3>
          <div class="betting-odds-container horizontal">
            <div class="betting-card rivalry-card">
              <div class="betting-brand">RIVALRY</div>
              <div class="odds-display">
                <span class="odd">{{ props.matchInfo.supabaseDataForMatch?.odds0 || '2.8' }}</span>
                <span class="separator">:</span>
                <span class="odd">{{ props.matchInfo.supabaseDataForMatch?.odds1 || '2.8' }}</span>
              </div>
            </div>
            
            <div class="betting-card betway-card">
              <div class="betting-brand">betway</div>
              <div class="odds-display">
                <span class="odd">2.8</span>
                <span class="separator">:</span>
                <span class="odd">2.8</span>
              </div>
            </div>
            
            <div class="betting-card ggbet-card">
              <div class="betting-brand">GGBET</div>
              <div class="odds-display">
                <span class="odd">2.8</span>
                <span class="separator">:</span>
                <span class="odd">2.8</span>
              </div>
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
          <div class="links-container">
            <div class="link-item">
              <span class="link-number">1.</span>
              <a href="#" class="link-text">Página do torneio - Liquipedia</a>
            </div>
            <div class="link-item">
              <span class="link-number">2.</span>
              <a href="#" class="link-text">Página do time | {{ teamNames[0] }} - Liquipedia</a>
            </div>
            <div class="link-item">
              <span class="link-number">3.</span>
              <a href="#" class="link-text">Página do time | {{ teamNames[1] }} - Liquipedia</a>
            </div>
          </div>
        </div>
      </div>
    </v-card>
  </v-row>

  <!-- MOBILE -->
  <v-card v-if="mobile" class="mobile-modal">
    <div class="close-header mobile">
      <v-icon @click="$emit('closeModal')" class="close-button">mdi-close</v-icon>
    </div>
    
    <div class="tournament-header mobile">
      <h3 class="tournament-title">{{ matchInfo.league.name }}</h3>
      <p class="tournament-date">{{ formatDate(matchInfo.begin_at) }}</p>
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
          <ModalsRosters :team-roster="props.matchInfo.rosters[0].players" />
        </div>
        
        <!-- Team 2 Roster (Mobile) -->
        <div class="roster-column mobile">
          <ModalsRosters :team-roster="props.matchInfo.rosters[1].players" />
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
        <div class="links-container mobile">
          <div class="link-item">
            <span class="link-number">1.</span>
            <a href="#" class="link-text">Página do torneio</a>
          </div>
          <div class="link-item">
            <span class="link-number">2.</span>
            <a href="#" class="link-text">Página do time</a>
          </div>
        </div>
      </div>
    </div>
  </v-card>
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

const availableStreams = computed(() => {
  if (!props.matchInfo?.streams_list || !Array.isArray(props.matchInfo.streams_list)) {
    return [];
  }
  return props.matchInfo.streams_list.filter(stream => stream.raw_url);
});

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

onBeforeMount(async () => {
  try {
    if (props.matchInfo?.opponents && props.matchInfo.opponents.length >= 2) {
      await gamesStore.fetchSupabaseDataForMatch(
        props.matchOccurrence,
        props.matchInfo.serie_id,
        teamNames.value
      );
      await gamesStore.fetchGameRosters(props.matchInfo, props.matchOccurrence);
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
.modal-card {
  overflow-y: auto;
  background: white;
  position: relative;
}

.close-header {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  
  &.mobile {
    top: 8px;
    right: 8px;
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
    margin: 0 0 4px 0;
    
    @media (max-width: 960px) {
      font-size: 16px;
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

.betting-section {
  margin-bottom: 32px;
  
  @media (max-width: 960px) {
    margin-bottom: 24px;
  }
}

.betting-odds-container {
  display: flex;
  gap: 16px;
  
  &.horizontal {
    flex-direction: row;
    justify-content: space-between;
    
    @media (max-width: 960px) {
      flex-direction: column;
      gap: 12px;
    }
  }
  
  @media (max-width: 960px) {
    flex-direction: column;
    gap: 12px;
  }
}

.betting-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 12px;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  background: white;
  min-width: 120px;
  flex: 1;
  
  &.rivalry-card {
    border-top: 4px solid #ff6b35;
  }
  
  &.betway-card {
    border-top: 4px solid #00a859;
  }
  
  &.ggbet-card {
    border-top: 4px solid #ff6600;
  }
  
  @media (max-width: 960px) {
    flex-direction: row;
    justify-content: space-between;
    padding: 12px 16px;
    
    &.rivalry-card,
    &.betway-card,
    &.ggbet-card {
      border-top: none;
      border-left: 4px solid;
    }
    
    &.rivalry-card {
      border-left-color: #ff6b35;
    }
    
    &.betway-card {
      border-left-color: #00a859;
    }
    
    &.ggbet-card {
      border-left-color: #ff6600;
    }
  }
}

.betting-brand {
  font-family: "Poppins";
  font-weight: 600;
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  
  @media (max-width: 960px) {
    margin-bottom: 0;
  }
}

.odds-display {
  display: flex;
  align-items: center;
  gap: 8px;
}

.odd {
  font-family: "Poppins";
  font-weight: 600;
  font-size: 14px;
  color: #333;
  min-width: 24px;
  text-align: center;
}

.separator {
  font-family: "Poppins";
  font-size: 14px;
  color: #666;
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

.link-number {
  font-family: "Poppins";
  font-weight: 600;
  color: #007bff;
  margin-right: 8px;
  min-width: 16px;
  font-size: 14px;
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

