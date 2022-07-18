<script setup>
import { onMounted, ref } from "vue";
import SimulationControls from "@/components/SimulationControls/Index.vue";

let mounted = ref(false);
onMounted(() => {
  mounted.value = true;
});
</script>

<template>
  <main>
    <SimulationControls v-if="mounted" />
    <div id="canvasContainer">
      <canvas id="backgroundCanvas"></canvas>
      <canvas id="mainCanvas"></canvas>
    </div>
  </main>
</template>

<style>
@import "./assets/tailwind-base.css"; /*Tailwind reset and default styles*/
@import "primevue/resources/themes/arya-orange/theme.css"; /*Arya Orange Theme for Primevue*/
@import "primevue/resources/primevue.min.css"; /*Primevue core*/
@import "primeicons/primeicons.css"; /*Primeicons*/
@import "./assets/tailwind-components-utilities.css"; /*Tailwind components and utilities*/
@import "./assets/app.css"; /*Custom CSS*/
</style>
<style scoped>
main {
  width: 100vw;
  height: 100vh;
}

#canvasContainer {
  width: 100%;
  height: 100%;
  position: absolute;
}

#mainCanvas {
  width: 100%;
  height: 100%;
  position: relative;
}

#backgroundCanvas {
  width: 100%;
  height: 100%;
  background-color: black;
  position: absolute;
}
</style>
