<script lang="ts" setup>
import { SubModule } from "@/utils/moduleTypes";
import type { ModulePropArray, StringObj } from '#imports';
import type OverlayPanel from 'primevue/overlaypanel';
import type ContextMenu from "primevue/contextmenu";
import type { MenuItem } from "primevue/menuitem";
import type {
  DataTableRowContextMenuEvent,
  DataTableRowReorderEvent
} from 'primevue/datatable';


const emit = defineEmits<{
  'set-dirty': [],
  'check-js': [lib: ExternalLib]
}>();
const prop = defineProps<{
  options: ModulePropArray
}>();

const selectedSubmodule = ref<SubModule>();
const ctxMenu = ref<ContextMenu>();
const ctxMenuItems: MenuItem[] = [{
  icon: 'pi pi-clone',
  label: 'Duplicar',
  command: () => duplicateSubmodule(selectedSubmodule.value!)
}]
const deleteConfirmation = ref<OverlayPanel[]>([]);

const { configureModule: { value: { openSubmodule } } } = useGlobalDialogs();
const toast = useToast();


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


const addNewSubmodule = () =>
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
const duplicateSubmodule = (submodule: SubModule) =>
{
  const index = prop.options.value.findIndex(sub => sub.id == submodule.id);
  const beforeLength = prop.options.value.length;
  const done = prop.options.addNew();
  if (!done) toast.add({
    severity: 'error',
    summary: 'Límite alcanzado',
    detail: `No se pueden añadir más de ${prop.options.maxAmount} elementos`,
    life: 3500
  })
  else
  {
    const newSubmodule = prop.options.value[beforeLength];
    // Loop all of new submodule's props:
    for (const subPropName in newSubmodule.props)
    {
      const subProp = submodule.props[subPropName];
      const newSubProp = newSubmodule.props[subPropName];
      if (typeof subProp.value == 'object')
      {
        const subPropValue = subProp.value as StringObj[];
        newSubProp.value = subPropValue.map(item => ({ ...item }));
      }
      else newSubProp.value = subProp.value;
    }
    reorderArray(prop.options.value, beforeLength, index + 1);
    emit('check-js', 'swiper');
    emit('set-dirty');
  }
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
  emit('check-js', 'swiper');
  emit('set-dirty');
}


const onRowContextMenu = (event: DataTableRowContextMenuEvent) => {
  ctxMenu.value!.show(event.originalEvent);
}
onMounted(() =>
{
  document.querySelector('#app')?.addEventListener(
    'mouseenter',
    () => ctxMenu.value?.hide()
  )
})
</script>


<template>
  <div class="prop-submodule-array">
    <div class="flex align-items-center justify-content-between">
      <div class="text-xs text-400 | flex | ml-2">
        <div class="pi pi-info-circle | mr-2"
        v-tooltip.left="options.additionalInfo"
        v-if="options.additionalInfo"
        />
        {{ options.title }}
      </div>
      <Button icon="pi pi-plus" severity="secondary" text @click="addNewSubmodule" />
    </div>

    <ContextMenu ref="ctxMenu" :model="ctxMenuItems"
    @hide="selectedSubmodule = undefined"
    />
    <DataTable :value="options.value" size="small"
    v-model:contextMenuSelection="selectedSubmodule"
    @row-contextmenu="onRowContextMenu"
    @row-reorder="onRowReorder"
    >
      <Column class="reorder-row | pt-2" row-reorder />

      <Column class="type-row">
        <template #body="{ data }">
          <div class="text-sm" v-html="asA<SubModule>(data).getDescriptor()" />
        </template>
      </Column>

      <Column class="actions-row">
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
.prop-submodule-array
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
        width: 245px;
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
