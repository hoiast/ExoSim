<script setup>
import Divider from "primevue/divider/sfc";
import InputSwitchWithTitle from "../Shared/InputSwitchWithTitle.vue";
import { ref, watch } from "vue";
const props = defineProps({
  isAdvancedSettingsActive: Boolean,
  isTooltipDisabled: Boolean,
  areOrbitsVisible: Boolean,
  isStarVisible: Boolean,
  arePlanetsVisible: Boolean,
  areSatellitesVisible: Boolean,
});
let areOrbitsVisible = ref(props.areOrbitsVisible);
let isStarVisible = ref(props.isStarVisible);
let arePlanetsVisible = ref(props.arePlanetsVisible);
let areSatellitesVisible = ref(props.areSatellitesVisible);
watch(props, () => {
  areOrbitsVisible.value = props.areOrbitsVisible;
  isStarVisible.value = props.isStarVisible;
  arePlanetsVisible.value = props.arePlanetsVisible;
  areSatellitesVisible.value = props.areSatellitesVisible;
});
</script>
<template>
  <div>
    <InputSwitchWithTitle
      v-model="areOrbitsVisible"
      :label="$t('Orbits')"
      :tooltipText="$t('Hide / Show orbit lines')"
      :isTooltipDisabled="isTooltipDisabled"
      v-on:update:modelValue="
        $emit('update:areOrbitsVisible', areOrbitsVisible)
      "
    />
    <Divider align="center">
      <span>{{ $t("Celestial Bodies") }}</span>
    </Divider>
    <InputSwitchWithTitle
      v-model="isStarVisible"
      :label="$t('Star')"
      :tooltipText="$t('Hide / Show star')"
      :isTooltipDisabled="isTooltipDisabled"
      v-on:update:modelValue="$emit('update:isStarVisible', isStarVisible)"
    />
    <InputSwitchWithTitle
      v-model="arePlanetsVisible"
      :label="$t('Planets')"
      :tooltipText="$t('Hide / Show planets')"
      :isTooltipDisabled="isTooltipDisabled"
      v-on:update:modelValue="
        $emit('update:arePlanetsVisible', arePlanetsVisible)
      "
    />
    <template v-if="isAdvancedSettingsActive">
      <Divider align="center">
        <span class="p-tag">{{ $t("Advanced Parameters") }}</span>
      </Divider>
      <InputSwitchWithTitle
        v-model="areSatellitesVisible"
        :label="$t('Satellites')"
        :tooltipText="$t('Hide / Show satellites')"
        :isTooltipDisabled="isTooltipDisabled"
        v-on:update:modelValue="
          $emit('update:areSatellitesVisible', areSatellitesVisible)
        "
      />
    </template>
  </div>
</template>
<style scoped></style>
