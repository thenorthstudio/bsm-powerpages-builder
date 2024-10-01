<script lang="ts" setup>
import type { GridDeImagenesModule } from '#imports';


const prop = defineProps<{
    m: GridDeImagenesModule
}>();
</script>


<template>
    <section class="c-grid-de-imagenes">
        <div class="inner | boxed">
            <h2 class="t-title" v-if="!isEmpty(m.props.title.value)">
                {{ m.props.title.value }}
            </h2>
            <div class="body | rich-text"
                v-if="!isEmpty(m.props.text.value)"
                v-html="m.props.text.value"
            />
            <div class="image-grid">
                <component class="image-block"
                    :class="`is-${c.props.width.getOption().value}-cols`"
                    v-for="(c, i) in m.props.images.value" :key="i"
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
