<script lang="ts" setup>
const page = useCurrentPage();
const builder = useViewportBuilder();
const iframe = ref<HTMLIFrameElement>();
const shadowRenderer = ref<HTMLElement>();


watch(page.modules, () =>
{
    if (!page.isUpdating.value)
    {
        const anyUpdate = page.modules.value.find(
            m => m.dirty || m.deathMark
        );
        if (anyUpdate) builder.value.update();
    }
},
    { deep: true }
);
watch(page.reorder, async () =>
{
    if (page.reorder.value)
    {
        builder.value.reRender();
        page.reorder.value = false;
    }
});
watch(page.dirtyJS, () =>
{
    if (!page.dirtyJS.value) return;
    builder.value.triggerJS();
    page.dirtyJS.value = false;
});

onMounted(async () =>
{
    const calculateIframeScale = () =>
    {
        const wrapW = document.querySelector('#page-wrap')!.clientWidth;
        if (wrapW < 1457)
        {
            page.dimensions.value.iframeWidth = `${1457.0 / wrapW * 100}%`;
            page.dimensions.value.iframeScale = wrapW / 1457.0;
        }
    }
    window.addEventListener('resize', calculateIframeScale);
    calculateIframeScale();

    await builder.value.init(iframe.value!, shadowRenderer.value!);
})
</script>


<template>
    <div id="page-viewport">
        <iframe id="viewport-mirror" ref="iframe"></iframe>
        <div id="viewport-shadow" ref="shadowRenderer">
            <ModulesRenderer />
        </div>
    </div>
</template>


<style lang="scss">
#page-viewport
{
    flex: 0 0 v-bind("page.dimensions.value.viewportWidth");
    #viewport-mirror
    {
        width: v-bind("page.dimensions.value.iframeWidth");
        height: v-bind("page.dimensions.value.iframeWidth");
        border: none;
        background: none;
        padding: 0;
        margin: 0;
        transform: scale(v-bind("page.dimensions.value.iframeScale"));
        transform-origin: left top;
        outline: none;
    }
    #viewport-shadow { display: none; }
}
</style>
