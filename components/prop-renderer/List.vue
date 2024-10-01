<script lang="ts" setup>
import type { ModulePropList } from '#imports';
import type OverlayPanel from 'primevue/overlaypanel';
import type {
    DataTableCellEditCompleteEvent,
    DataTableRowReorderEvent
} from 'primevue/datatable';


const emit = defineEmits<{
    'set-dirty': [],
    'check-js': [lib: ExternalLib]
}>();
const prop = defineProps<{
    options: ModulePropList
}>();
const deleteConfirmation = ref<OverlayPanel[]>([]);
const toast = useToast();

const tableColums = computed(() =>
{
    if (!prop.options.value.length) return [];
    const cols: string[] = [];
    for (const mem in prop.options.value[0]) cols.push(mem);
    return cols;
})
const inputWidth = computed(() =>
{
    const maxW = 300;
    const colAmount = tableColums.value.length;
    return `${maxW / colAmount}px`;
})


const onCellEditComplete = (e: DataTableCellEditCompleteEvent) => {
    prop.options.value[e.index][e.field] = e.newValue;
    emit('set-dirty');
}
const onRowReorder = (e: DataTableRowReorderEvent) =>
{
    reorderArray(prop.options.value, e.dragIndex, e.dropIndex);
    emit('check-js', 'swiper');
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


const addNewItem = () =>
{
    const done = prop.options.addNew();
    if (!done) toast.add({
        severity: 'error',
        summary: 'Límite alcanzado',
        detail: `No se pueden añadir más de ${prop.options.maxAmount} elementos`,
        life: 3500
    });
    emit('check-js', 'swiper');
    emit('set-dirty');
}
const askDeleteItem = (e: MouseEvent, index: number) => {
    deleteConfirmation.value[index].toggle(e);
}
const deleteItem = (index: number) =>
{
    const done = prop.options.remove(index);
    if (!done) toast.add({
        severity: 'error',
        summary: 'Límite alcanzado',
        detail: `Debe haber un mínimo de ${prop.options.minAmount} elementos`,
        life: 3500
    });
    deleteConfirmation.value[index].hide();
    emit('check-js', 'swiper');
    emit('set-dirty');
}
</script>


<template>
    <div class="prop-string-list">
        <div class="flex align-items-center justify-content-between">
            <div class="text-xs text-400 | flex | ml-2">
                <div class="pi pi-info-circle | mr-2"
                    v-tooltip.left="options.additionalInfo"
                    v-if="options.additionalInfo"
                />
                {{ options.title }}
            </div>
            <Button icon="pi pi-plus"
                severity="secondary" text 
                @click="addNewItem"
            />
        </div>
    
        <DataTable :value="options.value" size="small" editMode="cell"
            @cell-edit-complete="onCellEditComplete"
            @row-reorder="onRowReorder"
            >
            <Column class="reorder-row | pt-2" row-reorder />
    
            <Column class="type-row" v-for="(col, i) in tableColums" :key="i"
                :field="col"
                >
                <template #body="{ data }">
                    <div class="text-sm">
                        {{ stringOrDefault(data[col], '<vacío>') }}
                    </div>
                </template>
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" size="small" autofocus />
                </template>
            </Column>
    
            <Column class="actions-row">
                <template #body="{ index }">
                    <Button class="px-1 py-2" icon="pi pi-trash"
                        size="small" severity="danger" text outlined
                        @click="askDeleteItem($event, index)"
                    />
                    <OverlayPanel :ref="i => registerDeleteConfirmation(index, i)">
                        <Button label="Eliminar" severity="danger"
                            @click="deleteItem(index)"
                        />
                    </OverlayPanel>
                </template>
            </Column>
    
        </DataTable>
    </div>
</template>


<style lang="scss">
.prop-string-list
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
        .reorder-row { width: 2rem; }
        .type-row
        {
            width: auto;
            .text-sm
            {
                height: 20px;
                width: v-bind(inputWidth);
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }
            input { width: v-bind(inputWidth); }
        }
        .actions-row
        {
            width: 3rem;
            padding-right: 0;
            position: relative;
            button { transition: opacity .2s ease; }
        }
    }
}
</style>
