<script lang="ts" setup>
import
{
    PropRendererString,
    PropRendererNumber,
    PropRendererOptions,
    PropRendererList,
    PropRendererArray,
}
from '#components';


const emit = defineEmits<{
    'set-dirty': [],
    'check-js': [lib: ExternalLib]
}>();
const prop = defineProps<{
    options: ModuleProp
}>();
const propRendererComponents: { [key in ModulePropType]: any } = {
    'string': PropRendererString,
    'number': PropRendererNumber,
    'options': PropRendererOptions,
    'list': PropRendererList,
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
        <component :is="propRendererComponents[options.type]" :options="options"
            @check-js="emit('check-js', $event)" @set-dirty="emit('set-dirty')"
        />
    </div>
</template>


<style lang="scss">
.module-prop-field
{
    flex: 1 1 100%;
    &.is-hidden { display: none; }
    &:last-child { margin-bottom: 0 !important; }
    &.is-1-cols { flex-basis: 48%; }
    label { display: block; }
    input { width: 100%; }
}
</style>
