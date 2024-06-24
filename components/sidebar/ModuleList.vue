<script lang="ts" setup>
import { Module } from "@/utils/moduleTypes";
import type OverlayPanel from 'primevue/overlaypanel';
import type { DataTableRowReorderEvent } from 'primevue/datatable';


const page = useCurrentPage();
const dialogs = useGlobalDialogs();
const deleteConfirmation = ref<OverlayPanel[]>([]);


const onRowReorder = (e: DataTableRowReorderEvent) =>
{
    reorderArray(page.modules.value, e.dragIndex, e.dropIndex);
    page.reorder.value = true;
    triggerJS();
}
const registerDeleteConfirmation = (index: number, i: any) =>
{
    if (!i) return;
    if (deleteConfirmation.value.length > index) {
        deleteConfirmation.value[index] = i;
    }
    else deleteConfirmation.value.push(i);
}
const triggerJS = () => {
    page.dirtyJS.value = true;
}

const askNewModule = () =>
{
    dialogs.configureModule.value.close();
    dialogs.newModule.value = true;
}
const configureModule = (index: number) =>
{
    const module = page.modules.value[index];
    dialogs.configureModule.value.open(module);
}
const askDeleteModule = (e: MouseEvent, index: number) => {
    deleteConfirmation.value[index].toggle(e);
}
const deleteModule = (index: number) =>
{
    dialogs.configureModule.value.close();
    deleteConfirmation.value[index].hide();
    page.modules.value[index].deathMark = true;
    triggerJS();
}
</script>


<template>
    <Panel id="modules-list" class="min-h-full"
        pt:header="sticky top-0 z-2 | p-3 | surface-0 border-100 border-bottom-1"
        pt:content="pt-0"
        >

        <template #header>
            <div class="flex align-items-center gap-2">
                <div :class="page.isUpdating.value? 'pi pi-spin pi-spinner' : 'pi pi-box'"></div>
                <div>Módulos</div>
            </div>
        </template>

        <template #icons>
            <Button icon="pi pi-plus" severity="secondary" text
                v-tooltip.bottom="'Añadir nuevo módulo'"
                @click="askNewModule"
            />
        </template>

        <div class="inner text-sm">
            
            <div class="text-center" v-if="!page.hasModules()">
                <div class="mt-5 mb-4">No hay módulos todavía.</div>
                <Button icon="pi pi-plus" label="Añadir nuevo" size="small"
                    @click="askNewModule"
                />
            </div>

            <DataTable :value="page.modules.value" size="small"
                @row-reorder="onRowReorder"
                >
                <Column class="reorder-row | pt-2" row-reorder />

                <Column class="type-row px-0">
                    <template #body="{ data }">
                        <div class="text-sm">
                            {{ asA<Module>(data).getDescriptor() }}
                        </div>
                    </template>
                </Column>

                <Column class="actions-row">
                    <template #body="{ index }">
                        <ButtonGroup>
                            <Button class="px-1 py-2" icon="pi pi-cog"
                                size="small" severity="secondary" text
                                v-tooltip.bottom="'Opciones'" outlined
                                @click="configureModule(index)"
                            />
                            <Button class="px-1 py-2" icon="pi pi-trash"
                                size="small" severity="danger" text outlined
                                @click="askDeleteModule($event, index)"
                            />
                        </ButtonGroup>

                        <OverlayPanel :ref="i => registerDeleteConfirmation(index, i)">
                            <Button label="Eliminar" severity="danger"
                                @click="deleteModule(index)"
                            />
                        </OverlayPanel>
                    </template>
                </Column>

            </DataTable>
        </div>

    </Panel>
</template>


<style lang="scss">
#modules-list .inner
{
    thead { display: none; }
    tr
    {
        &:not(:hover) .actions-row button
        {
            opacity: 0;
            pointer-events: none;
        }
        .reorder-row { width: 32px; }
        .type-row
        {
            width: 100%;
            .text-sm
            {
                width: 136px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }
        }
        .actions-row
        {
            width: auto;
            padding-right: 0;
            position: relative;
            .p-button-group { display: flex; }
            button { transition: opacity .2s ease; }
        }
    }
}
</style>
