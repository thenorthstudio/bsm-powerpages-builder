<script lang="ts" setup>
const page = useCurrentPage();
</script>

<template>
    <div id="app" class="h-screen | flex align-items-start"
        :class="{ loading: page.isUpdating.value }"
        >
        <div id="sidebar-wrap" class="flex flex-column">
            <Sidebar/>
        </div>

        <div id="viewport-wrap" class="flex flex-column">
            <MainToolbar />
            <div id="page-wrap" class="flex justify-content-center">
                <PageViewport />
            </div>
        </div>

        <DialogNewModule />
        <DialogConfigureModule />
        <DialogPageExporter />
        <!-- <ConfirmDialog /> -->
         
        <Toast position="top-center" />
    </div>
</template>


<style lang="scss">
#app
{
    overflow: hidden;
    &.loading::after
    {
        content: '';
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99;
    }
    #sidebar-wrap
    {
        height: 100%;
        flex: 0 0 300px;
        max-width: 300px;
    }
    #viewport-wrap
    {
        height: 100%;
        flex: 1 1 100%;
        #page-wrap
        {
            flex: 1 1 100%;
            background-color: var(--surface-200);
        }
    }
}
.p-toast .p-toast-message .p-toast-message-content {
    background-color: #00000021;
}
</style>
