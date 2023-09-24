<template>
  <div>
    <p class="teste">{{ $t("welcome") }}</p>
    <v-btn>Hello Sass Changes</v-btn>
  </div>
</template>
<script setup>
definePageMeta({
  layout: "teste",
});
</script>

<style lang="scss" scoped>
</style>