<script setup>
import InputSwitchWithTitle from "./Shared/InputSwitchWithTitle.vue";
import { ref, watch } from "vue";

const props = defineProps({
  isAdvancedSettingsActive: Boolean,
  isTooltipDisabled: Boolean,
});
let isAdvancedSettingsActive = ref(props.isAdvancedSettingsActive);
watch(props, () => {
  isAdvancedSettingsActive.value = props.isAdvancedSettingsActive;
});
</script>
<template>
  <InputSwitchWithTitle
    v-model="isAdvancedSettingsActive"
    :label="$t('Advanced Mode')"
    :tooltipText="$t('Additional settings options')"
    :isTooltipDisabled="isTooltipDisabled"
    @update:modelValue="
      $emit('update:isAdvancedSettingsActive', isAdvancedSettingsActive)
    "
  />
</template>
<style scoped></style>
