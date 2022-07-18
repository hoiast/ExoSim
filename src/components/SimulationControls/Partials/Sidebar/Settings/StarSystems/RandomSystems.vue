<script setup>
import Button from "primevue/button/sfc";
import InputNumber from "primevue/inputnumber/sfc";
import { ref } from "vue";
defineProps({
  isTooltipDisabled: Boolean,
});

let randomSeed = ref(null);
const generateRandomNumber = function () {
  randomSeed.value = Math.floor(Math.random() * Math.pow(10, 8));
};

defineExpose({
  generateRandomNumber,
  randomSeed,
});
</script>
<template>
  <div>
    <div class="p-field p-col-12 p-md-4">
      <span
        class="p-float-label my-2 mx-auto align-middle"
        style="width: fit-content"
      >
        <InputNumber
          id="randomSeedInput"
          v-model="randomSeed"
          :useGrouping="false"
          :min="0"
          :max="Math.pow(10, 8)"
          v-tooltip.bottom="{
            value: $t('Remember this number to rebuild the same star system'),
            disabled: isTooltipDisabled,
          }"
        />
        <label for="randomSeedInput">{{ $t("Seed") }}</label>
        <Button
          icon="pi pi-sync"
          class="p-button-rounded ml-2"
          v-on:click="generateRandomNumber"
          v-tooltip.bottom="{
            value: $t('Generate a random seed'),
            disabled: isTooltipDisabled,
          }"
        />
      </span>
    </div>
    <div class="flex flex-col">
      <Button
        type="submit"
        :label="$t('Create Star System')"
        class="p-button-outlined"
        v-on:click="$emit('updateStarSystem', randomSeed)"
        v-tooltip.bottom="{
          value: $t('Use a seed to create a new star system'),
          disabled: isTooltipDisabled,
        }"
      />
    </div>
  </div>
</template>
<style scoped></style>
