<script lang="ts" setup>
const { configureModule: dialog } = useGlobalDialogs();


const module = computed(() => dialog.value.module);
const currentSubmodule = computed(() => dialog.value.sub.module);

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


const goBackFromSubmodule = () => {
    dialog.value.closeSubmodule();
}
</script>


<template>
    <Dialog id="configure-module-dialog"  position="topleft"
        v-model:visible="dialog.isVisible" :keep-in-view-port="false"
        pt:header="border-bottom-1 border-200 | cursor-move" pt:content="pt-4 pb-0"
        @after-hide="goBackFromSubmodule"
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
                    <div class="text-sm">
                        {{ module.additionalInfo }}
                    </div>
                </div>
            </div>
        </template>

        <div class="inner field-grid" v-if="module && !currentSubmodule">
            <div v-if="module.type != 'header'"
                class="w-full | pb-3 mb-4 | border-100 border-bottom-1"
                >
                <div class="flex align-items-center">
                    <label for="margin-option" class="text-xs text-500 | mr-3">
                        Margen <br>
                        superior
                    </label>
                    <Dropdown id="margin-option" v-model="module.topMaring" checkmark
                        :options="marginOptions" option-label="label" option-value="value"
                        pt:input="text-xs" pt:list="text-xs"
                    />
                    <div class="text-xs text-300 | ml-3 | flex align-items-start">
                        <div class="pi pi-info-circle"></div>
                        <div class="ml-2">
                            Permite enganchar este módulo al anterior
                        </div>
                    </div>
                </div>
            </div>
            <DialogPropRenderer v-for="(p, i) in module.props" :key="i"
                :options="p" @set-dirty="module!.dirty = true"
            />
        </div>

        <div class="inner field-grid" v-if="currentSubmodule">
            <DialogPropRenderer v-for="(p, i) in currentSubmodule.props" :key="i"
                :options="p" @set-dirty="module!.dirty = true"
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
        overflow: hidden;
    }

    .inner
    {
        width: 80vw;
        max-width: 525px;
    }
    .field-grid
    {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
}
</style>
