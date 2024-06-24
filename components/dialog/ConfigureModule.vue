<script lang="ts" setup>
const page = useCurrentPage();
const module = computed(() => dialog.value.module);
const currentSubmodule = computed(() => dialog.value.sub.module);
const { configureModule: dialog } = useGlobalDialogs();

const marginOptions: Array<{
    label: string,
    value: ModuleMarginType
}> = [
    { label: 'Normal', value: 'normal-margin' },
    { label: 'Pequeño', value: 'small-margin' }
]


watch([module, currentSubmodule], () =>
{
    if (module.value) module.value.watchPropVisibility();
    if (currentSubmodule.value) currentSubmodule.value.watchPropVisibility();
},
    { deep: true }
);


const checkTriggerJS = (lib: ExternalLib) =>
{
    if (!module.value) return;
    const libs = exLibRequirements[module.value.type];
    if (libs.includes(lib)) page.dirtyJS.value = true;
}
const goBackFromSubmodule = () => {
    dialog.value.closeSubmodule();
}
</script>


<template>
    <Dialog id="configure-module-dialog"  position="topleft"
        v-model:visible="dialog.isVisible" :keep-in-view-port="false"
        pt:header="border-bottom-1 border-200 | cursor-move"
        pt:content="p-0" @after-hide="goBackFromSubmodule"
        >
        <template #header>
            <div class="flex align-items-center gap-2">
                <template v-if="module && !currentSubmodule">
                    <div class="pi pi-cog"></div>
                    <div>{{ module.getTitle() }}</div>
                </template>

                <template v-if="module && currentSubmodule">
                    <Button icon="pi pi-arrow-left" class="mr-2"
                        size="small" severity="secondary"
                        @click="goBackFromSubmodule"
                    />
                    <div>{{ currentSubmodule.getTitle() }}</div>
                </template>

                <div class="flex align-items-center | text-300"
                    v-if="module && module.additionalInfo"
                    >
                    <div class="ml-2 mr-3">
                        |
                    </div>
                    <div class="pi pi-info-circle cursor-auto"
                        v-tooltip.right="module.additionalInfo"
                    ></div>
                </div>
            </div>
        </template>

        <div class="inner" v-if="module && !currentSubmodule">
            <div class=" p-3 mb-2 | border-100 border-bottom-1"
                v-if="module.type != 'header'"
                >
                <div class="flex align-items-center">
                    <label for="margin-option" class="text-xs text-500 | mr-3">
                        Margen superior
                    </label>
                    <Dropdown id="margin-option" v-model="module.topMaring" checkmark
                        :options="marginOptions" option-label="label" option-value="value"
                        pt:input="text-xs" pt:list="text-xs"
                    />
                    <div class="text-xs text-300 | ml-3 | flex align-items-start">
                        <div class="pi pi-info-circle"
                            v-tooltip.right="`Permite enganchar este módulo al anterior`"
                        ></div>
                    </div>
                </div>
            </div>
            <div class="field-grid | p-3">
                <DialogPropRenderer :options="p"
                    v-for="(p, i) in module.props" :key="i"
                    @set-dirty="module!.dirty = true"
                    @check-js="checkTriggerJS"
                />
            </div>
        </div>

        <div class="inner field-grid | p-3 pt-5" v-if="currentSubmodule">
            <DialogPropRenderer :options="p" :key="i"
                v-for="(p, i) in currentSubmodule.props"
                @set-dirty="module!.dirty = true"
            />
        </div>

    </Dialog>
</template>


<style lang="scss">
#configure-module-dialog
{
    .p-dialog-content
    {
        position: relative;
        overflow-x: hidden;
    }

    .inner
    {
        width: 80vw;
        max-width: 450px;
        // max-height: 80vh;
    }
    .field-grid
    {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
}
</style>
