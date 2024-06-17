<template>
    <ScrollPanel id="sidebar" class="h-full" pt:bary="bg-surface-200">
        <SidebarModuleList class="sidebar-panel" />
    </ScrollPanel>
</template>


<style lang="scss">
#sidebar
{
    background-color: var(--surface-200);
    .sidebar-panel
    {
        border-radius: 0;
        border-top: none;
        border-left: none;
        border-bottom: none;
    }
}
</style>
