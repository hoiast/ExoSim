<script setup>
import Button from "primevue/button/sfc";

defineProps({
  starSystemLibrary: Object,
  currentStarSystemName: String,
});
</script>
<template>
  <div>
    <Button
      v-for="(starSystem, key) in starSystemLibrary"
      :key="starSystem.name"
      :label="$t(starSystem.name)"
      :disabled="currentStarSystemName === starSystem.name ? 'disabled' : false"
      class="p-button-outlined"
      v-on:click="$emit('updateStarSystem', key)"
    />
  </div>
</template>
<style scoped></style>
