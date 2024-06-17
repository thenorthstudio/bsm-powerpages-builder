<script lang="ts" setup>
// import Editor from 'primevue/editor';
// import type { ModulePropString } from '#imports';


// const emit = defineEmits(['set-dirty']);
// const prop = defineProps<{
//     options: ModulePropString
// }>();
</script>


<template>
    <div></div>
    <!-- <div class="prop-string-field" :class="`is-${options.editor}`">
        <FloatLabel v-if="options.editor == 'plain'">
            <label :for="`${options.id}`">{{ options.title }}</label>
            <InputText :id="`${options.id}`" v-model="options.value"
                @input="emit('set-dirty')"
            />
        </FloatLabel>
    
        <div v-if="options.editor == 'rich'">
            <div class="text-xs text-400 | pl-2 mb-2">
                {{ options.title }}
            </div>
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
    </div> -->
</template>


<style lang="scss">
// .prop-string-number {  }
</style>
