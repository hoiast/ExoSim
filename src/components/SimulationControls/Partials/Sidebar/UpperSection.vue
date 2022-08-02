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
  <div
    class="flex flex-wrap justify-center items-center m-2 space-y-2 sm:space-y-0"
  >
    <div>
      <Button
        :icon="isRunning ? 'pi pi-pause' : 'pi pi-play'"
        @click="$emit('update:isRunning', !isRunning)"
        :class="isRunning ? 'p-button-danger' : 'p-button-success'"
        class="text-sm sm:text-base"
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
        class="ml-4 text-sm sm:text-base"
        v-tooltip.bottom="{
          value: $t('Start brightness measurements'),
          disabled: isTooltipDisabled,
        }"
      />
    </div>
    <div class="flex">
      <CascadeSelect
        class="w-20 ml-4"
        v-model="selectedLocale"
        :options="locales"
        optionLabel="name"
        :optionGroupChildren="[]"
      />
      <a
        href="https://github.com/hoiast/ExoSim"
        target="_blank"
      >
        <Button
          icon="pi pi-github"
          class="p-button-rounded p-button-text ml-4"
          v-tooltip.right="{ value: 'GitHub' }"
        />
      </a>
      <Button
        icon="pi pi-question"
        :class="
          isTooltipDisabled
            ? 'opacity-50 p-button-secondary'
            : 'p-button-success'
        "
        class="p-button-rounded p-button-text ml-4 hidden sm:block"
        v-tooltip.bottom="{
          value: tooltipToggleText,
        }"
        @click="$emit('update:isTooltipDisabled', !isTooltipDisabled)"
      />
    </div>
  </div>
</template>
<style scoped></style>
