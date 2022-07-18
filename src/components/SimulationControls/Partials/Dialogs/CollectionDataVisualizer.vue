<script setup>
import Dialog from "primevue/dialog/sfc";
import Button from "primevue/button/sfc";
// Vue3ChartJS is registered globally
import makeChartDetails from "@/components/SimulationControls/Helpers/chartOptions.js";
import { ref, watch, toRaw } from "vue";
import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();

const props = defineProps({
  collectionToDisplay: Number,
  isCollectionVisible: Boolean,
  chartDataPoints: Array,
  isTooltipDisabled: Boolean,
});

const isCollectionVisible = ref(props.isCollectionVisible);
const chart = ref();
const chartDetails = makeChartDetails();

watch(props, () => {
  isCollectionVisible.value = props.isCollectionVisible;
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
  if (isCollectionVisible.value) {
    if (updateData) {
      const data = toRaw(props.chartDataPoints);
      chartDetails.data.datasets[0].data = data;
    }
    if (chart.value) chart.value.update(250);
  }
};
const exportChart = () => {
  const dataUrl = chart.value.chartJSState.chart.toBase64Image();

  // . Export as new tab
  var newWindow = window.open();
  newWindow.document.write('<img src="' + dataUrl + '"/>');

  /*
    When exporting via file, there is a possibility that 
    browsers will show a download notification on the top 
    or bottom of the client view. This action changes the 
    viewport height, resizing the simulation renderer and 
    consequently the baseline of pixel count plotted as 
    brightness. It may confuse the user.
  */
  // . Export as PNG file
  // let a = document.createElement('a');
  // a.href = dataUrl;
  // a.download = 'curva-de-brilho.png';
  // a.click();
  // a = null;
};

// . Init titles on default language
translatePlot();
</script>

<template>
  <Dialog
    position="right"
    :header="`${$t('Light Curve - Collection')} ${collectionToDisplay}`"
    v-model:visible="isCollectionVisible"
    :style="{
      'min-width': '30rem',
      width: '30rem',
      'min-height': '20rem',
      background: '#1e1e1e',
    }"
    class="z-25 resize justify-between overflow-auto"
    :maximizable="true"
    :modal="false"
    v-on:update:visible="
      $emit('update:isCollectionVisible', isCollectionVisible)
    "
  >
    <Vue3ChartJs
      ref="chart"
      :type="chartDetails.type"
      :data="chartDetails.data"
      :options="chartDetails.options"
    ></Vue3ChartJs>
    <template #footer>
      <Button
        :label="$t('Export Plot')"
        icon="pi pi-download"
        class="p-button-sm p-button-success"
        v-on:click="exportChart"
        v-tooltip.bottom="{
          value: $t('Export plot to a new window tab'),
          disabled: isTooltipDisabled,
        }"
      />
    </template>
  </Dialog>
</template>
