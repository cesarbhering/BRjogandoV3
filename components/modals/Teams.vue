<template>
  <div class="teams-vs-container">
    <!-- Team 1 -->
    <div class="team-side left">
      <div class="team-logos">
        <v-img class="country-flag" :src="teamLogoThumb(false, props.opponentsInfo[0].opponent.location)" />
        <v-img class="team-logo" :src="teamLogoThumb(props.opponentsInfo[0].opponent.image_url, false)" />
      </div>
      <div class="team-name-display">{{ props.opponentsInfo[0].opponent.name }}</div>
    </div>

    <!-- VS Separator -->
    <div class="vs-separator">
      <div class="vs-circle">
        <span class="vs-text">VS</span>
      </div>
    </div>

    <!-- Team 2 -->
    <div class="team-side right">
      <div class="team-logos">
        <v-img class="team-logo" :src="teamLogoThumb(props.opponentsInfo[1].opponent.image_url, false)" />
        <v-img class="country-flag" :src="teamLogoThumb(false, props.opponentsInfo[1].opponent.location)" />
      </div>
      <div class="team-name-display">{{ props.opponentsInfo[1].opponent.name }}</div>
    </div>
  </div>
</template>

<script setup>
const { teamLogoThumb } = useLogos();

const props = defineProps({
  opponentsInfo: { type: Array, required: true },
});

</script>

<style lang="scss" scoped>
.teams-vs-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  gap: 40px;
  
  @media (max-width: 960px) {
    gap: 20px;
    padding: 15px 0;
  }
}

.team-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 180px;
  
  @media (max-width: 960px) {
    min-width: 120px;
  }
  
  &.left .team-logos {
    flex-direction: row;
  }
  
  &.right .team-logos {
    flex-direction: row;
  }
}

.team-logos {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
  
  @media (max-width: 960px) {
    gap: 12px;
    margin-bottom: 8px;
  }
}

.team-logo {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  
  @media (max-width: 960px) {
    width: 45px;
    height: 45px;
  }
}

.country-flag {
  width: 40px;
  height: 30px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  @media (max-width: 960px) {
    width: 30px;
    height: 22px;
  }
}

.team-name-display {
  font-family: "Poppins";
  font-weight: bold;
  font-size: 18px;
  color: #2c3e50;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
  
  @media (max-width: 960px) {
    font-size: 16px;
    max-width: 150px;
  }
}

.vs-separator {
  display: flex;
  align-items: center;
  justify-content: center;
}

.vs-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  
  @media (max-width: 960px) {
    width: 40px;
    height: 40px;
  }
}

.vs-text {
  font-family: "Poppins";
  font-weight: bold;
  font-size: 14px;
  color: white;
  
  @media (max-width: 960px) {
    font-size: 12px;
  }
}
</style>