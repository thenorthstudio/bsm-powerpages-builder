<script lang="ts" setup>
import
{
    ModuleHeader,
    ModuleColumnasDeTexto,
    ModuleListaConIconografia,
    ModuleCardsConIconografia,
    ModuleGridDeImagenes,
}
from '#components';


const moduleComponents: { [key in ModuleType]: any } = {
    'header': ModuleHeader,
    'columnas-de-texto': ModuleColumnasDeTexto,
    'lista-con-iconografia': ModuleListaConIconografia,
    'cards-con-iconografia': ModuleCardsConIconografia,
    'grid-de-imagenes': ModuleGridDeImagenes,
}
const page = useCurrentPage();
</script>


<template>
    <main class="main-content | in-builder | t-body">
        <component class="c-module"
            :class="[{ 'has-focus': m.hovering }, `is-${m.topMaring}`]"
            :is="moduleComponents[m.type]" :instance="m" :data-id="m.id"
            v-for="m in page.modules.value" :key="m.id"
        />
    </main>
</template>
