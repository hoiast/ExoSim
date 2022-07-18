import { createApp } from "vue";
import App from "./App.vue"; //Root component for UI.
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import Tooltip from "primevue/tooltip";
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";
import annotationPlugin from "chartjs-plugin-annotation";
import zoomPlugin from "chartjs-plugin-zoom";
import i18n from "./i18n";

const app = createApp(App);
app.use(i18n);
app.use(PrimeVue, { ripple: true });
app.use(ToastService);
app.use(Vue3ChartJs, {
  plugins: [zoomPlugin, annotationPlugin],
});
app.directive("tooltip", Tooltip);
app.mount("#app");
