<script lang="ts" setup>
import Editor from 'primevue/editor';
import type { ModulePropString } from '#imports';


const emit = defineEmits(['set-dirty']);
const prop = defineProps<{
    options: ModulePropString
}>();
</script>


<template>
    <div class="prop-string-field" :class="`is-${options.editor}`">
        <div v-if="options.editor == 'plain'">
            <label :for="`${options.id}`" class="text-xs text-400 | pl-2 mb-2">
                {{ options.title }}
            </label>
            <InputText :id="`${options.id}`" v-model="options.value"
                @input="emit('set-dirty')" label
            />
        </div>
    
        <div v-if="options.editor == 'rich'">
            <label :for="`${options.id}`" class="text-xs text-400 | pl-2 mb-2">
                {{ options.title }}
            </label>
            <Editor :id="`${options.id}`" v-model="options.value"
                @update:model-value="emit('set-dirty')"
                >
                <template v-slot:toolbar>
                    <span class="ql-formats">
                        <button class="ql-bold"></button>
                        <button class="ql-italic"></button>
                        <button class="ql-underline"></button>
                        <button class="ql-link"></button>
                        <button class="ql-list" data-pc-section="list" value="ordered"></button>
                        <button class="ql-list" data-pc-section="list" value="bullet"></button>
                    </span>
                </template>
            </Editor>
        </div>
    </div>
</template>


<style lang="scss">
.prop-string-field.is-rich
{
    margin-top: -1rem;
    .p-editor-container .p-editor-content .ql-editor
    {
        color: black;
        font-family: var(--font-family);
        font-size: 0.9rem;
        background-color: white;
    }
}
</style>
