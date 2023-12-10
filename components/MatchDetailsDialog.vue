<template>
    <v-dialog
      :model-value="modelValue"
      width="auto"
    >
      <v-card>
        <v-card-text>
          Odds 1XBET
         {{ matchInfo.odds?.odds1xBet }}
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="dialog = false">Close Dialog</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
<script>
export default {
  name: "MatchDetailsDialog",
};
</script>
<script setup>
const props = defineProps({ modelValue: Boolean, matchInfo: { type: Object, required: true } });
</script>