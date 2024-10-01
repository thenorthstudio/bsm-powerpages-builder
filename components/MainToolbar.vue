<script lang="ts" setup>
const page = useCurrentPage();
const pageWidthPercent = ref(100);
const pageLoader = usePageLoader();
const dialogs = useGlobalDialogs();
const toast = useToast();

const framePixelSize = computed(() =>
{
  const p100 = pageWidthPercent.value;
  return Math.ceil((1440 - 375) * (p100 / 100) + 375);
});
const selectedLang = computed({
  get: () => page.lang.value,
  set: (value: Lang) =>
  {
    page.lang.value = value;
    page.modules.value[0].dirty = true;
    page.modules.value[page.modules.value.length - 1].dirty = true;
  }
});


watch(pageWidthPercent, () => 
{
  const minViewportWidth = (392.0 / window.innerWidth) * 100;
  const width = (100 - minViewportWidth) * (pageWidthPercent.value / 100) + minViewportWidth;
  page.dimensions.value.viewportWidth = `${width}%`;
})


const openExporter = () => {
  dialogs.pageExporter.value = true;
}
const savePage = () =>
{
  dialogs.configureModule.value.close();

  // Create downloadable blob:
  const jsonString = JSON.stringify(pageLoader.exportAsObject(), null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });

  // Create a link element & click it:
  const link = document.createElement("a");
  link.download = `${page.name.value}.json`;
  link.href = URL.createObjectURL(blob);
  link.style.display = 'none';
  link.click();
}
const loadPage = () =>
{
  const onError = (error: unknown) =>
  {
    toast.add({
      severity: 'error',
      summary: 'Error al cargar la página',
      detail: 'Se ha copiado la informarción sobre el error en el portapapeles',
      life: 5000
    });
    navigator.clipboard.writeText(JSON.stringify(error));
    console.error('Error loading page file:', error);
  }

  const input = document.createElement('input') as HTMLInputElement;
  input.type = 'file';
  input.accept = 'application/json';
  input.addEventListener('change', (event: Event) =>
  {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0)
    {
      const file = target.files[0];
      const reader = new FileReader();
      reader.onload = (loadEvent: ProgressEvent<FileReader>) =>
      {
        if (loadEvent.target && loadEvent.target.result)
        {
          try
          {
            const data = JSON.parse(loadEvent.target.result as string);
            pageLoader.importFromObject(data);
            page.name.value = file.name.split(/\\|\//).pop()?.split('.')[0] || 'pagina-nueva';
          }
          catch (error) { onError(error) }
        }
        else onError(loadEvent);
      };
      reader.onerror = onError;
      reader.readAsText(file);
    }
  });
  input.click();
}
const printPage = () =>
{
  const window = useViewportBuilder().value.mirrorWindow;
  window?.print();
}
</script>


<template>
  <div id="main-toolbar" class="flex | justify-content-between | p-3 relative">
    
    <div class="flex align-items-center gap-2">
      <Button icon="pi pi-download" outlined
      v-tooltip.bottom="'Cargar desde archivo'"
      v-if="!page.hasModules()"
      @click="loadPage"
      />
      <Button icon="pi pi-save" outlined
      v-tooltip.bottom="'Guardar como archivo'"
      v-if="page.hasModules()"
      @click="savePage"
      />
      <Button icon="pi pi-print" outlined
      v-tooltip.bottom="'Imprimir página'"
      v-if="page.hasModules()"
      @click="printPage"
      />
    </div>
    
    <div id="viewport-slider" class="flex align-items-center gap-4">
      <div class="pi pi-mobile"/>
      <Slider class="w-14rem" v-model="pageWidthPercent" />
      <div class="pi pi-desktop"/>
      
      <div class="hint | text-sm text-400">
        {{ framePixelSize }}px
      </div>
    </div>
    
    <div class="flex align-items-center gap-4">
      <div class="lang-selector flex align-items-center gap-2" v-if="page.hasModules()">
        <label for="ui-lang-selector" class="text-sm text-400">
          Idioma:
        </label>
        <Dropdown id="ui-lang-selector" v-model="selectedLang" checkmark
        :options="AllLocales" option-label="label" option-value="value"
        pt:input="text-xs" pt:list="text-xs"
        />
      </div>
      <Button label="Exportar"
      icon="pi pi-file-export"
      @click="openExporter"
      />
    </div>
    
  </div>
</template>


<style lang="scss">
#main-toolbar
{
  flex: 0 0 auto;
  border-bottom: solid 1px var(--surface-200);
  background-color: var(--surface-0);
  #viewport-slider
  {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    @media (max-width: 1400px) {
      left: 38%;
    }
    .hint
    {
      position: absolute;
      top: 17px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
