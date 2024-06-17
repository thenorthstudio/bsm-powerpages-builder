<script lang="ts" setup>
const { configureModule: dialog } = useGlobalDialogs();


const module = computed(() => dialog.value.module);
const currentSubmodule = computed(() => dialog.value.sub.module);


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
            </div>
        </template>

        <div class="inner field-grid" v-if="module && !currentSubmodule">
            <MoodulePropRenderer v-for="(p, i) in module.props" :key="i"
                :options="p" @set-dirty="module!.dirty = true"
            />
        </div>

        <div class="inner field-grid" v-if="currentSubmodule">
            <MoodulePropRenderer v-for="(p, i) in currentSubmodule.props" :key="i"
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
