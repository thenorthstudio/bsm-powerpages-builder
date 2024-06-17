<script lang="ts" setup>
import
{
    ModuleColumnasDeTexto,
    ModuleCardsConIconografia,
    ModuleGridDeImagenes,
}
from '#components';


const moduleComponents: { [key in ModuleType]: any } = {
    'columnas-de-texto': ModuleColumnasDeTexto,
    'cards-con-iconografia': ModuleCardsConIconografia,
    'grid-de-imagenes': ModuleGridDeImagenes,
}
const page = useCurrentPage();
</script>


<template>
    <main class="main-content | in-builder | t-body">
        <component v-for="m in page.modules.value" :key="m.id"
            :class="{ 'has-focus': m.hovering }":data-id="m.id"
            :is="moduleComponents[m.type]" :instance="m"
        />
    </main>
</template>
