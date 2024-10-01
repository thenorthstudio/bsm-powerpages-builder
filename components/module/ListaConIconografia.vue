<script lang="ts" setup>
import type { ListaConIconografiaModule } from '#imports';


const prop = defineProps<{
    m: ListaConIconografiaModule
}>();
</script>


<template>
    <section class="c-lista-con-iconografia">
        <div class="inner | boxed">
            <h2 class="t-title" v-if="!isEmpty(m.props.title.value)">
                {{ m.props.title.value }}
            </h2>
            <div class="body | rich-text"
                v-if="!isEmpty(m.props.text.value)"
                v-html="m.props.text.value"
            />
            <div class="item-grid">
                <div class="item-block" :key="i"
                    v-for="(c, i) in m.props.items.value" 
                    >
                    <div class="L">
                        <BuilderImage />
                    </div>
                    <div class="R | rich-text-simple"
                        v-html="c.props.text.value"
                    />
                </div>
            </div>
        </div>
    </section>
</template>


<style lang="scss" src="/public/builder/scss/lista-con-iconografia.scss" />
