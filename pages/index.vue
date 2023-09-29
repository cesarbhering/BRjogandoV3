<template>
  <div>
    <p class="teste">{{ $t("welcome") }}</p>
    <v-btn>{{ list }}</v-btn>
  </div>
</template>
<script setup>
import { useMainStore } from "~/store/main";
import { storeToRefs } from "pinia";
import { useNuxtApp } from "nuxt/app";

const mainStore = useMainStore();
const { list } = storeToRefs(mainStore);
const nuxtApp = useNuxtApp()

let a = ''

definePageMeta({
  layout: "teste",
});

onMounted(async () => {
  a = await $fetch('/.netlify/functions/fetchUpcomingMatches')
  console.log(nuxtApp)
  nuxtApp.$restCall.get('cleiton/mercearia', {coco: 'coco'})
  nuxtApp.$restCall.put('cleiton/mercearia', {coco: 'coco'}, {cleber: 'cleber'})

  nuxtApp.$restCall.patch('cleiton/mercearia', {coco: 'coco'}, {cleber: 'cleber'})
  nuxtApp.$restCall.delete('cleiton/mercearia', {coco: 'coco'}, {cleber: 'cleber'})

})

</script>

<style lang="scss" scoped>
</style>