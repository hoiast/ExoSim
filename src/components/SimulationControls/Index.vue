<template>
  <div
    class="max-h-screen overflow-auto p-card absolute z-10"
    style="overflow: overlay"
  >
    <UpperSection
      v-model:isRunning="isRunning"
      v-model:isMeasuringBrightness="isMeasuringBrightness"
      v-model:isTooltipDisabled="isTooltipDisabled"
    />

    <Accordion>
      <AccordionTab :header="$t('Settings')">
        <AdvancedModeSwitch
          v-model:isAdvancedSettingsActive="isAdvancedSettingsActive"
          :isTooltipDisabled="isTooltipDisabled"
        />
        <Accordion :multiple="true">
          <AccordionTab :header="$t('Star Systems')">
            <Accordion>
              <AccordionTab :header="$t('Defaults')">
                <DefaultSystems
                  :starSystemLibrary="
                    simulation.configuration.starSystemLibrary
                  "
                  :currentStarSystemName="
                    simulation.configuration.starSystem.name
                  "
                  @updateStarSystem="setDefaultSystem"
                />
              </AccordionTab>
              <AccordionTab :header="$t('Random')">
                <RandomSystems
                  ref="randomSystems"
                  :isTooltipDisabled="isTooltipDisabled"
                  @updateStarSystem="setRandomSystem"
                />
              </AccordionTab>
              <AccordionTab :header="$t('Custom')">
                <CustomSystems
                  ref="customSystems"
                  :isTooltipDisabled="isTooltipDisabled"
                  :isAdvancedSettingsActive="isAdvancedSettingsActive"
                  @updateStarSystem="setCustomSystem"
                />
              </AccordionTab>
            </Accordion>
          </AccordionTab>
          <AccordionTab :header="$t('Visual Representation')">
            <Accordion :multiple="true">
              <AccordionTab :header="$t('Scales')">
                <ScalesSection
                  :isAdvancedSettingsActive="isAdvancedSettingsActive"
                  :isTooltipDisabled="isTooltipDisabled"
                  v-model:starSize="scales.starSize"
                  v-model:planetSize="scales.planetSize"
                  v-model:satelliteSize="scales.satelliteSize"
                  v-model:planetDistance="scales.planetDistance"
                  v-model:satelliteDistance="scales.satelliteDistance"
                />
              </AccordionTab>
              <AccordionTab :header="$t('Visibility')">
                <VisibilitySection
                  :isAdvancedSettingsActive="isAdvancedSettingsActive"
                  :isTooltipDisabled="isTooltipDisabled"
                  v-model:areOrbitsVisible="isVisible.orbits"
                  v-model:isStarVisible="isVisible.star"
                  v-model:arePlanetsVisible="isVisible.planets"
                  v-model:areSatellitesVisible="isVisible.satellites"
                />
              </AccordionTab>
            </Accordion>
          </AccordionTab>
          <AccordionTab :header="$t('Simulation Parameters')">
            <SimulationParameters
              :isAdvancedSettingsActive="isAdvancedSettingsActive"
              :isTooltipDisabled="isTooltipDisabled"
              v-model:simulationSpeed="simulation.configuration.simulationSpeed"
              v-model:simulationStep="simulation.configuration.simulationStep"
              v-model:areOrbitsTilted="areOrbitsTilted"
              v-model:isRotationEnabled="isRotationEnabled"
            />
          </AccordionTab>
          <AccordionTab :header="$t('Brightness Detection')">
            <BrightnessDetectionParameters
              :isTooltipDisabled="isTooltipDisabled"
              v-model:plotSizeLimit="measurements.plotSizeLimit"
              v-model:pointsPerSecond="measurements.pointsPerSecond"
            />
          </AccordionTab>
        </Accordion>
      </AccordionTab>
    </Accordion>
  </div>
  <BrightnessDetector
    ref="brightnessDetector"
    v-model:isMeasuringBrightness="isMeasuringBrightness"
    v-model:isCollectingData="measurements.isCollectingData"
    :chartDataPoints="measurements.chartDataPoints.measurement.data"
    :isTooltipDisabled="isTooltipDisabled"
    :collectionToDisplay="measurements.collectionToDisplay"
    @resetDataPoints="resetDataPoints"
    @openCollectionVisualizer="openCollectionVisualizer"
    @closeCollectionVisualizer="closeCollectionVisualizer"
  />
  <CollectionDataVisualizer
    :collectionToDisplay="measurements.collectionToDisplay"
    v-model:isCollectionVisible="measurements.isCollectionVisible"
    :chartDataPoints="measurements.chartDataPoints.collection.data"
  />
  <Toast class="z-40" />
</template>

<script>
// . General Use
import { defineComponent, toRaw } from "vue";

// . Components
import Accordion from "primevue/accordion/sfc";
import AccordionTab from "primevue/accordiontab/sfc";
import Toast from "primevue/toast/sfc";

import UpperSection from "./Partials/Sidebar/UpperSection.vue";
import AdvancedModeSwitch from "./Partials/Sidebar/Settings/AdvancedModeSwitch.vue";
import DefaultSystems from "./Partials/Sidebar/Settings/StarSystems/DefaultSystems.vue";
import RandomSystems from "./Partials/Sidebar/Settings/StarSystems/RandomSystems.vue";
import CustomSystems from "./Partials/Sidebar/Settings/StarSystems/CustomSystems.vue";
import ScalesSection from "./Partials/Sidebar/Settings/VisualRepresentation/ScalesSection.vue";
import VisibilitySection from "./Partials/Sidebar/Settings/VisualRepresentation/VisibilitySection.vue";
import SimulationParameters from "./Partials/Sidebar/Settings/SimulationParameters.vue";
import BrightnessDetectionParameters from "./Partials/Sidebar/Settings/BrightnessDetectionParameters.vue";
import BrightnessDetector from "./Partials/Dialogs/BrightnessDetector.vue";
import CollectionDataVisualizer from "./Partials/Dialogs/CollectionDataVisualizer.vue";
import DataPoints from "@/components/SimulationControls/Helpers/dataPoints.js";

// . Simulation Utils
import Simulation from "@/js/simulationBuilder.js";
import Stats from "three/examples/jsm/libs/stats.module";

export default defineComponent({
  name: `SimulationControls`,
  components: {
    Accordion,
    AccordionTab,
    Toast,
    UpperSection,
    AdvancedModeSwitch,
    DefaultSystems,
    RandomSystems,
    CustomSystems,
    ScalesSection,
    VisibilitySection,
    SimulationParameters,
    BrightnessDetectionParameters,
    CollectionDataVisualizer,
    BrightnessDetector,
  },
  data() {
    return {
      simulation: {},
      isRunning: true,
      isMeasuringBrightness: false,
      isTooltipDisabled: false,
      isAdvancedSettingsActive: false,
      scales: {
        starSize: 40,
        planetSize: 1000,
        satelliteSize: 1000,
        planetDistance: 1,
        satelliteDistance: 20,
      },
      isVisible: {
        orbits: true,
        star: true,
        planets: true,
        satellites: false,
      },
      areOrbitsTilted: true,
      isRotationEnabled: false,
      measurements: {
        isCollectionVisible: false,
        chartDataPoints: new DataPoints(),
        pointsPerSecond: 5,
        plotSizeLimit: 500,
        interval: null,
        isCollectingData: false,
        collectionToDisplay: null,
        currentMeasurement: { x: null, y: null },
      },
    };
  },
  created() {
    // . Create Stats Measurement
    var stats = new Stats();
    stats.domElement.style.position = "absolute";
    stats.domElement.style["z-index"] = "unset";
    stats.domElement.style.bottom = 0;
    stats.domElement.style.top = "unset";
    stats.domElement.style.right = 0;
    stats.domElement.style.left = "unset";
    stats.domElement.style.opacity = 0.2;
    document.body.appendChild(stats.domElement);

    // . Init Simulation
    this.simulation = new Simulation(stats);
    this.simulation.start();
  },
  mounted() {
    this.ensureUIConfigurations();
  },
  methods: {
    ensureUIConfigurations() {
      /*
      Adjust simulation and UI variables to match each other.
      This could be done directly through Vue's reactivity
      system, but at a higher risk of issues involving
      lack of synchronicity between Vue's lifecycle hooks and
      the simulation steps.
      This manual approach to couple simulation and interface
      is not the best solution, but it works just fine.
      TO DO: Find a better and finer solution.
      */
      this.scales.starSize = this.simulation.configuration.starScale;
      this.scales.planetSize = this.simulation.configuration.planetScale;
      this.scales.satelliteSize = this.simulation.configuration.satelliteScale;
      this.scales.planetDistance =
        this.simulation.configuration.planetDistanceScale;
      this.scales.satelliteDistance =
        this.simulation.configuration.satelliteDistanceScale;
      this.simulation.configuration.running = this.isRunning;
      this.simulation.setCameraMode(
        this.isMeasuringBrightness ? "measurement" : "view"
      );
      this.setStarVisibility(this.isVisible.star);
      this.setPlanetVisibility(this.isVisible.planets);
      this.setOrbitVisibility(this.isVisible.orbits);
      this.setSatelliteVisibility(this.isVisible.satellites);
      this.setOrbitInclination(this.areOrbitsTilted);
    },
    setOrbitVisibility(value) {
      this.simulation.setOrbitVisibility(value);
    },
    setStarVisibility(value) {
      let bodyName = this.simulation.simulationBodies.star.name;
      this.simulation.setBodyVisibility(bodyName, value);
    },
    setPlanetVisibility(value) {
      for (var body of this.simulation.simulationBodies.planets) {
        let bodyName = body.name;
        this.simulation.setBodyVisibility(bodyName, value);
      }
      // Ensure that orbit visibility restriction is respected
      this.simulation.setOrbitVisibility(this.isVisible.orbits);
    },
    setSatelliteVisibility(value) {
      for (var body of this.simulation.simulationBodies.satellites) {
        let bodyName = body.name;
        this.simulation.setBodyVisibility(bodyName, value);
      }
    },
    setOrbitInclination(value) {
      this.simulation.setOrbitInclination(value);
    },
    getCurrentOptions() {
      let options = {
        simulationSpeed: this.simulation.configuration.simulationSpeed,
        simulationStep: this.simulation.configuration.simulationStep,
      };
      return options;
    },
    setDefaultSystem(starSystem) {
      let options = this.getCurrentOptions();
      options.starSystem = starSystem;
      this.simulation.newConfig(options);
      this.resetDataPoints();
      this.ensureUIConfigurations();
    },

    setRandomSystem(randomSeed) {
      if (randomSeed === null) {
        this.$refs.randomSystems.generateRandomNumber();
        randomSeed = this.$refs.randomSystems.randomSeed;
      }

      let options = this.getCurrentOptions();
      options.mode = "random";
      options.randomSeed = randomSeed;

      this.simulation.newConfig(options);
      this.resetDataPoints();
      this.ensureUIConfigurations();
    },
    setCustomSystem(JSONCode) {
      if (JSONCode) {
        let options = this.getCurrentOptions();
        options.mode = "custom";
        options.customDetails = JSONCode;
        this.simulation.newConfig(options);
        this.resetDataPoints();
        this.ensureUIConfigurations();
      }
    },
    retrieveDataFromSimulation() {
      if (this.isMeasuringBrightness && this.isRunning) {
        // . Measure Pixels
        this.measureBrightness();
        // . Collect Pixels
        if (this.measurements.isCollectingData) {
          this.$refs.brightnessDetector.collectDataFromMeasurements(
            this.measurements.currentMeasurement,
            this.measurements.plotSizeLimit
          );
        }
      }
    },
    measureBrightness() {
      let count = toRaw(this.simulation.graphEngine).countStarPixels();

      // . Register current measurement data point
      let currentMeasurement = {
        x: this.simulation.configuration.time,
        y: count.toFixed(),
      };
      this.measurements.currentMeasurement = currentMeasurement;

      // . Check if there is a new minimum or maximum
      let measurementInfo = this.measurements.chartDataPoints.measurement;
      measurementInfo.maxY = Math.max(
        measurementInfo.maxY,
        currentMeasurement.y
      );
      measurementInfo.minY = Math.min(
        measurementInfo.minY,
        currentMeasurement.y
      );

      // . Push current data point to measurement plot array and ensure that plot array size limit is applied
      let data = measurementInfo.data;
      data.push(currentMeasurement);
      while (data.length > this.measurements.plotSizeLimit) {
        data.shift();
      }
    },
    openCollectionVisualizer(collection) {
      this.measurements.collectionToDisplay = collection.id;
      this.measurements.isCollectionVisible = true;
      this.measurements.chartDataPoints.collection.data = collection.data;
    },
    closeCollectionVisualizer() {
      this.measurements.collectionToDisplay = null;
      this.measurements.isCollectionVisible = false;
    },
    resetDataPoints() {
      this.measurements.chartDataPoints.reset();
      this.$refs.brightnessDetector.reset();
      this.simulation.configuration.time = 0;
    },
    setMeasurerInterval() {
      if (this.measurements.interval !== null) {
        clearInterval(this.measurements.interval);
      }
      this.measurements.interval = setInterval(
        this.retrieveDataFromSimulation,
        1000 / this.measurements.pointsPerSecond
      );
    },
    clearMeasurerInterval() {
      if (this.measurements.interval !== null) {
        clearInterval(this.measurements.interval);
        this.measurements.interval = null;
      }
    },
  },
  watch: {
    isRunning: function () {
      this.simulation.setRunning(this.isRunning);
    },
    isMeasuringBrightness: function () {
      if (this.isMeasuringBrightness) {
        this.isVisible.orbits = false;
        this.resetDataPoints();
        this.setMeasurerInterval();
      } else {
        this.isVisible.orbits = true;
        this.clearMeasurerInterval();
      }
      this.simulation.setCameraMode(
        this.isMeasuringBrightness ? "measurement" : "view"
      );
    },
    isTooltipDisabled: function () {
      if (this.isTooltipDisabled) {
        this.$toast.add({
          severity: "warn",
          summary: "Aviso",
          detail: "Dicas Desativadas",
          life: 3000,
        });
      } else {
        this.$toast.add({
          severity: "success",
          summary: "Sucesso",
          detail: "Dicas Ativadas",
          life: 3000,
        });
      }
    },
    "scales.starSize": function () {
      this.simulation.setStarScale(this.scales.starSize);
    },
    "scales.planetSize": function () {
      this.simulation.setPlanetScale(this.scales.planetSize);
    },
    "scales.satelliteSize": function () {
      this.simulation.setSatelliteScale(this.scales.satelliteSize);
    },
    "scales.planetDistance": function () {
      this.simulation.setPlanetDistanceScale(this.scales.planetDistance);
    },
    "scales.satelliteDistance": function () {
      this.simulation.setSatelliteDistanceScale(this.scales.satelliteDistance);
    },
    "isVisible.orbits": function () {
      this.setOrbitVisibility(this.isVisible.orbits);
    },
    "isVisible.star": function () {
      this.setStarVisibility(this.isVisible.star);
    },
    "isVisible.planets": function () {
      this.setPlanetVisibility(this.isVisible.planets);
    },
    "isVisible.satellites": function () {
      this.setSatelliteVisibility(this.isVisible.satellites);
    },
    areOrbitsTilted: function () {
      this.setOrbitInclination(this.areOrbitsTilted);
    },
    isRotationEnabled: function () {
      this.simulation.configuration.rotationEnabled = this.isRotationEnabled;
    },
    "measurements.pointsPerSecond": function () {
      this.setMeasurerInterval();
    },
  },
});
</script>

<style scoped></style>
