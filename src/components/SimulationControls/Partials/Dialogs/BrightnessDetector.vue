<script setup>
import Accordion from "primevue/accordion/sfc";
import AccordionTab from "primevue/accordiontab/sfc";
import Button from "primevue/button/sfc";
import Column from "primevue/column/sfc";
import DataTable from "primevue/datatable/sfc";
import Dialog from "primevue/dialog/sfc";
// Vue3ChartJS is registered globally
import makeChartDetails from "@/components/SimulationControls/Helpers/chartOptions.js";
import { ref, reactive, watch, toRaw, getCurrentInstance } from "vue";
import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();
const instance = getCurrentInstance();
const props = defineProps({
  isMeasuringBrightness: Boolean,
  isCollectingData: Boolean,
  chartDataPoints: Array,
  isTooltipDisabled: Boolean,
  collectionToDisplay: Number,
});

const emits = defineEmits([
  "update:isMeasuringBrightness",
  "update:isCollectingData",
  "resetDataPoints",
  "openCollectionVisualizer",
  "closeCollectionVisualizer",
]);

const isMeasuringBrightness = ref(props.isMeasuringBrightness);
const isCollectingData = ref(props.isCollectingData);

const collectedData = ref([]);
const collectionTotal = ref(0);
const isMeasurerMaximized = ref(false);
const chart = ref();
const chartDetails = makeChartDetails();
const annotation = reactive({
  init: null,
  end: null,
});
watch(props, () => {
  isMeasuringBrightness.value = props.isMeasuringBrightness;
  if (!isMeasuringBrightness.value) {
    reset();
  }
  drawChart();
});
watch(locale, () => {
  translatePlot();
});
const translatePlot = () => {
  chartDetails.options.scales.x.title.text = t("Time (earth days)");
  chartDetails.options.scales.y.title.text = t("Brightness");
  chartDetails.options.plugins.title.text = t("Light Curve");
  drawChart(false);
};
const drawChart = (updateData = true) => {
  if (isMeasuringBrightness.value) {
    if (updateData) {
      const data = toRaw(props.chartDataPoints);
      chartDetails.data.datasets[0].data = data;
    }

    if (annotation.init !== null) {
      chartDetails.options.plugins.annotation = {
        annotations: {
          box1: {
            type: "box",
            xMin: annotation.init,
            xMax: annotation.end,
            backgroundColor: "rgba(255, 213, 79, 0.25)",
          },
        },
      };
    } else {
      chartDetails.options.plugins.annotation.value = null;
    }

    if (chart.value) chart.value.update(250);
  }
};
const toggleDataCollection = () => {
  // Toggle collection Boolean
  isCollectingData.value = !isCollectingData.value;
  emits("update:isCollectingData", isCollectingData.value);

  // If collection is on, start collection
  if (isCollectingData.value) {
    // . New collection
    collectedData.value.push({
      id: collectionTotal.value,
      starSystemName:
        instance.parent.proxy.simulation.configuration.starSystem.name,
      start: new Date(),
      duration: null,
      totalPoints: null,
      data: [],
    });
    // Start plot annotation
    annotation.init = instance.parent.proxy.simulation.configuration.time;
    annotation.end = null;

    // Increment total number of collections
    collectionTotal.value++;
  } else {
    // . Close collection
    let collection = collectedData.value[collectedData.value.length - 1];
    collection.duration = ((new Date() - collection.start) / 1000).toFixed(2);
    collection.totalPoints = collection.data.length;
    // End plot annotation
    annotation.end = instance.parent.proxy.simulation.configuration.time;
  }
};
const deleteCollection = (collectionToDelete) => {
  collectedData.value = collectedData.value.filter(function (collection) {
    if (collection.id !== collectionToDelete.id) {
      return collection;
    }
  });
  if (collectionToDelete.id === props.collectionToDisplay) {
    emits("closeCollectionVisualizer");
  }
};
const collectDataFromMeasurements = (currentMeasurement, plotSizeLimit) => {
  if (isCollectingData.value) {
    let collections = collectedData.value;
    let currentCollection = collections[collections.length - 1];

    currentCollection.data.push(currentMeasurement);
    // . Stop collection if limit is reached
    if (currentCollection.data.length === plotSizeLimit) {
      toggleDataCollection();
    }
  }
};

const reset = () => {
  if (isCollectingData.value) {
    toggleDataCollection();
  }
  annotation.init = null;
  annotation.end = null;
  chartDetails.options.plugins.annotation = ref(null);
};
defineExpose({ reset, collectDataFromMeasurements });

// . Init titles on default language
translatePlot();
</script>
<template>
  <Dialog
    :header="$t('Brightness Detector')"
    v-on:maximize="isMeasurerMaximized = true"
    v-on:unmaximize="isMeasurerMaximized = false"
    v-on:hide="isMeasurerMaximized = false"
    v-model:visible="isMeasuringBrightness"
    v-on:update:visible="
      $emit('update:isMeasuringBrightness', isMeasuringBrightness);
      reset();
    "
    position="bottom"
    :maximizable="true"
    :modal="false"
    :style="{
      'min-width': '30rem',
      width: '30rem',
      'min-height': '20rem',
      background: '#1e1e1e',
    }"
    class="resize justify-between overflow-auto"
    :class="{
      'opacity-50 hover:opacity-100': !isMeasurerMaximized,
      'opacity-75': isMeasurerMaximized,
    }"
  >
    <Vue3ChartJs
      ref="chart"
      :type="chartDetails.type"
      :data="chartDetails.data"
      :options="chartDetails.options"
    ></Vue3ChartJs>
    <template #footer>
      <Button
        :label="$t('Reset Measurements')"
        icon="pi pi-replay"
        class="p-button-help p-button-sm"
        v-on:click="$emit('resetDataPoints')"
        :disabled="isCollectingData"
        v-tooltip.bottom="{
          value: $t(
            'Reset all measured brightness data on the real-time plot. Data stored in collections are preserved'
          ),
          disabled: isTooltipDisabled,
        }"
      />
      <Button
        :label="
          isCollectingData
            ? $t('Stop Collecting Data')
            : $t('Start Collecting Data')
        "
        :icon="isCollectingData ? 'pi pi-stop' : 'pi pi-play'"
        :class="
          isCollectingData ? 'p-button-danger p-button-sm' : ' p-button-sm'
        "
        v-on:click="toggleDataCollection"
        v-tooltip.bottom="{
          value: $t(
            'Store new measurements in collections for further analysis. Collections can be accessed in the menu below.'
          ),
          disabled: isTooltipDisabled,
        }"
      />
      <Accordion class="mt-4">
        <AccordionTab :header="$t('Data Collections')">
          <DataTable :value="collectedData" responsiveLayout="scroll">
            <Column field="id" :header="$t('ID')"></Column>
            <Column field="starSystemName" :header="$t('Star System')">
              <template #body="slotProps">
                {{ $t(slotProps.data.starSystemName) }}
              </template>
            </Column>
            <Column :header="$t('Start')">
              <template #body="slotProps">
                {{
                  slotProps.data.start.getHours() +
                  ":" +
                  slotProps.data.start.getMinutes() +
                  ":" +
                  slotProps.data.start.getSeconds()
                }}
              </template>
            </Column>
            <Column field="totalPoints" :header="$t('Points')"></Column>
            <Column header="">
              <template #body="slotProps">
                <div class="mt-2">
                  <Button
                    icon="pi pi-eye"
                    class="p-button-sm pt-2"
                    :disabled="!slotProps.data.totalPoints"
                    @click="$emit('openCollectionVisualizer', slotProps.data)"
                    v-tooltip.bottom="{
                      value: $t('Visualize data collection'),
                      disabled: isTooltipDisabled,
                    }"
                  />
                </div>
                <div class="mt-2">
                  <Button
                    icon="pi pi-trash"
                    class="p-button-sm p-button-danger"
                    @click="deleteCollection(slotProps.data)"
                    v-tooltip.bottom="{
                      value: $t('Delete data collection'),
                      disabled: isTooltipDisabled,
                    }"
                  />
                </div>
              </template>
            </Column>
          </DataTable>
        </AccordionTab>
      </Accordion>
    </template>
  </Dialog>
</template>
<style scoped></style>
