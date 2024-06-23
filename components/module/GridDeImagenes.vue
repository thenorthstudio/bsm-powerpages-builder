<script lang="ts" setup>
import type { GridDeImagenesModule } from '#imports';


const prop = defineProps<{
    instance: GridDeImagenesModule
}>();
</script>


<template>
    <section class="c-grid-de-imagenes">
        <div class="inner | boxed">
            <h2 class="t-title" v-if="!isEmpty(instance.props.title.value)">
                {{ instance.props.title.value }}
            </h2>
            <div class="body"
                v-if="!isEmpty(instance.props.text.value)"
                v-html="instance.props.text.value"
            ></div>
            <div class="image-grid">
                <component class="image-block"
                    :class="`is-${c.props.width.getValue().value}-cols`"
                    v-for="(c, i) in instance.props.images.value" :key="i"
                    :is="!isEmpty(c.props.link.value)? 'a' : 'div'"
                    :href="stringOrDefault(c.props.link.value, null)"
                    :target="c.props.link.value? '_blank' : null"
                    >
                    <BuilderImage :alt="c.props.alt.value" />
                </component>
            </div>
        </div>
    </section>
</template>


<style lang="scss" src="/public/builder/scss/grid-de-imagenes.scss" />
