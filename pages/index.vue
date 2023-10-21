<template>
  <primeiraPagina/>
  <div>
    <p class="teste">{{ $t("welcome") }}</p>
    <v-btn>{{ list }}</v-btn>
  </div>
</template>
<script setup>
import { useMainStore } from "~/store/main";
import { storeToRefs } from "pinia";
import primeiraPagina from "../layouts/primeiraPagina.vue"

const mainStore = useMainStore();
const { list } = storeToRefs(mainStore);

definePageMeta({
  layout: "teste",
});
</script>

<style lang="scss" scoped>
</style>