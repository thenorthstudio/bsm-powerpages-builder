<script lang="ts" setup>
import Editor from 'primevue/editor';
import type { ModulePropString } from '#imports';


const emit = defineEmits<{
    'set-dirty': [],
    'check-js': [lib: ExternalLib]
}>();
const prop = defineProps<{
    options: ModulePropString
}>();
</script>


<template>
    <div class="prop-string-field" :class="`is-${options.editor}`">
        <div v-if="options.editor == 'plain'">
            <label :for="`${options.id}`" class="text-xs text-400 | pl-2 mb-2 | flex">
                <div class="pi pi-info-circle | mr-2"
                    v-tooltip.left="options.additionalInfo"
                    v-if="options.additionalInfo"
                ></div>
                {{ options.title }}
            </label>
            <InputText :id="`${options.id}`" v-model="options.value"
                @input="emit('set-dirty')" label
            />
        </div>

        <div v-if="options.editor == 'plain-lines'">
            <label :for="`${options.id}`" class="text-xs text-400 | pl-2 mb-2">
                {{ options.title }}
            </label>
            <Textarea :id="`${options.id}`" v-model="options.value"
                rows="1" auto-resize @input="emit('set-dirty')"
            />
        </div>
    
        <div v-if="options.editor == 'rich' || options.editor == 'rich-h3'">
            <label :for="`${options.id}`" class="text-xs text-400 | pl-2 mb-2">
                {{ options.title }}
            </label>
            <Editor :id="`${options.id}`" v-model="options.value"
                @update:model-value="emit('set-dirty')"
                >
                <template #toolbar>
                    <span class="ql-formats" v-if="options.editor == 'rich-h3'">
                        <select class="ql-header" value="0">
                            <option value="3">Subtítulo</option>
                            <option selected value="0">Parágrafo</option>
                        </select>
                    </span>
                    <span class="ql-formats">
                        <button class="ql-bold"></button>
                        <button class="ql-italic"></button>
                        <button class="ql-underline"></button>
                        <button class="ql-link"></button>
                        <button class="ql-list" value="ordered"></button>
                        <button class="ql-list" value="bullet"></button>
                    </span>
                    <!-- <span class="ql-formats">
                        <button class="ql-script" value="sub"></button>
                        <button class="ql-script" value="super"></button>
                    </span> -->
                    <span class="ql-formats">
                        <button class="ql-clean"></button>
                    </span>
                </template>
            </Editor>
        </div>
    </div>
</template>


<style lang="scss">
.prop-string-field
{
    textarea
    {
        width: 100%;
        resize: none;
        * { background: none !important; }
    }
    &.is-rich, &.is-rich-h3
    {
        margin-top: -1rem;
        .p-editor-container .p-editor-content .ql-editor
        {
            max-height: 250px;
            color: black;
            font-family: var(--font-family);
            font-size: 0.9rem;
            background: var(--surface-700);
            * { background: none !important; }
            p, ul, ol
            {
                &+ { p, ul, ol { margin-top: 1.2em; } }
                &+h3 { margin-top: 1.75rem; }
            }
            h3
            {
                &+ { p, ul, ol { margin-top: 0.5rem; } }
                &+h3 { margin-top: 0; }
            }
        }
    }
}
</style>
