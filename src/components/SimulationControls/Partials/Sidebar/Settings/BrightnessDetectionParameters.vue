<script setup>
import InputNumberWithSlider from "./Shared/InputNumberWithSlider.vue";
import { ref, watch } from "vue";
const props = defineProps({
  plotSizeLimit: Number,
  pointsPerSecond: Number,
  isTooltipDisabled: Boolean,
});

let plotSizeLimit = ref(props.plotSizeLimit);
let pointsPerSecond = ref(props.pointsPerSecond);
watch(props, () => {
  plotSizeLimit = props.plotSizeLimit;
  pointsPerSecond = props.pointsPerSecond;
});
</script>
<template>
  <div>
    <InputNumberWithSlider
      :inputId="`plotSizeLimit`"
      :label="$t('Max number of points per plot')"
      :min="250"
      :max="1000"
      :step="1"
      :tooltipText="
        $t(
          'Define the maximum number of points which plots for real-time measurements or collected data may hold. Larger numbers produce more informative plots, but may degrade computational performance'
        )
      "
      v-model="plotSizeLimit"
      :isTooltipDisabled="isTooltipDisabled"
      @update:modelValue="$emit('update:plotSizeLimit', plotSizeLimit)"
    />
    <InputNumberWithSlider
      :inputId="`pointsPerSecond`"
      :label="$t('Measured points per second')"
      :min="1"
      :max="10"
      :step="1"
      :tooltipText="
        $t(
          'Define how many brightness points are measured per second. Larger number increase the temporal resolution of light curves, but may degrade computational performance'
        )
      "
      v-model="pointsPerSecond"
      :isTooltipDisabled="isTooltipDisabled"
      @update:modelValue="$emit('update:pointsPerSecond', pointsPerSecond)"
    />
  </div>
</template>
