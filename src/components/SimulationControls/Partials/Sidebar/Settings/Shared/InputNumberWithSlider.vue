<script setup>
import InputNumber from "primevue/inputnumber/sfc";
import Slider from "primevue/slider/sfc";
import { ref } from "vue";

const props = defineProps({
  inputId: String,
  label: String,
  min: Number,
  max: Number,
  step: Number,
  tooltipText: String,
  modelValue: Number,
  isTooltipDisabled: Boolean,
});
defineEmits(["update:modelValue"]);

let model = ref(props.modelValue);
</script>

<template>
  <div class="mt-2 p-4 flex flex-col">
    <span class="p-float-label">
      <InputNumber
        :id="inputId"
        v-model="model"
        :useGrouping="false"
        :min="min"
        :max="max"
        :step="step"
        style="width: 100%"
        v-on:input="$emit('update:modelValue', model)"
        v-tooltip.bottom="{
          value: tooltipText,
          disabled: isTooltipDisabled,
        }"
      />
      <label :for="inputId">{{ label }}</label>
      <Slider
        v-model="model"
        :min="min"
        :max="max"
        :step="step"
        v-on:change="$emit('update:modelValue', model)"
      />
    </span>
  </div>
</template>
<style scoped></style>
