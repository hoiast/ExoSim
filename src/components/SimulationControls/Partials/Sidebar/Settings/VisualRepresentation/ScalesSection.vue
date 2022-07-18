<script setup>
import Divider from "primevue/divider/sfc";
import InputNumberWithSlider from "../Shared/InputNumberWithSlider.vue";
import { ref, watch } from "vue";

const props = defineProps({
  isAdvancedSettingsActive: Boolean,
  isTooltipDisabled: Boolean,
  starSize: Number,
  planetSize: Number,
  satelliteSize: Number,
  planetDistance: Number,
  satelliteDistance: Number,
});
let starSize = ref(props.starSize);
let planetSize = ref(props.planetSize);
let satelliteSize = ref(props.satelliteSize);
let planetDistance = ref(props.planetDistance);
let satelliteDistance = ref(props.satelliteDistance);
watch(props, () => {
  starSize = props.starSize;
  planetSize = props.planetSize;
  satelliteSize = props.satelliteSize;
  planetDistance = props.planetDistance;
  satelliteDistance = props.satelliteDistance;
});
</script>
<template>
  <div>
    <Divider align="center">
      <span>{{ $t("Size") }}</span>
    </Divider>
    <InputNumberWithSlider
      :inputId="`starSize`"
      :label="$t('Star')"
      :min="1"
      :max="100"
      :step="1"
      :tooltipText="$t('Scale apparent size of the star')"
      v-model="starSize"
      :isTooltipDisabled="isTooltipDisabled"
      v-on:update:modelValue="$emit('update:starSize', starSize)"
    />
    <InputNumberWithSlider
      :inputId="`planetSize`"
      :label="$t('Planets')"
      :min="5"
      :max="2000"
      :step="1"
      :tooltipText="$t('Scale apparent size of planets')"
      v-model="planetSize"
      :isTooltipDisabled="isTooltipDisabled"
      v-on:update:modelValue="$emit('update:planetSize', planetSize)"
    />
    <template v-if="isAdvancedSettingsActive">
      <Divider align="center">
        <span class="p-tag">{{ $t("Advanced Parameters") }}</span>
      </Divider>
      <InputNumberWithSlider
        :inputId="`satelliteSize`"
        :label="$t('Satellites')"
        :min="5"
        :max="2000"
        :step="1"
        :tooltipText="$t('Scale apparent size of satellites')"
        v-model="satelliteSize"
        :isTooltipDisabled="isTooltipDisabled"
        v-on:update:modelValue="$emit('update:satelliteSize', satelliteSize)"
      />

      <Divider align="center">
        <span>{{ $t("Distance") }}</span>
      </Divider>
      <InputNumberWithSlider
        :inputId="`planetDistance`"
        :label="$t('Planets')"
        :min="0.5"
        :max="5"
        :step="0.1"
        :tooltipText="$t('Scale apparent orbit radius of planets')"
        v-model="planetDistance"
        :isTooltipDisabled="isTooltipDisabled"
        v-on:update:modelValue="$emit('update:planetDistance', planetDistance)"
      />
      <InputNumberWithSlider
        :inputId="`satelliteDistance`"
        :label="$t('Satellites')"
        :min="25"
        :max="250"
        :step="1"
        :tooltipText="$t('Scale apparent orbit radius of satellites')"
        v-model="satelliteDistance"
        :isTooltipDisabled="isTooltipDisabled"
        v-on:update:modelValue="
          $emit('update:satelliteDistance', satelliteDistance)
        "
      />
    </template>
  </div>
</template>
<style scoped></style>
