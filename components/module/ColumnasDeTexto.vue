<script lang="ts" setup>
import type { ColumnasDeTextoModule } from '#imports';


const prop = defineProps<{
    m: ColumnasDeTextoModule
}>();
</script>


<template>
    <section class="c-columnas-de-texto">
        <div class="inner | boxed">
            <h2 class="t-title" v-if="!isEmpty(m.props.title.value)">
                {{ m.props.title.value }}
            </h2>
            <div class="col-wrap" :class="`has-${m.props.columns.value.length}-cols`">
                <div class="col | rich-text"
                    v-for="(c, i) in m.props.columns.value" :key="i"
                    v-html="c.props.text.value"
                />
            </div>
        </div>
    </section>
</template>


<style lang="scss" src="/public/builder/scss/columnas-de-texto.scss" />
