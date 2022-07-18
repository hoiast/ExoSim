<script setup>
import Divider from "primevue/divider/sfc";
import InputSwitchWithTitle from "./Shared/InputSwitchWithTitle.vue";
import InputNumberWithSlider from "./Shared/InputNumberWithSlider.vue";
import { ref, watch } from "vue";

const props = defineProps({
  isAdvancedSettingsActive: Boolean,
  isTooltipDisabled: Boolean,
  simulationSpeed: Number,
  simulationStep: Number,
  areOrbitsTilted: Boolean,
  isRotationEnabled: Boolean,
});
let simulationSpeed = ref(props.simulationSpeed);
let simulationStep = ref(props.simulationStep);
let areOrbitsTilted = ref(props.areOrbitsTilted);
let isRotationEnabled = ref(props.isRotationEnabled);
watch(props, () => {
  simulationSpeed.value = props.simulationSpeed;
  simulationStep.value = props.simulationStep;
  areOrbitsTilted.value = props.areOrbitsTilted;
  isRotationEnabled.value = props.isRotationEnabled;
});
</script>
<template>
  <div>
    <InputNumberWithSlider
      :inputId="`simulationSpeed`"
      :label="$t('Simulation Speed')"
      :min="1"
      :max="100"
      :step="1"
      :tooltipText="
        $t(
          'Define how many simulations steps are performed for each new frame. Larger numbers speed up the simulation, but may degrade computational performance'
        )
      "
      v-model="simulationSpeed"
      :isTooltipDisabled="isTooltipDisabled"
      v-on:update:modelValue="$emit('update:simulationSpeed', simulationSpeed)"
    />

    <template v-if="isAdvancedSettingsActive">
      <Divider align="center">
        <span class="p-tag">{{ $t("Advanced Parameters") }}</span>
      </Divider>
      <InputNumberWithSlider
        :inputId="`simulationStep`"
        :label="$t('Simulation Step (earth days)')"
        :min="0.005"
        :max="0.1"
        :step="0.005"
        :tooltipText="
          $t(
            'Define the size of simulation (integration) steps used by the motion equations integrator. Larger numbers speed up the simulation without degrading computational performance, but also end up accumulating more errors at every new simulation step'
          )
        "
        v-model="simulationStep"
        :isTooltipDisabled="isTooltipDisabled"
        v-on:update:modelValue="$emit('update:simulationStep', simulationStep)"
      />

      <InputSwitchWithTitle
        :class="'mt-12'"
        v-model="areOrbitsTilted"
        :label="$t('Orbital Inclination')"
        :tooltipText="
          $t(
            'Define if orbital inclination of planets and satellites is applied'
          )
        "
        :isTooltipDisabled="isTooltipDisabled"
        v-on:update:modelValue="
          $emit('update:areOrbitsTilted', areOrbitsTilted)
        "
      />
      <InputSwitchWithTitle
        v-model="isRotationEnabled"
        :label="$t('Rotation')"
        :tooltipText="
          $t(
            'Define if celestial bodies rotate around their own axis of rotation. This simulation ignores rotation obliquity'
          )
        "
        :isTooltipDisabled="isTooltipDisabled"
        v-on:update:modelValue="
          $emit('update:isRotationEnabled', isRotationEnabled)
        "
      />
    </template>
  </div>
</template>
<style scoped></style>
