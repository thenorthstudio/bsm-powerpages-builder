<script lang="ts" setup>
import type { ColumnasDeTextoModule } from '#imports';


const prop = defineProps<{
    instance: ColumnasDeTextoModule
}>();
</script>


<template>
    <section class="c-columnas-de-texto">
        <div class="inner | boxed">
            <h2 class="t-title" v-if="!isEmpty(instance.props.title.value)">
                {{ instance.props.title.value }}
            </h2>
            <div class="col-wrap" :class="`has-${instance.props.columns.value.length}-cols`">
                <div class="col" v-for="(c, i) in instance.props.columns.value" :key="i"
                    v-html="c.props.text.value"
                ></div>
            </div>
        </div>
    </section>
</template>


<style lang="scss" src="/public/builder/scss/columnas-de-texto.scss" />
