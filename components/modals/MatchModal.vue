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
          <v-img class="country-flag" :src="teamLogoThumb(false, props.matchInfo.opponents[0].opponent.location)" />
          
          <!-- Team 1 Logo -->
          <v-img class="team-logo-small" :src="teamLogoThumb(props.matchInfo.opponents[0].opponent.image_url, false)" />
          
          <!-- Team Names -->
          <div class="team-names">
            <span class="team-name-text">{{ props.matchInfo.opponents[0].opponent.name }}</span>
            <v-icon class="vs-icon">mdi-close</v-icon>
            <span class="team-name-text">{{ props.matchInfo.opponents[1].opponent.name }}</span>
          </div>
          
          <!-- Team 2 Logo -->
          <v-img class="team-logo-small" :src="teamLogoThumb(props.matchInfo.opponents[1].opponent.image_url, false)" />
          
          <!-- Team 2 Flag -->
          <v-img class="country-flag" :src="teamLogoThumb(false, props.matchInfo.opponents[1].opponent.location)" />
        </div>
      </div>

      <!-- Main Content -->
      <div class="modal-content">
        <v-row class="main-row">
          <!-- Left Column - Team Members -->
          <v-col cols="8" class="team-members-col">
            <h3 class="section-title">Integrantes do time</h3>
            
            <div v-if="!props.matchInfo.rosters" class="loading-container">
              <v-progress-circular :size="40" color="primary" indeterminate></v-progress-circular>
            </div>
            
            <v-row v-if="props.matchInfo.rosters" class="team-rosters">
              <v-col cols="6" class="roster-col">
                <ModalsRosters :team-roster="props.matchInfo.rosters[0].players" />
              </v-col>
              <v-col cols="6" class="roster-col">
                <ModalsRosters :team-roster="props.matchInfo.rosters[1].players" />
              </v-col>
            </v-row>
          </v-col>

          <!-- Right Column - Betting Odds -->
          <v-col cols="4" class="betting-col">
            <h3 class="section-title">Betting odds</h3>
            <div class="betting-odds-container">
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
          </v-col>
        </v-row>

        <!-- Links Section -->
        <div class="links-section">
          <h3 class="section-title">Links Relevantes</h3>
          <div class="links-container">
            <div class="link-item">
              <span class="link-number">1.</span>
              <a href="#" class="link-text">Stream - Twitch</a>
            </div>
            <div class="link-item">
              <span class="link-number">2.</span>
              <a href="#" class="link-text">Página do torneio - Liquipedia</a>
            </div>
            <div class="link-item">
              <span class="link-number">3.</span>
              <a href="#" class="link-text">Página do time | {{ props.matchInfo.opponents[0]?.opponent?.name }} - Liquipedia</a>
            </div>
            <div class="link-item">
              <span class="link-number">4.</span>
              <a href="#" class="link-text">Página do time | {{ props.matchInfo.opponents[1]?.opponent?.name }} - Liquipedia</a>
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
        <v-img class="country-flag" :src="teamLogoThumb(false, props.matchInfo.opponents[0].opponent.location)" />
        <span class="team-name-text">{{ props.matchInfo.opponents[0].opponent.name }}</span>
        <v-icon class="vs-icon">mdi-close</v-icon>
        <span class="team-name-text">{{ props.matchInfo.opponents[1].opponent.name }}</span>
        <v-img class="country-flag" :src="teamLogoThumb(false, props.matchInfo.opponents[1].opponent.location)" />
      </div>
    </div>

    <div class="modal-content mobile">
      <h3 class="section-title">Integrantes do time</h3>
      <v-row v-if="props.matchInfo.rosters" class="team-rosters mobile">
        <v-col cols="6">
          <ModalsRosters :team-roster="props.matchInfo.rosters[0].players" />
        </v-col>
        <v-col cols="6">
          <ModalsRosters :team-roster="props.matchInfo.rosters[1].players" />
        </v-col>
      </v-row>
      
      <div class="links-section mobile">
        <h3 class="section-title">Links Relevantes</h3>
        <div class="links-container mobile">
          <div class="link-item">
            <span class="link-number">1.</span>
            <a href="#" class="link-text">Stream - Twitch</a>
          </div>
          <div class="link-item">
            <span class="link-number">2.</span>
            <a href="#" class="link-text">Página do torneio</a>
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

const gamesStore = useGamesStore();

const teamNames = [
  props.matchInfo.opponents[0].opponent.name,
  props.matchInfo.opponents[1].opponent.name,
];

onBeforeMount(async () => {
  await gamesStore.fetchSupabaseDataForMatch(
    props.matchInfo.id,
    props.matchOccurrence,
    props.matchInfo.serie_id,
    teamNames
  );
  await gamesStore.fetchGameRosters(props.matchInfo, props.matchOccurrence);
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
  overflow: hidden;
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
  padding: 20px 24px;
  background: white;
  border-bottom: 1px solid #e9ecef;
  
  &.mobile {
    padding: 16px 20px;
  }
}

.team-lineup {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  
  &.mobile {
    gap: 12px;
  }
}

.country-flag {
  width: 32px;
  height: 24px;
  border-radius: 2px;
  flex-shrink: 0;
  
  @media (max-width: 960px) {
    width: 24px;
    height: 18px;
  }
}

.team-logo-small {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  flex-shrink: 0;
  
  @media (max-width: 960px) {
    width: 24px;
    height: 24px;
  }
}

.team-names {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 8px;
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

.main-row {
  margin-bottom: 24px;
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

.team-members-col {
  padding-right: 16px;
  
  @media (max-width: 960px) {
    padding-right: 0;
  }
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

.team-rosters {
  gap: 16px;
  
  &.mobile {
    gap: 12px;
  }
}

.roster-col {
  padding: 0 8px;
}

.betting-col {
  padding-left: 16px;
  
  @media (max-width: 960px) {
    padding-left: 0;
    margin-top: 20px;
  }
}

.betting-odds-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.betting-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  background: white;
  
  &.rivalry-card {
    border-left: 4px solid #ff6b35;
  }
  
  &.betway-card {
    border-left: 4px solid #00a859;
  }
  
  &.ggbet-card {
    border-left: 4px solid #ff6600;
  }
}

.betting-brand {
  font-family: "Poppins";
  font-weight: 600;
  font-size: 14px;
  color: #333;
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
}

@media (max-width: 960px) {
  .modal-card {
    height: 100vh !important;
    width: 100% !important;
  }
  
  .main-row {
    flex-direction: column;
  }
  
  .betting-col {
    order: -1;
  }
}
</style>

