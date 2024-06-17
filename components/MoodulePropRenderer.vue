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
</script>


<template>
    <div class="module-prop-field | mb-4" :class="`is-${options.columnSpan}-cols`">
        <div v-if="['string', 'options', 'array'].includes(options.type)">
            <component :options="options" @set-dirty="emit('set-dirty')"
                :is="propRendererComponents[options.type]"
            />
        </div>
    </div>
</template>


<style lang="scss">
.module-prop-field
{
    flex: 1 1 100%;
    &.is-1-cols { flex-basis: 48%; }
    label { display: block; }
    input { width: 100%; }
}
</style>
