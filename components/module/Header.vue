<script lang="ts" setup>
import type { HeaderModule } from '#imports';


const prop = defineProps<{
    m: HeaderModule
}>();
</script>


<template>
    <header class="c-header">
        <div class="background">
            <BuilderImage />
            <div class="overlay"></div>
        </div>
        <div class="inner">
            <h1 class="t-title" v-if="!isEmpty(m.props.title.value)">
                {{ m.props.title.value }}
            </h1>
            <div class="body | rich-text-simple"
                v-if="!isEmpty(m.props.text.value)"
                v-html="m.props.text.value"
            ></div>
        </div>
    </header>
</template>


<style lang="scss" src="/public/builder/scss/header.scss" />
