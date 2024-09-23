<script lang="ts" setup>
import { Module } from "@/utils/moduleTypes";
import type ContextMenu from "primevue/contextmenu";
import type { MenuItem } from "primevue/menuitem";
import type OverlayPanel from 'primevue/overlaypanel';
import type { DataTableRowContextMenuEvent, DataTableRowReorderEvent } from 'primevue/datatable';


const page = useCurrentPage();
const builde = useViewportBuilder();
const dialogs = useGlobalDialogs();
const toast = useToast();

const selectedModule = ref<Module>();
const ctxMenu = ref<ContextMenu>();
const ctxMenuItems: MenuItem[] = [{
  icon: 'pi pi-expand',
  label: 'Centrar',
  command: () => builde.value.scrollToModule(selectedModule.value!),
}, {
  icon: 'pi pi-clone',
  label: 'Duplicar',
  command: () => duplicateModule(selectedModule.value!)
}]
const deleteConfirmation = ref<OverlayPanel[]>([]);


const onRowReorder = (e: DataTableRowReorderEvent) =>
{
  /* Menu & Footer cannot be moved */
  if (isMenuOrFooter(e.dragIndex) || isMenuOrFooter(e.dropIndex))
  {
    toast.add({ severity: 'warn', summary: 'Movimiento no permitido',
      detail: 'El menú y el footer no se pueden mover.',
      life: 3000,
    });
    return;
  }
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
const duplicateModule = (module: Module) =>
{
  const newModule = cloneModule(module, true);
  const index = page.modules.value.findIndex(m => m.id == module.id);
  page.modules.value.splice(index, 0, newModule);
  configureModule(index + 1);
  page.reorder.value = true;
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

const isMenuOrFooter = (index: number) => {
  return /* index == 0 ||  */index == page.modules.value.length - 1;
}


const onRowContextMenu = (event: DataTableRowContextMenuEvent) =>
{
  if (isMenuOrFooter(event.index)) return;
  ctxMenu.value!.show(event.originalEvent);
};
onMounted(() =>
{
  document.querySelector('iframe')?.addEventListener('mouseenter',
    () => ctxMenu.value?.hide()
  )
})
</script>


<template>
  <Panel id="modules-list" class="min-h-full"
  pt:header="sticky top-0 z-2 | p-3 | surface-0 border-100 border-bottom-1"
  pt:content="p-0 pr-2"
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
        <Button icon="pi pi-plus"
        label="Añadir nuevo" size="small"
        @click="askNewModule"
        />
      </div>

      <ContextMenu ref="ctxMenu"
      :model="ctxMenuItems"
      @hide="selectedModule = undefined"
      />

      <DataTable :value="page.modules.value" size="small"
      v-model:contextMenuSelection="selectedModule"
      @row-contextmenu="onRowContextMenu"
      @row-reorder="onRowReorder"
      >
        <Column class="reorder-row | pt-2" row-reorder />

        <Column class="type-row px-0">
          <template #body="{ data }">
            <div class="text-sm" v-tooltip.bottom="{
              value: asA<Module>(data).getDescriptor().slice(0, 100),
              showDelay: 100,
            }">
              {{ asA<Module>(data).getTitle() }}
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
              <!-- Menu & Footer cannot be deleted -->
              <Button v-if="!isMenuOrFooter(index)"
              class="px-1 py-2" icon="pi pi-trash"
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
        width: 170px;
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
