<script setup>
import Accordion from "primevue/accordion/sfc";
import AccordionTab from "primevue/accordiontab/sfc";
import Button from "primevue/button/sfc";
import CascadeSelect from "primevue/cascadeselect/sfc";
import Divider from "primevue/divider/sfc";
import InputText from "primevue/inputtext/sfc";
import { useToast } from "primevue/usetoast";
import InputNumberWithSlider from "../Shared/InputNumberWithSlider.vue";
import { StarSystem, Planet } from "@/js/starSystemHelper";
import { onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

defineProps({
  isTooltipDisabled: Boolean,
  isAdvancedSettingsActive: Boolean,
});
const emits = defineEmits(["updateStarSystem"]);
const toast = useToast();
const document = window.document;

let customStarSystem = reactive({
  starMass: 1.5 * Math.pow(10, 30),
  starColorList: [
    { name: "White", code: 0xffffff },
    { name: "Yellow", code: 0xffff00 },
    { name: "Blue", code: 0x559999 },
    { name: "Orange", code: 0xff6339 },
    { name: "Red", code: 0xff0000 },
  ],
  JSONCode: "",
  starColor: { name: "White", code: 0xffffff },
  starRadius: 2,
  planetNumber: 1,
  planetDetails: [
    new Planet("Planet 1", 0.02, 200, 0.0, 0, 0, 0x0000ff),
    new Planet("Planet 2", 0.02, 400, 0.0, 0, 0, 0x0000ff),
    new Planet("Planet 3", 0.02, 600, 0.0, 0, 0, 0x0000ff),
    new Planet("Planet 4", 0.02, 800, 0.0, 0, 0, 0x0000ff),
    new Planet("Planet 5", 0.02, 1000, 0.0, 0, 0, 0x0000ff),
  ],
});

const UIToJSONCode = function () {
  let starSystemConfig = new StarSystem("Custom");
  //prettier-ignore
  starSystemConfig.setStar('Custom Star', customStarSystem.starMass, customStarSystem.starRadius, customStarSystem.starColor.code)
  let planetName = "a";
  for (var p = 0; p < customStarSystem.planetNumber; p++) {
    //prettier-ignore
    planetName = String.fromCharCode(planetName.charCodeAt(planetName.length - 1) + 1);
    starSystemConfig.addPlanet(
      planetName,
      customStarSystem.planetDetails[p].radius,
      customStarSystem.planetDetails[p].semiMajor,
      customStarSystem.planetDetails[p].eccentricity,
      customStarSystem.planetDetails[p].longitudePerihelion,
      customStarSystem.planetDetails[p].orbitInclination,
      0xffffff
    );
  }

  //   starSystemConfig.calculateCameraSettings();
  starSystemConfig.setCameraSettings(
    { x: 0, y: 0, z: 2000 * 7 },
    2000 * 6,
    20,
    2,
    0.1,
    50000
  );
  //   starSystemConfig.calculateScales();
  starSystemConfig.setScales(30, 300, 300, 1, 50, 3500);

  customStarSystem.JSONCode = JSON.stringify(starSystemConfig);
};

const JSONCodeToUI = function () {
  let starSystemConfig = JSON.parse(customStarSystem.JSONCode);
  customStarSystem.starMass = starSystemConfig.star.mass;
  customStarSystem.starRadius = starSystemConfig.star.radius;
  customStarSystem.starColor = customStarSystem.starColorList.filter((obj) => {
    return obj.code === starSystemConfig.star.color;
  })[0];
  customStarSystem.planetNumber = starSystemConfig.planets.length;
  starSystemConfig.planets.forEach((planet) => {
    customStarSystem.planetDetails.push(
      new Planet(
        planet.name,
        planet.radius,
        planet.semiMajor,
        planet.eccentricity,
        planet.longitudePerihelion,
        planet.orbitInclination,
        planet.color
      )
    );
  });
};

const setCodeAndSystem = function () {
  UIToJSONCode();
  emits("updateStarSystem", customStarSystem.JSONCode);
};

const setUIAndSystem = function () {
  JSONCodeToUI();
  emits("updateStarSystem", customStarSystem.JSONCode);
};

let toastSummary = ref("");
let toastDetail = ref("");
const clipBoardCustomJSONCode = function () {
  /* Get the text field */
  var copyText = document.getElementById("customJSON");

  /* Select the text field */
  copyText.select();
  // copyText.setSelectionRange(0, 9999999); /* For mobile devices */

  /* Copy the text inside the text field */
  navigator.clipboard.writeText(copyText.value);

  /* Alert the copied text */
  toast.add({
    severity: "success",
    summary: toastSummary,
    detail: toastDetail,
    life: 3000,
  });
};

const translateStarColorSelectLabel = function () {
  document.querySelector(
    "#customStarColorSelect .p-cascadeselect-label"
  ).innerText = t(customStarSystem.starColor.name);
};
const translateToastMessage = function () {
  toastSummary = t("Success");
  toastDetail = t("Code copied to clipboard");
};
onMounted(() => {
  translateToastMessage();
  translateStarColorSelectLabel();
});
</script>
<template>
  <div>
    <div
      class="flex justify-center mt-4"
      v-tooltip.bottom="{
        value: $t('Select a star color'),
        disabled: isTooltipDisabled,
      }"
    >
      <span class="p-float-label">
        <CascadeSelect
          id="customStarColorSelect"
          v-model="customStarSystem.starColor"
          :options="customStarSystem.starColorList"
          optionLabel="name"
          optionGroupLabel="name"
          :optionGroupChildren="[]"
          style="minwidth: 14rem; width: fit-content"
          v-on:change="
            () => {
              setCodeAndSystem();
              translateStarColorSelectLabel();
            }
          "
        >
          <template #option="slotProps">
            <span>{{ $t(slotProps.option.name) }}</span>
          </template>
        </CascadeSelect>
        <label for="customStarColorSelect">{{ $t("Star Color") }}</label>
      </span>
    </div>
    <InputNumberWithSlider
      :inputId="`customStarRadiusInput`"
      :label="$t('Star Radius')"
      :min="2"
      :max="5"
      :step="0.1"
      :tooltipText="$t('Define a star radius')"
      v-model="customStarSystem.starRadius"
      :isTooltipDisabled="isTooltipDisabled"
      v-on:update:modelValue="setCodeAndSystem"
    />
    <InputNumberWithSlider
      :inputId="`customPlanetNumberInput`"
      :label="$t('Number of planets')"
      :min="1"
      :max="5"
      :step="1"
      :tooltipText="$t('Define how many planets compose the star system')"
      v-model="customStarSystem.planetNumber"
      :isTooltipDisabled="isTooltipDisabled"
      v-on:update:modelValue="setCodeAndSystem"
    />

    <Accordion>
      <AccordionTab
        :header="`${$t('Planet')} ${index}`"
        v-for="index in customStarSystem.planetNumber"
        :key="index"
      >
        <InputNumberWithSlider
          :inputId="`customPlanetRadiusInput${index}`"
          :label="$t('Planet Radius')"
          :min="0.01"
          :max="1"
          :step="0.01"
          :tooltipText="$t('Define planet radius')"
          v-model="customStarSystem.planetDetails[index - 1].radius"
          :isTooltipDisabled="isTooltipDisabled"
          v-on:update:modelValue="setCodeAndSystem"
        />
        <InputNumberWithSlider
          :inputId="`customPlanetSemiMajorInput${index}`"
          :label="$t('Orbit semi-major axis')"
          :min="200"
          :max="2000"
          :step="1"
          :tooltipText="$t('Define the planet orbit radius')"
          v-model="customStarSystem.planetDetails[index - 1].semiMajor"
          :isTooltipDisabled="isTooltipDisabled"
          v-on:update:modelValue="setCodeAndSystem"
        />
        <template v-if="isAdvancedSettingsActive">
          <Divider align="center">
            <span class="p-tag">{{ $t("Advanced Parameters") }}</span>
          </Divider>
          <InputNumberWithSlider
            :inputId="`customPlanetEccentricityInput${index}`"
            :label="$t('Orbit Eccentricity')"
            :min="0"
            :max="0.75"
            :step="0.01"
            :tooltipText="$t('Define the planet orbit eccentricity')"
            v-model="customStarSystem.planetDetails[index - 1].eccentricity"
            :isTooltipDisabled="isTooltipDisabled"
            v-on:update:modelValue="setCodeAndSystem"
          />
          <InputNumberWithSlider
            :inputId="`customPlanetPerihelionLongitudeInput${index}`"
            :label="$t('Orbit Perihelion Longitude')"
            :min="0"
            :max="180"
            :step="1"
            :tooltipText="
              $t(
                'Define the perihelion longitude of the planet orbit. It changes the relative orientation between planet orbits'
              )
            "
            v-model="
              customStarSystem.planetDetails[index - 1].longitudePerihelion
            "
            :isTooltipDisabled="isTooltipDisabled"
            v-on:update:modelValue="setCodeAndSystem"
          />
          <InputNumberWithSlider
            :inputId="`customPlanetOrbitInclinationInput${index}`"
            :label="$t('Orbit Inclination')"
            :min="0"
            :max="90"
            :step="1"
            :tooltipText="
              $t(
                'Define the planet orbit inclination relative to plane of reference of the star system'
              )
            "
            v-model="customStarSystem.planetDetails[index - 1].orbitInclination"
            :isTooltipDisabled="isTooltipDisabled"
            v-on:update:modelValue="setCodeAndSystem"
          />
        </template>
      </AccordionTab>
    </Accordion>
    <Divider align="center"> </Divider>
    <div class="p-field p-col-12 p-md-4">
      <h5 class="pb-4 -white text-center">
        {{ $t("Use the code below") }}
        <span class="text-yellow-300 uppercase">{{ $t("or") }}</span>
        {{ $t("insert another code to recover previous configurations") }}
      </h5>
      <span
        class="p-float-label my-2 mx-auto align-middle"
        style="width: fit-content"
      >
        <InputText
          id="customJSON"
          v-model="customStarSystem.JSONCode"
          class="p-inputtext-sm"
          v-tooltip.bottom="{
            value: $t(
              'This code represent the customized star system. Save this code to reproduce this star system later'
            ),
            disabled: isTooltipDisabled,
          }"
        />

        <label for="customJSON">{{ $t("JSON Code") }}</label>
        <Button
          icon="pi pi-copy"
          class="p-button ml-2"
          v-on:click="() => clipBoardCustomJSONCode()"
          v-tooltip.bottom="{
            value: $t('Copy the current code to clipboard'),
            disabled: isTooltipDisabled,
          }"
        />
      </span>
    </div>
    <div class="flex flex-col">
      <Button
        :label="$t('Create Star System')"
        class="p-button-outlined"
        v-on:click="setUIAndSystem"
        v-tooltip.bottom="{
          value: $t('Use the JSON code to create a star system'),
          disabled: isTooltipDisabled,
        }"
      />
    </div>
  </div>
</template>
<style scoped>
#customJSON {
  width: unset;
}
</style>
