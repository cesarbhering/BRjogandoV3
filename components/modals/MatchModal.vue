<template>
  <!-- DESKTOP -->
  <v-row class="d-flex align-center justify-center" v-if="!mobile">
    <v-card height="90vh" class="w-75 modal-card">
      <!-- Close Button -->
      <v-row class="close-header">
        <v-spacer></v-spacer>
        <v-col cols="auto">
          <v-icon @click="$emit('closeModal')" class="ma-3 close-button">mdi-close</v-icon>
        </v-col>
      </v-row>

      <!-- Tournament Header -->
      <div class="tournament-header">
        <h2 class="tournament-title">{{ matchInfo.league.name }} - {{ matchInfo.serie.name }}</h2>
        <p class="tournament-date">{{ formatDate(matchInfo.begin_at) }}</p>
      </div>

      <!-- Teams VS Section -->
      <div class="teams-vs-section">
        <ModalsTeams :opponents-info="props.matchInfo.opponents" />
      </div>

      <v-card-text class="modal-content">
        <v-row>
          <!-- Left Column - Team Members -->
          <v-col cols="8">
            <div class="section-title">Integrantes do time</div>
            <v-row class="team-members-section">
              <v-progress-circular v-if="!props.matchInfo.rosters" :size="50" color="primary" 
                class="justify-center mx-auto" indeterminate></v-progress-circular>
              <v-col cols="6" v-if="props.matchInfo.rosters">
                <div class="team-column">
                  <ModalsRosters :team-roster="props.matchInfo.rosters[0].players" />
                </div>
              </v-col>
              <v-col cols="6" v-if="props.matchInfo.rosters">
                <div class="team-column">
                  <ModalsRosters :team-roster="props.matchInfo.rosters[1].players" />
                </div>
              </v-col>
            </v-row>
          </v-col>

          <!-- Right Column - Betting Odds -->
          <v-col cols="4">
            <div class="section-title">Betting odds</div>
            <div class="betting-section" v-if="props.matchInfo.supabaseDataForMatch">
              <div class="betting-site">
                <div class="betting-logo-text rivalry">RIVALRY</div>
                <div class="odds">
                  <span>{{ props.matchInfo.supabaseDataForMatch.odds0 || '2.8' }}</span>
                  <span>:</span>
                  <span>{{ props.matchInfo.supabaseDataForMatch.odds1 || '2.8' }}</span>
                </div>
              </div>
              <div class="betting-site">
                <div class="betting-logo-text betway">betway</div>
                <div class="odds">
                  <span>2.8</span>
                  <span>:</span>
                  <span>2.8</span>
                </div>
              </div>
              <div class="betting-site">
                <div class="betting-logo-text ggbet">GGBET</div>
                <div class="odds">
                  <span>2.8</span>
                  <span>:</span>
                  <span>2.8</span>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- Relevant Links Section -->
        <div class="links-section">
          <div class="section-title">Links Relevantes</div>
          <div class="links-list">
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
      </v-card-text>
    </v-card>
  </v-row>

  <!-- MOBILE -->
  <v-card v-if="mobile" class="mobile-modal">
    <v-row class="close-header">
      <v-col class="d-flex justify-end">
        <v-icon @click="$emit('closeModal')" class="ma-2 close-button">mdi-close</v-icon>
      </v-col>
    </v-row>
    
    <!-- Mobile Tournament Header -->
    <div class="tournament-header mobile">
      <h3 class="tournament-title">{{ matchInfo.league.name }}</h3>
      <h4 class="tournament-subtitle">{{ matchInfo.serie.name }}</h4>
      <p class="tournament-date">{{ formatDate(matchInfo.begin_at) }}</p>
    </div>

    <!-- Mobile Teams -->
    <div class="teams-vs-section mobile">
      <ModalsTeams :opponents-info="props.matchInfo.opponents" />
    </div>

    <!-- Mobile Team Members -->
    <v-card-text class="modal-content mobile">
      <div class="section-title">Integrantes do time</div>
      <v-row class="team-members-section mobile">
        <v-progress-circular v-if="!props.matchInfo.rosters" :size="40" color="primary" 
          class="mx-auto" indeterminate></v-progress-circular>
        <v-col cols="6" v-if="props.matchInfo.rosters">
          <ModalsRosters :team-roster="props.matchInfo.rosters[0].players" />
        </v-col>
        <v-col cols="6" v-if="props.matchInfo.rosters">
          <ModalsRosters :team-roster="props.matchInfo.rosters[1].players" />
        </v-col>
      </v-row>
      
      <!-- Mobile Links -->
      <div class="links-section mobile">
        <div class="section-title">Links Relevantes</div>
        <div class="links-list mobile">
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
    </v-card-text>
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
  padding: 0;
  overflow: hidden;
}

.close-header {
  padding: 8px 16px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.close-button {
  cursor: pointer;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.7;
  }
}

.tournament-header {
  text-align: center;
  padding: 20px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  
  &.mobile {
    padding: 16px 20px;
  }

  .tournament-title {
    font-family: "Poppins";
    font-weight: bold;
    font-size: 24px;
    margin-bottom: 8px;
    
    @media (max-width: 960px) {
      font-size: 18px;
      margin-bottom: 4px;
    }
  }

  .tournament-subtitle {
    font-family: "Poppins";
    font-weight: 500;
    font-size: 16px;
    margin-bottom: 8px;
    opacity: 0.9;
  }

  .tournament-date {
    font-family: "Poppins";
    font-size: 16px;
    opacity: 0.8;
    margin: 0;
    
    @media (max-width: 960px) {
      font-size: 14px;
    }
  }
}

.teams-vs-section {
  padding: 20px 24px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  
  &.mobile {
    padding: 16px 20px;
  }
}

.modal-content {
  padding: 24px;
  
  &.mobile {
    padding: 16px 20px;
  }
}

.section-title {
  font-family: "Poppins";
  font-weight: bold;
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #3498db;
  
  @media (max-width: 960px) {
    font-size: 16px;
    margin-bottom: 12px;
  }
}

.team-members-section {
  margin-bottom: 32px;
  
  &.mobile {
    margin-bottom: 24px;
  }
}

.team-column {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  
  @media (max-width: 960px) {
    padding: 12px;
  }
}

.betting-section {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
}

.betting-site {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #e9ecef;
  
  &:last-child {
    border-bottom: none;
  }
}

.betting-logo-text {
  font-family: "Poppins";
  font-weight: bold;
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 4px;
  min-width: 80px;
  text-align: center;
  
  &.rivalry {
    background-color: #ff6b35;
    color: white;
  }
  
  &.betway {
    background-color: #00a859;
    color: white;
  }
  
  &.ggbet {
    background-color: #ff6600;
    color: white;
  }
}

.odds {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: "Poppins";
  font-weight: bold;
  color: #2c3e50;
  
  span {
    min-width: 30px;
    text-align: center;
    
    &:nth-child(2) {
      color: #7f8c8d;
    }
  }
}

.links-section {
  margin-top: 24px;
  
  &.mobile {
    margin-top: 20px;
  }
}

.links-list {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  
  &.mobile {
    padding: 12px;
  }
}

.link-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e9ecef;
  
  &:last-child {
    border-bottom: none;
  }
}

.link-number {
  font-family: "Poppins";
  font-weight: bold;
  color: #3498db;
  margin-right: 12px;
  min-width: 20px;
}

.link-text {
  font-family: "Poppins";
  color: #2980b9;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
}

.mobile-modal {
  height: 100vh;
  overflow-y: auto;
}

// Responsive adjustments
@media (max-width: 960px) {
  .modal-card {
    height: 100vh !important;
    width: 100% !important;
  }
}
</style>

