<script lang="ts" setup>
const page = useCurrentPage();
const pageWidthPercent = ref(100);
const pageLoader = usePageLoader();

const dialogs = useGlobalDialogs();
const toast = useToast();


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
    const jsonString = JSON.stringify(pageLoader.exportAsObject(), null, 4);
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
</script>


<template>
    <div id="main-toolbar" class="flex | justify-content-between | p-3 relative">
        
        <div>
            <Button icon="pi pi-download" outlined
                v-tooltip.bottom="'Cargar desde archivo'"
                v-if="!page.hasModules()"
                @click="loadPage"
            />
            <Button icon="pi pi-save" outlined class="ml-2"
                v-tooltip.bottom="'Guardar como archivo'"
                v-if="page.hasModules()"
                @click="savePage"
            />
        </div>

        <div id="viewport-slider" class="flex align-items-center gap-4">
            <div class="pi pi-mobile"></div>
            <Slider class="w-14rem" v-model="pageWidthPercent" />
            <div class="pi pi-desktop"></div>
        </div>

        <div>
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
    }
}
</style>
