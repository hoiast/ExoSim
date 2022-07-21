<script setup>
import InputSwitch from "primevue/inputswitch/sfc";
import { ref, watch } from "vue";
const props = defineProps({
  modelValue: Boolean,
  label: String,
  tooltipText: String,
  isTooltipDisabled: Boolean,
});
defineEmits(["update:modelValue"]);

let model = ref(props.modelValue);
watch(props, () => {
  model.value = props.modelValue;
});
</script>
<template>
  <div class="mt-2 px-2">
    <h5 class="pb-4 text-white flex itens-center justify-between">
      {{ label }}
      <InputSwitch
        class="ml-2"
        v-model="model"
        @change="$emit('update:modelValue', model)"
        v-tooltip.bottom="{
          value: tooltipText,
          disabled: isTooltipDisabled,
        }"
      />
    </h5>
  </div>
</template>
<style scoped></style>
