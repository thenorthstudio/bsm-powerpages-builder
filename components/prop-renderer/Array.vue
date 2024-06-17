<script lang="ts" setup>
import { SubModule } from '@/utils/module';
import type { ModulePropArray } from '#imports';
import type OverlayPanel from 'primevue/overlaypanel';
import type { DataTableRowReorderEvent } from 'primevue/datatable';


const emit = defineEmits(['set-dirty']);
const prop = defineProps<{
    options: ModulePropArray
}>();
const deleteConfirmation = ref<OverlayPanel[]>([]);
const { configureModule: { value: { openSubmodule } } } = useGlobalDialogs();
const toast = useToast();


const onRowReorder = (e: DataTableRowReorderEvent) =>
{
    reorderArray(prop.options.value, e.dragIndex, e.dropIndex);
    emit('set-dirty');
}
const registerDeleteConfirmation = (index: number, i: any) =>
{
    if (!i) return;
    if (deleteConfirmation.value.length > index) {
        deleteConfirmation.value[index] = i;
    }
    else deleteConfirmation.value.push(i);
}


const addNewSubmodule = () =>
{
    const done = prop.options.addNew();
    if (!done) toast.add({
        severity: 'error',
        summary: 'Límite alcanzado',
        detail: `No se pueden añadir más de ${prop.options.maxAmount} elementos`,
        life: 3500
    });
    emit('set-dirty');
}
const configureSubmodule = (index: number) =>
{
    const submodule = prop.options.value[index];
    openSubmodule(submodule);
}
const askDeleteSubmodule = (e: MouseEvent, index: number) => {
    deleteConfirmation.value[index].toggle(e);
}
const deleteSubmodule = (index: number) =>
{
    const done = prop.options.remove(index);
    if (!done) toast.add({
        severity: 'error',
        summary: 'Límite alcanzado',
        detail: `Debe haber un mínimo de ${prop.options.minAmount} elementos`,
        life: 3500
    });
    deleteConfirmation.value[index].hide();
    emit('set-dirty');
}
</script>


<template>
    <div class="submodule-list">
        <div class="flex align-items-center justify-content-between">
            <div class="text-xs text-400 | ml-2">
                {{ options.title }}
            </div>
            <Button icon="pi pi-plus" severity="secondary"
                text @click="addNewSubmodule"
            />
        </div>
    
        <DataTable :value="options.value" size="small"
            scrollable scrollHeight="200px"
            @row-reorder="onRowReorder"
            >
            <Column class="reorder-row | pt-2" row-reorder />
    
            <Column class="type-row" header="Tipo">
                <template #body="{ data }">
                    <div class="text-sm"
                        v-html="asA<SubModule>(data).getDescriptor()"
                    ></div>
                </template>
            </Column>
    
            <Column class="actions-row" header="Acciones">
                <template #body="{ index }">
                    <ButtonGroup>
                        <Button class="px-1 py-2" icon="pi pi-cog"
                            size="small" severity="secondary" text
                            v-tooltip.bottom="'Opciones'" outlined
                            @click="configureSubmodule(index)"
                        />
                        <Button class="px-1 py-2" icon="pi pi-trash"
                            size="small" severity="danger" text outlined
                            @click="askDeleteSubmodule($event, index)"
                        />
                    </ButtonGroup>
    
                    <OverlayPanel :ref="i => registerDeleteConfirmation(index, i)">
                        <Button label="Eliminar" severity="danger"
                            @click="deleteSubmodule(index)"
                        />
                    </OverlayPanel>
                </template>
            </Column>
    
        </DataTable>
    </div>
</template>


<style lang="scss">
.submodule-list
{
    .p-datatable-wrapper { overflow-x: hidden !important; }
    thead { display: none; }
    tr
    {
        &:not(:hover) .actions-row button
        {
            opacity: 0;
            pointer-events: none;
        }
        .type-row
        {
            width: 100%;
            .text-sm
            {
                height: 20px;
                width: 375px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                * {  margin: 0; }
            }
        }
        .actions-row
        {
            padding-right: 0;
            position: relative;
            .p-button-group { display: flex; }
            button { transition: opacity .2s ease; }
        }
    }
}
</style>
