<script lang="ts" setup>
import
{
    PropRendererString,
    PropRendererNumber,
    PropRendererOptions,
    PropRendererArray,
}
from '#components';


const emit = defineEmits(['set-dirty']);
const prop = defineProps<{
    options: ModuleProp
}>();
const propRendererComponents: { [key in ModulePropType]: any } = {
    'string': PropRendererString,
    'number': PropRendererNumber,
    'options': PropRendererOptions,
    'array': PropRendererArray,
}

const classList = computed(() =>
{
    const list = [`is-${prop.options.columnSpan}-cols`];
    if (prop.options.isHiiden) list.push('is-hidden');
    return list;
});
</script>


<template>
    <div class="module-prop-field | mb-4" :class="classList">
        <component :is="propRendererComponents[options.type]"
            :options="options" @set-dirty="emit('set-dirty')"
        />
    </div>
</template>


<style lang="scss">
.module-prop-field
{
    flex: 1 1 100%;
    &.is-hidden { display: none; }
    &.is-1-cols { flex-basis: 48%; }
    label { display: block; }
    input { width: 100%; }
}
</style>
