<template>
  <div>
    <form>
      <select v-model="locale">
        <option value="pt-br">en</option>
        <option value="en">fr</option>
      </select>
      <p>{{ $t('welcome') }}</p>
    </form>
  </div>
</template>
<script setup>
const { locale } = useI18n()
</script>

<style lang="scss" scoped>

</style>