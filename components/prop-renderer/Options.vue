<script lang="ts" setup>
import type { ModulePropOptions } from '#imports';


const emit = defineEmits(['set-dirty']);
const prop = defineProps<{ options: ModulePropOptions }>();
const selectedValue = ref(prop.options.options[prop.options.value].value);


watch(selectedValue, () =>
{
  const selection = prop.options.options.findIndex(
    o => o.value == selectedValue.value
  );
  prop.options.value = selection;
  emit('set-dirty');
})
</script>


<template>
  <div class="prop-string-options">
    <label :for="`${options.id}`" class="text-xs text-400 | pl-2 mb-2 | flex">
      <div class="pi pi-info-circle | mr-2"
      v-tooltip.left="options.additionalInfo"
      v-if="options.additionalInfo"
      />
      {{ options.title }}
    </label>
    <Dropdown :id="`${options.id}`" v-model="selectedValue" checkmark
    :options="options.options" option-label="label" option-value="value"
    />
  </div>
</template>


<style lang="scss">
.prop-string-options {
  &, >.p-dropdown { width: 100% !important; }
}
</style>
