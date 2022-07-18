<script setup>
import Button from "primevue/button/sfc";
import CascadeSelect from "primevue/cascadeselect/sfc";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();
const props = defineProps({
  isRunning: Boolean,
  isMeasuringBrightness: Boolean,
  isTooltipDisabled: Boolean,
});

const tooltipToggleText = computed(() => {
  if (props.isTooltipDisabled) {
    return t("Enable interface hints");
  } else {
    return t("Disable interface hints");
  }
});
const locales = ref([
  { name: "en", code: "en" },
  { name: "pt", code: "pt-BR" },
]);
let selectedLocale = ref(
  locales.value.filter(
    (localElement) => localElement.code === locale.value
  )[0] ?? { name: "en", code: "en" }
);

watch(selectedLocale, () => {
  locale.value = selectedLocale.value.code;
});
</script>

<template>
  <div class="flex justify-center items-center my-2">
    <Button
      :icon="isRunning ? 'pi pi-pause' : 'pi pi-play'"
      v-on:click="$emit('update:isRunning', !isRunning)"
      :class="isRunning ? 'p-button-danger' : 'p-button-success'"
      v-tooltip.right="{
        value: $t('Pause / Play'),
        disabled: isTooltipDisabled,
      }"
    />
    <Button
      :label="
        isMeasuringBrightness
          ? $t('Close Brightness Detector')
          : $t('Open Brightness Detector')
      "
      :icon="isMeasuringBrightness ? 'pi pi-times' : 'pi pi-external-link'"
      :class="isMeasuringBrightness ? 'p-button-danger' : ''"
      @click="$emit('update:isMeasuringBrightness', !isMeasuringBrightness)"
      class="ml-4"
      v-tooltip.bottom="{
        value: $t('Start brightness measurements'),
        disabled: isTooltipDisabled,
      }"
    />
    <Button
      icon="pi pi-question"
      :class="
        isTooltipDisabled ? 'opacity-50 p-button-secondary' : 'p-button-success'
      "
      class="p-button-rounded p-button-text ml-4"
      v-tooltip.bottom="{
        value: tooltipToggleText,
      }"
      @click="$emit('update:isTooltipDisabled', !isTooltipDisabled)"
    />

    <CascadeSelect
      class="w-20 ml-4"
      v-model="selectedLocale"
      :options="locales"
      optionLabel="name"
      :optionGroupChildren="[]"
    />
    <a href="https://github.com/hoiast/transit-method" target="_blank">
      <Button
        icon="pi pi-github"
        class="p-button-rounded p-button-text ml-4"
        v-tooltip.right="{ value: 'GitHub' }"
      />
    </a>
  </div>
</template>
<style scoped></style>
