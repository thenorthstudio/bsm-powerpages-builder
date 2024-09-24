<script lang="ts" setup>
type ActionT = {
  icon: 'pi-clipboard' | 'pi-save',
  tooltip: string,
  title: string,
  callback(action: ActionT): void,
  loading: boolean,
  disabled?: boolean,
}
const page = useCurrentPage();
const builder = useViewportBuilder();
const { pageExporter: isVisible } = useGlobalDialogs();
const toast = useToast();


const copyToClipboard = (str: string) =>
{
  navigator.clipboard.writeText(str);
  toast.add({
    severity: 'success',
    summary: '¡Hecho!',
    detail: 'Contenido copiado en el portapapeles',
    life: 3500
  });
}
const exportPageHTML = async (action: ActionT) =>
{
  action.loading = true;
  const html = await builder.value.exportPageHTML();
  copyToClipboard(html);
  action.loading = false;
}
const downloadThemeCSS = async (action: ActionT) =>
{
  action.loading = true;

  // Create downloadable blob:
  const cssString = await builder.value.exportThemeCSS();
  const blob = new Blob([cssString], { type: 'text/css' });

  // Create a link element & click it:
  const link = document.createElement("a");
  link.download = `bsm-theme.css`;
  link.href = URL.createObjectURL(blob);
  link.style.display = 'none';
  link.click();

  action.loading = false;
}


const exportPageHint = 'No hay módulos';
const actions = ref<Array<ActionT>>([
  {
    icon: 'pi-clipboard',
    tooltip: 'Copiar',
    title: 'Contenido de la página',
    callback: exportPageHTML,
    loading: false,
    disabled: true
  },
  {
    icon: 'pi-save',
    tooltip: 'Guardar',
    title: 'Estilos globales',
    callback: downloadThemeCSS,
    loading: false
  }
]);
watch(page.hasModules, () =>
  actions.value[0].disabled = !page.hasModules()
)
</script>


<template>
  <Dialog id="exporter-dialog" v-model:visible="isVisible"
  dismissable-mask block-scroll :draggable="false" modal
  pt:header="border-bottom-1 border-200" pt:content="pt-4"
  >
    <template #header>
      <div class="flex align-items-center gap-2">
        <div class="pi pi-file-export"></div>
        <div>Exportación de código</div>
      </div>
    </template>

    <div class="inner">
      <div class="pb-3 mb-3 | border-50 border-bottom-1"
      v-for="(a, i) in actions" :key="i"
      >
        <div class="buttons | mr-4">
          <Button :icon="`pi ${a.icon}`" severity="secondary" raised
          v-tooltip.left="a.tooltip" :loading="a.loading"
          :disabled="a.disabled"  @click="a.callback(a)"
          />
        </div>
        <div class="text" v-tooltip.left="(i==0 && a.disabled)? exportPageHint : null">
          {{ a.title }}
        </div>
      </div>
    </div>

  </Dialog>
</template>


<style lang="scss">
#exporter-dialog
{
  .inner
  {
    width: 80vw;
    max-width: 300px;
    >div
    {
      display: flex;
      align-items: center;
      &:last-of-type { margin: 0 !important; }
    }
  }
}
</style>
