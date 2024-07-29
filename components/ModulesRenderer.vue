<script lang="ts" setup>
import
{
    ModuleHeader,
    ModuleColumnasDeTexto,
    ModuleContenidoDestacado,
    ModuleCardsDePrograma,
    ModuleCardsGenericas,
    ModuleCardsConIconografia,
    ModuleListaConIconografia,
    ModuleAcordeon,
    ModuleGridDeImagenes,
    ModuleVideo,
    ModuleThankYou,
}
from '#components';


const moduleComponents: { [key in ModuleType]: any } = {
    'header': ModuleHeader,
    'columnas-de-texto': ModuleColumnasDeTexto,
    'contenido-destacado': ModuleContenidoDestacado,
    'cards-de-programa': ModuleCardsDePrograma,
    'cards-genericas': ModuleCardsGenericas,
    'cards-con-iconografia': ModuleCardsConIconografia,
    'lista-con-iconografia': ModuleListaConIconografia,
    'acordeon': ModuleAcordeon,
    'grid-de-imagenes': ModuleGridDeImagenes,
    'video': ModuleVideo,
    'thank-you': ModuleThankYou,
}
const page = useCurrentPage();
</script>


<template>
    <main class="main-content | in-builder">
        <component class="c-module"
            :class="[{ 'has-focus': m.hovering }, `is-${m.topMaring}`]"
            :is="moduleComponents[m.type]" :m="m" :data-id="m.id"
            v-for="m in page.modules.value" :key="m.id"
        />
    </main>
</template>
