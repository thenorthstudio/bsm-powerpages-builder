<script lang="ts" setup>
import { moduleFactory } from '#imports';


const page = useCurrentPage();
const { newModule: isVisible, configureModule } = useGlobalDialogs();


const moduleItems = () =>
{
  const skipItems: ModuleType[] = ['footer'];
  const items: {
    typeName: string,
    title: string,
  }[] = [];
  for (const m in moduleFactory)
  {
    if (skipItems.includes(m as ModuleType)) continue;
    items.push({
      typeName: m,
      title: moduleFactory[m as ModuleType]().getTitle()
    });
  }
  return items;
}
const selectModule = (selction: ModuleType) =>
{
  isVisible.value = false;
  const newModule = moduleFactory[selction]();
  // If page is empty, add a menu & footer:
  if (page.modules.value.length == 0)
  {
    // page.modules.value.push(moduleFactory['menu']());
    page.modules.value.push(moduleFactory['footer']());
  }
  page.modules.value.splice(page.modules.value.length - 1, 0, newModule);
  configureModule.value.open(newModule);
  
  const libs = exLibRequirements[newModule.type];
  if (libs.length) page.dirtyJS.value = true;

  // Trigger re-render since footer must be the last element:
  page.reorder.value = true;
}
</script>


<template>
  <Dialog id="new-module-dialog" v-model:visible="isVisible"
  dismissable-mask block-scroll :draggable="false" modal
  pt:header="border-bottom-1 border-200"
  >
    <template #header>
      <div class="flex align-items-center gap-2">
        <div class="pi pi-box"></div>
        <div>Nuevo módulo</div>
      </div>
    </template>
    
    <div class="inner">
      <div v-for="(m, i) in moduleItems()" :key="i"
      :class="{ 'border-top-1': i > 0 }"
      class="m-block | px-2 py-4"
      >
        <div class="head">
          {{ m.title }}
          <Button label="Seleccionar" severity="secondary"
          @click="selectModule(m.typeName as ModuleType)"
          />
        </div>
        <Image class="image" pt:toolbar="hidden" preview
        :src="`/builder/img/${m.typeName}.png`"
        />
      </div>
    </div>
  </Dialog>
</template>


<style lang="scss">
#new-module-dialog
{
  .p-dialog-content { overflow-x: hidden; }
  .inner
  {
    width: 80vw;
    max-width: 600px;
    >.m-block
    {
      border-color: var(--surface-200);
      display: flex;
      justify-content: space-between;
      &:not(:hover)>.head>button
      {
        opacity: 0;
        pointer-events: none;
      }
      >.head
      {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        button { transition: opacity 0.2s ease; }
      }
      >.image
      {
        flex: 0 1 50%;
        aspect-ratio: 3 / 1;
        >*:not(button)
        {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          object-position: top left;
          image-rendering: optimizeQuality;
        }
      }
    }
  }
}
</style>
