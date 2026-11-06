<template>
  <v-app>
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </v-app>
</template>

<script setup>
const { locale } = useI18n();

useHead({
  htmlAttrs: { lang: computed(() => (locale.value === "en" ? "en" : "pt-BR")) },
});
</script>
