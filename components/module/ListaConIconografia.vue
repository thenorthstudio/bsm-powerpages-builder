<script lang="ts" setup>
import type { ListaConIconografiaModule } from '#imports';


const prop = defineProps<{
    instance: ListaConIconografiaModule
}>();
</script>


<template>
    <section class="c-lista-con-iconografia">
        <div class="inner | boxed">
            <h2 class="t-title" v-if="!isEmpty(instance.props.title.value)">
                {{ instance.props.title.value }}
            </h2>
            <div class="body | rich-text"
                v-if="!isEmpty(instance.props.text.value)"
                v-html="instance.props.text.value"
            ></div>
            <div class="item-grid">
                <div class="item-block" :key="i"
                    v-for="(c, i) in instance.props.items.value" 
                    >
                    <div class="L">
                        <BuilderImage />
                    </div>
                    <div class="R | rich-text-smaller"
                        v-html="c.props.text.value"
                    ></div>
                </div>
            </div>
        </div>
    </section>
</template>


<style lang="scss" src="/public/builder/scss/lista-con-iconografia.scss" />
